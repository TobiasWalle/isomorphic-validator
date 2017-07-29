import { VALIDATION_RESOLVERS } from './resolvers';
import { ErrorMessages } from './error-mapping';

describe('Resolvers', () => {
  describe('required', () => {
    const errorMessages: ErrorMessages<'required', {}> = {
      notDefined: 'notDefined'
    };
    const required = VALIDATION_RESOLVERS.required({errorMessages})({});

    it('should return error if input is null or empty', () => {
      expect(required(null)).toBe(errorMessages.notDefined);
      expect(required(undefined)).toBe(errorMessages.notDefined);
      expect(required('')).toBe(errorMessages.notDefined);
    });

    it('should return undefined if value is valid', () => {
      expect(required(123)).toBeNull();
      expect(required(0)).toBeNull();
      expect(required('123')).toBeNull();
      expect(required(false)).toBeNull();
    });
  });

  describe('inRange', () => {
    const errorMessages: ErrorMessages<'inRange', {}> = {
      underMin: 'underMin',
      overMax: 'overMax',
    };
    const inRange = VALIDATION_RESOLVERS.inRange({errorMessages})({
      min: -10,
      max: 10,
    });

    it('should return undefined if value is in range or null', () => {
      expect(inRange(5)).toBeNull();
      expect(inRange(-10)).toBeNull();
      expect(inRange(10)).toBeNull();
      expect(inRange(0)).toBeNull();
      expect(inRange(null)).toBeNull();
      expect(inRange(undefined)).toBeNull();
    });

    it('should return error if not in range', () => {
      expect(inRange(-11)).toBe(errorMessages.underMin);
      expect(inRange(-10.000012)).toBe(errorMessages.underMin);
      expect(inRange(-Infinity)).toBe(errorMessages.underMin);
      expect(inRange(11)).toBe(errorMessages.overMax);
      expect(inRange(10.000012)).toBe(errorMessages.overMax);
      expect(inRange(Infinity)).toBe(errorMessages.overMax);
    });
  });

  describe('isEmail', () => {
    const errorMessages: ErrorMessages<'isEmail', {}> = {
      notValid: 'notValid'
    };
    const isEmail = VALIDATION_RESOLVERS.isEmail({errorMessages})({});
    it('should recognize valid emails', () => {
      expect(isEmail('test@test.de')).toBeNull();
      expect(isEmail('test.test@test.de')).toBeNull();
      expect(isEmail('test.test@test.sub.de')).toBeNull();
      expect(isEmail('test+test@test.sub.de')).toBeNull();
      expect(isEmail('test@123.123.123.123')).toBeNull();
      expect(isEmail('test@[123.123.123.123]')).toBeNull();
      expect(isEmail('"test"@test.com')).toBeNull();
      expect(isEmail('123423432@test.com')).toBeNull();
      expect(isEmail('123423432@test-test.com')).toBeNull();
      expect(isEmail('____________@test.com')).toBeNull();
      expect(isEmail('test@test.name')).toBeNull();
      expect(isEmail('test@test.co.jp')).toBeNull();
      expect(isEmail('test-test@test.co.jp')).toBeNull();
    });
    it('should recognize invalid emails', () => {
      expect(isEmail('test')).toBe('notValid');
      expect(isEmail('#@%^%#$@#$@#.com')).toBe('notValid');
      expect(isEmail('Joe Smith <email@domain.com>')).toBe('notValid');
      expect(isEmail('email.domain.com')).toBe('notValid');
      expect(isEmail('email@domain@domain.com')).toBe('notValid');
      expect(isEmail('あいうえお@domain.com')).toBe('notValid');
      expect(isEmail('email@domain.com (Joe Smith)')).toBe('notValid');
      expect(isEmail('email@-domain.com')).toBe('notValid');
    });
  });

  describe('isNumber', () => {
    const errorMessages: ErrorMessages<'isNumber', {}> = {
      notValid: 'notValid',
    };
    const isNumber = VALIDATION_RESOLVERS.isNumber({errorMessages})({});
    it('should detect valid number', () => {
      expect(isNumber(123)).toBeNull();
      expect(isNumber(3e10)).toBeNull();
      expect(isNumber(-132)).toBeNull();
      expect(isNumber(Infinity)).toBeNull();
      // undefined / null should not emit errors
      expect(isNumber(undefined)).toBeNull();
      expect(isNumber(null)).toBeNull();
    });
    it('should find invalid number', () => {
      expect(isNumber(('test' as any))).toBe('notValid');
      expect(isNumber(({} as any))).toBe('notValid');
      expect(isNumber(([] as any))).toBe('notValid');
    });
  });

  describe('hasLength', () => {
    const errorMessages: ErrorMessages<'hasLength', {}> = {
      shorter: 'shorter',
      longer: 'longer',
    };
    const hasLength = VALIDATION_RESOLVERS.hasLength({errorMessages})({
      min: 5,
      max: 10
    });
    it('should detect valid strings', () => {
      expect(hasLength('12345')).toBeNull();
      expect(hasLength('1234568910')).toBeNull();
    });
    it('should detect invalid strings', () => {
      expect(hasLength('1234')).toBe('shorter');
      expect(hasLength('12345689101')).toBe('longer');
    });
  });
});