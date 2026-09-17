/*!
 * Copyright (c) 2017-2026 Digital Bazaar, Inc.
 */
import {config} from '@bedrock/core';
import path from 'node:path';

config.mocha.tests.push(path.join(import.meta.dirname, 'mocha'));
