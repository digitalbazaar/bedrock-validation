/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import proof from './proof.js';
import identifier from './jsonldIdentifier.js';
import {klona} from 'klona';
import w3cDateTime from './w3cDateTime.js';

// https://www.w3.org/TR/vc-data-model/
// Based off of the VC Data Model 1.1
const schema = {
  type: 'object',
  title: 'Verifiable Credential',
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
    credentialSubject: {
      anyOf: [
        {type: 'object'},
        {type: 'array', minItems: 1, items: {type: 'object'}}
      ]
    },
    id: identifier(),
    issuer: identifier(),
    issuanceDate: w3cDateTime(),
    proof: proof(),
    type: {
      type: 'array',
      minItems: 1,
      // this first type must be VerifiableCredential
      items: [
        {type: 'string', const: 'VerifiableCredential'},
      ],
      // additional types must be strings
      additionalItems: {
        type: 'string'
      }
    }
  },
  required: [
    '@context',
    'credentialSubject',
    'issuer',
    'issuanceDate',
    'type'
  ]
};

export default function(extend) {
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
