import { createSelector } from '@ngrx/store';
import { getActionableAuthorizations } from '../../../referralId/referral-authorization/fusion/lib/fusionReferralAuthorizationFilters';
import { ReferralState } from '../../models/referral.models';
import { getReferralState } from '../index';

export const getFusionAuthorizationState = createSelector(
  getReferralState,
  (state: ReferralState) => state.fusionAuthorization
);

export const getFusionWorkingAuthorizationState = createSelector(
  getReferralState,
  (state: ReferralState) => state.fusionAuthorization.workingAuthorizations
);

export const getFusionOriginalAuthorization = createSelector(
  getReferralState,
  (state: ReferralState) => state.fusionAuthorization.originalAuthorizations
);
export const isFusionAuthorizationLoaded = createSelector(
  getFusionWorkingAuthorizationState,
  (state) => state.authorizations && state.authorizations.length > 0
);

export const isFusionAuthorizationLoading = createSelector(
  getFusionAuthorizationState,
  (state) => state.isLoading
);

export const getFusionAuthorizations = createSelector(
  getFusionWorkingAuthorizationState,
  (state) => state.authorizations
);

export const getFusionActionableAuthorizations = createSelector(
  getFusionAuthorizations,
  (authorizations) => {
    return getActionableAuthorizations(authorizations);
  }
);

export const getFusionSubmittedAuthorizationState = createSelector(
  getFusionAuthorizationState,
  (state) =>
    getActionableAuthorizations(state.submitResponse.formValues.authorizations)
);

export const isFusionAuthorizationRush = createSelector(
  getFusionAuthorizationState,
  (state) => state.rush
);

export const getFusionAuthorizationNoteList = createSelector(
  getFusionOriginalAuthorization,
  (state) => state.noteList
);

export const getFusionSubmittedNoteList = createSelector(
  getFusionAuthorizationState,
  (state) => state.submitResponse.formValues.noteList
);

export const isFusionAuthorizationDocumentsLoading = createSelector(
  getFusionWorkingAuthorizationState,
  (state) => state.attachments.isLoading
);

export const getFusionAuthorizationDocuments = createSelector(
  getFusionWorkingAuthorizationState,
  (state) => state.attachments.list
);

export const getFusionAuthorizationReasons = createSelector(
  getFusionAuthorizationState,
  (state) => state.reasons
);

export const isSubmittingAuthorizations = createSelector(
  getFusionAuthorizationState,
  (state) => state.submittingAuthorizations
);

export const fusinAuthorizationSubmitError = createSelector(
  getFusionAuthorizationState,
  (state) => state.submitResponse.errors
);

export const fusinAuthorizationSubmitResponse = createSelector(
  getFusionAuthorizationState,
  (state) => state.submitResponse.successful
);

export const fusinAuthorizationSubmitResponseStatus = createSelector(
  getFusionAuthorizationState,
  (state) => state.submitResponse.status
);

export const isAuthorizationSubmitted = createSelector(
  getFusionAuthorizationState,
  (state) => state.submitResponse.successful
);

export const getClinicalAlerts = createSelector(
  getFusionAuthorizationState,
  (state) => {
    if (state.originalAuthorizations.clinicalAlerts) {
      return state.originalAuthorizations.clinicalAlerts;
    } else {
      return [];
    }
  }
);

export const isFusionAuthorizationLocked = createSelector(
  getFusionAuthorizationState,
  (state) => state.locked
);

export const getFusionAuthorizationDefaultHesReferralDetailId = createSelector(
  getFusionAuthorizationState,
  (state) => {
    if (
      state.originalAuthorizations &&
      state.originalAuthorizations.authorizations &&
      state.originalAuthorizations.authorizations.length > 0
    ) {
      return state.originalAuthorizations.authorizations[0]
        .authorizationUnderReview.hesReferralDetailId
        ? state.originalAuthorizations.authorizations[0].authorizationUnderReview.hesReferralDetailId.toString()
        : null;
    } else {
      return null;
    }
  }
);
