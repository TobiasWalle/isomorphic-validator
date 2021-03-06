import { ValueValidatorConfig } from '../create-value-validator';
import { capitalizeFirstLetter, pluralize } from '../utils/format.utils';

export const defaultValueValidatorConfig: ValueValidatorConfig<{}> = {
  errorMapping: {
    inRange: {
      underMin: ({params: {min}}) => `Enter a number which has a minimum value of ${min}`,
      overMax: ({params: {max}}) => `Enter a number which has a maximum value of ${max}`,
    },
    required: {
      notDefined: ({target: {name}}) => `${capitalizeFirstLetter(name)} is required`,
    },
    isEmail: {
      notValid: 'Enter a valid email',
    },
    isNumber: {
      notValid: 'Enter a valid number'
    },
    hasLength: {
      shorter: ({params: {min}}) => min != null ? `Use at least ${min} ${pluralize(min, 'character')}` : '',
      longer: ({params: {max}}) => max != null ? `Use a maximum of ${max} ${pluralize(max, 'character')}` : '',
    },
    matchRegExp: {
      notValid: ({target: {name}}) => `Enter a valid ${name}`
    },
    isUrl: {
      notValid: 'Enter a valid URL'
    },
    isInList: {
      notInList: ({target: {name}}) => `Enter a valid ${name}`
    }
  },
  context: {}
};
