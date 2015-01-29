/*
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */

'use strict';

var validation = require('../lib/validation');

// FIXME: add more tests, test for proper errors
describe('JSON-LD REST API input schema', function() {
  describe('comment', function() {
    var schema = validation.getSchema('comment');
    it('should be an Object', function(done) {
      schema.should.be.an.instanceof(Object);
      done();
    });
    it('should reject empty comments', function(done) {
      var result = validation.validate('comment', '');
      result.valid.should.be.false;
      done();
    });
    it('should reject comments that are too long', function(done) {
      var tmp = '12345678901234567890123456789012345678901234567890';
      var max = schema.maxLength / tmp.length;
      var str = '';
      for(var i = 0; i < max; ++i) {
        str += tmp;
      }
      var result = validation.validate('comment', str + '0');
      result.valid.should.be.false;
      done();
    });
    it('should accept valid comments', function(done) {
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
      done();
    });
    it('should accept normal non-letter symbols', function(done) {
      var result = validation.validate(
        'comment', '-a-zA-Z0-9~!@#$%^&*()_=+\\|{}[];:\'"<>,./? ');
      result.valid.should.be.true;
      done();
    });
  });

  describe('nonce', function() {
    var schema = validation.getSchema('nonce');
    it('should be an Object', function(done) {
      schema.should.be.an.instanceof(Object);
      done();
    });
    it('should reject empty nonces', function(done) {
      var result = validation.validate('nonce', '');
      result.valid.should.be.false;
      done();
    });
    it('should reject nonces that are too short', function(done) {
      var result = validation.validate('nonce', '1234567');
      result.valid.should.be.false;
      done();
    });
    it('should reject nonces that are too long', function(done) {
      var result = validation.validate(
        'nonce',
        // 65 chars
        '1234567890123456789012345678901234567890' +
        '1234567890123456789012345');
      result.valid.should.be.false;
      done();
    });
    it('should accept valid nonces', function(done) {
      var small = validation.validate('nonce', '12345678');
      small.valid.should.be.true;
      var large = validation.validate(
        'nonce',
        // 64 chars
        '1234567890123456789012345678901234567890' +
        '123456789012345678901234');
      large.valid.should.be.true;
      done();
    });
    it('should accept normal non-letter characters', function(done) {
      var result = validation.validate('nonce', '-a-zA-Z0-9~!$%^&*()_=+. ');
      result.valid.should.be.true;
      done();
    });
    it('should reject invalid characters', function(done) {
      var result = validation.validate('nonce', '|||||||||');
      result.valid.should.be.false;
      done();
    });
  });

  describe('slug', function() {
    var schema = validation.getSchema('slug');
    it('should be an Object', function(done) {
      schema.should.be.an.instanceof(Object);
      done();
    });
    it('should reject empty slugs', function(done) {
      var result = validation.validate('slug', '');
      result.valid.should.be.false;
      done();
    });
    it('should reject slugs that are too short', function(done) {
      // 2 chars
      var result = validation.validate('slug', '12');
      result.valid.should.be.false;
      done();
    });
    it('should reject slugs that are too long', function(done) {
      // 33 chars
      var result = validation.validate(
        'slug', '123456789012345678901234567890123');
      result.valid.should.be.false;
      done();
    });
    it('should accept valid slugs', function(done) {
      // 3 chars
      var result = validation.validate('slug', 'a23');
      result.valid.should.be.true;
      // 32 chars
      var result = validation.validate(
        'slug', 'a2345678901234567890123456789012');
      result.valid.should.be.true;
      done();
    });
    it('should accept normal non-letter characters', function(done) {
      var result = validation.validate('slug', 'az-az09~_.');
      result.valid.should.be.true;
      done();
    });
    it('should reject invalid characters', function(done) {
      var result = validation.validate('slug', 'badchar@');
      result.valid.should.be.false;
      var result = validation.validate('slug', '0numstart');
      result.valid.should.be.false;
      done();
    });
  });
});
