/*!
 * Copyright (c) 2012-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const w3cDateTime = require('./w3cDateTime');
const identifier = require('./identifier');

const signature = {
  title: 'Linked Data Signature',
  description: 'A Linked Data digital signature.',
  // NOTE: id is not required
  required: ['type', 'created', 'verificationMethod', 'proofValue'],
  type: 'object',
  properties: {
    id: identifier(),
    type: {
      title: 'Linked Data Signature Type',
      type: 'string',
      enum: ['Ed25519Signature2020']
    },
    created: w3cDateTime(),
    proofValue: {
      title: 'Digital Signature Value',
      description: 'The multibase encoding of the result of the signature ' +
        'algorithm.',
      type: 'string'
    },
    verificationMethod: identifier(),
  },
};

const schema = {
  title: 'Linked Data Signatures',
  oneOf: [{
    type: 'array',
    items: signature,
    minItems: 1,
  }, signature]
};

module.exports = () => (schema);
