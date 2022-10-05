# bedrock-validation

[![Build Status](http://ci.digitalbazaar.com/buildStatus/icon?job=bedrock-validation)](http://ci.digitalbazaar.com/job/bedrock-validation)

A [bedrock][] module that provides a express middleware and an API for
validating data structures and their contents. **bedrock-validation** uses
schemas based on [JSON schema][].

## Requirements

- npm v6+

## Quick Examples

```
npm install @bedrock/validation
```

```js
import * as bedrock from '@bedrock/core';
import {postBarValidator, postBarQueryValidator} from '../schemas/my-schemas.js';
import {createValidateMiddleware as validate} from '@bedrock/validation';

// load schemas from '/foo'
bedrock.config.validation.schema.paths.push('/foo');

// add an express route with validation middleware
bedrock.events.on('bedrock-express.configure.routes', function(app) {
  app.post('/bar',
    // validate the query using the 'postBarQueryValidator'
    // validate the response body using the 'postBarValidator'
    validate({query: postBarQueryValidator, body: postBarValidator}),
    function(req, res) {
      // do something
    });
});

bedrock.start();
```

## Configuration

**bedrock-validation** will, on initialization (via the `bedrock.init` event),
read any schemas found in the list of paths specified in
`bedrock.config.validation.schema.paths`. Individual schemas can be skipped
via the `bedrock.config.validation.schema.skip` configuration option. If any
schema name matches a previously loaded schema, it will override that
schema.

For more documentation on configuration, see [config.js](./lib/config.js).

## API

### createValidateMiddleware({query: schema, body: schema})

This method may be called with either `query` or `body` defined.

The method returns express middleware that will be used to validate a request
using the schema associated with either `query` or `body`.

### getSchema(name)

Retrieves a validation schema given a `name` for the schema. If no such
schema exists, `null` is returned.

### validateInstance(instance, schema)

Validates an `instance` (data) against a `schema`. This method may be used
to validate data using a schema that wasn't necessarily registered via
the configuration system. The `schema` must be a [JSON schema][] instance. The
return value will contain the result of the validation. This function returns
a promise that resolves to:
```js
{
  valid: <boolean>,
  error: <error> // only present when valid === false
}
```


[bedrock]: https://github.com/digitalbazaar/bedrock
[JSON schema]: http://json-schema.org/
