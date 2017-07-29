import { Validators } from '../configuration/validators';

export type ValidationSchema = {
  [key in keyof Validators]?: Validators[key]['params']
};

