import { ValidationResolvers } from '../model/validation-resolver.model';
import * as email from 'email-validation';
import { convertStringToRegExp } from '../utils/regex.utils';

export const VALIDATION_RESOLVERS: ValidationResolvers<any> = {
  required: ({errorMessages}) => () => (value) => {
    if (value == null || value === '') {
      return errorMessages.notDefined;
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
  isEmail: ({errorMessages}) => ({}) => (value) => {
    if (value == null) return null;
    if (!email.valid(value)) {
      return errorMessages.notValid;
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
  hasLength: ({errorMessages}) => ({min, max}) => (value) => {
    if (value == null) return null;
    const length = value.length;
    if (length < min) {
      return errorMessages.shorter;
    } else if (length > max) {
      return errorMessages.longer;
    }
    return null;
  },
  matchRegExp: ({errorMessages}) => ({pattern}) => (value) => {
    if (value == null) return null;
    const regExp: RegExp = convertStringToRegExp(pattern);
    if (!regExp.test(value)) {
      return errorMessages.notValid;
    }
    return null;
  },
  isUrl: ({errorMessages}) => ({}) => (value) => {
    if (value == null) return null;
    /* tslint:disable:max-line-length */
    const urlRegexp = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    /* tslint:enable:max-line-length */
    if (!urlRegexp.test(value)) {
      return errorMessages.notValid;
    }
    return null;
  }
};
