/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import {klona} from 'klona';

const schema = {
  title: 'Label',
  description: 'A short, descriptive label.',
  type: 'string',
  pattern: '^[-a-zA-Z0-9~`!@#$%^&*\\(\\)\\[\\]{}<>_=+\\\\|:;\'"\\.,/? ]*$',
  minLength: 1,
  maxLength: 200,
  errors: {
    invalid: 'The label contains invalid characters or is not between ' +
      '1 and 200 characters in length.',
    missing: 'Please enter a label.'
  }
};

export default function(extend) {
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
