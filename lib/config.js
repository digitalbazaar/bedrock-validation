/*!
 * Copyright (c) 2012-2018 Digital Bazaar, Inc. All rights reserved.
 */
const {config} = require('bedrock');
const path = require('path');

config.validation = {};
config.validation.schema = {};
config.validation.schema.paths = [];
config.validation.schema.skip = [];

// common validation schemas
config.validation.schema.paths.push(
  path.join(__dirname, '..', 'schemas')
);
