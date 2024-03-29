/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import identifier from './identifier.js';
import w3cDateTime from './w3cDateTime.js';

const signature = {
  title: 'Ed25519Signature2020',
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
  title: 'One or more Ed25519 signatures (2020 cryptosuite)',
  oneOf: [{
    type: 'array',
    items: signature,
    minItems: 1,
  }, signature]
};

export default function() {
  return schema;
}
