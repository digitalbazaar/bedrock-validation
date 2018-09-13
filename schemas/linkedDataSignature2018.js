/*!
 * Copyright (c) 2012-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const w3cDateTime = require('./w3cDateTime');
const identifier = require('./identifier');

const signature = {
  title: 'Linked Data Signature',
  description: 'A Linked Data digital signature.',
  // NOTE: id is not required
  required: ['type', 'creator', 'created', 'jws'],
  type: 'object',
  properties: {
    id: identifier(),
    type: {
      title: 'Linked Data Signature Type',
      type: 'string',
      enum: ['Ed25519Signature2018']
    },
    creator: identifier(),
    created: w3cDateTime(),
    jws: {
      title: 'Digital Signature Value',
      description: 'The Base64 encoding of the result of the signature ' +
        'algorithm.',
      type: 'string'
    },
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
