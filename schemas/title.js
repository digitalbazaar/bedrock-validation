/*!
 * Copyright (c) 2012-2026 Digital Bazaar, Inc.
 */
import {extend as _extend} from '../lib/helpers.js';

const schema = {
  title: 'Title',
  description: 'A descriptive title.',
  type: 'string',
  pattern: '^[-a-zA-Z0-9~`!@#$%^&*\\(\\)\\[\\]{}<>_=+\\\\|:;\'"\\.,/? ]*$',
  minLength: 1,
  maxLength: 200,
  errors: {
    invalid: 'The title contains invalid characters or is not between ' +
      '1 and 200 characters in length.',
    missing: 'Please enter a title.'
  }
};

export default function(extend) {
  if(extend) {
    return _extend(true, structuredClone(schema), extend);
  }
  return schema;
}
