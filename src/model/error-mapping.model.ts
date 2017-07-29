import { Validators } from '../configuration/validators';

export type Cases<K extends keyof Validators> = Validators[K]['cases'];

export type ValidationTarget<K extends keyof Validators> = { name: string, value: Validators[K]['inputType'] };

export type ErrorMessageFunction<K extends keyof Validators, Context> =
  (args: {
    params: Validators[K]['params'],
    target: ValidationTarget<K>,
    context: Context
  }) => (string | Promise<string>);

export type ErrorMessage<K extends keyof Validators, Context> =
  string | Promise<string> | ErrorMessageFunction<K, Context>;

export type ErrorMessages<K extends keyof Validators, Context> = {[key in Cases<K>]: ErrorMessage<K, Context>};

export type ErrorMapping<Context> = {
  [key in keyof Validators]: ErrorMessages<key, Context>
};
