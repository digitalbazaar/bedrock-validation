/*!
 * Copyright (c) 2012-2026 Digital Bazaar, Inc.
 */
import {extend as _extend} from '../lib/helpers.js';

// schema for a proof on a VerifiableCredential or Presentation
const schema = {
  title: 'Proof',
  anyOf: [
    {type: 'object'},
    {type: 'array', minItems: 1, items: {type: 'object'}}
  ]
};

export default function(extend) {
  if(extend) {
    return _extend(true, structuredClone(schema), extend);
  }
  return schema;
}
