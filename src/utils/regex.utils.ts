/**
 * Convert a string to a regular expression. The string should be formed like a RegExp
 * literal.
 * @param pattern
 * @returns {RegExp}
 */
export function convertStringToRegExp(pattern: string): RegExp {
  const regExpPattern = /^\/(.+)\/([gimuy]*)$/;
  const args: string[] | null = regExpPattern.exec(pattern);
  if (args === null) {
    throw Error(`Invalid regExp string "${pattern}"`);
  }
  const body = args[1] || '';
  const flags = args[2];
  return new RegExp(body, flags);
}