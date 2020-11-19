/*!
 * Copyright (c) 2012-2018 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

const schema = {
  title: 'Public Key PEM',
  description: 'A cryptographic Public Key in PEM format.',
  type: 'string',
  // eslint-disable-next-line max-len
  pattern: '^\\s*-----BEGIN (RSA\\s)?PUBLIC KEY-----[a-zA-Z0-9/+=\\s]*-----END (RSA\\s)?PUBLIC KEY-----\\s*$',
  errors: {
    invalid: 'The public key is not formatted correctly.',
    missing: 'The public key is missing.'
  }
};

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
