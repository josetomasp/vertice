import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ssnmask'
})
export class SsnMakePipe implements PipeTransform {
  transform(ssn: string, visibleDigits: number = 4): string {
    let maskedSection = ssn.slice(0, -visibleDigits);
    let visibleSection = ssn.slice(-visibleDigits);
    return maskedSection.replace(/./g, '*') + visibleSection;
  }
}
