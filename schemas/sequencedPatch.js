/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const jsonPatch = require('./jsonPatch');

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

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
