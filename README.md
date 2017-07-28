# Isomorphic Validator
[![Build Status](https://travis-ci.org/TobiasWalle/isomorphic-validator.svg?branch=master)](https://travis-ci.org/TobiasWalle/isomorphic-validator)
[![Coverage Status](https://coveralls.io/repos/github/TobiasWalle/isomorphic-validator/badge.svg?branch=master)](https://coveralls.io/github/TobiasWalle/isomorphic-validator?branch=master)
[![npm version](https://badge.fury.io/js/isomorphic-validator.svg)](https://badge.fury.io/js/isomorphic-validator)

:rocket: Share your form validator between client and server

**1. Define your validation schema**

```typescript
import { ValueSchemaMapping } from 'isomorphic-validator';

type MyObject = {
  username: string,
  email: string,
  age: number
}

const validationSchema: ValueSchemaMapping<keyof MyObject> = {
  username: {
    required: {},
    hasLength: {
      min: 8,
      max: 30
    }
  },
  email: {
    isEmail: {},
  },
  age: {
    isNumber: {},
    inRange: {
      min: 0,
      max: 150
    }
  }
}
```

**2. Validate**
```typescript
import { createValueValidator, PartialValueValidatorConfig } from 'isomorphic-validator';

const myObject: MyObject = {
  username: 'user',
  email: 'invalidEmail',
  age: -10
}

// Create config or just leave empty to use defaults
const config: PartialValueValidatorConfig = {
  errorMapping: {
    required: {
      notDefined: 'This field is required'
    },
    hasLength: {
      shorter: ({params: {min}}) => `The minimal length is ${min}`,
      longer: ({params: {max}}) => `The maximum length is ${max}`
    },
    isEmail: {
      notValid: 'The email is not valid'
    },
    isNumber: {
      notValid: 'This field has to be a number'
    },
    inRange: {
      underMin: ({params: {min}, target: {name}}) => `The ${name} has to be at least ${min}.`,
      overMax: ({params: {max}, target: {name}}) => `The ${name} has to be smaller than ${max}.`
    }
  }
}

const valueValidator = createValueValidator(config)(schema);
valueValidator(myObject)
  .then((errors) => {
    /*
    errors equals:
    {
      username: {
        hasLength: 'The minimal length is 8',
      },
      email: {
        isEmail: 'The email is not valid',
      },
      age: {
        inRange: 'The age has to be at least 0'
      }
    }
     */
  })
;
```

**3. Share**

As the schema is serializable you can easily share it between the client and the server.
Isomorphic makes no restrictions which technology you use for that.

## API

*It is recommended to use this library with [typescript](https://www.typescriptlang.org/). But the usage with javascript is also possible.*

You can find all possible validations in [validators.ts](src/validators.ts).
The structure of the definitions is the following:

|Property|Description|
|:---------:|:-------------|
|`inputType`| The expected input type for this validator|
|`params`| The parameter this validator needs to accept|
|`cases`| The possible result cases (Important for the error messages)|


