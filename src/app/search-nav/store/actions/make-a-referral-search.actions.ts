import { FormGroup } from '@angular/forms';
import { createAction, props } from '@ngrx/store';
import { ClaimResult } from '../../../claims/abm/referral/store/models/claimResult.model';

//#region   Claims
export const loadClaimResults = createAction(
  '[Make a Referral Search] Load Claim Results',
  props<{ searchValues: any }>()
);

export const loadClaimResultsSuccess = createAction(
  '[Make a Referral Search] Load Claim Results Success',
  props<{ claims: ClaimResult[] }>()
);

export const loadClaimResultsFail = createAction(
  '[Make a Referral Search] Load Claim Results Request Fail',
  props<{ serverErrors: string[] }>()
);

export const clearClaimResults = createAction(
  '[Make a Referral Search] Clear Claim Results'
);

//#endregion
export const saveSearchForm = createAction(
  '[Make a Referral Search] Save Search Form',
  props<{ form: FormGroup }>()
);
