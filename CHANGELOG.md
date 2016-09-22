# bedrock-validation ChangeLog

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
