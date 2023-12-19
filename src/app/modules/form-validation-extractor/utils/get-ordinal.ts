/**
 * Returns a string, ordinal representation of the given number.
 * For example...
 * getOrdinal(1); // returns "1st"
 * getOrdinal(2); // returns "2nd"
 * @param num
 */
export function getOrdinal(num: number): string {
  let suffix = 'th';
  if (num % 10 === 1 && num % 100 !== 11) {
    suffix = 'st';
  }
  if (num % 10 === 2 && num % 100 !== 12) {
    suffix = 'nd';
  }
  if (num % 10 === 3 && num % 100 !== 13) {
    suffix = 'rd';
  }

  return num + suffix;
}
