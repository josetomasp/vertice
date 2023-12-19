import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateRangeValidators } from '../components/date-range-form/dateRangeValidators';

export function generatePMDateRangeForm() {
  return new FormGroup({
    bodyParts: new FormControl([], [Validators.required]),
    otherTypes: new FormControl([], [Validators.required]),
    serviceType: new FormControl(null, Validators.required),
    startDate: new FormControl('', [
      Validators.required,
      DateRangeValidators.startDateValidation
    ]),
    endDate: new FormControl('', [
      Validators.required,
      DateRangeValidators.endDateValidation
    ]),
    notes: new FormControl(null),
    numberOfVisits: new FormControl(null, [Validators.required])
  });
}
