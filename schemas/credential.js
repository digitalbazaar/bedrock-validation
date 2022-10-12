/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import identifier from './identifier.js';
import {klona} from 'klona';
import w3cDateTime from './w3cDateTime.js';

// https://www.w3.org/TR/vc-data-model/
// Based off of the VC Data Model 1.1
const schema = {
  type: 'object',
  title: 'Credential',
  additionalProperties: true,
  properties: {
    '@context': {
      type: 'array',
      minItems: 1,
      // first item must be the credentials context
      prefixItems: [{
        type: 'string',
        const: 'https://www.w3.org/2018/credentials/v1'
      }],
      items: [{type: 'string'}, {type: 'object'}]
    },
    credentialSubject: {
      required: ['id'],
      properties: {
        id: identifier()
      }
    },
    id: identifier(),
    issuer: identifier(),
    issuanceDate: w3cDateTime(),
    proof: {
      anyOf: [
        {type: 'object'},
        {type: 'array', minItems: 1, items: {type: 'object'}}
      ]
    },
    type: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string'
      }
    }
  },
  required: [
    '@context',
    'credentialSubject',
    'id',
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
