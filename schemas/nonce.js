/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import {klona} from 'klona';

const schema = {
  title: 'Nonce',
  description: 'A single use secure unique string.',
  type: 'string',
  pattern: '^[-a-zA-Z0-9~!$%^&*\\(\\)_=+\\. ]*$',
  minLength: 8,
  maxLength: 64,
  errors: {
    invalid: 'The nonce contains invalid characters or is not between ' +
      '8 and 64 characters in length.',
    missing: 'Please enter a nonce.'
  }
};

export default function(extend) {
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
