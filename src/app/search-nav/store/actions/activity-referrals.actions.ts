import { FormGroup } from '@angular/forms';
import { createAction, props } from '@ngrx/store';
import { NavReferral } from '../models/nav-referral.model';

export const loadActivityReferrals = createAction(
  '[Search Nav - Referral Activity] Load Activity Referrals',
  props<{ searchValues: any }>()
);

export const loadActivityReferralsSuccess = createAction(
  '[Search Nav - Activity] Load Activity Referrals Success',
  props<{ referrals: NavReferral[] }>()
);

export const loadActivityReferralsFail = createAction(
  '[Search Nav - Activity] Load Activity Referrals Request Fail',
  props<{ errors: string[] }>()
);

export const saveActivitySearchForm = createAction(
  '[Search Nav - Activity] Save Search Form',
  props<{ form: FormGroup }>()
);
