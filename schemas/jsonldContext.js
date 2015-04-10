/*
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');

module.exports = function(context, extend) {
  var schema = {
    required: true,
    title: 'JSON-LD context',
    description: 'A JSON-LD Context',
    type: [{
      type: 'string',
      enum: [context]
    }, {
      type: 'object'
      // FIXME: improve context object validator
    }]
  };
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
