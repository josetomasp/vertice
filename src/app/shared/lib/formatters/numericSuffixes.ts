// Good for numbers up until 21.
export function getNumericSuffix(count: number): string {
  switch (count) {
    default:
      return 'th';
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
  }
}
