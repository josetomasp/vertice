import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {
  constructor() {}
  transform(phoneNumber: string) {
    let onlyNumbers = phoneNumber.split(/\D/g).join('');
    return `(${onlyNumbers.substr(0,3)}) ${onlyNumbers.substr(2,3)} -${onlyNumbers.substr(5, 4)}`;
  }
}


