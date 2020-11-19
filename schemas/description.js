/*!
 * Copyright (c) 2012-2020 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

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

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
