/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import verifiableCredential from './verifiableCredential.js';
import {extend as _extend} from '../lib/helpers.js';
import identifier from './identifier.js';
import {klona} from 'klona';

const schema = {
  title: 'Verifiable Presentation',
  type: 'object',
  additionalProperties: true,
  properties: {
    id: identifier(),
    type: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string'
      }
    },
    verifiableCredential: {
      anyOf: [
        verifiableCredential(),
        {type: 'array', minItems: 1, items: verifiableCredential()}
      ]
    },
    holder: identifier(),
    proof: {
      anyOf: [
        {type: 'object'},
        {type: 'array', minItems: 1, items: {type: 'object'}}
      ]
    }
  },
  required: ['type']
};

export default function(extend) {
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
