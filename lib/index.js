/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const fs = require('fs');
const PATH = require('path');
const bedrock = require('bedrock');
const logger = require('./logger');
const Ajv = require('ajv');
const {util: {BedrockError}} = bedrock;
const Cache = require('./Cache');
const ajv = new Ajv({cache: new Cache(), serialize: false, verbose: true});

// load config defaults
require('./config');

// available schemas
const schemas = exports.schemas = {};

bedrock.events.on('bedrock.init', init);

/**
 * Initializes the validation system: loads all schemas, etc.
 */
function init() {
  // schemas to skip loading
  const skip = bedrock.config.validation.schema.skip.slice();

  // load all schemas
  const schemaDirs = bedrock.config.validation.schema.paths;
  const jsExt = '.js';
  schemaDirs.forEach(schemaDir => {
    schemaDir = PATH.resolve(schemaDir);
    logger.debug('loading schemas from: ' + schemaDir);
    fs.readdirSync(schemaDir).filter(file => {
      const js = PATH.extname(file) === jsExt;
      const use = skip.indexOf(file) === -1;
      return js && use;
    }).forEach(file => {
      const name = PATH.basename(file, PATH.extname(file));
      const module = require(PATH.join(schemaDir, file));
      if(typeof module === 'function') {
        if(name in schemas) {
          logger.debug(
            'overwriting schema "' + name + '" with ' +
            PATH.resolve(schemaDir, file));
        }
        schemas[name] = module;
        schemas[name].instance = module();
        logger.debug('loaded schema: ' + name);
      } else {
        for(const key in module) {
          const tmp = name + '.' + key;
          if(tmp in schemas) {
            logger.debug('overwriting schema "' + tmp + '" with ' + file);
          }
          schemas[tmp] = module[key];
          schemas[tmp].instance = schemas[tmp]();
          logger.debug('loaded schema: ' + tmp);
        }
      }
    });
  });
}

/**
 * Compiles the given schema, returning a validation function that takes one
 * parameter: the data to be validated. It returns the same value that
 * `validateInstance` returns.
 *
 * @param {object} schema - The JSON schema to compile.
 *
 * @returns {function} - The a validate function to call on instance data.
 */
exports.compile = function(schema) {
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
};

/**
 * This method is deprecated for creating middleware. Use
 * `createValidateMiddleware` instead.
 *
 * This method takes one or three parameters.
 *
 * If only one parameter is given, returns express middleware that will be
 * used to validate a request using the schema associated with the given name.
 *
 * If a string is provided for the first parameter, then it will be used
 * as the schema name for validating the request body.
 *
 * If an object is provided for the first parameter, then the object can
 * contain 'body' and 'query' schema names as properties of the object.
 *
 * If two parameters are given, the first parameter must be a string
 * and the second parameter must be the data to validate. The return value
 * will contain the result of the validation.
 *
 * If three parameters are given, the first parameter must be a string,
 * the second parameter must be the data to validate and the third must be
 * function to be called once the validation operation completes.
 *
 * @param name the name of the schema to use (or an object with names).
 * @param [data] the data to validate.
 * @param [callback(err)] called once the operation completes.
 *
 * @return the validation result.
 */
exports.validate = function(name, data, callback) {
  // NOTE: this cannot be an arrow function due to use of `arguments`
  const options = {};

  if(typeof name === 'object') {
    if('body' in name) {
      options.body = name.body;
    }
    if('query' in name) {
      options.query = name.query;
    }
  } else {
    options.body = name;
  }

  // look up schema(s) by name
  const schemas = {};
  let notFound = null;
  Object.keys(options).forEach(key => {
    schemas[key] = exports.getSchema(options[key]);
    if(!notFound && !schemas[key]) {
      notFound = options[key];
    }
  });

  // schema does not exist
  if(notFound) {
    const err = new BedrockError(
      'Could not validate data; unknown schema name (' + notFound + ').',
      'UnknownSchema', {schema: notFound});
    if(typeof callback === 'function') {
      return callback(err);
    }
    throw err;
  }

  // do immediate validation if data is present
  if(arguments.length > 1) {
    // use schema.body (assume 3 parameter is called w/string)
    return exports.validateInstance(data, schemas.body, callback);
  }

  // pre-compile schemas
  let queryFn;
  if(schemas.query) {
    queryFn = exports.compile(schemas.query);
    queryFn.title = schemas.query.title;
  }
  let bodyFn;
  if(schemas.body) {
    bodyFn = exports.compile(schemas.body);
    bodyFn.title = schemas.body.title;
  }

  // return validation middleware
  // both `query` and `body` may need to be validated
  return (req, res, next) => {
    if(queryFn) {
      const result = queryFn(req.query);
      if(!result.valid) {
        return next(result.error);
      }
    }
    if(bodyFn) {
      const result = bodyFn(req.body);
      if(!result.valid) {
        return next(result.error);
      }
    }
    next();
  };
};

/**
 * Retrieves a validation schema given a name for the schema.
 *
 * @param name the name of the schema to retrieve.
 *
 * @return the object for the schema, or null if the schema doesn't exist.
 */
exports.getSchema = name => {
  let schema = null;
  if(name in exports.schemas) {
    schema = exports.schemas[name].instance;
  }
  return schema;
};

/**
 * Validates an instance against a schema.
 *
 * @param instance the instance to validate.
 * @param {object|array} [schemaOrCompiledSchemaFn] - The JSON schema or the
 *   compiled schema function to use.
 * @param {function} [callback(err)] - A callback to call once the operation
 *   completes.
 *
 * @return the validation result.
 */
exports.validateInstance = (instance, schema, callback) => {
  const schemaIsFunction = typeof schema === 'function';

  // do validation
  let valid;
  if(schemaIsFunction) {
    valid = schema(instance);
  } else {
    valid = ajv.validate(schema, instance);
  }
  if(valid) {
    if(callback) {
      return callback(null, {valid});
    }
    return {valid};
  }

  const result = {
    valid: false,
    error: _createError({schema, instance})
  };

  if(callback) {
    return callback(null, result);
  }
  return result;
};

/**
 * Creates middleware that will validate request body and URL query parameters.
 *
 * Use this method over the deprecated `validate` to create a middleware.
 *
 * @param {object} options - The options to use.
 * @param {object} [bodySchema] - The JSON schema to use to validate the
 *   request body.
 * @param {object} [querySchema] - The JSON schema to use to validate the
 *   request URL query parameters.
 *
 * @returns {Function} An express-style middleware.
 */
exports.createValidateMiddleware = function({bodySchema, querySchema}) {
  if(!(bodySchema || querySchema)) {
    throw new TypeError(
      'One of the following parameters is required: ' +
      '"bodySchema", "querySchema".');
  }
  // pre-compile schemas
  let validateBodySchema;
  if(bodySchema) {
    validateBodySchema = exports.compile(bodySchema);
  }
  let validateQuerySchema;
  if(querySchema) {
    validateQuerySchema = exports.compile(querySchema);
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
};

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
