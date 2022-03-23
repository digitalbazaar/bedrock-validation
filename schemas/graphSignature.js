/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from 'bedrock';
import jsonldType from './jsonldType.js';
import w3cDateTime from './w3cDateTime.js';
import identifier from './identifier.js';

const schema = {
  title: 'GraphSignature',
  description: 'A digital signature on a graph.',
  type: 'object',
  properties: {
    id: identifier(),
    type: jsonldType('GraphSignature2012'),
    creator: identifier(),
    created: w3cDateTime(),
    signatureValue: {
      title: 'Digital Signature Value',
      description: 'A base-64 encoded byte string containing the result of ' +
        'the GraphSignature2012 algorithm.',
      type: 'string'
    },
  },
  // NOTE: id is not required
  required: ['type', 'creator', 'created', 'signatureValue'],
  additionalProperties: false
};

export default function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
}
