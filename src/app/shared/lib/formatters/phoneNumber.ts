export function getPhoneNumberString(phoneNumber: string, fallbackValue: string = 'Not Available'): string {
  if (null == phoneNumber) {
    return fallbackValue;
  }

  // remove all non-numeric characters
  phoneNumber = phoneNumber.replace(/\D/g, '');

  let finalPhoneNumberString = fallbackValue;
  if (phoneNumber.length === 11) {
    finalPhoneNumberString =
      phoneNumber.substring(0, 1) +
      '-' +
      phoneNumber.substring(1, 4) +
      '-' +
      phoneNumber.substring(4, 7) +
      '-' +
      phoneNumber.substring(7, 11);
  }
  if (phoneNumber.length === 10) {
    finalPhoneNumberString =
      '(' +
      phoneNumber.substring(0, 3) +
      ') ' +
      phoneNumber.substring(3, 6) +
      '-' +
      phoneNumber.substring(6, 10);
  }
  if (phoneNumber.length === 7) {
    finalPhoneNumberString =
      phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3, 7);
  }

  return finalPhoneNumberString;
}
