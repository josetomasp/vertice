import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';

export class DateRangeValidators {
  public static validLocationSelection(ac: AbstractControl): ValidationErrors {
    let isInvalid: boolean = true;
    const selectedValues: string[] = ac.get('approvedLocations').value || [];

    if (
      ac.get('noLocationRestrictions').value === true ||
      selectedValues.length > 0
    ) {
      isInvalid = false;
    }

    if (isInvalid) {
      return {
        invalidLocationSelection: true
      };
    } else {
      return {};
    }
  }

  public static validTwoLocationSelection(
    ac: AbstractControl
  ): ValidationErrors {
    let isInvalid: boolean = true;
    const selectedValues: string[] = ac.get('approvedLocations').value || [];

    if (
      ac.get('noLocationRestrictions').value === true ||
      selectedValues.length > 1
    ) {
      isInvalid = false;
    }

    if (isInvalid) {
      return {
        invalidLocationSelection: true
      };
    } else {
      return {};
    }
  }

  public static validTwoLocationSelectionAuth(
    ac: AbstractControl
  ): ValidationErrors {
    let isInvalid: boolean = true;
    const selectedValues: string[] = [];
    Object.keys(ac.get('approvedLocations').value).forEach((locationType) =>
      Object.keys(ac.get('approvedLocations').value[locationType]).forEach(
        (locationId) => {
          if (
            ac.get('approvedLocations').value[locationType][locationId]
              .locationSelected
          ) {
            selectedValues.push(locationId);
          }
        }
      )
    );

    if (
      ac.get('noLocationRestrictions').value === true ||
      selectedValues.length > 1
    ) {
      isInvalid = false;
    }

    if (isInvalid) {
      return {
        invalidLocationSelection: true
      };
    } else {
      return {};
    }
  }

  /*
    * @Deprecated This should be a formGroup validator
   */
  public static endDateValidation(ac: AbstractControl): ValidationErrors {
    if (ac.parent && ac.parent.get('startDate').value && ac.value) {
      let fromControl = ac.parent.get('startDate');
      let to = ac.value;
      let validationError = DateRangeValidators.generateInvalidDateRangeError(
        fromControl.value,
        to
      );
      // If there's no range error, also remove the error from the start date control
      if (
        _.isEmpty(validationError) &&
        fromControl.hasError('invalidDateRange')
      ) {
        fromControl.updateValueAndValidity();
      } else if (validationError.invalidDateRange &&
        fromControl.hasError('invalidDateRange')) {
        delete validationError.invalidDateRange
      }
      return validationError;
    }
    return {};
  }

  /*
    * @Deprecated This should be a formGroup validator
   */
  public static startDateValidation(ac: AbstractControl): ValidationErrors {
    if (ac.parent && ac.parent.get('endDate').value && ac.value) {
      let from = ac.value;
      let toControl = ac.parent.get('endDate');
      let validationError = DateRangeValidators.generateInvalidDateRangeError(
        from,
        toControl.value
      );
      // If there's no range error, also remove the error from the end date control
      if (
        _.isEmpty(validationError) &&
        toControl.hasError('invalidDateRange')
      ) {
        toControl.updateValueAndValidity();
      } else if (validationError.invalidDateRange &&
        toControl.hasError('invalidDateRange')) {
        delete validationError.invalidDateRange
      }
      return validationError;
    }
    return {};
  }

  public static startBeforeEndDateValidation(
    ac: AbstractControl
  ): ValidationErrors {
    if (
      ac.parent &&
      ac.parent.get('startDate') &&
      ac.parent.get('startDate').value &&
      ac.parent.get('endDate') &&
      ac.parent.get('endDate').value
    ) {
      if (
        DateRangeValidators.isEndDateAfterStartDate(
          new Date(ac.parent.get('startDate').value),
          new Date(ac.parent.get('endDate').value)
        )
      ) {
        return { startDateMustBeBeforeEndDate: true };
      }
    }
    return {};
  }

  public static endDateMustBeInFuture(ac: AbstractControl): ValidationErrors {
    if (ac.value <= new Date()) {
      return {
        endDateMustBeInFuture: true
      };
    }

    return {};
  }

  public static dateMustBeLowerThan(maxDate: string) {
    return (ac: AbstractControl) => {
      if (ac.value >= new Date(maxDate)) {
        return {
          dateMustBelowerThan: true
        };
      } else {
        return {};
      }
    };
  }

  public static denyIndefinitelyDateMustBeLowerThan(maxDate: string) {
    return (ac: AbstractControl) => {
      if (
        ac.value >= new Date(maxDate) &&
        ac.value.setHours(0, 0, 0, 0) !==
          new Date('12/31/9999').setHours(0, 0, 0, 0)
      ) {
        return {
          denyIndefinitelyDateMustBeLowerThan: true
        };
      } else {
        return {};
      }
    };
  }
  public static dateMustBeGreaterThan(minDate: string) {
    return (ac: AbstractControl) => {
      if (ac.value <= new Date(minDate)) {
        return {
          dateMustBeGreaterThan: true
        };
      } else {
        return {};
      }
    };
  }
  private static generateInvalidDateRangeError(from: Date, to: Date) {
    let evalFromDate = new Date(from);
    let evalToDate = new Date(to);
    evalFromDate.setHours(0, 0, 0, 0);
    evalToDate.setHours(0, 0, 0, 0);
    if (this.isEndDateEqualsOrAfterStartDate(evalFromDate, evalToDate)) {
      return {
        invalidDateRange: true
      };
    }
    return {};
  }

  private static isEndDateEqualsOrAfterStartDate(
    start: Date,
    end: Date
  ): boolean {
    return end.getTime() < start.getTime();
  }

  private static isEndDateAfterStartDate(start: Date, end: Date): boolean {
    return end.getTime() <= start.getTime();
  }

  public static dateEqualsOrGreaterThan(date: string) {
    return (ac: AbstractControl) => {
      if (new Date() < new Date(date)) {
        return { dateMustBeEqualsOrGreaterThan: true };
      } else {
        return {};
      }
    };
  }

  public static maxDateRangeDifferentInMonths(
    months: number,
    startDateControlName: string,
    endDateControlName: string
  ) {
    return (ac: AbstractControl) => {
      const fromDate = ac.parent.get(startDateControlName).value;
      const toDate = ac.parent.get(endDateControlName).value;
      if (fromDate && toDate) {
        let error = this.generateDateRangeBiggerThanAllowError(
          new Date(fromDate),
          new Date(toDate),
          months
        );
        const otherControl =
          ac.value === ac.parent.get(startDateControlName).value
            ? ac.parent.get(endDateControlName)
            : ac.parent.get(startDateControlName);
        if (
          _.isEmpty(error) &&
          otherControl.hasError('dateRangeBiggerThanAllow')
        ) {
          otherControl.updateValueAndValidity();
        }
        return error;
      }
      return null;
    };
  }

  private static generateDateRangeBiggerThanAllowError(
    from: Date,
    to: Date,
    months: number
  ) {
    if (from && to) {
      let diff = moment(to)
        .startOf('day')
        .diff(moment(from).startOf('day'), 'months', true);
      if (diff > months) {
        return { dateRangeBiggerThanAllow: true };
      } else {
        return null;
      }
    }
    return null;
  }

  static tripsOrUnlimitedTrips(
    control: AbstractControl
  ): { [key: string]: any } | null {
    // Parent will always be null when the form initializes
    if (control.parent == null) {
      return null;
    }
    const fcTripsAuthorized: AbstractControl = control.parent.get(
      'tripsAuthorized'
    );
    const fcUnInlimitedTrips: AbstractControl = control.parent.get(
      'unlimitedTrips'
    );
    let trips = +fcTripsAuthorized.value;
    if (isNaN(trips)) {
      trips = 0;
    }

    const error = trips === 0 && fcUnInlimitedTrips.value === false;
    return error ? { tripsOrUnlimited: true } : null;
  }

  static specifyTripsTotal(
    control: AbstractControl
  ): { [key: string]: any } | null {
    // control will always be null when the form initializes
    if (control == null) {
      return null;
    }
    const fcTripsAuthorized: AbstractControl = control.get('tripsAuthorized');
    const fcSpecifyTripsByLocation: AbstractControl = control.get(
      'specifyTripsByLocation'
    );
    let trips = +fcTripsAuthorized.value;
    if (isNaN(trips)) {
      trips = 0;
    }

    const error = trips === 0 && fcSpecifyTripsByLocation.value === true;
    return error ? { specifyTripsTotal: true } : null;
  }

  static mustBeGreaterThanZeroIfSelected(control: AbstractControl) {
    // This crazy statement is just to make sure this validation does NOT fire when
    // you are in All Locations Together mode.  Also, after discussing this Alan,
    // doing it this way was the least worst choice.
    if (
      control.parent &&
      control.parent.parent &&
      control.parent.parent.parent
    ) {
      if (
        false ===
        control.parent.parent.parent.get('specifyTripsByLocation').value
      ) {
        return null;
      }
    }

    if (control.value.locationSelected && control.value.locationTripCount < 1) {
      return { mustBeGreaterThanZeroIfSelected: true };
    }
    return null;
  }
}
