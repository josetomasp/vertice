import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

import * as _moment from 'moment';

const moment = _moment;

export function dateOfInjuryMaxDaysValidator(
  dateOfInjury: AbstractControl
): ValidationErrors | null {
  if (null == dateOfInjury.parent) {
    return null;
  }

  const parent: FormGroup = dateOfInjury.parent as FormGroup;

  const dateOfInjuryMaxDays = parent.get('dateOfInjuryMaxDays');
  const callerAllowDateOfInjuryOverride = parent.get(
    'callerAllowDateOfInjuryOverride'
  );

  if (null == dateOfInjuryMaxDays || null == callerAllowDateOfInjuryOverride) {
    return null;
  }

  if (!!dateOfInjury.value && !callerAllowDateOfInjuryOverride.value) {
    if (
      moment()
        .startOf('day')
        .diff(moment(dateOfInjury.value), 'days') > dateOfInjuryMaxDays.value
    ) {
      return { dateOfInjuryDays: true };
    }
  }

  return null;
}

export function employerForbiddenStateValidator(
  employerState: AbstractControl
): ValidationErrors | null {
  if (null == employerState.parent) {
    return null;
  }

  const parent: FormGroup = employerState.parent as FormGroup;

  const forbiddenStates = parent.get('forbiddenStates');

  if (
    null == employerState.value ||
    null == forbiddenStates ||
    null == forbiddenStates.value
  ) {
    return null;
  }

  const forbiddenStatesList = forbiddenStates.value as string[];
  if (forbiddenStatesList.indexOf(employerState.value) > -1) {
    return { forbiddenStates: true };
  }

  return null;
}

export function addFirstFillSsnValidator(
  ssn: AbstractControl
): ValidationErrors | null {
  if (null == ssn.parent) {
    return null;
  }

  const parent: FormGroup = ssn.parent as FormGroup;

  const unableToEnter15DigitIdCheckBox = parent.get('unableToEnter15DigitId');

  if (null == unableToEnter15DigitIdCheckBox) {
    return null;
  }
  let snnValueLength = 0;
  if (null != ssn.value) {
    snnValueLength = ssn.value.toString().length;
  }

  if (true === unableToEnter15DigitIdCheckBox.value) {
    if (snnValueLength !== 9) {
      return { ssnMemberId: true };
    } else {
      return null;
    }
  } else {
    if (snnValueLength !== 0 && snnValueLength !== 9) {
      return { zeroOrNine: true };
    }
  }

  return null;
}
