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
  const valueValidator = createValueValidator(config)(schema);
  it('should find and return errors', () => {
    const result = valueValidator({
      a: 10,
      b: 300,
    });
    expect(result).toEqual({
      b {
        inRange: config.errorMapping.inRange.overMax
      }
    });
  });
});