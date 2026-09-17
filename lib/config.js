/*!
 * Copyright (c) 2012-2026 Digital Bazaar, Inc.
 */
import {config} from '@bedrock/core';
import path from 'node:path';

config.validation = {};
config.validation.schema = {};
config.validation.schema.paths = [];
config.validation.schema.skip = [];

// common validation schemas
config.validation.schema.paths.push(
  path.join(import.meta.dirname, '..', 'schemas')
);
