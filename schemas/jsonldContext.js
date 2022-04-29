/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import {klona} from 'klona';

export default function(context, extend) {
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
    }, {
      type: 'array',
      // items added below if context param truthy
    }];
    if(context) {
      schema.anyOf[0].enum = [context];
      schema.anyOf[2].items = [{const: context}];
      schema.anyOf[2].additionalItems = false;
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
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
