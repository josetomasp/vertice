import { createAction, props } from '@ngrx/store';
import {
  AuthorizationFusionSubmitMessage,
  AuthorizationReasons,
  DocumentsFusionFormState,
  FusionAuthorization,
  FusionAuthorizationCancelSubmit,
  FusionAuthorizationResponse,
  FusionAuthorizationSubmitResponse,
  FusionPMExtensionSubmitMessage,
  NoteList
} from '../../models/fusion/fusion-authorizations.models';
import { ReferralAuthorizationArchetype } from '../../../referralId/referral-authorization/referral-authorization.models';

export const loadFusionLanguageAuthorizations = createAction(
  '[Referral :: Fusion] Load Language Referral Authorizations',
  props<{
    encodedReferralId: string;
    encodedClaimNumber: string;
    encodedCustomerId: string;
  }>()
);

export const loadFusionLanguageReferralAuthorizationsSuccess = createAction(
  '[Referral :: Fusion] Load Language Referral Authorizations Success',
  props<FusionAuthorizationResponse>()
);

export const loadFusionLanguageReferralAuthorizationsFail = createAction(
  '[Referral :: Fusion] Load Language Referral Authorizations Fail',
  props<{ errors: string[] }>()
);

export const loadFusionDiagnosticsAuthorizations = createAction(
  '[Referral :: Fusion] Load Diagnostics Referral Authorizations',
  props<{
    encodedReferralId: string;
    encodedClaimNumber: string;
    encodedCustomerId: string;
  }>()
);

export const loadFusionDiagnosticsReferralAuthorizationsSuccess = createAction(
  '[Referral :: Fusion] Load Diagnostics Referral Authorizations Success',
  props<FusionAuthorizationResponse>()
);

export const loadFusionDiagnosticsReferralAuthorizationsFail = createAction(
  '[Referral :: Fusion] Load Diagnostics Referral Authorizations Fail',
  props<{ errors: string[] }>()
);

// Physical Medicine
export const loadFusionPhysicalMedicineAuthorizations = createAction(
  '[Referral :: Fusion] Load Physical Medicine Referral Authorizations',
  props<{
    encodedReferralId: string;
    encodedClaimNumber: string;
    encodedCustomerId: string;
  }>()
);

export const loadFusionPhysicalMedicineReferralAuthorizationsSuccess = createAction(
  '[Referral :: Fusion] Load Physical Medicine Referral Authorizations Success',
  props<FusionAuthorizationResponse>()
);

export const loadFusionPhysicalMedicineReferralAuthorizationsFail = createAction(
  '[Referral :: Fusion] Load Physical Medicine Referral Authorizations Fail',
  props<{ errors: string[] }>()
);

export const loadFusionHomeHealthAuthorizations = createAction(
  '[Referral :: Fusion] Load Home Health Referral Authorizations',
  props<{
    encodedReferralId: string;
    encodedClaimNumber: string;
    encodedCustomerId: string;
  }>()
);

export const loadFusionHomeHealthReferralAuthorizationsSuccess = createAction(
  '[Referral :: Fusion] Load Home Health Referral Authorizations Success',
  props<FusionAuthorizationResponse>()
);

export const loadFusionHomeHealthReferralAuthorizationsFail = createAction(
  '[Referral :: Fusion] Load Home Health Referral Authorizations Fail',
  props<{ errors: string[] }>()
);

// DME
export const loadFusionDmeAuthorizations = createAction(
  '[Referral :: Fusion] Load DME Referral Authorizations',
  props<{
    encodedReferralId: string;
    encodedClaimNumber: string;
    encodedCustomerId: string;
  }>()
);

export const loadFusionDmeReferralAuthorizationsSuccess = createAction(
  '[Referral :: Fusion] Load DME Referral Authorizations Success',
  props<FusionAuthorizationResponse>()
);

export const loadFusionDmeReferralAuthorizationsFail = createAction(
  '[Referral :: Fusion] Load DME Referral Authorizations Fail',
  props<{ errors: string[] }>()
);

// Documents
export const loadFusionReferralDocuments = createAction(
  '[Referral :: Fusion] Load Referral Documents',
  props<{ customerCode: string; referralId: string }>()
);

export const loadFusionReferralDocumentsSuccess = createAction(
  '[Referral :: Fusion] Load Referral Documents Success',
  props<DocumentsFusionFormState>()
);

export const loadFusionReferralDocumentsFail = createAction(
  '[Referral :: Fusion] Load Referral Documents Fail',
  props<{ errors: string[] }>()
);

// Auth Reasons
export const loadFusionAuthReasons = createAction(
  '[Referral :: Fusion] Load Auth Reasons',
  props<{ encodedCustomerId: string }>()
);

export const loadFusionAuthReasonsSuccess = createAction(
  '[Referral :: Fusion] Load Auth Reasons Success',
  props<{ reasons: AuthorizationReasons }>()
);

export const loadFusionAuthReasonsFail = createAction(
  '[Referral :: Fusion] Load Auth Reasons Fail',
  props<{ errors: string[] }>()
);

export const updateFusionAuthorizationState = createAction(
  '[[Referral :: Fusion] Update Fusion Referral Auth State Data',
  props<{
    authorization: FusionAuthorization;
  }>()
);

export const restoreFusionAuthorizationState = createAction(
  '[[Referral :: Fusion] Restore Fusion Referral Auth State Data'
);

export const submitFusionAuthorizations = createAction(
  '[Referral :: Fusion ] Submit Authorizations',
  props<{ submitMessage: AuthorizationFusionSubmitMessage }>()
);

export const submitFusionAuthorizationSuccess = createAction(
  '[Referral :: Fusion] Submit Authorization Call Success',
  props<{
    successResponseFusion: FusionAuthorizationSubmitResponse;
  }>()
);
export const submitFusionAuthorizationFail = createAction(
  '[Referral :: Fusion] Submit Authorization Fail',
  props<{ status?: number; errorResponse: string[] }>()
);

export const updateFusionAuthHeaderNotes = createAction(
  '[Referral :: Fusion] Update Auth Header Notes',
  props<{ notes: NoteList[] }>()
);

export const updateFusionAuthHeaderPendExpirationDate = createAction(
  '[Referral :: Fusion] Update Auth Header Pend Expiration Date',
  props<{ expirationDate: string }>()
);

export const lockFusionAuthorization = createAction(
  '[Referral :: Fusion] Lock Authorization',
  props<{ encodedReferralId: string }>()
);
export const lockFusionAuthorizationSuccess = createAction(
  '[Referral :: Fusion] Lock Authorization Success',
  props<{ isLocked: boolean }>()
);
export const lockFusionAuthorizationFail = createAction(
  '[Referral :: Fusion] Lock Authorization Fail',
  props<{ errors: string[] }>()
);

export const unlockFusionAuthorization = createAction(
  '[Referral :: Fusion] Unlock Authorization',
  props<{ encodedReferralId: string }>()
);
export const unlockFusionAuthorizationSuccess = createAction(
  '[Referral :: Fusion] Unlock Authorization Success',
  props<{ isLocked: boolean }>()
);
export const unlockFusionAuthorizationFail = createAction(
  '[Referral :: Fusion] Unlock Authorization Fail',
  props<{ isLocked: boolean }>()
);

// Physical Medicine Extensions
export const submitFusionPMExtension = createAction(
  '[Referral :: Fusion ] Submit PM Extension',
  props<{ submitMessage: FusionPMExtensionSubmitMessage }>()
);
export const submitFusionPMExtensionSuccess = createAction(
  '[Referral :: Fusion] Submit PM Extension Call Success',
  props<{
    successResponseFusion: boolean;
  }>()
);
export const submitFusionPMExtensionFail = createAction(
  '[Referral :: Fusion] Submit PM Extension Fail',
  props<{ errorResponse: string[] }>()
);

// Authorization Cancellation
export const submitFusionAuthCancellation = createAction(
  '[Referral :: Fusion ] Submit Authorization Cancelation',
  props<{
    submitMessage: FusionAuthorizationCancelSubmit;
    submitParameters: {
      encodedCustomerId: string;
      encodedClaimNumber: string;
      archeType: ReferralAuthorizationArchetype;
    };
  }>()
);
export const submitFusionAuthCancellationSuccessAndRefetch = createAction(
  '[Referral :: Fusion] Submit Authorization Cancellation Call Success',
  props<{
    submitMessage: FusionAuthorizationCancelSubmit;
    submitParameters: {
      encodedCustomerId: string;
      encodedClaimNumber: string;
      archeType: ReferralAuthorizationArchetype;
    };
  }>()
);
export const submitFusionAuthCancellationFail = createAction(
  '[Referral :: Fusion] Submit Authorization Cancellation Fail'
);

export const resetFusionAuthorizationState = createAction(
  '[Referral :: Fusion] Reset Fusion Authorization State'
);
