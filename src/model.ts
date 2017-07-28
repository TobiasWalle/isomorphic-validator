import { Validators } from './validators';

export type ValidationResolverConfig<K extends keyof Validators, Context> = {
  errorMessages: ErrorMessages<K, Context>
};

export type ValidationResolver<K extends keyof Validators, Context> =
  (params: Validators[K]['params']) => (value: Validators[K]['inputType']) => ErrorMessage<K, Context> | null;

export type ValidationResolverCreator<K extends keyof Validators, Context> =
  (config: ValidationResolverConfig<K, Context>) => ValidationResolver<K, Context>;

export type ValidationResolvers<Context> = {
  [key in keyof Validators]: ValidationResolverCreator<key, Context>
};

export type ValidationSchema = {
  [key in keyof Validators]?: Validators[key]['params']
};

export type Cases<K extends keyof Validators> = Validators[K]['cases'];

export type ValidationTarget<K extends keyof Validators> = {name: string, value: Validators[K]['inputType']};
export type ErrorMessageFunction<K extends keyof Validators, Context> =
  (args: {params: Validators[K]['params'], target: ValidationTarget<K>, context: Context}) => (string | Promise<string>);
export type ErrorMessage<K extends keyof Validators, Context> = string | Promise<string> | ErrorMessageFunction<K, Context>;
export type ErrorMessages<K extends keyof Validators, Context> =
  {[key in Cases<K>]: ErrorMessage<K, Context>}
;

export type ErrorMapping<Context> = {
  [key in keyof Validators]: ErrorMessages<key, Context>
};


