import { ErrorMessages } from './model';
import { VALIDATION_RESOLVERS } from './resolvers';
describe('Resolvers', () => {
  describe('required', () => {
    const errorMessages: ErrorMessages<'required'> = {
      notDefined: 'notDefined'
    };
    const required = VALIDATION_RESOLVERS.required({errorMessages})({});

    it('should return error if input is null', () => {
      expect(required(null)).toBe(errorMessages.notDefined);
      expect(required(undefined)).toBe(errorMessages.notDefined);
    });

    it('should return undefined if value is valid', () => {
      expect(required(123)).toBeNull();
      expect(required(0)).toBeNull();
      expect(required('123')).toBeNull();
      expect(required(false)).toBeNull();
    });
  });

  describe('inRange', () => {
    const errorMessages: ErrorMessages<'inRange'> = {
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
});