import { convertStringToRegExp } from './regex.utils';
describe('RegExpUtils', () => {
  describe('convertStringToRegExp', () => {

    it('should convert a string into a regular expression', () => {
      expect(convertStringToRegExp('/abc/').toString()).toBe('/abc/');
      expect(convertStringToRegExp('/abc/g').toString()).toBe('/abc/g');
      expect(convertStringToRegExp('/abc/gimuy').toString()).toBe('/abc/gimuy');
      expect(convertStringToRegExp('/[abc]+\\w*/gimuy').toString()).toBe('/[abc]+\\w*/gimuy');
    });

    it('should throw an error on invalid strings', () => {
      expect.assertions(4);
      const test = (pattern: string) => {
        try {
          convertStringToRegExp(pattern);
        } catch (err) {
          expect(err).toBeDefined();
        }
      };

      test('');
      test('//');
      test('/');
      test('/abc/xyvvx');
    });

  });
});