/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');

var schema = {
  required: true,
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

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
