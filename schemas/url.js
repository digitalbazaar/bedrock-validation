/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

const schema = {
  required: true,
  title: 'URL',
  description: 'A universal resource location.',
  type: 'string',
  minLength: 1,
  errors: {
    invalid: 'Please enter a valid URL.',
    missing: 'Please enter a URL.'
  }
};

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
