import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DateRangeValidators } from '../components/date-range-form/dateRangeValidators';

export function generateDateRangeForm(): FormGroup {
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
      tripsAuthorized: new FormControl(
        '',
        DateRangeValidators.tripsOrUnlimitedTrips
      ),
      unlimitedTrips: new FormControl(
        false,
        DateRangeValidators.tripsOrUnlimitedTrips
      ),
      noLocationRestrictions: new FormControl(false),
      approvedLocations: new FormControl(),
      notes: new FormControl(''),
      specifyTripsByLocation: new FormControl(false)
    },
    [DateRangeValidators.validTwoLocationSelection]
  );
}
