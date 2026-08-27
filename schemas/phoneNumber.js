/*!
 * Copyright (c) 2026 Digital Bazaar, Inc.
 */
import {extend as _extend} from '../lib/helpers.js';

/* E.164: a leading `+`, a country code whose first digit is not zero, and at
most fifteen digits in total. Callers normalize before validating, so only one
form of a given number can reach a uniqueness constraint. */
const schema = {
  title: 'Phone Number',
  description: 'A phone number in E.164 form.',
  type: 'string',
  pattern: '^\\+[1-9]\\d{1,14}$',
  minLength: 3,
  maxLength: 16,
  errors: {
    // keeps the submitted number out of the public error body and the log
    mask: true,
    invalid: 'The phone number must be in E.164 form, such as +15551234567.',
    missing: 'Please enter a phone number.'
  }
};

export default function(extend) {
  if(extend) {
    return _extend(true, structuredClone(schema), extend);
  }
  return schema;
}
