/*!
 * Copyright (c) 2012-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const w3cDateTime = require('./w3cDateTime');
const identifier = require('./identifier');

const baseSignature = {
  title: 'Linked Data Signature',
  description: 'A Linked Data digital signature.',
  // NOTE: id is not required
  required: ['type', 'created', 'proofValue'],
  type: 'object',
  properties: {
    id: identifier(),
    type: {
      title: 'Linked Data Signature Type',
      type: 'string',
      enum: ['Ed25519Signature2020']
    },
    creator: identifier(),
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

const signature = {
  allOf: [
    baseSignature, {
      // only one of `creator` or `verificationMethod`
      anyOf: [{
        required: ['creator'],
        not: {required: ['verificationMethod']},
      }, {
        required: ['verificationMethod'],
        not: {required: ['creator']},
      }]
    }
  ]
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
