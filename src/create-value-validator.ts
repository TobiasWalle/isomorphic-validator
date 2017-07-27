import { ErrorMapping, ValidationResolverConfig, ValidationResolverCreator, ValidationSchema } from './model';
import { Validators } from './validators';
import { VALIDATION_RESOLVERS } from './resolvers';

export type ValueValidatorConfig = {
  errorMapping: ErrorMapping
};
export type ValueSchemaMapping<K extends string> = {[key in K]?: ValidationSchema};
export type ValidationResult = {[V in keyof Validators]?:  string | undefined};
export type ValidationResultMapping<K extends string> = {[key in K]?: ValidationResult};

export const createValueValidator =
  (config: ValueValidatorConfig) =>
    <K extends string>(schemaMapping: ValueSchemaMapping<K>) =>
      (obj: {[key in K]: any}): ValidationResultMapping<K> => (
        Object.keys(obj)
          .map(key => [key, obj[key], schemaMapping[key]])
          .filter(([key, value, schema]) => schema != null)
          .reduce((result: ValidationResultMapping<K>, [key, value, schema]) => {
            const schemaResult = validateSchema(config, value, schema);
            if (Object.keys(schemaResult).length > 0) {
              result[key] = schemaResult;
            }
            return result;
          }, {})
      );

const validateSchema = (config: ValueValidatorConfig, value: any, schema: ValidationSchema): ValidationResult => {
  return Object.keys(schema)
    .reduce((result: Partial<ValidationResult>, key: keyof Validators) => {
      const resolverConfig = getResolverConfig(config, key);
      const params = schema[key];
      if (!params) return result;
      const validationResolverCreator: ValidationResolverCreator<typeof key> = VALIDATION_RESOLVERS[key];
      const itemResult = validationResolverCreator(resolverConfig)(params)(value);
      if (itemResult != null) {
        result[key] = itemResult;
      }
      return result;
    }, {});
};

const getResolverConfig = <K extends keyof Validators>(config: ValueValidatorConfig, key: K): ValidationResolverConfig<K> => {
  // Types unfortunately not work here
  const errorMessages: any = config.errorMapping[key];
  return {
    errorMessages
  };
};
