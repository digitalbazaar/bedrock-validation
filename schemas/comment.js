/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import {klona} from 'klona';

const schema = {
  title: 'Comment',
  description: 'A short comment.',
  type: 'string',
  minLength: 1,
  maxLength: 5000,
  errors: {
    invalid: 'The comment contains invalid characters or is more than ' +
      '5000 characters in length.',
    missing: 'Please enter a comment.'
  }
};

export default function(extend) {
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
