export function getFIEN(fien: string): string {
  if (null == fien || fien.trim().length < 3) {
    return '';
  }

  fien = fien.trim();

  return fien.substring(0, 2) + '-' + fien.substring(2);
}
