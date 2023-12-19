import { FormGroup } from '@angular/forms';
import { createAction, props } from '@ngrx/store';
import { NavReferral } from '../models/nav-referral.model';

export const loadDraftReferrals = createAction(
  '[Search Nav - Draft] Load Draft Referrals',
  props<{ searchValues: any }>()
);

export const loadDraftReferralsSuccess = createAction(
  '[Search Nav - Draft] Load Draft Referrals Success',
  props<{ referrals: NavReferral[] }>()
);

export const loadDraftReferralsFail = createAction(
  '[Search Nav - Draft] Load Draft Referrals Request Fail',
  props<{ errors: string[] }>()
);

export const saveDraftSearchForm = createAction(
  '[Search Nav - Draft] Save Search Form',
  props<{ form: FormGroup }>()
);
