/*!
 * Copyright (c) 2012-2018 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

const schema = {
  title: 'Email',
  description: 'An email address.',
  type: 'string',
  pattern: "^[-a-zA-Z0-9~!$%^&*_=+}{\\'?]+(\\.[-a-zA-Z0-9~!$%^&*_=+}{\\'?]+)*@(((([a-zA-Z0-9]{1}[a-zA-Z0-9\\-]{0,62}[a-zA-Z0-9]{1})|[a-zA-Z])\\.)+[a-zA-Z]{2,6})$",
  minLength: 1,
  maxLength: 100,
  errors: {
    invalid: 'The email address is invalid.',
    missing: 'Please enter an email address.'
  }
};

module.exports = function(extend, options) {
  if(options && options.lowerCaseOnly) {
    extend = extend || {};
    if(!('pattern' in extend)) {
      extend.pattern = "^[-a-z0-9~!$%^&*_=+}{\\'?]+(\\.[-a-z0-9~!$%^&*_=+}{\\'?]+)*@(((([a-z0-9]{1}[a-z0-9\\-]{0,62}[a-z0-9]{1})|[a-z])\\.)+[a-z]{2,6})$";
    }
  }
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
