import { capitalizeFirstLetter, pluralize } from './format.utils';
describe('FormatUtils', () => {
  it('should capitalize the first letter', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
    expect(capitalizeFirstLetter('heLo')).toBe('HeLo');
    expect(capitalizeFirstLetter('')).toBe('');
  });
  describe('pluralize', () => {

    it('should return the singular', () => {
      expect(pluralize(1, 'hello')).toBe('hello');
      expect(pluralize(1, '')).toBe('');
    });

    it('should pluralize a word', () => {
      expect(pluralize(2, 'hello')).toBe('hellos');
      expect(pluralize(2, '')).toBe('s');
    });

    it('should return the plural if given', () => {
      expect(pluralize(2, 'hello', 'test')).toBe('test');
    });
  });
});