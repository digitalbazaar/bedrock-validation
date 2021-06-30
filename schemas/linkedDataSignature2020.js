/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const w3cDateTime = require('./w3cDateTime');
const identifier = require('./identifier');

const signature = {
  title: 'An Ed25519 Linked Data Signature',
  description: 'An Ed25519 Linked Data Signature (2020 cryptosuite).',
  // NOTE: id is not required
  required: ['type', 'created', 'verificationMethod', 'proofValue'],
  type: 'object',
  properties: {
    id: identifier(),
    type: {
      title: 'Ed25519 Signature Type for 2020 Cryptosuite',
      type: 'string',
      enum: ['Ed25519Signature2020']
    },
    created: w3cDateTime(),
    proofValue: {
      title: 'Digital Signature Value',
      description: 'The multibase base58-btc encoding of the result of ' +
        'the signature algorithm.',
      type: 'string'
    },
    verificationMethod: identifier(),
  },
};

const schema = {
  title: 'Ed25519 Linked Data Signatures',
  oneOf: [{
    type: 'array',
    items: signature,
    minItems: 1,
  }, signature]
};

module.exports = () => (schema);
