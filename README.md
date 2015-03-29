# bedrock-validation

A [bedrock][] module that provides a express middleware and an API for
validating data structures and their contents. **bedrock-validation** uses
schemas based on [JSON schema][].

## Quick Examples

```
npm install bedrock-validation
```

```js
var bedrock = require('bedrock');
var validate = require('bedrock-validation').validate;

// load schemas from '/foo'
bedrock.config.validation.schema.paths.push('/foo');

// add an express route with validation middleware
bedrock.events.on('bedrock-express.configure.routes', function(app) {
  app.post('/bar',
    // validate the query using the 'postBarQueryValidator'
    // validate the response body using the 'postBarValidator'
    validate({query: 'postBarQueryValidator', body: 'postBarValidator'}),
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

### validate(name, [data], [callback])

This method may be called with either one, two, or three parameters.

If only one parameter is given:

* The method returns express middleware that will be used to validate a request
  using the schema associated with the given name.
* If a string is provided for the first parameter, then it will be used as the
  schema name for validating the request body.
* If an object is provided for the first parameter, then the object can contain
  `body` and `query` schema names as properties of the object.

If two parameters are given:

* The first parameter must be a string and the second parameter must be the
  data to validate. The return value will contain the result of the validation.

If three parameters are given:

* The first parameter must be a string, the second parameter must be the data
  to validate and the third must be a callback function to be called once the
  validation operation completes. If an error occurs (including a validation
  error), it will be passed as the first parameter of the callback, otherwise
  validation has passed. The return value will contain the result of the
  validation.

### getSchema(name)

Retrieves a validation schema given a `name` for the schema. If no such
schema exists, `null` is returned.

### validateInstance(instance, schema, [callback])

Validates an `instance` (data) against a `schema`. This method may be used
to validate data using a schema that wasn't necessarily registered via
the configuration system. The `schema` must be a [JSON schema][] instance. The
return value will contain the result of the validation. If a `callback` is
given, it will be called once the validation operation completes. If an
error occurred (including a validation error), it will be passed as the
first parameter of the `callback`.


[bedrock]: https://github.com/digitalbazaar/bedrock
[JSON schema]: http://json-schema.org/
