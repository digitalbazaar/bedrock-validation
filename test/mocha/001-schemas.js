/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as validation from '@bedrock/validation';
import {mock} from './mock.data.js';

const {validateInstance} = validation;

const expect = global.chai.expect;

describe('bedrock-validation', function() {
  describe('invalid schema specified', function() {
    it('should throw an error', function() {
      expect(function() {
        validateInstance({
          instance: {some: 'object'}, schema: 'test-unknown-schema'
        });
      }).to.throw('Could not validate data; unknown schema name ' +
        '(test-unknown-schema).');
    });
  });

  describe('comment', function() {
    const schema = validation.getSchema({name: 'comment'});
    const validate = validation.compile({schema});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty comments', function() {
      const result = validateInstance(
        {instance: '', schema: 'comment'});
      result.valid.should.be.false;
    });
    it('should reject empty comments w/compiled schema', function() {
      const result = validate('');
      result.valid.should.be.false;
    });
    it('should reject comments that are too long', function() {
      const tmp = '12345678901234567890123456789012345678901234567890';
      const max = schema.maxLength / tmp.length;
      let str = '';
      for(let i = 0; i < max; ++i) {
        str += tmp;
      }
      const result = validateInstance(
        {instance: str + '0', schema: 'comment'});
      result.valid.should.be.false;
    });
    it('should accept valid comments', function() {
      const small = validateInstance({instance: '1', schema: 'comment'});
      should.not.exist(small.error);
      small.valid.should.be.true;
      const tmp = '12345678901234567890123456789012345678901234567890';
      const max = schema.maxLength / tmp.length;
      let str = '';
      for(let i = 0; i < max; ++i) {
        str += tmp;
      }
      const large = validateInstance({instance: str, schema: 'comment'});
      large.valid.should.be.true;
    });
    it('should accept valid comments w/compiled schema', function() {
      const small = validate('1');
      should.not.exist(small.error);
      small.valid.should.be.true;
      const tmp = '12345678901234567890123456789012345678901234567890';
      const max = schema.maxLength / tmp.length;
      let str = '';
      for(let i = 0; i < max; ++i) {
        str += tmp;
      }
      const large = validate(str);
      large.valid.should.be.true;
    });
    it('should accept normal non-letter symbols', function() {
      const result = validateInstance({
        instance: '-a-zA-Z0-9~!@#$%^&*()_=+\\|{}[];:\'"<>,./? ',
        schema: 'comment'
      });
      result.valid.should.be.true;
    });
    it('should throw a "NotFoundError" error when schema does not exist',
      function() {
        let result;
        let err;

        try {
          result = validateInstance({instance: {}, schema: 'test'});
        } catch(e) {
          err = e;
        }

        should.exist(err);
        should.not.exist(result);
        err.name.should.equal('NotFoundError');
      });
    it('should raise a body ValidationError via middleware', done => {
      const req = {
        body: ''
      };
      const res = {};
      const next = function(err) {
        should.exist(err);
        err.name.should.equal('ValidationError');
        done();
      };

      const bodySchema = validation.getSchema({name: 'comment'});
      const middleware = validation.createValidateMiddleware({bodySchema});
      middleware(req, res, next);
    });
    it('should raise a query ValidationError via middleware', done => {
      const req = {
        query: ''
      };
      const res = {};
      const next = function(err) {
        should.exist(err);
        err.name.should.equal('ValidationError');
        done();
      };

      const querySchema = validation.getSchema({name: 'comment'});
      const middleware = validation.createValidateMiddleware({querySchema});
      middleware(req, res, next);
    });
    it('should pass body validation via middleware', done => {
      const req = {
        body: 'comment'
      };
      const res = {};
      const next = function(err) {
        should.not.exist(err);
        done();
      };

      const bodySchema = validation.getSchema({name: 'comment'});
      const middleware = validation.createValidateMiddleware({bodySchema});
      middleware(req, res, next);
    });
    it('should pass query validation via middleware', done => {
      const req = {
        query: 'comment'
      };
      const res = {};
      const next = function(err) {
        should.not.exist(err);
        done();
      };

      const querySchema = validation.getSchema({name: 'comment'});
      const middleware = validation.createValidateMiddleware({querySchema});
      middleware(req, res, next);
    });
    it('should accept valid comment with extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.comment(extend);
      const result = validateInstance({instance: 'test comment', schema});
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('description', function() {
    const schema = validation.getSchema({name: 'description'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid description', function() {
      const result = validateInstance({
        instance: 'test description',
        schema: 'description'
      });
      result.valid.should.be.true;
    });
    it('should reject an invalid description', function() {
      const result = validateInstance({
        instance: {},
        schema: 'description'
      });
      result.valid.should.be.false;
    });
    it('should accept valid description with extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.description(extend);
      const result = validateInstance({
        instance: 'test description',
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('identifier', function() {
    const schema = validation.getSchema({name: 'identifier'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid identifier', function() {
      const result = validateInstance({
        instance: '1234',
        schema: 'identifier'
      });
      result.valid.should.be.true;
    });
    it('should reject an invalid identifier', function() {
      const result = validateInstance({
        instance: '',
        schema: 'identifier'
      });
      result.valid.should.be.false;
    });
    it('should accept valid identifier with extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.identifier(extend);
      const result = validateInstance({
        instance: '1234',
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('label', function() {
    const schema = validation.getSchema({name: 'label'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid label', function() {
      const result = validateInstance({
        instance: 'test label',
        schema: 'label'
      });
      result.valid.should.be.true;
    });
    it('should reject an invalid label', function() {
      const result = validateInstance({
        instance: {},
        schema: 'label'
      });
      result.valid.should.be.false;
    });
    it('should accept valid label with extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.label(extend);
      const result = validateInstance({
        instance: 'test label',
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('title', function() {
    const schema = validation.getSchema({name: 'title'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid title', function() {
      const result = validateInstance({
        instance: 'Test Title',
        schema: 'title'
      });
      result.valid.should.be.true;
    });
    it('should reject an invalid title', function() {
      const result = validateInstance({
        instance: {},
        schema: 'title'
      });
      result.valid.should.be.false;
    });
    it('should accept valid title with extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.title(extend);
      const result = validateInstance({
        instance: 'Test Title',
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('url', function() {
    const schema = validation.getSchema({name: 'url'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid url', function() {
      const result = validateInstance({
        instance: 'http://foo.com/v2',
        schema: 'url'
      });
      result.valid.should.be.true;
    });
    it('should reject an invalid url', function() {
      const result = validateInstance({
        instance: {},
        schema: 'url'
      });
      result.valid.should.be.false;
    });
    it('should accept valid url with extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.url(extend);
      const result = validateInstance({
        instance: 'http://foo.com/v2',
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('w3cDateTime', function() {
    const schema = validation.getSchema({name: 'w3cDateTime'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid w3cDateTime', function() {
      const result = validateInstance({
        instance: '2016-01-01T01:00:00Z',
        schema: 'w3cDateTime'
      });
      result.valid.should.be.true;
    });
    it('should reject an invalid w3cDateTime', function() {
      const result = validateInstance({
        instance: {},
        schema: 'w3cDateTime'
      });
      result.valid.should.be.false;
    });
    it('should accept valid w3cDateTime with extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.w3cDateTime(extend);
      const result = validateInstance({
        instance: '2016-01-01T01:00:00Z',
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('personName', function() {
    const schema = validation.getSchema({name: 'personName'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid personName', function() {
      const result = validateInstance({
        instance: 'Name',
        schema: 'personName'
      });
      result.valid.should.be.true;
    });
    it('should reject an invalid personName', function() {
      const result = validateInstance({
        instance: {},
        schema: 'personName'
      });
      result.valid.should.be.false;
    });
    it('should accept valid personName with extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.personName(extend);
      const result = validateInstance({
        instance: 'Name',
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('privateKeyPem', function() {
    const schema = validation.getSchema({name: 'privateKeyPem'});
    const {privateKey} = mock.keys.alpha;
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid privateKeyPem', function() {
      const result = validateInstance({
        instance: privateKey,
        schema: 'privateKeyPem'
      });
      result.valid.should.be.true;
    });
    it('should reject an invalid privateKeyPem', function() {
      const result = validateInstance({
        instance: {},
        schema: 'privateKeyPem'
      });
      result.valid.should.be.false;
    });
    it('should accept valid privateKeyPem with extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.privateKeyPem(extend);
      const result = validateInstance({
        instance: privateKey,
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('publicKeyPem', function() {
    const schema = validation.getSchema({name: 'publicKeyPem'});
    const {publicKey} = mock.keys.alpha;
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept valid publicKeyPem', function() {
      const result = validateInstance({
        instance: publicKey,
        schema: 'publicKeyPem'
      });
      result.valid.should.be.true;
    });
    it('should reject an invalid publicKeyPem', function() {
      const result = validateInstance({
        instance: {},
        schema: 'publicKeyPem'
      });
      result.valid.should.be.false;
    });
    it('should accept valid privateKeyPem with extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.publicKeyPem(extend);
      const result = validateInstance({
        instance: publicKey,
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('email', function() {
    const schema = validation.getSchema({name: 'email'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty emails', function() {
      const result = validateInstance({
        instance: '',
        schema: 'email'
      });
      result.valid.should.be.false;
    });
    it('should reject emails without `@`', function() {
      const result = validateInstance({
        instance: 'abcdefg',
        schema: 'email'
      });
      result.valid.should.be.false;
    });
    it('should accept valid emails', function() {
      const small = validateInstance({
        instance: 'a@b.io',
        schema: 'email'
      });
      should.not.exist(small.error);
      small.valid.should.be.true;
    });
    it('should accept normal non-letter symbols', function() {
      const result = validateInstance({
        instance: 'abc123~!$%^&*_=+-@example.org',
        schema: 'email'
      });
      result.valid.should.be.true;
    });
    it('should not accept emails with uppercase chars', function() {
      const schema = validation.getSchema({name: 'email'});
      const result = validateInstance({
        instance: 'aBC@DEF.com',
        schema
      });
      result.valid.should.be.false;
    });
    it('should reject emails with uppercase chars', function() {
      const schema = validation.schemas.email({}, {lowerCaseOnly: true});
      const result = validateInstance({
        instance: 'aBC@DEF.com',
        schema
      });
      result.valid.should.be.false;
    });
  });

  describe('nonce', function() {
    const schema = validation.getSchema({name: 'nonce'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty nonces', function() {
      const result = validateInstance({
        instance: '',
        schema: 'nonce'
      });
      result.valid.should.be.false;
    });
    it('should reject nonces that are too short', function() {
      const result = validateInstance({
        instance: '1234567',
        schema: 'nonce'
      });
      result.valid.should.be.false;
    });
    it('should reject nonces that are too long', function() {
      const result = validateInstance({
        instance:
          // 65 chars
          '1234567890123456789012345678901234567890' +
          '1234567890123456789012345',
        schema: 'nonce'
      });
      result.valid.should.be.false;
    });
    it('should accept valid nonces', function() {
      const small = validateInstance({
        instance: '12345678',
        schema: 'nonce'
      });
      small.valid.should.be.true;
      const large = validateInstance({
        instance:
          // 64 chars
          '1234567890123456789012345678901234567890' +
          '123456789012345678901234',
        schema: 'nonce'
      });
      large.valid.should.be.true;
    });
    it('should accept normal non-letter characters', function() {
      const result = validateInstance({
        instance: '-a-zA-Z0-9~!$%^&*()_=+. ',
        schema: 'nonce'
      });
      result.valid.should.be.true;
    });
    it('should reject invalid characters', function() {
      const result = validateInstance({
        instance: '|||||||||',
        schema: 'nonce'
      });
      result.valid.should.be.false;
    });
    it('should accept valid nonces with an extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.nonce(extend);
      const result = validateInstance({
        instance: '12345678',
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('slug', function() {
    const schema = validation.getSchema({name: 'slug'});
    const validate = validation.compile({schema});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty slugs', function() {
      const result = validateInstance({
        instance: '',
        schema: 'slug'
      });
      result.valid.should.be.false;
    });
    it('should reject slugs that are too short', function() {
      // 2 chars
      const result = validateInstance({
        instance: '12',
        schema: 'slug'
      });
      result.valid.should.be.false;
    });
    it('should reject slugs that are too long', function() {
      // 33 chars
      const result = validateInstance({
        instance: '12345678901234567890123456789012345678901',
        schema: 'slug'
      });
      result.valid.should.be.false;
    });
    it('should accept valid slugs', function() {
      // 3 chars
      let result = validateInstance({
        instance: 'a23',
        schema: 'slug'
      });
      result.valid.should.be.true;
      // 40 chars
      result = validateInstance({
        instance: '1234567890123456789012345678901234567890',
        schema: 'slug'
      });
      result.valid.should.be.true;
      // uuids
      result = validateInstance({
        instance: '2f5f3815-fba0-4e07-a248-d79c26ca8fd6',
        schema: 'slug'
      });
      result.valid.should.be.true;
    });
    it('should accept normal non-letter characters', function() {
      const result = validateInstance({
        instance: 'az-az09~_.',
        schema: 'slug'
      });
      result.valid.should.be.true;
    });
    it('should reject invalid characters', function() {
      let result = validateInstance({
        instance: 'badchar@',
        schema: 'slug'
      });
      result.valid.should.be.false;
      result = validateInstance({
        instance: '-hyphenstart',
        schema: 'slug'
      });
      result.valid.should.be.false;
    });
    it('should mask value when error occurs', function() {
      schema.errors.mask = true;
      const result = validateInstance({
        instance: 'sl',
        schema
      });
      result.valid.should.be.false;
      result.error.details.errors[0].details.value.should.equal('***MASKED***');
    });
    it('should mask value when error occurs w/compiled schema', function() {
      schema.errors.mask = true;
      const result = validate('sl');
      result.valid.should.be.false;
      result.error.details.errors[0].details.value.should.equal('***MASKED***');
    });
    it('should mask value when error occurs with a custom mask', function() {
      schema.errors.mask = 'custom mask value';
      const result = validateInstance({
        instance: 'sl',
        schema
      });
      result.valid.should.be.false;
      result.error.details.errors[0].details.value.should
        .equal('custom mask value');
    });
    it('should mask value when error occurs with a custom mask ' +
      'w/compiled schema', function() {
      schema.errors.mask = 'custom mask value';
      const result = validate('sl');
      result.valid.should.be.false;
      result.error.details.errors[0].details.value.should
        .equal('custom mask value');
    });
    it('should accept valid slug with extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.slug(extend);
      const result = validateInstance({
        instance: 'a23',
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('jsonldContext', function() {
    const schema = validation.getSchema({name: 'jsonldContext'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept a URL', function() {
      const schema = validation.schemas.jsonldContext('http://foo.com/v1');
      const result = validateInstance({
        instance: 'http://foo.com/v1',
        schema
      });
      result.valid.should.be.true;
    });
    it('should accept a URL with an extend', function() {
      const extend = {name: 'test'};
      const schema = validation.schemas.jsonldContext(
        'http://foo.com/v1', extend);
      const result = validateInstance({
        instance: 'http://foo.com/v1',
        schema
      });
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
    it('should reject the wrong a URL', function() {
      const schema = validation.schemas.jsonldContext('http://foo.com/v1');
      const result = validateInstance({
        instance: 'http://foo.com/v2',
        schema
      });
      result.valid.should.be.false;
    });
    it('should accept an array of URLs', function() {
      const schema = validation.schemas.jsonldContext([
        'http://foo.com/v1',
        'http://bar.com/v1'
      ]);
      const result = validateInstance({
        instance: ['http://foo.com/v1', 'http://bar.com/v1'],
        schema
      });
      result.valid.should.be.true;
    });
    it('should reject the wrong array of URLs', function() {
      const schema = validation.schemas.jsonldContext([
        'http://foo.com/v1',
        'http://bar.com/v1'
      ]);
      const result = validateInstance({
        instance: ['http://foo.com/v1', 'http://wrong.com/v1'],
        schema
      });
      result.valid.should.be.false;
    });
    it('should accept an array of objects', function() {
      const schema = validation.schemas.jsonldContext([
        {url: 'http://foo.com/v1'},
        {url: 'http://bar.com/v1'}
      ]);
      const result = validateInstance({
        instance: [{url: 'http://foo.com/v1'}, {url: 'http://bar.com/v1'}],
        schema
      });
      result.valid.should.be.true;
    });
    it('should accept an array of objects w/compiled schema', function() {
      const schema = validation.schemas.jsonldContext([
        {url: 'http://foo.com/v1'},
        {url: 'http://bar.com/v1'}
      ]);
      const validate = validation.compile({schema});
      const result = validate([
        {url: 'http://foo.com/v1'},
        {url: 'http://bar.com/v1'}
      ]);
      result.valid.should.be.true;
    });
  });

  describe('jsonldType', function() {
    const schema = validation.getSchema({name: 'jsonldType'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept a string', function() {
      const schema = validation.schemas.jsonldType('Group');
      const type = 'Group';
      const result = validateInstance({
        instance: type,
        schema
      });
      result.valid.should.be.true;
    });
    it('should accept a string with alternates', function() {
      const alternate = 1;
      const schema = validation.schemas.jsonldType('Group', alternate);
      const type = 'Group';
      const result = validateInstance({
        instance: type,
        schema
      });
      schema.anyOf.length.should.equal(4);
      result.valid.should.be.true;
    });
    it('should reject the wrong string', function() {
      const schema = validation.schemas.jsonldType('Group');
      const type = 'Wrong';
      const result = validateInstance({
        instance: type,
        schema
      });
      result.valid.should.be.false;
    });
    it('should accept an array of strings', function() {
      const schema = validation.schemas.jsonldType(['Group', 'Name']);
      const type = ['Group', 'Name'];
      const result = validateInstance({
        instance: type,
        schema
      });
      result.valid.should.be.true;
    });
    it('should reject the wrong array of strings', function() {
      const schema = validation.schemas.jsonldType(['Group', 'Name']);
      const type = ['Group', 'Wrong'];
      const result = validateInstance({
        instance: type,
        schema
      });
      result.valid.should.be.false;
    });
  });

  describe('linkedDataSignature', function() {
    const schema = validation.getSchema({name: 'linkedDataSignature'});

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
      const result = validateInstance({instance: signature, schema});
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
      const result = validateInstance({instance: signature, schema});
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
      const schema = validation.schemas.linkedDataSignature(extend);
      const result = validateInstance({instance: signature, schema});
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
      const result = validateInstance({instance: signature, schema});
      result.valid.should.be.false;
    });

    it('should NOT validate a signature w/missing type', function() {
      const signature = {
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        // eslint-disable-next-line max-len
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      const result = validateInstance({instance: signature, schema});
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
      const result = validateInstance({instance: signature, schema});
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
      const result = validateInstance({instance: signature, schema});
      result.valid.should.be.false;
    });

    // eslint-disable-next-line max-len
    it('should NOT validate a LinkedDataSignature2015 signature w/missing signature', function() {
      const signature = {
        type: 'LinkedDataSignature2015',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1'
      };
      const result = validateInstance({instance: signature, schema});
      result.valid.should.be.false;
    });
  });

  describe('linkedDataSignature2020', function() {
    const schema = validation.getSchema({name: 'linkedDataSignature2020'});

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
      const result = validateInstance({instance: signature, schema});
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
      const result = validateInstance({instance: signature, schema});
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
      const result = validateInstance({instance: signature, schema});
      result.valid.should.be.false;
    });

    it('should NOT validate a with missing verificationMethod', function() {
      const signature = {
        type: 'Ed25519Signature2020',
        proofPurpose: 'assertionMethod',
        proofValue: 'z3MvGcVxzRzzpKF1HA11EjvfPZsN8NAb7kXBRfeTm3CBg2gcJLQM5hZ' +
          'Nmj6Ccd9Lk4C1YueiFZvkSx4FuHVYVouQk'
      };
      const result = validateInstance({instance: signature, schema});
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
      const result = validateInstance({instance: signature, schema});
      result.valid.should.be.false;
    });
  });

  describe('credential', function() {
    const schema = validation.getSchema({name: 'credential'});
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should validate a credential', function() {
      const credential = {...mock.credentials.valid};
      const result = validateInstance({instance: credential, schema});
      result.valid.should.be.true;
    });
    it('should validate a credential with an extend', function() {
      const credential = {...mock.credentials.valid};
      const extend = {name: 'test'};
      const schema = validation.schemas.credential(extend);
      const result = validateInstance({instance: credential, schema});
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('jsonPatch', function() {
    const schema = validation.getSchema({name: 'jsonPatch'});

    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });

    it('should validate a JSON patch', function() {
      const patch = [
        {op: 'add', path: '/email', value: 'pdoe@example.com'}
      ];
      const result = validateInstance({instance: patch, schema});
      result.valid.should.be.true;
    });

    it('should NOT validate a JSON patch that is an empty array', function() {
      const patch = [];
      const result = validateInstance({instance: patch, schema});
      result.valid.should.be.false;
    });

    it('should NOT validate a JSON patch that is not an array', function() {
      const patch = {
        op: 'add', path: '/email', value: 'pdoe@example.com'
      };
      const result = validateInstance({instance: patch, schema});
      result.valid.should.be.false;
    });

    it('should NOT validate a JSON patch with an extra property', function() {
      const patch = [
        {op: 'add', path: '/email', value: 'pdoe@example.com', extra: true}
      ];
      const result = validateInstance({instance: patch, schema});
      result.valid.should.be.false;
    });
    it('should validate a JSON patch with extend', function() {
      const patch = [
        {op: 'add', path: '/email', value: 'pdoe@example.com'}
      ];
      const extend = {name: 'test'};
      const schema = validation.schemas.jsonPatch(extend);
      const result = validateInstance({instance: patch, schema});
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });

  describe('sequencedPatch', function() {
    const schema = validation.getSchema({name: 'sequencedPatch'});

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
      const result = validateInstance({instance: doc, schema});
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
      const result = validateInstance({instance: doc, schema});
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
      const result = validateInstance({instance: doc, schema});
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
      const result = validateInstance({instance: doc, schema});
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
      const schema = validation.schemas.sequencedPatch(extend);
      const result = validateInstance({instance: doc, schema});
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });

    it('should validate a sequenced JSON patch with extend ' +
      'and w/compiled schema', function() {
      const doc = {
        target: 'some-identifier',
        patch: [
          {op: 'add', path: '/email', value: 'pdoe@example.com'}
        ],
        sequence: 1
      };
      const extend = {name: 'test'};
      const schema = validation.schemas.sequencedPatch(extend);
      const validate = validation.compile({schema});
      const result = validate(doc);
      schema.name.should.equal('test');
      result.valid.should.be.true;
    });
  });
});
