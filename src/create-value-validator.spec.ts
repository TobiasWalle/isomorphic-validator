import {
  createValueValidator,
  PartialValueValidatorConfig,
  ValueSchemaMapping,
  ValueValidatorWithoutSchema
} from './create-value-validator';

describe('CreateValueValidator', () => {
  let config: PartialValueValidatorConfig<{}>;
  let valueValidator: ValueValidatorWithoutSchema<never>;

  beforeEach(() => {
    config = {
      errorMapping: {
        required: {
          notDefined: 'notDefined'
        },
        inRange: {
          underMin: 'underMin',
          overMax: 'overMax'
        },
      }
    };
    valueValidator = createValueValidator(config);
  });

  it('should find and return errors', async () => {
    type Keys = 'a' | 'b';
    const schema: ValueSchemaMapping<Keys> = {
      a: {
        required: {}
      },
      b: {
        required: {},
        inRange: {
          min: 0,
          max: 10
        }
      },
    };
    const result = await valueValidator(schema)({
      a: 10,
      b: 300,
    });
    expect(result).toEqual({
      b: {
        inRange: 'overMax'
      }
    });
  });

  it('should work with empty schema', async () => {
    type Keys = 'a' | 'b';
    const schema: ValueSchemaMapping<Keys> = {
      a: {},
      b: {},
    };
    const result = await valueValidator(schema)({
      a: 10,
      b: 300,
    });
    expect(result).toEqual({});
  });

  it('should work with messages which are function', async () => {
    expect.assertions(5);
    config = {
        errorMapping: {
          inRange: {
            underMin: ({params: {min, max}, target: {name, value}}) => {
              expect(min).toBe(0);
              expect(max).toBe(10);
              expect(name).toBe('a');
              expect(value).toBe(-10);
              return 'underMin';
            },
            overMax: 'overMax'
          }
        }
    };
    type Keys = 'a';
    const schema: ValueSchemaMapping<Keys> = {
      a: {
        inRange: {
          min: 0,
          max: 10
        }
      }
    };
    const result = await createValueValidator(config)(schema)({
      a: -10
    });
    expect(result).toEqual({
      a: {
        inRange: 'underMin'
      }
    });
  });

  it('should work with messages which are asnyc function', async () => {
    expect.assertions(5);
    config = {
        errorMapping: {
          inRange: {
            underMin: async ({params: {min, max}, target: {name, value}}) => {
              expect(min).toBe(0);
              expect(max).toBe(10);
              expect(name).toBe('a');
              expect(value).toBe(-10);
              return 'underMin';
            },
            overMax: 'overMax'
          }
        }
    };
    type Keys = 'a';
    const schema: ValueSchemaMapping<Keys> = {
      a: {
        inRange: {
          min: 0,
          max: 10
        }
      }
    };
    const result = await createValueValidator(config)(schema)({
      a: -10
    });
    expect(result).toEqual({
      a: {
        inRange: 'underMin'
      }
    });
  });

  it('should work with messages which are promises', async () => {
    expect.assertions(1);
    config = {
        errorMapping: {
          inRange: {
            underMin: Promise.resolve('underMin'),
            overMax: 'overMax'
          }
        }
    };
    type Keys = 'a';
    const schema: ValueSchemaMapping<Keys> = {
      a: {
        inRange: {
          min: 0,
          max: 10
        }
      }
    };
    const result = await createValueValidator(config)(schema)({
      a: -10
    });
    expect(result).toEqual({
      a: {
        inRange: 'underMin'
      }
    });
  });

  it('should throw error if message type is invalid', async () => {
    expect.assertions(1);
    config = {
        errorMapping: {
          inRange: {
            underMin: 123,
            overMax: 'overMax'
          }
        }
    } as any;
    type Keys = 'a';
    const schema: ValueSchemaMapping<Keys> = {
      a: {
        inRange: {
          min: 0,
          max: 10
        }
      }
    };
    try {
      const result = await createValueValidator(config)(schema)({
        a: -10
      });
    } catch (err) {
      expect(err.message).toBe('Invalid error message type "number": 123');
    }
  });
});