import { createAction, props } from '@ngrx/store';
import { ReferralSubmitMessage } from '../models/make-a-referral.models';

export const loadLanguageDraft = createAction(
  '[Make A Referral Draft] Load Language Draft',
  props<{ referralId: string }>()
);
export const loadLanguageDraftSuccessful = createAction(
  '[Make A Referral Draft] Load Language Draft Success',
  props<ReferralSubmitMessage>()
);
export const loadLanguageDraftFail = createAction(
  '[Make A Referral Draft] Load Language Draft Fail',
  props<{ errors: string[] }>()
);

export const loadPhysicalMedicineDraft = createAction(
  '[Make A Referral Draft] Load PhysicalMedicine Draft',
  props<{ referralId: string }>()
);
export const loadPhysicalMedicineDraftSuccessful = createAction(
  '[Make A Referral Draft] Load PhysicalMedicine Draft Success',
  props<ReferralSubmitMessage>()
);
export const loadPhysicalMedicineDraftFail = createAction(
  '[Make A Referral Draft] Load PhysicalMedicine Draft Fail',
  props<{ errors: string[] }>()
);

export const loadDiagnosticsDraft = createAction(
  '[Make A Referral Draft] Load Diagnostics Draft',
  props<{ referralId: string }>()
);
export const loadDiagnosticsDraftSuccessful = createAction(
  '[Make A Referral Draft] Load Diagnostics Draft Success',
  props<ReferralSubmitMessage>()
);
export const loadDiagnosticsDraftFail = createAction(
  '[Make A Referral Draft] Load Diagnostics Draft Fail',
  props<{ errors: string[] }>()
);

export const loadHomeHealthDraft = createAction(
  '[Make A Referral Draft] Load HomeHealth Draft',
  props<{ referralId: string }>()
);
export const loadHomeHealthDraftSuccessful = createAction(
  '[Make A Referral Draft] Load HomeHealth Draft Success',
  props<ReferralSubmitMessage>()
);
export const loadHomeHealthDraftFail = createAction(
  '[Make A Referral Draft] Load HomeHealth Draft Fail',
  props<{ errors: string[] }>()
);

export const loadDMEDraft = createAction(
  '[Make A Referral Draft] Load DME Draft',
  props<{ referralId: string }>()
);
export const loadDMEDraftSuccessful = createAction(
  '[Make A Referral Draft] Load DME Draft Success',
  props<ReferralSubmitMessage>()
);
export const loadDMEDraftFail = createAction(
  '[Make A Referral Draft] Load DME Draft Fail',
  props<{ errors: string[] }>()
);

export const loadTRPDraft = createAction(
  '[Make A Referral Draft] Load TRP Draft',
  props<{ referralId: string }>()
);
export const loadTRPDraftSuccessful = createAction(
  '[Make A Referral Draft] Load TRP Draft Success',
  props<ReferralSubmitMessage>()
);
export const loadTRPDraftFail = createAction(
  '[Make A Referral Draft] Load TRP Draft Fail',
  props<{ errors: string[] }>()
);

export const clearLoadedFromDraftFlag = createAction(
  '[Make A Referral Draft] Clear Loaded From Draft Flag'
);
