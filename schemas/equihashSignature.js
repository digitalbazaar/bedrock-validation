/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');

var schema = {
  required: true,
  title: 'Equihash Proof',
  description: 'An Equihash proof.',
  type: 'object',
  properties: {
    type: {
      title: 'Equihash Proof Type',
      required: true,
      type: 'string',
      enum: ['EquihashProof2017']
    },
    equihashParameterN: {
      title: 'Equihash `n` Parameter',
      required: true,
      type: 'integer'
    },
    equihashParameterK: {
      title: 'Equihash `k` Parameter',
      required: true,
      type: 'integer'
    },
    nonce: {
      title: 'Equihash `nonce` Parameter',
      required: true,
      type: 'string'
    },
    proofValue: {
      title: 'Proof Value',
      description: 'The encoding of the result of the proof algorithm.',
      required: true,
      type: 'string'
    }
  },
  additionalProperties: false
};

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
