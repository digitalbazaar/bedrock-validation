# bedrock-validation ChangeLog

## 6.0.1 - 2022-04-xx

### Fixed
- Use `jsdoc-to-markdown@7`.

## 6.0.0 - 2022-04-01

### Changed
- **BREAKING**: Rename package to `@bedrock/validation`.
- **BREAKING**: Convert to module (ESM).
- **BREAKING**: Remove default export.
- **BREAKING**: Require node 14.x.
- **BREAKING**: All APIs now use options-style/named parameters.
- **BREAKING**: When no schema can be found to match a given schema name,
  the error returned from `validateInstance` is now of type `NotFoundError`
  instead of `UnknownSchema`.

### Removed
- **BREAKING**: Remove deprecated `validate` function. Use `validateInstance`
  or `createValidateMiddleware`.
- **BREAKING**: All callback-style APIs/parameters have been removed. Functions
  that validate instances are synchronous.
- **BREAKING**: Removed obsolete `graphSignature` schema.

## 5.6.3 - 2022-03-24

### Fixed
- Fix slow loading of schemas in same dir (load in parallel).

## 5.6.2 - 2022-03-24

### Fixed
- Handle case that import schema has no default export.

## 5.6.1 - 2022-03-24

### Fixed
- Update schemas to use esm style and `esm.js` to transpile
  to CommonJS.

## 5.6.0 - 2022-03-23

### Changed
- Update peer deps:
  - `bedrock@4.5`.
- Update internals to use esm style and use `esm.js` to
  transpile to CommonJS.

## 5.5.0 - 2022-02-17

### Added
- Add `createValidateMiddleware` to create a more modern validate express-style
  middleware. This function has more clear name, simpler parameters, and
  ensures that the schemas used are compiled once. It requires schemas to
  be passed directly, a string identifying a schema may not be used.

## 5.4.1 - 2022-02-10

### Fixed
- Ensure `title` is set on compiled function.

## 5.4.0 - 2022-02-10

### Added
- Add `compile()` function to pre-compile a schema and return a
  function that outputs the same validation results as calling
  `validateInstance`.

## 5.3.0 - 2022-02-10

### Changed
- Pre-compile schemas that are used in middlewares to prevent
  compiling on every request.

## 5.2.2 - 2021-12-15

### Fixed
- Fix bug in `graphSignature` schema causing it to be invalid.

## 5.2.1 - 2021-12-14

### Fixed
- Fix `api.validate` to throw error if schema does not exist instead of
  returning middleware that raises the error.

## 5.2.0 - 2021-07-23

### Changed
- Update peer dependencies; use bedrock@4.

## 5.1.0 - 2021-06-30

### Added
- Support `linkedDataSignature2020` schema generator.

## 5.0.0 - 2021-03-19

### Changed
- **BREAKING**: Email pattern no longer supports uppercase chars.

## 4.5.0 - 2020-11-19

### Added
- Implement a new ES6 Map based cache for AJV schemas. This provides a
  significant peformance improvement over the default AJV caching mechanism.

## 4.4.0 - 2020-04-27

### Added
- Allow context in `DID Login` validator to be array with single context string.

## 4.3.0 - 2020-03-30

### Changed
- Increase character length of email domain labels per RFC 1034.

## 4.2.0 - 2019-11-08

### Changed
- Update dependencies.

## 4.1.0 - 2019-01-23

### Added
- Support verificationMethod in linkedDataSignature2018.

## 4.0.1 - 2018-12-17

### Fixed
- Add missing RsaSignature2018 type in LD signature schema.

## 4.0.0 - 2018-11-28

### Changed
- Remove `async` module dependency.
- Return value is {valid: <bool>, error: <error>}

## 3.1.2 - 2018-09-17

### Fixed
- Invalid `jsonldType` schema.

## 3.1.1 - 2018-09-13

### Fixed
- Improper use of arrow function in `validate` API.

## 3.1.0 - 2018-09-13

### Added
- Schema `linkedDataSignature2018`.

### Changed
- Errors are now 2.x compatible.

### Fixed
- Fixed test suite.

## 3.0.0 - 2018-02-24
- Switch core validator to `ajv`.

## 2.4.1 - 2018-06-28

### Changed
- Use child logger.

## 2.4.0 - 2018-05-10

### Added
- Add `jsonPatch` and `sequencedPatch` validators.

## 2.3.0 - 2017-09-06

### Added
- Support multiple signatures in `linkedDataSignature` schema.

## 2.2.1 - 2016-09-22

### Changed
- Restructure test framework for CI.

## 2.2.0 - 2016-07-22

### Added
- Add `lowerCaseOnly` option to email validator.

## 2.1.1 - 2016-07-20

### Changed
- Replace deprecated `GLOBAL` with `global`.

## 2.1.0 - 2016-07-06

### Added
- Add `linkedDataSignature` schema.

## 2.0.3 - 2016-06-13

### Fixed
- Accept dates before the year 2000 (1000+). A future fix should
  also accept dates 0-1000.

## 2.0.2 - 2016-03-15

### Changed
- Update bedrock dependencies.

### Changed
- Use jsonldContext schema to validate Credential @context.

## 2.0.1 - 2016-03-09

### Changed
- Update publicKeyPem schema to accept RSA PUBLIC KEY.

## 2.0.0 - 2016-03-02

### Changed
- Update package dependencies for npm v3 compatibility.

## 1.0.3 - 2016-01-06

### Fixed
- Fix synchronous error emission when invalid schema is specified.

## 1.0.2 - 2015-10-13

### Fixed
- Fix credential schema bugs/style.

## 1.0.1 - 2015-05-07

### Added
- Support validating JSON-LD context arrays.

### Changed
- Accept and ignore null as jsonldContext context param.

## 1.0.0 - 2015-04-08

### Changed
- Labels/titles: Allow double quotes.
- Lables: Allow length of 200 (up from 32).

## 0.1.0 (up to early 2015)

- See git history for changes.
