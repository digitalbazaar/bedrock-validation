/*
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */

'use strict';

var expect = GLOBAL.chai.expect;
var validation = require('../lib/validation');
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
        'slug', '123456789012345678901234567890123');
      result.valid.should.be.false;
    });
    it('should accept valid slugs', function() {
      // 3 chars
      var result = validation.validate('slug', 'a23');
      result.valid.should.be.true;
      // 32 chars
      result = validation.validate(
        'slug', 'a2345678901234567890123456789012');
      result.valid.should.be.true;
    });
    it('should accept normal non-letter characters', function() {
      var result = validation.validate('slug', 'az-az09~_.');
      result.valid.should.be.true;
    });
    it('should reject invalid characters', function() {
      var result = validation.validate('slug', 'badchar@');
      result.valid.should.be.false;
      result = validation.validate('slug', '0numstart');
      result.valid.should.be.false;
    });
  });

  describe('jsonldContext', function() {
    var schema = validation.getSchema('jsonldContext');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
    });
    it('should accept a URL', function() {
      var schema = require('../schemas/jsonldContext')('http://foo.com/v1');
      var result = validation.validateInstance('http://foo.com/v1', schema);
      result.valid.should.be.true;
    });
    it('should reject the wrong a URL', function() {
      var schema = require('../schemas/jsonldContext')('http://foo.com/v1');
      var result = validation.validateInstance('http://foo.com/v2', schema);
      result.valid.should.be.false;
    });
    it('should accept an array of URLs', function() {
      var schema = require('../schemas/jsonldContext')([
        'http://foo.com/v1',
        'http://bar.com/v1'
      ]);
      var result = validation.validateInstance(
        ['http://foo.com/v1', 'http://bar.com/v1'], schema);
      result.valid.should.be.true;
    });
    it('should reject the wrong array of URLs', function() {
      var schema = require('../schemas/jsonldContext')([
        'http://foo.com/v1',
        'http://bar.com/v1'
      ]);
      var result = validation.validateInstance(
        ['http://foo.com/v1', 'http://wrong.com/v1'], schema);
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
