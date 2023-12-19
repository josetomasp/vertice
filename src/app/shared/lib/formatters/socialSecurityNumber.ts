export function getFormattedSSN(ssn: string): string {
  if (null == ssn || ssn.trim().length != 9) {
    return '';
  }

  ssn = ssn.trim();

  return (
    ssn.substring(0, 3) + '-' + ssn.substring(3, 5) + '-' + ssn.substring(5)
  );
}
