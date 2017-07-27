import { ValidationResolvers } from './model';
import * as email from 'email-validation';

export const VALIDATION_RESOLVERS: ValidationResolvers = {
  required: ({errorMessages}) => () => (value) => {
    if (value == null) {
      return errorMessages.notDefined;
    }
    return null;
  },
  inRange: ({errorMessages}) => ({min, max}) => (value) => {
    if (value == null) return null;
    if (value < min) {
      return errorMessages.underMin;
    } else if (value > max) {
      return errorMessages.overMax;
    }
    return null;
  },
  isEmail: ({errorMessages}) => ({}) => (value) => {
    if (value == null) return null;
    if (!email.valid(value)) {
      return errorMessages.notValid;
    }
    return null;
  },
  isNumber: ({errorMessages}) => ({}) => (value) => {
    if (value == null) return null;
    if (isNaN(value) || typeof value !== 'number') {
      return errorMessages.notValid;
    }
    return null;
  },
  hasLength: ({errorMessages}) => ({min, max}) => (value) => {
    if (value == null) return null;
    const length = value.length;
    if (length < min) {
      return errorMessages.shorter;
    } else if (length > max) {
      return errorMessages.longer;
    }
    return null;
  }
};
