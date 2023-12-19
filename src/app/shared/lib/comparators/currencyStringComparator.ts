const currencyRegEx = /[$,]/g;

export function currencyStringComparator(
  alpha: string,
  beta: string,
  ascending: boolean
): number {
  if (null == alpha) {
    alpha = '';
  }
  alpha = alpha.replace(currencyRegEx, '');
  const numA: number = Number(alpha) as number;

  if (null == beta) {
    beta = '';
  }
  beta = beta.replace(currencyRegEx, '');
  const numB: number = Number(beta) as number;

  if (ascending) {
    return numA - numB;
  } else {
    return numB - numA;
  }
}
