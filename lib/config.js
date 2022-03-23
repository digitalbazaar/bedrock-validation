/*!
 * Copyright (c) 2012-2020 Digital Bazaar, Inc. All rights reserved.
 */
import {config} from 'bedrock';
import {fileURLToPath} from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config.validation = {};
config.validation.schema = {};
config.validation.schema.paths = [];
config.validation.schema.skip = [];

// common validation schemas
config.validation.schema.paths.push(
  path.join(__dirname, '..', 'schemas')
);
