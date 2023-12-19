const coPayRegEx = /[%,]/g;

export function coPayStringComparator(
  alpha: string,
  beta: string,
  ascending: boolean
): number {
  if (alpha === 'N/A') {
    alpha = '0';
  } else {
    alpha = alpha.replace(coPayRegEx, '');
  }
  const numA: number = Number(alpha) as number;

  if (beta === 'N/A') {
    beta = '0';
  } else {
    beta = beta.replace(coPayRegEx, '');
  }
  const numB: number = Number(beta) as number;

  if (ascending) {
    return numA - numB;
  } else {
    return numB - numA;
  }
}
