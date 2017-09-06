/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

const jsonldType = require('./jsonldType');
const w3cDateTime = require('./w3cDateTime');
const identifier = require('./identifier');

const schema = {
  required: true,
  title: 'GraphSignature',
  description: 'A digital signature on a graph.',
  type: 'object',
  properties: {
    id: identifier({required: false}),
    type: jsonldType('GraphSignature2012'),
    creator: identifier(),
    created: w3cDateTime(),
    signatureValue: {
      title: 'Digital Signature Value',
      description: 'A base-64 encoded byte string containing the result of ' +
        'the GraphSignature2012 algorithm.',
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
