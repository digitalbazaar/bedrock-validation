/*
 * Bedrock validation configuration.
 *
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
const config = require('bedrock').config;
const path = require('path');

config.validation = {};
config.validation.schema = {};
config.validation.schema.paths = [];
config.validation.schema.skip = [];

// common validation schemas
config.validation.schema.paths.push(
  path.join(__dirname, '..', 'schemas')
);

// tests
config.mocha.tests.push(path.join(__dirname, '..', 'tests'));
