/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
const async = require('async');
const fs = require('fs');
const jsonschema = require('json-schema');
const PATH = require('path');
const bedrock = require('bedrock');
const logger = require('./logger');
const Ajv = require('ajv');
const BedrockError = bedrock.util.BedrockError;
const ajv = new Ajv();

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
  schemaDirs.forEach(function(schemaDir) {
    schemaDir = PATH.resolve(schemaDir);
    logger.debug('loading schemas from: ' + schemaDir);
    fs.readdirSync(schemaDir).filter(function(file) {
      const js = PATH.extname(file) === jsExt;
      const use = skip.indexOf(file) === -1;
      return js && use;
    }).forEach(function(file) {
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
  Object.keys(options).forEach(function(key) {
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
    return function(req, res, next) {
      next(new BedrockError(
        'Could not validate request; unknown schema name (' + notFound + ').',
        'UnknownSchema', {schema: notFound}));
    };
  }

  // return validation middleware
  return function(req, res, next) {
    async.waterfall([
      function(callback) {
        if(schemas.query) {
          return api.validateInstance(
            req.query, schemas.query, function(err) {
              callback(err);
            });
        }
        callback();
      },
      function(callback) {
        if(schemas.body) {
          return api.validateInstance(
            req.body, schemas.body, function(err) {
              callback(err);
            });
        }
        callback();
      }
    ], next);
  };
};

/**
 * Retrieves a validation schema given a name for the schema.
 *
 * @param name the name of the schema to retrieve.
 *
 * @return the object for the schema, or null if the schema doesn't exist.
 */
api.getSchema = function(name) {
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
api.validateInstance = function(instance, schema, callback) {
  // do validation
  const valid = ajv.validate(schema, instance);
  if(valid) {
    if(callback) {
      callback();
    }
    return valid;
  }

  // FIXME: making minimal change right now to capture errors with new API
  const result = {
    errors: ajv.errors
  };

  // FIXME: skipping all post-processing of errors

  // create public error messages
  // const errors = [];
  // result.errors.forEach(function(error) {
  //   // create custom error details
  //   const details = {
  //     path: error.property,
  //     'public': true
  //   };
  //   details.schema = {
  //     title: error.schema.title || '',
  //     description: error.schema.description || ''
  //   };
  //   // include custom errors or use default
  //   details.errors = error.schema.errors || {
  //     invalid: 'Invalid input.',
  //     missing: 'Missing input.'
  //   };
  //   if(error.value) {
  //     if(error.schema.errors && 'mask' in error.schema.errors) {
  //       const mask = error.schema.errors.mask;
  //       if(mask === true) {
  //         details.value = '***MASKED***';
  //       } else {
  //         details.value = mask;
  //       }
  //     } else {
  //       details.value = error.value;
  //     }
  //   }

  //   // add bedrock validation error
  //   errors.push(new BedrockError(
  //     error.message, 'ValidationError', details));
  // });

  const msg = schema.title ?
    'A validation error occured in the \'' + schema.title + '\' validator.' :
    'A validation error occured in an unnamed validator.';
  const error = new BedrockError(
    msg, 'ValidationError',
    {'public': true, errors: result.errors, httpStatusCode: 400});
  if(callback) {
    callback(error);
    return result;
  }
  result.error = error;
  return result;
};
