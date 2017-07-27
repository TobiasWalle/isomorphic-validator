import { createValueValidator, ValueSchemaMapping, ValueValidatorConfig } from './create-value-validator';
describe('CreateValueValidator', () => {
  const config: ValueValidatorConfig = {
    errorMapping: {
      required: {
        notDefined: 'notDefined'
      },
      inRange: {
        underMin: 'underMin',
        overMax: 'overMax'
      }
    }
  };
  const valueValidator = createValueValidator(config);

  it('should find and return errors', () => {
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
    const result = valueValidator(schema)({
      a: 10,
      b: 300,
    });
    expect(result).toEqual({
      b: {
        inRange: config.errorMapping.inRange.overMax
      }
    });
  });

  it('should work with empty schema', () => {
    type Keys = 'a' | 'b';
    const schema: ValueSchemaMapping<Keys> = {
      a: {
      },
      b: {
      },
    };
    const result = valueValidator(schema)({
      a: 10,
      b: 300,
    });
    expect(result).toEqual({});
  });
});