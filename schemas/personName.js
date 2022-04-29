/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import {klona} from 'klona';

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
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
