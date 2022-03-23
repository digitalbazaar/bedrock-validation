/*!
 * Copyright (c) 2019-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from 'bedrock';

const schema = {
  title: 'JSON Patch',
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    required: ['op', 'path'],
    // FIXME: more strictly validate properties based on value of `op`
    properties: {
      op: {
        type: 'string',
        enum: ['add', 'copy', 'move', 'remove', 'replace', 'test']
      },
      from: {
        type: 'string',
      },
      path: {
        type: 'string',
      },
      value: {
        //type: ['number', 'string', 'boolean', 'object', 'array'],
      }
    },
    additionalProperties: false
  }
};

export default function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
}
