import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as _moment from 'moment';
import { ActionOption } from '../store/models/action.option';

const moment = _moment;

export function notesOnDenyValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  // Parent will always be null when the form initializes
  if (control.parent == null) {
    return null;
  }

  const fgActions: AbstractControl = control.parent.get('actionsFormGroup');
  if (null == fgActions) {
    return null;
  }
  const fcAction: AbstractControl = fgActions.get('action');
  const fcNotes: AbstractControl = control.parent.get('notes');
  //const error = fcAction.value === AUTH_INFO_ACTION_TYPE_REEVALUATE && !fcNotes.value;

  //return error ? { required: true } : null;
  return null;
}

export function adjusterCallbackDateNullOrTodayOrLaterValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  // No value, empty strings, etc... are all OK
  if (!control.value) {
    return null;
  }

  const error = moment().startOf('day').isAfter(moment(control.value));

  if (error) {
    console.log('date validator error');
  }

  return error ? { dateIsBeforeToday: true } : null;
}

export function maxBilledAmountValidation(maxAmount: number) {
  return (ac: AbstractControl): ValidationErrors => {
    if (
      ac.value
    ) {
      let inputValue = ac.value;
      if (
        inputValue > maxAmount
      ) {
        return { maxAmountExceededWhenApprove: true };
      }
      return {};
    }
    return {};
  };
}

export function noPendActionToSubmitPaper(
  ac: AbstractControl
): ValidationErrors {
  if (ac.value && ac.value.equalsIgnoreCase(ActionOption.pend)) {
    return { noPendActionToSubmitPaper: true };
  }
  return {};
}
