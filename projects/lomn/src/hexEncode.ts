export function hexEncode(inputString: string): string {
  let str = '';
  for (let i = 0; i < inputString.length; i++) {
    str += inputString[i].charCodeAt(0).toString(16);
  }
  return str.toUpperCase();
}
