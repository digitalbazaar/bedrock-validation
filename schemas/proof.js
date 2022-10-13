/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import {klona} from 'klona';

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
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
