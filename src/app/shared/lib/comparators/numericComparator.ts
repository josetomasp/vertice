export function numericComparator(
  a: number,
  b: number,
  ascending: boolean
): number {
  if (ascending) {
    return a - b;
  } else {
    return b - a;
  }
}
