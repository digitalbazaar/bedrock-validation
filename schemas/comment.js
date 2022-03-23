/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from 'bedrock';

const schema = {
  title: 'Comment',
  description: 'A short comment.',
  type: 'string',
  minLength: 1,
  maxLength: 5000,
  errors: {
    invalid: 'The comment contains invalid characters or is more than ' +
      '5000 characters in length.',
    missing: 'Please enter a comment.'
  }
};

export default function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
}
