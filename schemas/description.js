/*!
 * Copyright (c) 2012-2026 Digital Bazaar, Inc.
 */
import {extend as _extend} from '../lib/helpers.js';

const schema = {
  title: 'Description',
  description: 'A description.',
  type: 'string',
  minLength: 0,
  maxLength: 5000,
  errors: {
    invalid: 'The description contains invalid characters or is more than ' +
      '5000 characters in length.',
    missing: 'Please enter a description.'
  }
};

export default function(extend) {
  if(extend) {
    return _extend(true, structuredClone(schema), extend);
  }
  return schema;
}
