/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import identifier from './identifier.js';
import {klona} from 'klona';
import w3cDateTime from './w3cDateTime.js';

const signature = {
  title: 'Linked Data Signature',
  description: 'A Linked Data digital signature.',
  type: 'object',
  properties: {
    id: identifier(),
    type: {
      title: 'Linked Data Signature Type',
      type: 'string',
      enum: ['LinkedDataSignature2015', 'LinkedDataSignature2016']
    },
    creator: identifier(),
    created: w3cDateTime(),
    signatureValue: {
      title: 'Digital Signature Value',
      description: 'The Base64 encoding of the result of the signature ' +
        'algorithm.',
      type: 'string'
    },
  },
  // NOTE: id is not required
  required: ['type', 'creator', 'created', 'signatureValue']
};

const schema = {
  title: 'Linked Data Signatures',
  anyOf: [{
    type: 'array',
    items: signature,
    minItems: 1,
  }, signature]
};

export default function(extend) {
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
