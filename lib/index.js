/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import Ajv from 'ajv';
import {Cache} from './Cache.js';
import {promises as fs} from 'node:fs';
import {logger} from './logger.js';
import PATH from 'node:path';

const ajv = new Ajv({cache: new Cache(), serialize: false, verbose: true});
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
  const errors = [];
  for(const error of validationErrors) {
    // create custom error details
    const details = {
      instance,
      params: error.params,
      path: error.dataPath,
      public: true,
      schemaPath: error.schemaPath,
    };
    let title;
    if(Array.isArray(error.schema)) {
      [title] = error.schema;
    }
    title = title || error.parentSchema.title || '',
    details.schema = {
      description: error.parentSchema.description || '',
      title,
    };
    // include custom errors or use default
    // FIXME: enable if ajv supports this parentSchema.errors property
    // it appears that this is not the case
    // details.errors = error.parentSchema.errors || {
    //   invalid: 'Invalid input.',
    //   missing: 'Missing input.'
    // };
    if(error.data) {
      if(error.parentSchema.errors && 'mask' in error.parentSchema.errors) {
        const mask = error.parentSchema.errors.mask;
        if(mask === true) {
          details.value = '***MASKED***';
        } else {
          details.value = mask;
        }
      } else {
        details.value = error.data;
      }
    }

    // add bedrock validation error
    errors.push(new BedrockError(error.message, 'ValidationError', details));
  }

  const msg = schema.title ?
    'A validation error occured in the \'' + schema.title + '\' validator.' :
    'A validation error occured in an unnamed validator.';
  const error = new BedrockError(
    msg, 'ValidationError', {public: true, errors, httpStatusCode: 400});

  return error;
}
