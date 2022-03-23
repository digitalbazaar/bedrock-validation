/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from 'bedrock';
import identifier from './identifier.js';
import jsonldContext from './jsonldContext.js';
import w3cDateTime from './w3cDateTime.js';

// TODO: Improve this schema
const schema = {
  type: 'object',
  title: 'Credential',
  properties: {
    '@context': jsonldContext(),
    // FIXME: improve credential context check
    //'@context': schemas.jsonldContext([
    //  constants.IDENTITY_CONTEXT_V1_URL,
    //  constants.CREDENTIALS_CONTEXT_V1_URL
    //]),
    issuer: identifier(),
    issued: w3cDateTime(),
    claim: {
      required: ['id'],
      properties: {
        id: identifier()
      },
    }
  },
  required: ['issuer', 'issued', 'claim']
};

export default function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
}
