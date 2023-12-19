import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateRangeValidators } from '../components/date-range-form/dateRangeValidators';

export function generateLanguageDateRangeForm() {
  return new FormGroup(
    {
      startDate: new FormControl('', [
        Validators.required,
        DateRangeValidators.startDateValidation
      ]),
      endDate: new FormControl('', [
        Validators.required,
        DateRangeValidators.endDateValidation
      ]),
      tripsAuthorized: new FormControl('', [
        Validators.required,
        Validators.min(1)
      ]),
      certification: new FormControl(null, [Validators.required]),
      noLocationRestrictions: new FormControl(false),
      approvedLocations: new FormControl([]),
      notes: new FormControl('')
    },
    [DateRangeValidators.validLocationSelection]
  );
}
