/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
export default function(types, alternates) {
  const schema = {
    title: 'Object Type',
    description: 'A set of terms, CURIEs, or URLs specifying the type of ' +
      'the object.',
    anyOf: []
  };

  types = Array.isArray(types) ? types : [types];

  // allow single object
  if(types.length === 1) {
    schema.anyOf.push({
      type: 'string',
      enum: types,
      errors: {
        invalid: 'The JSON-LD type information is invalid.',
        missing: 'The JSON-LD type information is missing.'
      }
    });
  }

  // allow array combination of all types
  schema.anyOf.push({
    type: 'array',
    // minItems: types.length,
    uniqueItems: true,
    items: {
      type: 'string',
      enum: types
    },
    errors: {
      invalid: 'The JSON-LD type information is invalid.',
      missing: 'The JSON-LD type information is missing.'
    }
  });

  // HACK: madness to support given types *must* exist, while allowing
  // up to <alternates> other custom types
  if(alternates !== undefined) {
    for(let before = 0; before <= alternates; ++before) {
      const s = {
        type: 'array',
        minItems: types.length,
        uniqueItems: true,
        items: [],
        additionalItems: {
          type: 'string'
        },
        errors: {
          invalid: 'The JSON-LD type information is invalid.',
          missing: 'The JSON-LD type information is missing.'
        }
      };
      for(let i = 0; i < before; ++i) {
        s.items.push({type: 'string'});
      }
      for(let i = 0; i < types.length; ++i) {
        s.items.push({
          type: 'string',
          enum: types
        });
      }
      schema.anyOf.push(s);
    }
  }

  return schema;
}
