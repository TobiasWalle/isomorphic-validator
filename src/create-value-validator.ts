import {
  ValidationResolverConfig,
  ValidationResolverCreator,
} from './model';
import { ErrorMapping, ErrorMessageFunction, ValidationTarget } from './error-mapping';
import { ValidationSchema } from './validation-schema';
import { Validators } from './validators';
import { VALIDATION_RESOLVERS } from './resolvers';
import { defaultValueValidatorConfig } from './default-value-validator-config';
import deepmerge = require('deepmerge');

export type ValueValidatorConfig<Context> = {
  errorMapping: ErrorMapping<Context>,
  context?: Context
};
export type PartialValueValidatorConfig<Context> = {
  [k in keyof ValueValidatorConfig<Context>]: Partial<ValueValidatorConfig<Context>[k]>
};
export type ValueSchemaMapping<K extends string> = {[key in K]?: ValidationSchema};
export type ValidationResult = {[V in keyof Validators]?:  string | undefined};
export type ValidationResultMapping<K extends string> = {[key in K]?: ValidationResult};

const resolveErrorMessage = async <K extends keyof Validators, Context>
  ({errorMessage, params, target, context}: {
    errorMessage: string | Promise<string> | ErrorMessageFunction<K, Context>,
    params: Validators[K]['params'],
    target: ValidationTarget<K>,
    context: Context
  }): Promise<string> => {
    if (typeof errorMessage === 'string' || errorMessage instanceof Promise) {
      return errorMessage;
    } else if (typeof errorMessage === 'function') {
      errorMessage = errorMessage({params, target, context});
      if (errorMessage instanceof Promise) {
        errorMessage = await errorMessage;
      }
      return errorMessage;
    } else {
      throw ReferenceError('Invalid error message type "' + typeof errorMessage + '"');
    }
  };

const validateSchema = async <K extends keyof Validators, Context>
  ({config, value, schema, name}: {
    config: ValueValidatorConfig<Context>,
    value: any,
    schema: ValidationSchema,
    name: string,
  }): Promise<ValidationResult> => {
  return Object.keys(schema)
    .reduce(async (resultPromise: Promise<Partial<ValidationResult>>, key: keyof Validators) => {
      const result = await resultPromise;
      const resolverConfig = getResolverConfig(config, key);
      const params = schema[key];
      const context = config.context;
      if (!params) return result;
      const validationResolverCreator: ValidationResolverCreator<typeof key, Context> = VALIDATION_RESOLVERS[key];
      const errorMessage = validationResolverCreator(resolverConfig)(params)(value);
      if (errorMessage != null) {
        result[key] = await resolveErrorMessage({
          errorMessage,
          params,
          target: {value, name},
          context
        });
      }
      return result;
    }, Promise.resolve({}));
};

const getResolverConfig = <K extends keyof Validators, Context>
(config: ValueValidatorConfig<Context>, key: K): ValidationResolverConfig<K, Context> => {
  const errorMessages = config.errorMapping[key] as any;
  return {
    errorMessages
  };
};

export type ValueValidator<K extends string> = (obj: {[key in K]: any}) => Promise<ValidationResultMapping<K>>;
export type ValueValidatorWithoutSchema<K extends string> = (schemaMapping: ValueSchemaMapping<K>) => ValueValidator<K>;

export const createValueValidator = <K extends string, Context>
  (config: PartialValueValidatorConfig<Context>): ValueValidatorWithoutSchema<K> => {
    const configuration = deepmerge(defaultValueValidatorConfig, config) as ValueValidatorConfig<Context>;
    return (schemaMapping) => (obj) =>
        Object.keys(obj)
          .map(key => [key, obj[key], schemaMapping[key]])
          .filter(([key, value, schema]) => schema != null)
          .reduce(async (resultPromise: Promise<ValidationResultMapping<K>>, [key, value, schema]) => {
            const result = await resultPromise;
            const schemaResult = await validateSchema({
              config: configuration,
              value,
              schema,
              name: key,
            });
            if (Object.keys(schemaResult).length > 0) {
              result[key] = schemaResult;
            }
            return result;
          }, Promise.resolve({}));
  }
;
