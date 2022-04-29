/*!
 * Copyright (c) 2019-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import jsonPatch from './jsonPatch.js';
import {klona} from 'klona';

const schema = {
  required: ['patch', 'sequence', 'target'],
  title: 'Sequence-based JSON Patch',
  type: 'object',
  properties: {
    target: {
      type: 'string',
    },
    // FIXME: also support `frame` property later
    patch: jsonPatch(),
    sequence: {
      type: 'integer',
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER
    }
  },
  additionalProperties: false
};

export default function(extend) {
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
