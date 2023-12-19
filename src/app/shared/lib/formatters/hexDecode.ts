export function hexDecode(hexValue: string): string {
  if (hexValue) {
    hexValue = hexValue + '';
    let retval = '';
    for (let n = 0; n < hexValue.length; n += 2) {
      retval += String.fromCharCode(parseInt(hexValue.substr(n, 2), 16));
    }
    return retval;
  } else {
    throw new Error('invalid input');
  }
}
