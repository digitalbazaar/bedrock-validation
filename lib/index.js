/*!
 * Copyright (c) 2012-2026 Digital Bazaar, Inc.
 */
import * as bedrock from '@bedrock/core';
import Ajv from 'ajv';
import {promises as fs} from 'node:fs';
import {logger} from './logger.js';
import PATH from 'node:path';

// strict=false for backwards compatibility with ajv v6
const ajv = new Ajv({strict: false, verbose: true});
const {util: {BedrockError}} = bedrock;

// load config defaults
import './config.js';

// available schemas
export const schemas = {};

bedrock.events.on('bedrock.init', init);

/**
 * Initializes the validation system: loads all schemas, etc.
 */
async function init() {
  // schemas to skip loading
  const skip = bedrock.config.validation.schema.skip.slice();

  // load all schemas in directory order
  const schemaDirs = bedrock.config.validation.schema.paths;
  const jsExt = '.js';
  for(let schemaDir of schemaDirs) {
    schemaDir = PATH.resolve(schemaDir);
    logger.debug('loading schemas from: ' + schemaDir);
    const files = (await fs.readdir(schemaDir)).filter(file => {
      const js = PATH.extname(file) === jsExt;
      const use = skip.indexOf(file) === -1;
      return js && use;
    });
    // load files in parallel
    await Promise.all(files.map(async file => {
      const name = PATH.basename(file, PATH.extname(file));
      const module = await import(PATH.join(schemaDir, file));
      const api = module.default || module;
      if(typeof api === 'function') {
        if(name in schemas) {
          logger.debug(
            'overwriting schema "' + name + '" with ' +
            PATH.resolve(schemaDir, file));
        }
        schemas[name] = api;
        schemas[name].instance = api();
        logger.debug('loaded schema: ' + name);
      } else {
        for(const key in api) {
          const tmp = name + '.' + key;
          if(tmp in schemas) {
            logger.debug('overwriting schema "' + tmp + '" with ' + file);
          }
          schemas[tmp] = api[key];
          schemas[tmp].instance = schemas[tmp]();
          logger.debug('loaded schema: ' + tmp);
        }
      }
    }));
  }
}

/**
 * Compiles the given schema, returning a validation function that takes one
 * parameter: the data to be validated. It returns the same value that
 * `validateInstance` returns.
 *
 * @param {object} options - The options to use.
 * @param {object} options.schema - The JSON schema to compile.
 *
 * @returns {Function} The a validate function to call on instance data.
 */
export function compile({schema} = {}) {
  const fn = ajv.compile(schema);
  fn.title = schema.title;
  return function validate(instance) {
    if(fn(instance)) {
      return {valid: true};
    }
    return {
      valid: false,
      error: _createError({schema: fn, instance})
    };
  };
}

/**
 * Retrieves a validation schema given a name for the schema.
 *
 * @param {object} options - The options to use.
 * @param {string} options.name - The name of the schema to retrieve.
 *
 * @returns {object|null} The object for the schema, or `null` if the schema
 *   doesn't exist.
 */
export function getSchema({name} = {}) {
  let schema = null;
  if(name in schemas) {
    schema = schemas[name].instance;
  }
  return schema;
}

/**
 * Validates an instance against a schema.
 *
 * @param {object} options - The options to use.
 * @param {*} options.instance - The instance to validate.
 * @param {object|Array|Function|string} [options.schema] - The JSON schema,
 *   compiled schema function, or name of schema to use.
 *
 * @returns {object} The validation result.
 */
export function validateInstance({instance, schema} = {}) {
  const schemaIsFunction = typeof schema === 'function';

  // do validation
  let valid;
  if(schemaIsFunction) {
    valid = schema(instance);
  } else {
    if(typeof schema === 'string') {
      const name = schema;
      schema = getSchema({name});
      if(!schema) {
        throw new BedrockError(
          `Could not validate data; unknown schema name (${name}).`,
          'NotFoundError', {schemaName: name});
      }
    }
    valid = ajv.validate(schema, instance);
  }
  if(valid) {
    return {valid};
  }

  const result = {
    valid: false,
    error: _createError({schema, instance})
  };

  return result;
}

/**
 * Creates middleware that will validate request body and URL query parameters.
 *
 * Use this method over the deprecated `validate` to create a middleware.
 *
 * @param {object} options - The options to use.
 * @param {object} [options.bodySchema] - The JSON schema to use to validate
 *   the request body.
 * @param {object} [options.querySchema] - The JSON schema to use to validate
 *   the request URL query parameters.
 *
 * @returns {Function} An express-style middleware.
 */
export function createValidateMiddleware({bodySchema, querySchema} = {}) {
  if(!(bodySchema || querySchema)) {
    throw new TypeError(
      'One of the following parameters is required: ' +
      '"bodySchema", "querySchema".');
  }
  // pre-compile schemas
  let validateBodySchema;
  if(bodySchema) {
    validateBodySchema = compile({schema: bodySchema});
  }
  let validateQuerySchema;
  if(querySchema) {
    validateQuerySchema = compile({schema: querySchema});
  }
  return function validate(req, res, next) {
    if(validateBodySchema) {
      const result = validateBodySchema(req.body);
      if(!result.valid) {
        return next(result.error);
      }
    }
    if(validateQuerySchema) {
      const result = validateQuerySchema(req.query);
      if(!result.valid) {
        return next(result.error);
      }
    }
    next();
  };
}

function _createError({schema, instance}) {
  // create public error messages
  const schemaIsFunction = typeof schema === 'function';
  const validationErrors = schemaIsFunction ? schema.errors : ajv.errors;
  /* Masking is applied to the whole instance, not just the value that failed:
  every error carries a copy of the instance, so a schema that masks one
  property still published it whenever a *different* property was the one to
  fail. */
  const maskedInstance = _maskDeclaredValues(
    instance, schemaIsFunction ? schema.schema : schema);
  const errors = [];
  for(const error of validationErrors) {
    // create custom error details
    const details = {
      instance: maskedInstance,
      params: error.params,
      instancePath: error.instancePath,
      path: _jsonPointerToJsPath(error.instancePath),
      public: true,
      schemaPath: error.schemaPath
    };
    let title;
    if(Array.isArray(error.schema)) {
      [title] = error.schema;
    }
    title = title || error.parentSchema.title || '',
    details.schema = {
      description: error.parentSchema.description || '',
      title
    };
    // include custom errors or use default
    // FIXME: enable if ajv supports this parentSchema.errors property
    // it appears that this is not the case
    // details.errors = error.parentSchema.errors || {
    //   invalid: 'Invalid input.',
    //   missing: 'Missing input.'
    // };
    const masked = _isMasked(error.parentSchema);
    const maskValue = _maskValue(error.parentSchema?.errors?.mask);
    if(masked) {
      details.instance = _maskAtPath(
        maskedInstance, error.instancePath, maskValue);
    }
    if(error.data) {
      details.value = masked ? maskValue :
        _maskDeclaredValues(error.data, error.parentSchema);
    }

    // add bedrock validation error
    errors.push(new BedrockError(error.message, 'ValidationError', details));
  }

  const msg = schema.title ?
    'A validation error occurred in the \'' + schema.title + '\' validator.' :
    'A validation error occurred in an unnamed validator.';
  const error = new BedrockError(
    msg, 'ValidationError', {public: true, errors, httpStatusCode: 400});

  return error;
}

function _maskValue(mask) {
  return mask === true ? '***MASKED***' : mask;
}

function _isMasked(schema) {
  const mask = schema?.errors?.mask;
  return mask !== undefined && mask !== false;
}

// replaces every value whose own subschema asks to be masked, wherever it sits
function _maskDeclaredValues(instance, schema) {
  if(instance === null || typeof instance !== 'object' ||
    schema === null || typeof schema !== 'object') {
    return instance;
  }
  if(Array.isArray(instance)) {
    const {items} = schema;
    if(!items) {
      return instance;
    }
    const masked = instance.map(entry => _isMasked(items) ?
      _maskValue(items.errors.mask) : _maskDeclaredValues(entry, items));
    return masked.some((v, i) => v !== instance[i]) ? masked : instance;
  }
  let copy = instance;
  for(const [key, subschema] of Object.entries(schema.properties ?? {})) {
    if(!(key in instance)) {
      continue;
    }
    const value = _isMasked(subschema) ?
      _maskValue(subschema.errors.mask) :
      _maskDeclaredValues(instance[key], subschema);
    if(value !== instance[key]) {
      if(copy === instance) {
        copy = {...instance};
      }
      copy[key] = value;
    }
  }
  return copy;
}

function _decodePointerSegment(segment) {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

function _maskAtPath(instance, pointer, maskValue) {
  const [, ...segments] = pointer.split('/');
  if(segments.length === 0) {
    return maskValue;
  }
  const copy = structuredClone(instance);
  let parent = copy;
  for(const segment of segments.slice(0, -1)) {
    parent = parent?.[_decodePointerSegment(segment)];
  }
  if(parent === null || typeof parent !== 'object') {
    // a path that cannot be walked masks the whole instance rather than
    // returning it unmasked
    return maskValue;
  }
  parent[_decodePointerSegment(segments.at(-1))] = maskValue;
  return copy;
}

function _jsonPointerToJsPath(pointer) {
  let path = '';
  const [, ...segments] = pointer.split('/');
  for(const segment of segments) {
    // decode JSON pointer escape chars
    const decoded = segment.replace(/~1/g, '/').replace(/~0/g, '~');

    // handle integer index
    if(/^\d+$/.test(decoded)) {
      path += `[${decoded}]`;
      continue;
    }

    // use dot notation for valid keys and bracket notation otherwise
    if(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(decoded)) {
      path += `.${decoded}`;
    } else {
      path += `["${decoded}"]`;
    }
  }

  return path;
}
