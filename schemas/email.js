/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import {extend as _extend} from '../lib/helpers.js';
import {klona} from 'klona';

// RFC 1034 - All labels have a max length of 63 octets.
// https://tools.ietf.org/html/rfc1034#section-3.1
const schema = {
  title: 'Email',
  description: 'An email address.',
  type: 'string',
  // eslint-disable-next-line max-len
  pattern: '^[-a-z0-9~!$%^&*_=+}{\\\'?]+(\\.[-a-z0-9~!$%^&*_=+}{\\\'?]+)*@(((([a-z0-9]{1}[a-z0-9\\-]{0,63}[a-z0-9]{1})|[a-z])\\.)+[a-z]{2,63})$',
  minLength: 1,
  maxLength: 100,
  errors: {
    invalid: 'The email address is invalid.',
    missing: 'Please enter an email address.'
  }
};

export default function(extend, options) {
  if(options && options.lowerCaseOnly) {
    extend = extend || {};
    if(!('pattern' in extend)) {
      // eslint-disable-next-line max-len
      extend.pattern = '^[-a-z0-9~!$%^&*_=+}{\\\'?]+(\\.[-a-z0-9~!$%^&*_=+}{\\\'?]+)*@(((([a-z0-9]{1}[a-z0-9\\-]{0,63}[a-z0-9]{1})|[a-z])\\.)+[a-z]{2,63})$';
    }
  }
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
