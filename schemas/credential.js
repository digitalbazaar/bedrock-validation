/*
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');

var schemas = {};
schemas.identifier = require('./identifier');
schemas.url = require('./url');
schemas.w3cDateTime = require('./w3cDateTime');

// TODO: Improve this schema
var schema = {
  type: 'object',
  title: 'Credential',
  properties: {
    '@context': {required: true},
    issuer: schemas.identifier({required: true}),
    issued: schemas.w3cDateTime({required: true}),
    claim: {
      required: true,
      properties: {
        id: schemas.identifier({required: true})
      }
    }
  }
};

module.exports = function(extend) {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
