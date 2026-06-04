/*!
 * Copyright (c) 2012-2026 Digital Bazaar, Inc.
 */
import {extend as _extend} from '../../lib/helpers.js';
import identifier from '../identifier.js';

const schema = {
  title: 'identifier or an object with an id',
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
    return _extend(true, structuredClone(schema), extend);
  }
  return schema;
}
