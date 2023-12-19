/**
 * @deprecated unused
 * @param array
 * @param customNameTransform
 */
export function toPrefValueList<T>(
  array: Array<T>,
  customNameTransform?: (value: T, i: number) => string
): Array<any> {
  return array.map((val, i) => {
    return {
      orderOfPrecedence: i,
      preferenceValue: val,
      preferenceCustomName: customNameTransform
        ? customNameTransform(val, i)
        : ''
    };
  });
}
