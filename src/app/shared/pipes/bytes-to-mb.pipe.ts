import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytesToMb'
})
export class BytesToMbPipe implements PipeTransform {
  transform(value: number): number {
    return this.bytesToMB(value);
  }

  private bytesToMB(value: number): number {
    const total = value / 1024 / 1024;
    return +total.toFixed(2);
  }
}
