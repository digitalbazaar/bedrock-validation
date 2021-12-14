/*
 * Copyright (c) 2012-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const expect = global.chai.expect;
const validation = require('bedrock-validation');
const validate = validation.validate;

// FIXME: add more tests, test for proper errors
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

  // FIXME: This is a stub
  describe('credential', function() {
    const schema = validation.getSchema('credential');
    it('should be an Object', function() {
      schema.should.be.an.instanceof(Object);
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
  });
});
