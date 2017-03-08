/*
 * Copyright (c) 2012-2016 Digital Bazaar, Inc. All rights reserved.
 */
/* globals describe, it, should */
/* jshint -W030, node: true */
'use strict';

var expect = global.chai.expect;
var validation = require('bedrock-validation');
var validate = validation.validate;

// FIXME: add more tests, test for proper errors
describe('bedrock-validation', function() {
  describe('invalid schema specified', function() {
    describe('synchronous mode', function() {
      it('should throw an error', function() {
        expect(function() {
          validate('test-unknown-schema', {some: 'object'});})
          .to.throw(
            'UnknownSchema: Could not validate data; unknown schema name ' +
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
    var schema = validation.getSchema('comment');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty comments', function() {
      var result = validation.validate('comment', '');
      result.valid.should.be.false;
    });
    it('should reject comments that are too long', function() {
      var tmp = '12345678901234567890123456789012345678901234567890';
      var max = schema.maxLength / tmp.length;
      var str = '';
      for(var i = 0; i < max; ++i) {
        str += tmp;
      }
      var result = validation.validate('comment', str + '0');
      result.valid.should.be.false;
    });
    it('should accept valid comments', function() {
      var small = validation.validate('comment', '1');
      small.errors.should.be.empty;
      small.valid.should.be.true;
      var tmp = '12345678901234567890123456789012345678901234567890';
      var max = schema.maxLength / tmp.length;
      var str = '';
      for(var i = 0; i < max; ++i) {
        str += tmp;
      }
      var large = validation.validate('comment', str);
      large.valid.should.be.true;
    });
    it('should accept normal non-letter symbols', function() {
      var result = validation.validate(
        'comment', '-a-zA-Z0-9~!@#$%^&*()_=+\\|{}[];:\'"<>,./? ');
      result.valid.should.be.true;
    });
  });

  describe('email', function() {
    var schema = validation.getSchema('email');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty emails', function() {
      var result = validation.validate('email', '');
      result.valid.should.be.false;
    });
    it('should reject emails without `@`', function() {
      var result = validation.validate('email', 'abcdefg');
      result.valid.should.be.false;
    });
    it('should accept valid emails', function() {
      var small = validation.validate('email', 'a@b.io');
      small.errors.should.be.empty;
      small.valid.should.be.true;
    });
    it('should accept normal non-letter symbols', function() {
      var result = validation.validate(
        'email', 'abc123~!$%^&*_=+-@example.org');
      result.valid.should.be.true;
    });
    it('should accept emails with uppercase chars', function() {
      var schema = validation.getSchema('email');
      var result = validation.validateInstance('aBC@DEF.com', schema);
      result.valid.should.be.true;
    });
    it('should reject emails with uppercase chars', function() {
      var schema = validation.schemas.email({}, {lowerCaseOnly: true});
      var result = validation.validateInstance('aBC@DEF.com', schema);
      result.valid.should.be.false;
    });
  });

  describe('nonce', function() {
    var schema = validation.getSchema('nonce');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty nonces', function() {
      var result = validation.validate('nonce', '');
      result.valid.should.be.false;
    });
    it('should reject nonces that are too short', function() {
      var result = validation.validate('nonce', '1234567');
      result.valid.should.be.false;
    });
    it('should reject nonces that are too long', function() {
      var result = validation.validate(
        'nonce',
        // 65 chars
        '1234567890123456789012345678901234567890' +
        '1234567890123456789012345');
      result.valid.should.be.false;
    });
    it('should accept valid nonces', function() {
      var small = validation.validate('nonce', '12345678');
      small.valid.should.be.true;
      var large = validation.validate(
        'nonce',
        // 64 chars
        '1234567890123456789012345678901234567890' +
        '123456789012345678901234');
      large.valid.should.be.true;
    });
    it('should accept normal non-letter characters', function() {
      var result = validation.validate('nonce', '-a-zA-Z0-9~!$%^&*()_=+. ');
      result.valid.should.be.true;
    });
    it('should reject invalid characters', function() {
      var result = validation.validate('nonce', '|||||||||');
      result.valid.should.be.false;
    });
  });

  describe('slug', function() {
    var schema = validation.getSchema('slug');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should reject empty slugs', function() {
      var result = validation.validate('slug', '');
      result.valid.should.be.false;
    });
    it('should reject slugs that are too short', function() {
      // 2 chars
      var result = validation.validate('slug', '12');
      result.valid.should.be.false;
    });
    it('should reject slugs that are too long', function() {
      // 33 chars
      var result = validation.validate(
        'slug', '12345678901234567890123456789012345678901');
      result.valid.should.be.false;
    });
    it('should accept valid slugs', function() {
      // 3 chars
      var result = validation.validate('slug', 'a23');
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
      var result = validation.validate('slug', 'az-az09~_.');
      result.valid.should.be.true;
    });
    it('should reject invalid characters', function() {
      var result = validation.validate('slug', 'badchar@');
      result.valid.should.be.false;
      result = validation.validate('slug', '-hyphenstart');
      result.valid.should.be.false;
    });
  });

  describe('jsonldContext', function() {
    var schema = validation.getSchema('jsonldContext');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept a URL', function() {
      var schema = require('../node_modules/bedrock-validation/schemas/jsonldContext')('http://foo.com/v1');
      var result = validation.validateInstance('http://foo.com/v1', schema);
      result.valid.should.be.true;
    });
    it('should reject the wrong a URL', function() {
      var schema = require('../node_modules/bedrock-validation/schemas/jsonldContext')('http://foo.com/v1');
      var result = validation.validateInstance('http://foo.com/v2', schema);
      result.valid.should.be.false;
    });
    it('should accept an array of URLs', function() {
      var schema = require('../node_modules/bedrock-validation/schemas/jsonldContext')([
        'http://foo.com/v1',
        'http://bar.com/v1'
      ]);
      var result = validation.validateInstance(
        ['http://foo.com/v1', 'http://bar.com/v1'], schema);
      result.valid.should.be.true;
    });
    it('should reject the wrong array of URLs', function() {
      var schema = require('../node_modules/bedrock-validation/schemas/jsonldContext')([
        'http://foo.com/v1',
        'http://bar.com/v1'
      ]);
      var result = validation.validateInstance(
        ['http://foo.com/v1', 'http://wrong.com/v1'], schema);
      result.valid.should.be.false;
    });
  });

  describe('linkedDataSignature', function() {
    var schema = validation.getSchema('linkedDataSignature');

    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });

    it('should validate a LinkedDataSignature2015 signature', function() {
      var signature = {
        type: 'LinkedDataSignature2015',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      var result = validation.validateInstance(signature, schema);
      result.valid.should.be.true;
    });

    it('should validate a LinkedDataSignature2016 signature', function() {
      var signature = {
        type: 'LinkedDataSignature2016',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      var result = validation.validateInstance(signature, schema);
      result.valid.should.be.true;
    });

    it('should NOT validate a GraphSignature2012 signature', function() {
      var signature = {
        type: 'GraphSignature2012',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      var result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });

    it('should NOT validate a signature w/missing type', function() {
      var signature = {
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      var result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });

    it('should NOT validate a LinkedDataSignature2015 signature w/missing created', function() {
      var signature = {
        type: 'LinkedDataSignature2015',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1',
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      var result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });

    it('should NOT validate a LinkedDataSignature2015 signature w/missing creator', function() {
      var signature = {
        type: 'LinkedDataSignature2015',
        created: '2016-01-01T01:00:00Z',
        signatureValue: 'Lc6l7gxEPV1lKTj4KADaER52CiMBpvsHg7eZZJXzRK3U8N/eUYxITlenu3svj4KPrdnaBfMXGo3U/vAVaQNF5Er0g/SXC2KpUmRN4uyMYgQ5NwWklS2JqjJ/0Y3hio4GOgdMDiqrlZJvfQdtRaJjKoskc7F3bZtDVsX6Sr95erfOeobHOIMcbNIC0a96oYOaQlOeOC45BqQaUaczYKPayGEeQN2lfD+qR6b1MR4xtWNrx5pzzPpAPkjj3I91wiVQER43s/nq5XZKkDk8V8eD7xEURoDUcu3rA1qHLfrpRHJGCErXNc784O4R4Oqm5zQlkyB1mWJxnz3qSqzgqVG0sQ=='
      };
      var result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });

    it('should NOT validate a LinkedDataSignature2015 signature w/missing signature', function() {
      var signature = {
        type: 'LinkedDataSignature2015',
        created: '2016-01-01T01:00:00Z',
        creator: 'urn:5dd6a7e2-4c32-4a21-60b3-2385e5b6bcd4/keys/1'
      };
      var result = validation.validateInstance(signature, schema);
      result.valid.should.be.false;
    });
  });

  // FIXME: This is a stub
  describe('credential', function() {
    var schema = validation.getSchema('credential');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
  });
});
