/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import {klona} from 'klona';

const schema = {
  title: 'Slug',
  description: 'A short identifier within a URL.',
  type: 'string',
  pattern: '^[a-z0-9][-a-z0-9~_\\.]*$',
  minLength: 3,
  maxLength: 40,
  errors: {
    invalid:
      'The slug must start with a letter or number, contain only lowercase ' +
      'letters, numbers, hyphens, periods, underscores, and tildes. It must ' +
      'between 3 and 40 characters in length.',
    missing: 'Please enter a slug.'
  }
};

export default function(extend) {
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
