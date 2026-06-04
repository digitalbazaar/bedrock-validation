/*!
 * Copyright (c) 2012-2026 Digital Bazaar, Inc.
 */
import {extend as _extend} from '../lib/helpers.js';

const schema = {
  title: 'URL',
  description: 'A universal resource location.',
  type: 'string',
  minLength: 1,
  errors: {
    invalid: 'Please enter a valid URL.',
    missing: 'Please enter a URL.'
  }
};

export default function(extend) {
  if(extend) {
    return _extend(true, structuredClone(schema), extend);
  }
  return schema;
}
