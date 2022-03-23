/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import identifier from './identifier.js';
import w3cDateTime from './w3cDateTime.js';

const baseSignature = {
  title: 'Linked Data Signature',
  description: 'A Linked Data digital signature.',
  // NOTE: id is not required
  required: ['type', 'created', 'jws'],
  type: 'object',
  properties: {
    id: identifier(),
    type: {
      title: 'Linked Data Signature Type',
      type: 'string',
      enum: ['Ed25519Signature2018', 'RsaSignature2018']
    },
    creator: identifier(),
    created: w3cDateTime(),
    jws: {
      title: 'Digital Signature Value',
      description: 'The Base64 encoding of the result of the signature ' +
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

export default function() {
  return schema;
}
