export function randomIdLikeNumber(digitCount = 7): number {
  return Number(
    Math.random()
      .toString()
      .substring(2, digitCount)
  );
}
