/*!
 * Copyright (c) 2012-2020 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

const schemas = {};
schemas.identifier = require('./identifier');
schemas.jsonldContext = require('./jsonldContext');
schemas.url = require('./url');
schemas.w3cDateTime = require('./w3cDateTime');

// TODO: Improve this schema
const schema = {
  type: 'object',
  title: 'Credential',
  properties: {
    '@context': schemas.jsonldContext(),
    // FIXME: improve credential context check
    //'@context': schemas.jsonldContext([
    //  constants.IDENTITY_CONTEXT_V1_URL,
    //  constants.CREDENTIALS_CONTEXT_V1_URL
    //]),
    issuer: schemas.identifier(),
    issued: schemas.w3cDateTime(),
    claim: {
      required: ['id'],
      properties: {
        id: schemas.identifier()
      },
    }
  },
  required: ['issuer', 'issued', 'claim']
};

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
