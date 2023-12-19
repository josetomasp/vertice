import { AbstractControl } from '@angular/forms';

export class AddLocationValidators {
  static zipCodeValidator(zip: AbstractControl): { invalidZip: boolean } {
    if (zip.pristine) {
      return null;
    }
    const ZIP_REGEXP = /^[0-9]{5}(?:[0-9]{4})?$/;
    zip.markAsTouched();
    if (ZIP_REGEXP.test(zip.value)) {
      return null;
    }
    return {
      invalidZip: true
    };
  }
}
