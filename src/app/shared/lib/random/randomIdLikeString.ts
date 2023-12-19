export function randomIdLikeString(digitCount = 7): string {
  return Math.random()
    .toString()
    .substring(2, digitCount);
}
