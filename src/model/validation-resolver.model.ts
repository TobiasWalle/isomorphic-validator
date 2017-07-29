import { Validators } from '../configuration/validators';
import { ErrorMessage, ErrorMessages } from './error-mapping.model';

export type ValidationResolverConfig<K extends keyof Validators, Context> = {
  errorMessages: ErrorMessages<K, Context>
};

export type ValidationResolver<K extends keyof Validators, Context> =
  (params: Validators[K]['params']) =>
    (value: Validators[K]['inputType'] | undefined | null) =>
      ErrorMessage<K, Context> | null;

export type ValidationResolverCreator<K extends keyof Validators, Context> =
  (config: ValidationResolverConfig<K, Context>) => ValidationResolver<K, Context>;

export type ValidationResolvers<Context> = {
  [key in keyof Validators]: ValidationResolverCreator<key, Context>
};


