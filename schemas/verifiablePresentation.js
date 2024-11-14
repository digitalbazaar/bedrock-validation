/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import idOrObjectWithId from './helpers/idOrObjectWithId.js';
import {klona} from 'klona';
import proof from './proof.js';
import verifiableCredential from './verifiableCredential.js';

const schema = {
  title: 'Verifiable Presentation',
  type: 'object',
  additionalProperties: true,
  properties: {
    '@context': {
      type: 'array',
      minItems: 1,
      // the first context must be the VC context
      items: [{
        type: 'string',
        const: 'https://www.w3.org/2018/credentials/v1'
      }],
      // additional contexts maybe strings or objects
      additionalItems: {
        anyOf: [{type: 'string'}, {type: 'object'}]
      }
    },
    id: idOrObjectWithId(),
    type: {
      type: 'array',
      minItems: 1,
      // this first type must be VerifiablePresentation
      items: [
        {type: 'string', const: 'VerifiablePresentation'},
      ],
      // additional types must be strings
      additionalItems: {
        type: 'string'
      }
    },
    verifiableCredential: {
      anyOf: [
        verifiableCredential(),
        {type: 'array', minItems: 1, items: verifiableCredential()}
      ]
    },
    holder: idOrObjectWithId(),
    proof: proof()
  },
  required: ['@context', 'type']
};

export default function(extend) {
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
