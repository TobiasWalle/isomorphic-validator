import { ValidationResolvers } from './model';

export const VALIDATION_RESOLVERS: ValidationResolvers = {
  required: ({errorMessages}) => () => (value) => {
    if (value == null) {
      return errorMessages.notDefined;
    }
    return;
  },
  inRange: ({errorMessages}) => ({min, max}) => (value) => {
    if (value == null) return;
    if (value < min) {
      return errorMessages.underMin;
    } else if (value > max) {
      return errorMessages.overMax;
    } else {
      return;
    }
  }
};
