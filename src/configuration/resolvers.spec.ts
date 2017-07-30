import { VALIDATION_RESOLVERS } from './resolvers';
import { ErrorMessages } from '../model/error-mapping.model';
import { Validators } from './validators';

describe('Resolvers', () => {
  it('should throw no error on null or undefined (except required)', () => {
    const resolverKeys = Object.keys(VALIDATION_RESOLVERS).filter(key => key !== 'required');
    expect.assertions(resolverKeys.length * 2);

    resolverKeys.forEach((key: keyof Validators) => {
      const resolver: any = VALIDATION_RESOLVERS[key];
      const config: any = {};
      const params: any = {};
      const validate = resolver(config)(params);
      expect(validate(null)).toBeNull();
      expect(validate(undefined)).toBeNull();
    });
  });

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
    let inRange = VALIDATION_RESOLVERS.inRange({errorMessages})({
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

    it('should work with only min', () => {
      inRange = VALIDATION_RESOLVERS.inRange({errorMessages})({
        min: -10,
      });
      expect(inRange(-11)).toBe(errorMessages.underMin);
      expect(inRange(1000000000)).toBeNull();
    });
    it('should work with only max', () => {
      inRange = VALIDATION_RESOLVERS.inRange({errorMessages})({
        max: -10,
      });
      expect(inRange(-11)).toBeNull();
      expect(inRange(1000000000)).toBe(errorMessages.overMax);
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
    let hasLength = VALIDATION_RESOLVERS.hasLength({errorMessages})({
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
    it('should work with only min', () => {
      hasLength = VALIDATION_RESOLVERS.hasLength({errorMessages})({
        min: 5
      });
      expect(hasLength('123')).toBe('shorter');
      expect(hasLength('1234565')).toBeNull();
    });
    it('should work with only max', () => {
      hasLength = VALIDATION_RESOLVERS.hasLength({errorMessages})({
        max: 5
      });
      expect(hasLength('123')).toBeNull();
      expect(hasLength('1234565')).toBe('longer');
    });
  });

  describe('matchRegExp', () => {
    const errorMessages: ErrorMessages<'matchRegExp', {}> = {
      notValid: 'notValid'
    };
    const matchRegex = VALIDATION_RESOLVERS.matchRegExp({errorMessages})({
      //language=RegExp
      pattern: '/^[ABC]{2}\\d+$/i'
    });
    it('should detect valid inputs', () => {
      expect(matchRegex('ab123')).toBeNull();
      expect(matchRegex('Cb3')).toBeNull();
    });
    it('should detect invalid inputs', () => {
      expect(matchRegex('a123')).toBe('notValid');
      expect(matchRegex('ac')).toBe('notValid');
      expect(matchRegex('Ae1344')).toBe('notValid');
    });
  });

  describe('isUrl', () => {
    const errorMessages: ErrorMessages<'isUrl', {}> = {
      notValid: 'notValid'
    };
    const isUrl = VALIDATION_RESOLVERS.isUrl({errorMessages})({});
    it('should detect valid inputs', () => {
      expect(isUrl('http://google.de')).toBeNull();
      expect(isUrl('https://google.de/search/something')).toBeNull();
      expect(isUrl('https://google.de/search/something?query=1234')).toBeNull();
      expect(isUrl('google.de')).toBeNull();
    });
    it('should detect invalid inputs', () => {
      expect(isUrl('abc')).toBe('notValid');
      expect(isUrl('https://test')).toBe('notValid');
    });
  });

  describe('isInList', () => {
    const errorMessages: ErrorMessages<'isInList', {}> = {
      notInList: 'notInList'
    };
    const isInList = VALIDATION_RESOLVERS.isInList({errorMessages})({
      list: [1, 2, 3]
    });
    it('should detect valid inputs', () => {
      expect(isInList(1)).toBeNull();
      expect(isInList(2)).toBeNull();
      expect(isInList(3)).toBeNull();
    });
    it('should detect invalid inputs', () => {
      expect(isInList(4)).toBe('notInList');
      expect(isInList(0)).toBe('notInList');
      expect(isInList(-1)).toBe('notInList');
    });
  });
});