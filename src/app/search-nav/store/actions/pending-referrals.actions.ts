import { createAction, props } from '@ngrx/store';
import { NavReferral } from '../models/nav-referral.model';

export const loadPendingReferrals = createAction(
  '[Search Nav - Pending] Load Pending Referrals',
  props<{ searchValues: any }>()
);

export const loadPendingReferralsSuccess = createAction(
  '[Search Nav - Pending] Load Pending Referrals Success',
  props<{ referrals: NavReferral[] }>()
);

export const loadPendingReferralsFail = createAction(
  '[Search Nav - Pending] Load Pending Referrals Request Fail',
  props<{ errors: string[] }>()
);

export const savePendingSearchForm = createAction(
  '[Search Nav - Pending] Save Search Form',
  props<{ form: any }>()
);
