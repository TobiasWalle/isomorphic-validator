import { ErrorMapping, ValidationResolverConfig, ValidationResolverCreator, ValidationSchema } from './model';
import { Validators } from './validators';
import { VALIDATION_RESOLVERS } from './resolvers';

export type ValueValidatorConfig = {
  errorMapping: ErrorMapping
};
export type ValueSchemaMapping<T> = {[K in keyof T]?: ValidationSchema};
export type ValidationResult = {[V in keyof Validators]?:  string | undefined};
export type ValidationResultMapping<T> = {[K in keyof T]?: ValidationResult};

export const createValueValidator =
  (config: ValueValidatorConfig) =>
    <T extends { [key: string]: any }>(schemaMapping: ValueSchemaMapping<T>) =>
      (obj: T): ValidationResultMapping<T> => (
        Object.keys(obj)
          .map(key => [key, obj[key], schemaMapping[key]])
          .filter(([key, value, schema]) => schema != null)
          .reduce((result: ValidationResultMapping<T>, [key, value, schema]) => {
            result[key] = validateSchema(config, value, schema);
            return result;
          }, {})
      );

const validateSchema = (config: ValueValidatorConfig, value: any, schema: ValidationSchema): ValidationResult => {
  return Object.keys(schema)
    .reduce((result: Partial<ValidationResult>, key: keyof Validators) => {
      const resolverConfig = getResolverConfig(config, key);
      const resolverSchema = schema[key];
      if (!resolverSchema) return result;
      const validationResolverCreator: ValidationResolverCreator<typeof key> = VALIDATION_RESOLVERS[key];
      result[key] = validationResolverCreator(resolverConfig)(resolverSchema.params)(value);
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
