/*!
 * Copyright (c) 2012-2018 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

module.exports = function(context, extend) {
  const schema = {
    title: 'JSON-LD context',
    description: 'A JSON-LD Context'
  };
  if(!Array.isArray(context)) {
    schema.anyOf = [{
      type: 'string'
      // enum added below if context param truthy
    }, {
      type: 'object'
      // FIXME: improve context object validator
    }];
    if(context) {
      schema.anyOf[0].enum = [context];
    }
  } else {
    Object.assign(schema, {
      type: 'array',
      minItems: context.length,
      uniqueItems: true,
      items: [],
      errors: {
        invalid: 'The JSON-LD context information is invalid.',
        missing: 'The JSON-LD context information is missing.'
      }
    });
    for(let i = 0; i < context.length; ++i) {
      if(typeof context[i] === 'string') {
        schema.items.push({
          type: 'string',
          enum: [context[i]]
        });
      } else {
        // FIXME: improve context object validator
        schema.items.push({type: 'object'});
      }
    }
  }
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
