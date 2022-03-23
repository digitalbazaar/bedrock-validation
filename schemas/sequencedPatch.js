/*!
 * Copyright (c) 2019-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from 'bedrock';
import jsonPatch from './jsonPatch.js';

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
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
}
