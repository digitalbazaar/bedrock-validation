/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {extend as _extend} from '../../lib/helpers.js';
import identifier from '../identifier.js';
import {klona} from 'klona';

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
    return _extend(true, klona(schema), extend);
  }
  return schema;
}
