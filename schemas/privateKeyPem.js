/*!
 * Copyright (c) 2012-2020 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

const schema = {
  title: 'Private Key PEM',
  description: 'A cryptographic Private Key in PEM format.',
  type: 'string',
  // eslint-disable-next-line max-len
  pattern: '^\\s*-----BEGIN RSA PRIVATE KEY-----[a-zA-Z0-9/+=\\s]*-----END RSA PRIVATE KEY-----\\s*$',
  errors: {
    invalid: 'The private key is not formatted correctly.',
    missing: 'The private key is missing.'
  }
};

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
