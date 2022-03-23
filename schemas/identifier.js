/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from 'bedrock';

const schema = {
  title: 'ID',
  description: 'A unique identifier.',
  type: 'string',
  minLength: 1,
  disallow: {
    type: 'string',
    enum: ['0']
  }
};

export default function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
}
