import { Validators } from './validators';

export type ValidationResolverConfig<K extends keyof Validators> = {
  errorMessages: ErrorMessages<K>
};

export type ValidationResolver<K extends keyof Validators> =
  (params: Validators[K]['params']) => (value: Validators[K]['inputType']) => string | null;

export type ValidationResolverCreator<K extends keyof Validators> =
  (config: ValidationResolverConfig<K>) => ValidationResolver<K>;

export type ValidationResolvers = {
  [key in keyof Validators]: ValidationResolverCreator<key>
};

export type ValidationSchema = {
  [key in keyof Validators]?: Validators[key]['params']
};

export type Cases<K extends keyof Validators> = Validators[K]['cases'];

export type ErrorMessages<K extends keyof Validators> = {[key in Cases<K>]: string};

export type ErrorMapping = {
  [key in keyof Validators]: ErrorMessages<key>
};


