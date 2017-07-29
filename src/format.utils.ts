/**
 * Capitalize the first letter of a string
 * @param s The string to change
 * @returns {string} The new string
 */
export function capitalizeFirstLetter(s: string): string {
  if (s.length <= 0) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Pluralize a word if the value is not one
 * @param value The value to check
 * @param wordInSingular The word in singular
 * @param wordInPlural The word in plural. The default is the word in singular + s
 * @returns {string}
 */
export function pluralize(value: number, wordInSingular: string, wordInPlural?: string): string {
  wordInPlural = wordInPlural || `${wordInSingular}s`;
  if (value === 1) {
    return wordInSingular;
  }
  return wordInPlural;
}