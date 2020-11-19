/*!
 * Copyright (c) 2012-2020 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

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

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
