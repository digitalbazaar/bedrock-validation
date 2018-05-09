/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

const schema = {
  required: true,
  title: 'JSON Patch',
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    required: true,
    // FIXME: more strictly validate properties based on value of `op`
    properties: {
      op: {
        type: 'string',
        required: true,
        enum: ['add', 'copy', 'move', 'remove', 'replace', 'test']
      },
      from: {
        type: 'string',
        required: false
      },
      path: {
        type: 'string',
        required: true
      },
      value: {
        //type: ['number', 'string', 'boolean', 'object', 'array'],
        required: false
      }
    },
    additionalProperties: false
  }
};

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
