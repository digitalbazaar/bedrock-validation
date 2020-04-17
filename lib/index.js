/*!
 * Copyright (c) 2012-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const fs = require('fs');
const PATH = require('path');
const bedrock = require('bedrock');
const logger = require('./logger');
const Ajv = require('ajv');
const {BedrockError} = bedrock.util;
const ajv = new Ajv({verbose: true});

// load config defaults
require('./config');

const api = {};
module.exports = api;

// available schemas
const schemas = api.schemas = {};

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
api.validate = function(name, data, callback) {
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
    schemas[key] = api.getSchema(options[key]);
    if(!notFound && !schemas[key]) {
      notFound = options[key];
    }
  });

  // do immediate validation if data is present
  if(arguments.length > 1) {
    if(notFound) {
      const err = new BedrockError(
        'Could not validate data; unknown schema name (' + notFound + ').',
        'UnknownSchema', {schema: notFound});
      if(typeof callback === 'function') {
        return callback(err);
      }
      throw err;
    }
    // use schema.body (assume 3 parameter is called w/string)
    return api.validateInstance(data, schemas.body, callback);
  }

  // schema does not exist, return middle that raises error
  if(notFound) {
    return (req, res, next) => {
      next(new BedrockError(
        'Could not validate request; unknown schema name (' + notFound + ').',
        'UnknownSchema', {schema: notFound}));
    };
  }

  // return validation middleware
  // both `query` and `body` may need to be validated
  return (req, res, next) => {
    if(schemas.query) {
      const result = api.validateInstance(req.query, schemas.query);
      if(!result.valid) {
        return next(result.error);
      }
    }
    if(schemas.body) {
      const result = api.validateInstance(req.body, schemas.body);
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
api.getSchema = name => {
  let schema = null;
  if(name in api.schemas) {
    schema = api.schemas[name].instance;
  }
  return schema;
};

/**
 * Validates an instance against a schema.
 *
 * @param instance the instance to validate.
 * @param schema the schema to use.
 * @param [callback(err)] called once the operation completes.
 *
 * @return the validation result.
 */
api.validateInstance = (instance, schema, callback) => {
  // do validation
  const valid = ajv.validate(schema, instance);
  if(valid) {
    if(callback) {
      return callback(null, {valid});
    }
    return {valid};
  }

  const result = {valid: false};

  // create public error messages
  const errors = [];
  for(const error of ajv.errors) {
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

  result.error = error;
  if(callback) {
    return callback(null, result);
  }
  return result;
};
