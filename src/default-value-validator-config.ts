import { ValueValidatorConfig } from './create-value-validator';

export const defaultValueValidatorConfig: ValueValidatorConfig<{}> = {
  errorMapping: {
    inRange: {
      underMin: '',
      overMax: ''
    },
    required: {
      notDefined: ''
    },
    isEmail: {
      notValid: ''
    },
    isNumber: {
      notValid: ''
    },
    hasLength: {
      shorter: '',
      longer: ''
    }
  },
  context: {}
};
