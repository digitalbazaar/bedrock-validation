/*!
 * Copyright (c) 2012-2026 Digital Bazaar, Inc.
 */
import {extend as _extend} from '../lib/helpers.js';

const schema = {
  title: 'Person Name',
  description: 'The name of a person.',
  type: 'string',
  pattern: '^\\S$|^\\S.*\\S$',
  minLength: 1,
  maxLength: 100,
  errors: {
    invalid: 'The name must not start or end with whitespace and must ' +
      'be between 1 and 100 characters in length.',
    missing: 'Please enter a name.'
  }
};

export default function(extend) {
  if(extend) {
    return _extend(true, structuredClone(schema), extend);
  }
  return schema;
}
