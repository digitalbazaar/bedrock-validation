/*
 * Copyright (c) 2012-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const expect = global.chai.expect;
const validation = require('bedrock-validation');
const validate = validation.validate;
const mock = require('./mock.data.js');

describe('bedrock-validation', function() {
  describe('invalid schema specified', function() {
    describe('synchronous mode', function() {
      it('should throw an error', function() {
        expect(function() {
          validate('test-unknown-schema', {some: 'object'});
        }).to.throw('Could not validate data; unknown schema name ' +
          '(test-unknown-schema).');
      });
    });
    describe('asynchronous mode', function() {
      it('should call callback with an error', function(done) {
        validate('test-unknown-schema', {some: 'object'}, function(err) {
          should.exist(err);
          err.message.should.equal(
            'Could not validate data; unknown schema name ' +
            '(test-unknown-schema).');
          done();
        });
      });
    });
  });

  describe('comment', function() {
    const schema = validation.getSchema('comment');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty comments', function() {
      const result = validation.validate('comment', '');
      result.valid.should.be.false;
    });
    it('should reject comments that are too long', function() {
      const tmp = '12345678901234567890123456789012345678901234567890';
      const max = schema.maxLength / tmp.length;
      let str = '';
      for(let i = 0; i < max; ++i) {
        str += tmp;
      }
      const result = validation.validate('comment', str + '0');
      result.valid.should.be.false;
    });
    it('should accept valid comments', function() {
      const small = validation.validate('comment', '1');
      should.not.exist(small.error);
      small.valid.should.be.true;
      const tmp = '12345678901234567890123456789012345678901234567890';
      const max = schema.maxLength / tmp.length;
      let str = '';
      for(let i = 0; i < max; ++i) {
        str += tmp;
      }
      const large = validation.validate('comment', str);
      large.valid.should.be.true;
    });
    it('should accept normal non-letter symbols', function() {
      const result = validation.validate(
        'comment', '-a-zA-Z0-9~!@#$%^&*()_=+\\|{}[];:\'"<>,./? ');
      result.valid.should.be.true;
    });
    it('should validate with name as an object', function() {
      const name = {
        body: 'comment',
        query: 'comment'
      };
      const result = validation.validate(name, '1');
      result.valid.should.be.true;
    });
    it('should throw an UnknownSchema error when schema does not exist',
      function() {
        let result;
        let err;

        try {
          result = validation.validate('test');
        } catch(e) {
          err = e;
        }

        should.exist(err);
        should.not.exist(result);
        err.name.should.equal('UnknownSchema');
      });
    it('should return middleware with a ValidationError due to invalid body',
      function(done) {
        const req = {
          body: ''
        };
        const res = {};
        const next = function(err) {
          should.exist(err);
          err.name.should.equal('ValidationError');
          done();
        };

        const result = validation.validate('comment');
        result(req, res, next);
      });
    it('should call middleware with a ValidationError due to invalid query',
      function(done) {
        const req = {
          query: ''
        };
        const res = {};
        const next = function(err) {
          should.exist(err);
          err.name.should.equal('ValidationError');
          done();
        };

        const result = validation.validate({
          query: 'comment'});
        result(req, res, next);
      });
    it('should not return a ValidationError in middleware when valid',
      function(done) {
        const req = {
          body: 'comment'
        };
        const res = {};
        const next = function(err) {
          should.not.exist(err);
          done();
        };

        const result = validation.validate('comment');
        result(req, res, next);
      });
    it('should accept valid comment with extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/comment')(extend);
      const result = validation.validateInstance('test comment', schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('description', function() {
    const schema = validation.getSchema('description');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid description', function() {
      const result = validation.validate('description', 'test description');
      result.valid.should.be.true;
    });
    it('should reject an invalid description', function() {
      const result = validation.validate('description', {});
      result.valid.should.be.false;
    });
    it('should accept valid description with extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/description')(extend);
      const result = validation.validateInstance('test description', schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('identifier', function() {
    const schema = validation.getSchema('identifier');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid identifier', function() {
      const result = validation.validate('identifier', '1234');
      result.valid.should.be.true;
    });
    it('should reject an invalid identifier', function() {
      const result = validation.validate('identifier', '');
      result.valid.should.be.false;
    });
    it('should accept valid identifier with extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/identifier')(extend);
      const result = validation.validateInstance('1234', schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('label', function() {
    const schema = validation.getSchema('label');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid label', function() {
      const result = validation.validate('label', 'test label');
      result.valid.should.be.true;
    });
    it('should reject an invalid label', function() {
      const result = validation.validate('label', {});
      result.valid.should.be.false;
    });
    it('should accept valid label with extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/label')(extend);
      const result = validation.validateInstance('test label', schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('title', function() {
    const schema = validation.getSchema('title');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid title', function() {
      const result = validation.validate('title', 'Test Title');
      result.valid.should.be.true;
    });
    it('should reject an invalid title', function() {
      const result = validation.validate('title', {});
      result.valid.should.be.false;
    });
    it('should accept valid title with extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/title')(extend);
      const result = validation.validateInstance('Test Title', schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('url', function() {
    const schema = validation.getSchema('url');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid url', function() {
      const result = validation.validate('url', 'http://foo.com/v2');
      result.valid.should.be.true;
    });
    it('should reject an invalid url', function() {
      const result = validation.validate('url', {});
      result.valid.should.be.false;
    });
    it('should accept valid url with extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/url')(extend);
      const result = validation.validateInstance('http://foo.com/v2', schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('w3cDateTime', function() {
    const schema = validation.getSchema('w3cDateTime');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid w3cDateTime', function() {
      const result = validation.validate('w3cDateTime', '2016-01-01T01:00:00Z');
      result.valid.should.be.true;
    });
    it('should reject an invalid w3cDateTime', function() {
      const result = validation.validate('w3cDateTime', {});
      result.valid.should.be.false;
    });
    it('should accept valid w3cDateTime with extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/w3cDateTime')(extend);
      const result = validation.validateInstance(
        '2016-01-01T01:00:00Z', schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('personName', function() {
    const schema = validation.getSchema('personName');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid personName', function() {
      const result = validation.validate('personName', 'Name');
      result.valid.should.be.true;
    });
    it('should reject an invalid personName', function() {
      const result = validation.validate('personName', {});
      result.valid.should.be.false;
    });
    it('should accept valid personName with extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/personName')(extend);
      const result = validation.validateInstance('Name', schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('privateKeyPem', function() {
    const schema = validation.getSchema('privateKeyPem');
    const privateKey = mock.keys.alpha.privateKey;
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid privateKeyPem', function() {

      const result = validation.validate('privateKeyPem', privateKey);
      result.valid.should.be.true;
    });
    it('should reject an invalid privateKeyPem', function() {
      const result = validation.validate('privateKeyPem', {});
      result.valid.should.be.false;
    });
    it('should accept valid privateKeyPem with extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/privateKeyPem')(extend);
      const result = validation.validateInstance(privateKey, schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('publicKeyPem', function() {
    const schema = validation.getSchema('publicKeyPem');
    const privateKey = mock.keys.alpha.publicKey;
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid publicKeyPem', function() {

      const result = validation.validate('publicKeyPem', privateKey);
      result.valid.should.be.true;
    });
    it('should reject an invalid publicKeyPem', function() {
      const result = validation.validate('publicKeyPem', {});
      result.valid.should.be.false;
    });
    it('should accept valid privateKeyPem with extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/publicKeyPem')(extend);
      const result = validation.validateInstance(privateKey, schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('email', function() {
    const schema = validation.getSchema('email');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty emails', function() {
      const result = validation.validate('email', '');
      result.valid.should.be.false;
    });
    it('should reject emails without `@`', function() {
      const result = validation.validate('email', 'abcdefg');
      result.valid.should.be.false;
    });
    it('should accept valid emails', function() {
      const small = validation.validate('email', 'a@b.io');
      should.not.exist(small.error);
      small.valid.should.be.true;
    });
    it('should accept valid emails with callback', function() {
      const callback = function(err, result) {
        should.not.exist(err);
        result.valid.should.be.true;
      };
      validation.validate('email', 'a@b.io', callback);
    });
    it('should accept normal non-letter symbols', function() {
      const result = validation.validate(
        'email', 'abc123~!$%^&*_=+-@example.org');
      result.valid.should.be.true;
    });
    it('should not accept emails with uppercase chars', function() {
      const schema = validation.getSchema('email');
      const result = validation.validateInstance('aBC@DEF.com', schema);
      result.valid.should.be.false;
    });
    it('should reject emails with uppercase chars', function() {
      const schema = validation.schemas.email({}, {lowerCaseOnly: true});
      const result = validation.validateInstance('aBC@DEF.com', schema);
      result.valid.should.be.false;
    });
    it('should reject emails with uppercase chars with callback',
      function() {
        const schema = validation.schemas.email({}, {lowerCaseOnly: true});
        const callback = function(err, result) {
          should.not.exist(err);
          result.valid.should.be.false;
        };
        validation.validateInstance('aBC@DEF.com', schema, callback);
      });
  });

  describe('nonce', function() {
    const schema = validation.getSchema('nonce');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty nonces', function() {
      const result = validation.validate('nonce', '');
      result.valid.should.be.false;
    });
    it('should reject nonces that are too short', function() {
      const result = validation.validate('nonce', '1234567');
      result.valid.should.be.false;
    });
    it('should reject nonces that are too long', function() {
      const result = validation.validate(
        'nonce',
        // 65 chars
        '1234567890123456789012345678901234567890' +
        '1234567890123456789012345');
      result.valid.should.be.false;
    });
    it('should accept valid nonces', function() {
      const small = validation.validate('nonce', '12345678');
      small.valid.should.be.true;
      const large = validation.validate(
        'nonce',
        // 64 chars
        '1234567890123456789012345678901234567890' +
        '123456789012345678901234');
      large.valid.should.be.true;
    });
    it('should accept normal non-letter characters', function() {
      const result = validation.validate('nonce', '-a-zA-Z0-9~!$%^&*()_=+. ');
      result.valid.should.be.true;
    });
    it('should reject invalid characters', function() {
      const result = validation.validate('nonce', '|||||||||');
      result.valid.should.be.false;
    });
    it('should accept valid nonces with an extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/nonce')(extend);
      const result = validation.validateInstance('12345678', schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('slug', function() {
    const schema = validation.getSchema('slug');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty slugs', function() {
      const result = validation.validate('slug', '');
      result.valid.should.be.false;
    });
    it('should reject slugs that are too short', function() {
      // 2 chars
      const result = validation.validate('slug', '12');
      result.valid.should.be.false;
    });
    it('should reject slugs that are too long', function() {
      // 33 chars
      const result = validation.validate(
        'slug', '12345678901234567890123456789012345678901');
      result.valid.should.be.false;
    });
    it('should accept valid slugs', function() {
      // 3 chars
      let result = validation.validate('slug', 'a23');
      result.valid.should.be.true;
      // 40 chars
      result = validation.validate(
        'slug', '1234567890123456789012345678901234567890');
      result.valid.should.be.true;
      // uuids
      result = validation.validate(
        'slug', '2f5f3815-fba0-4e07-a248-d79c26ca8fd6');
      result.valid.should.be.true;
    });
    it('should accept normal non-letter characters', function() {
      const result = validation.validate('slug', 'az-az09~_.');
      result.valid.should.be.true;
    });
    it('should reject invalid characters', function() {
      let result = validation.validate('slug', 'badchar@');
      result.valid.should.be.false;
      result = validation.validate('slug', '-hyphenstart');
      result.valid.should.be.false;
    });
    it('should mask value when error occurs', function() {
      schema.errors.mask = true;
      const result = validation.validateInstance('sl', schema);
      result.valid.should.be.false;
      result.error.details.errors[0].details.value.should.equal('***MASKED***');
    });
    it('should mask value when error occurs with a custom mask',
      function() {
        schema.errors.mask = 'custom mask value';
        const result = validation.validateInstance('sl', schema);
        result.valid.should.be.false;
        result.error.details.errors[0].details.value.should
          .equal('custom mask value');
      });
    it('should accept valid slug with extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/slug')(extend);
      const result = validation.validateInstance('a23', schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('jsonldContext', function() {
    const schema = validation.getSchema('jsonldContext');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept a URL', function() {
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonldContext')('http://foo.com/v1');
      const result = validation.validateInstance('http://foo.com/v1', schema);
      result.valid.should.be.true;
    });
    it('should accept a URL with an extend', function() {
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonldContext')('http://foo.com/v1', extend);
      const result = validation.validateInstance('http://foo.com/v1', schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
    it('should reject the wrong a URL', function() {
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonldContext')('http://foo.com/v1');
      const result = validation.validateInstance('http://foo.com/v2', schema);
      result.valid.should.be.false;
    });
    it('should accept an array of URLs', function() {
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonldContext')([
        'http://foo.com/v1',
        'http://bar.com/v1'
      ]);
      const result = validation.validateInstance(
        ['http://foo.com/v1', 'http://bar.com/v1'], schema);
      result.valid.should.be.true;
    });
    it('should reject the wrong array of URLs', function() {
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonldContext')([
        'http://foo.com/v1',
        'http://bar.com/v1'
      ]);
      const result = validation.validateInstance(
        ['http://foo.com/v1', 'http://wrong.com/v1'], schema);
      result.valid.should.be.false;
    });
    it('should accept an array of objects', function() {
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonldContext')([
        {url: 'http://foo.com/v1'},
        {url: 'http://bar.com/v1'}
      ]);
      const result = validation.validateInstance([
        {url: 'http://foo.com/v1'},
        {url: 'http://bar.com/v1'}
      ], schema);
      result.valid.should.be.true;
    });
  });

  describe('jsonldType', function() {
    const schema = validation.getSchema('jsonldType');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept a string', function() {
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonldType')('Group');
      const type = 'Group';
      const result = validation.validateInstance(type, schema);
      result.valid.should.be.true;
    });
    it('should accept a string with alternates', function() {
      const alternate = 1;
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonldType')('Group', alternate);
      const type = 'Group';
      const result = validation.validateInstance(type, schema);
      schema.anyOf.length.should.equal(4);
      result.valid.should.be.true;
    });
    it('should reject the wrong string', function() {
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonldType')('Group');
      const type = 'Wrong';
      const result = validation.validateInstance(type, schema);
      result.valid.should.be.false;
    });
    it('should accept an array of strings', function() {
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonldType')(['Group', 'Name']);
      const type = ['Group', 'Name'];
      const result = validation.validateInstance(type, schema);
      result.valid.should.be.true;
    });
    it('should reject the wrong array of strings', function() {
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonldType')(['Group', 'Name']);
      const type = ['Group', 'Wrong'];
      const result = validation.validateInstance(type, schema);
      result.valid.should.be.false;
    });
  });

  describe('graphSignature', function() {
    const schema = validation.getSchema('graphSignature');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should validate a GraphSignature2012 signature', function() {
      const signature = {
        type: 'GraphSignature2012',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        // eslint-disable-next-line max-len
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.true;
    });
    it('should validate a GraphSignature2012 with an extend', function() {
      const signature = {
        type: 'GraphSignature2012',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        // eslint-disable-next-line max-len
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/graphSignature')(extend);
      const result = validation.validateInstance(signature, schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('linkedDataSignature', function() {
    const schema = validation.getSchema('linkedDataSignature');

    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });

    it('should validate a LinkedDataSignature2015 signature', function() {
      const signature = {
        type: 'LinkedDataSignature2015',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        // eslint-disable-next-line max-len
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.true;
    });

    it('should validate a LinkedDataSignature2016 signature', function() {
      const signature = {
        type: 'LinkedDataSignature2016',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        // eslint-disable-next-line max-len
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.true;
    });

    it('should validate a LinkedDataSignature2015 with an extend', function() {
      const signature = {
        type: 'LinkedDataSignature2015',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        // eslint-disable-next-line max-len
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/linkedDataSignature')(extend);
      const result = validation.validateInstance(signature, schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });

    it('should NOT validate a GraphSignature2012 signature', function() {
      const signature = {
        type: 'GraphSignature2012',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        // eslint-disable-next-line max-len
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });

    it('should NOT validate a signature w/missing type', function() {
      const signature = {
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        // eslint-disable-next-line max-len
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });

    // eslint-disable-next-line max-len
    it('should NOT validate a LinkedDataSignature2015 signature w/missing created', function() {
      const signature = {
        type: 'LinkedDataSignature2015',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        // eslint-disable-next-line max-len
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });

    // eslint-disable-next-line max-len
    it('should NOT validate a LinkedDataSignature2015 signature w/missing creator', function() {
      const signature = {
        type: 'LinkedDataSignature2015',
        created: '2016-01-01T01:00:00Z',
        // eslint-disable-next-line max-len
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });

    // eslint-disable-next-line max-len
    it('should NOT validate a LinkedDataSignature2015 signature w/missing signature', function() {
      const signature = {
        type: 'LinkedDataSignature2015',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1'
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });
  });

  describe('linkedDataSignature2020', function() {
    const schema = validation.getSchema('linkedDataSignature2020');

    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });

    it('should validate a LinkedDataSignature2020 signature', function() {
      const signature = {
        type: 'Ed25519Signature2020',
        created: '2021-01-01T19:23:24Z',
        verificationMethod: 'https://example.edu/issuers/565049#' +
          'z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T',
        proofPurpose: 'assertionMethod',
        proofValue: 'z3MvGcVxzRzzpKF1HA11EjvfPZsN8NAb7kXBRfeTm3CBg2gcJLQM5hZ' +
          'Nmj6Ccd9Lk4C1YueiFZvkSx4FuHVYVouQk'
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.true;
    });

    it('should NOT validate a signature w/missing type', function() {
      const signature = {
        created: '2021-01-01T19:23:24Z',
        verificationMethod: 'https://example.edu/issuers/565049#' +
          'z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T',
        proofPurpose: 'assertionMethod',
        proofValue: 'z3MvGcVxzRzzpKF1HA11EjvfPZsN8NAb7kXBRfeTm3CBg2gcJLQM5hZ' +
          'Nmj6Ccd9Lk4C1YueiFZvkSx4FuHVYVouQk'
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });

    it('should NOT validate a signature with missing created', function() {
      const signature = {
        type: 'Ed25519Signature2020',
        verificationMethod: 'https://example.edu/issuers/565049#' +
          'z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T',
        proofPurpose: 'assertionMethod',
        proofValue: 'z3MvGcVxzRzzpKF1HA11EjvfPZsN8NAb7kXBRfeTm3CBg2gcJLQM5hZ' +
          'Nmj6Ccd9Lk4C1YueiFZvkSx4FuHVYVouQk'
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });

    it('should NOT validate a with missing verificationMethod', function() {
      const signature = {
        type: 'Ed25519Signature2020',
        proofPurpose: 'assertionMethod',
        proofValue: 'z3MvGcVxzRzzpKF1HA11EjvfPZsN8NAb7kXBRfeTm3CBg2gcJLQM5hZ' +
          'Nmj6Ccd9Lk4C1YueiFZvkSx4FuHVYVouQk'
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });

    // eslint-disable-next-line max-len
    it('should NOT validate a signature w/missing proofValue', function() {
      const signature = {
        type: 'Ed25519Signature2020',
        verificationMethod: 'https://example.edu/issuers/565049#' +
          'z6MknCCLeeHBUaHu4aHSVLDCYQW9gjVJ7a63FpMvtuVMy53T',
        proofPurpose: 'assertionMethod'
      };
      const result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });
  });

  describe('credential', function() {
    const schema = validation.getSchema('credential');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should validate a credential', function() {
      const credential = {
        issuer: 'test',
        issued: '1997-07-16T19:20:30',
        claim: {
          id: '1234'
        }
      };
      const result = validation.validateInstance(credential, schema);
      result.valid.should.be.true;
    });
    it('should validate a credential with an extend', function() {
      const credential = {
        issuer: 'test',
        issued: '2016-01-01T01:00:00Z',
        claim: {
          id: '1234'
        }
      };
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/credential')(extend);
      const result = validation.validateInstance(credential, schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('jsonPatch', function() {
    const schema = validation.getSchema('jsonPatch');

    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });

    it('should validate a JSON patch', function() {
      const patch = [
        {op: 'add', path: '/email', value: 'pdoe@example.com'}
      ];
      const result = validation.validateInstance(patch, schema);
      result.valid.should.be.true;
    });

    it('should NOT validate a JSON patch that is an empty array', function() {
      const patch = [];
      const result = validation.validateInstance(patch, schema);
      result.valid.should.be.false;
    });

    it('should NOT validate a JSON patch that is not an array', function() {
      const patch = {
        op: 'add', path: '/email', value: 'pdoe@example.com'
      };
      const result = validation.validateInstance(patch, schema);
      result.valid.should.be.false;
    });

    it('should NOT validate a JSON patch with an extra property', function() {
      const patch = [
        {op: 'add', path: '/email', value: 'pdoe@example.com', extra: true}
      ];
      const result = validation.validateInstance(patch, schema);
      result.valid.should.be.false;
    });
    it('should validate a JSON patch with extend', function() {
      const patch = [
        {op: 'add', path: '/email', value: 'pdoe@example.com'}
      ];
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/jsonPatch')(extend);
      const result = validation.validateInstance(patch, schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('sequencedPatch', function() {
    const schema = validation.getSchema('sequencedPatch');

    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });

    it('should validate a sequenced JSON patch', function() {
      const doc = {
        target: 'some-identifier',
        patch: [
          {op: 'add', path: '/email', value: 'pdoe@example.com'}
        ],
        sequence: 1
      };
      const result = validation.validateInstance(doc, schema);
      result.valid.should.be.true;
    });

    // eslint-disable-next-line max-len
    it('should NOT validate a sequenced JSON patch without a sequence', function() {
      const doc = {
        target: 'some-identifier',
        patch: [
          {op: 'add', path: '/email', value: 'pdoe@example.com'}
        ]
      };
      const result = validation.validateInstance(doc, schema);
      result.valid.should.be.false;
    });

    // eslint-disable-next-line max-len
    it('should NOT validate a sequenced JSON patch without a target', function() {
      const doc = {
        patch: [
          {op: 'add', path: '/email', value: 'pdoe@example.com'}
        ],
        sequence: 1
      };
      const result = validation.validateInstance(doc, schema);
      result.valid.should.be.false;
    });

    // eslint-disable-next-line max-len
    it('should NOT validate a sequenced JSON patch with a negative sequence', function() {
      const doc = {
        target: 'some-identifier',
        patch: [
          {op: 'add', path: '/email', value: 'pdoe@example.com'}
        ],
        sequence: -1
      };
      const result = validation.validateInstance(doc, schema);
      result.valid.should.be.false;
    });

    it('should validate a sequenced JSON patch with extend', function() {
      const doc = {
        target: 'some-identifier',
        patch: [
          {op: 'add', path: '/email', value: 'pdoe@example.com'}
        ],
        sequence: 1
      };
      const extend = {name: 'test'};
      // eslint-disable-next-line max-len
      const schema = require('../node_modules/bedrock-validation/schemas/sequencedPatch')(extend);
      const result = validation.validateInstance(doc, schema);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });
});
