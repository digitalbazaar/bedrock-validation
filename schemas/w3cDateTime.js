/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';

const schema = {
  title: 'W3C Date/Time',
  description: 'A W3C-formatted date and time combination.',
  type: 'string',
  // eslint-disable-next-line max-len
  pattern: '^[1-9][0-9]{3}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9]):(([0-5][0-9])|60)(\\.[0-9]+)?(Z|((\\+|-)([0-1][0-9]|2[0-3]):([0-5][0-9])))?$',
  errors: {
    // eslint-disable-next-line max-len
    invalid: 'The date/time must be of the W3C date/time format "YYYY-MM-DD( |T)HH:MM:SS.s(Z|(+|-)TZOFFSET)".',
    missing: 'Please enter a date/time.'
  }
};

export default function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
}
