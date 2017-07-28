import { Validators } from './validators';

export type ValidationSchema = {
  [key in keyof Validators]?: Validators[key]['params']
};

