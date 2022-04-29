/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import {extend as _extend} from '../lib/helpers.js';
import {klona} from 'klona';

const schema = {
  title: 'Private Key PEM',
  description: 'A cryptographic Private Key in PEM format.',
  type: 'string',
  // eslint-disable-next-line max-len
  pattern: '^\\s*-----BEGIN RSA PRIVATE KEY-----[a-zA-Z0-9/+=\\s]*-----END RSA PRIVATE KEY-----\\s*$',
  errors: {
    invalid: 'The private key is not formatted correctly.',
    missing: 'The private key is missing.'
  }
};

export default function(extend) {
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
