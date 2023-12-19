import {
  AuthorizationDetails,
  AuthorizationInformationState
} from '../models/pbm-authorization-information.model';
import { getPbmAuthorizationState } from './pbm-authorization.selectors';
import { PBMAuthorizationState } from '../models/pbm-authorization.models';
import { createSelector } from '@ngrx/store';
import { PbmAuthorizationNote } from '../models/pbm-authorization-information/pbm-authorization-note.models';

export const getPbmAuthorizationRootState = createSelector(
  getPbmAuthorizationState,
  (state: { pbmAuthorizationRootState: PBMAuthorizationState }) =>
    state.pbmAuthorizationRootState
);

export const getAuthorizationInformationState = createSelector(
  getPbmAuthorizationRootState,
  (state: PBMAuthorizationState) => state.pbmAuthorizationInformationState
);

export const getAuthorizationDetails = createSelector(
  getAuthorizationInformationState,
  (state: AuthorizationInformationState) => state.authorizationDetails
);

export const getAuthorizationDetailsNotes = createSelector(
  getAuthorizationDetails,
  (state: AuthorizationDetails) =>
    null == state ? [] : (state.authorizationNotes as PbmAuthorizationNote[])
);

export const getAuthorizationHealtheHeaderBar = createSelector(
  getAuthorizationInformationState,
  (state: AuthorizationInformationState) =>
    state.authorizationDetails.healtheHeaderBar
);

export const getAuthorizationLockBannerIndicator = createSelector(
  getAuthorizationInformationState,
  (state: AuthorizationInformationState) =>
    state.authorizationDetails.authorizationLockIndicatorBanner
);

export const getAuthorizationDetailsHeaderWithCallerInformation =
  createSelector(
    getAuthorizationInformationState,
    (state: AuthorizationInformationState) => {
      return {
        ...state.authorizationDetails.authorizationDetailsHeader,
        callerName:
          state.authorizationDetails.pharmacyInformationForm.callerName,
        callerNumber:
          state.authorizationDetails.pharmacyInformationForm.callerNumber
      };
    }
  );

export const getPaperAuthorizationReassignResponse = createSelector(
  getAuthorizationInformationState,
  (state: AuthorizationInformationState) => state.paperReassignResponse
);

export const getPharmacyInformationForm = createSelector(
  getAuthorizationDetails,
  (state: AuthorizationDetails) => state.pharmacyInformationForm
);

export const getAuthorizationDetailsClaimNumber = createSelector(
  getAuthorizationDetails,
  (state: AuthorizationDetails) => state.currentClaimNum
);

export const getAuthorizationDetailsHeader = createSelector(
  getAuthorizationDetails,
  (state) => state.authorizationDetailsHeader
);

export const getLOMNWizardState = createSelector(
  getPbmAuthorizationRootState,
  (state: PBMAuthorizationState) => state.pbmLOMNWizardState
);

export const getAuthorizationLineItems = createSelector(
  getAuthorizationDetails,
  (state) => state.authorizationLineItems
);

export const getAuthorizationId = createSelector(
  getAuthorizationDetails,
  (state) => state.authorizationId
);

export const getAuthorizationActionLabel = createSelector(
  getAuthorizationDetails,
  (state) => state.authorizationActionLabel
);

export const getAuthorizationDenialReasons = createSelector(
  getAuthorizationDetails,
  (state) => state.authorizationDenialReasons
);

export const getShowSecondDenialReason = createSelector(
  getAuthorizationDetails,
  (state) => state.showSecondDenialReason
);
export const getShowDenialReasons = createSelector(
  getAuthorizationDetails,
  (state) => state.showDenialReasons
);

export const getAuthorizationLineItemNote = (lineItemIndex: number) =>
  createSelector(
    getAuthorizationDetails,
    (state) => state.authorizationLineItems[lineItemIndex].notes
  );
export const getAuthorizationLineItemDatePickerPresets = (
  lineItemIndex: number
) =>
  createSelector(
    getAuthorizationDetails,
    (state) => state.authorizationLineItems[lineItemIndex].datePickerPresets
  );

export const isAuthorizationInformationIsLoading = createSelector(
  getAuthorizationInformationState,
  (state: AuthorizationInformationState) => state.isLoading
);

export const isAuthorizationIsLoading = createSelector(
  getPbmAuthorizationRootState,
  (state) => state.isLoading
);

export const isSubmitSamaritanDose = createSelector(
  getAuthorizationInformationState,
  (state: AuthorizationInformationState) => state.isSubmitingSamDose
);

export const getAuthorizationReassignedIndicator = createSelector(
  getAuthorizationInformationState,
  (state: AuthorizationInformationState) =>
    state.authorizationDetails.authorizationReassignedIndicator
);

// Search Claim for Reassignment
export const isRxAuthorizationClaimSearching = createSelector(
  getPbmAuthorizationRootState,
  (state: PBMAuthorizationState) =>
    state.pbmAuthClaimReassignmentState.isSearching
);

export const getRxAuthorizationClaimSearchResult = createSelector(
  getPbmAuthorizationRootState,
  (state: PBMAuthorizationState) =>
    state.pbmAuthClaimReassignmentState.searchResponse
);

// Submit
export const isRxAuthorizationSubmitting = createSelector(
  getAuthorizationInformationState,
  (state) => state.submittingRxAuthorization
);

export const getRxAuthorizationSubmitResponse = createSelector(
  getAuthorizationInformationState,
  (state) => {
    return {
      response: state.rxAuthorizationSubmitResponse,
      isLastDecisionSave: state.isLastDecisionSave
    };
  }
);

export const getRxAuthorizationErrorState = createSelector(
  getAuthorizationInformationState,
  (state) => state.rxAuthorizationErrorState
);

export const isAuthorizationSaving = createSelector(
  getAuthorizationInformationState,
  (state) => state.savingAuthorization
);

export const getAuthorizationSaveResponse = createSelector(
  getAuthorizationInformationState,
  (state) => state.authorizationSavingResponse
);

export const submitSamaritanDoseResponse = createSelector(
  getAuthorizationInformationState,
  (state) => state.lineActionResponse
);

export const submitByPassPriorAuthLoadResponse = createSelector(
  getAuthorizationInformationState,
  (state) => state.isSubmitingByPassPriorAuthSuccess
);

export const getIsReconsideration = createSelector(
  getAuthorizationInformationState,
  (state) => state.authorizationDetails.isReconsideration
);

export const getReviewerAlerts = createSelector(
  getAuthorizationInformationState,
  (state) => state.authorizationDetails.reviewerAlerts
);
export const getShowLAThresholdMessage = createSelector(
  getAuthorizationInformationState,
  (state) => state.authorizationDetails.showLAThresholdMessage
);

export const isPaperAuthorizationPreparing = createSelector(
  getAuthorizationInformationState,
  (state) => state.preparingPaperAuthorization
);

export const getPaperAuthorizationPrepareResponse = createSelector(
  getAuthorizationInformationState,
  (state) => state.paperAuthorizationPrepareResponse
);

export const getLockAuthorizationStatus = createSelector(
  getAuthorizationInformationState,
  (state) => state.authorizationDetails.authorizationLockIndicatorBanner.locked
);
