/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../lib/helpers.js';
import {klona} from 'klona';
import identifier from './identifier.js';

const schema = {
  title: 'JSON-LD identifier',
  anyOf: [
    identifier(),
    {
      type: 'object',
      additionalProperties: true,
      properties: {id: identifier()},
      required: ['id']
    }
  ]
};

export default function(extend) {
  if(extend) {
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
