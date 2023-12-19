/**
 * @description takes a string as input and returns
 * a string with capitalized first letter
 * @param  {string} value
 */
export function capitalize(value: string): string {
  if (null == value || value.length < 2) {
    return value;
  }
  value = value.toLowerCase().trim();
  return value.charAt(0).toUpperCase() + value.substr(1);
}
