import { createReducer, on } from '@ngrx/store';
import {
  loadPaperAuthInfo,
  loadPaperAuthInfoFail,
  loadPaperAuthInfoSuccess,
  loadRxAuthInfo,
  loadRxAuthInfoFail,
  loadRxAuthInfoSuccess,
  postInternalNoteSuccess,
  resetRxAuthorizationState,
  saveDecision,
  saveDecisionFail,
  saveDecisionSuccess,
  savePaperAuthorization,
  savePaperAuthorizationFail,
  savePaperAuthorizationSuccess,
  saveRxAuthLineItemNoteSuccess,
  searchRxAuthClaimForReassignment,
  searchRxAuthClaimForReassignmentFail,
  searchRxAuthClaimForReassignmentSuccess,
  submitByPassPriorAuthLoad,
  submitByPassPriorAuthLoadFail,
  submitByPassPriorAuthLoadSuccess,
  submitPaperAuthorization,
  submitPriorAuthLoadFail,
  submitPriorAuthLoadSuccess,
  submitRxAuthClaimReassignment,
  submitRxAuthClaimReassignmentFail,
  submitRxAuthClaimReassignmentSuccess,
  submitRxAuthorization,
  submitRxAuthorizationFail,
  submitRxAuthorizationSuccess,
  submitSamaritanDose,
  submitSamaritanDoseFail,
  submitSamaritanDoseSuccess,
  unlockRxAuthorizationSuccess,
  submitPaperAuthClaimReassignmentSuccess,
  submitPaperAuthClaimReassignmentFail,
  submitPaperAuthClaimReassignment,
  preparePaperAuthorization,
  preparePaperAuthorizationFail,
  preparePaperAuthorizationSuccess,
  submitPaperAuthorizationFail,
  submitPaperAuthorizationSuccess,
  resetRxAuthorizationClaimSearchResult
} from '../actions/pbm-authorization-information.actions';
import { PBMAuthorizationState } from '../models/pbm-authorization.models';
import {
  loadExparteCopiesRequiredSuccess,
  loadLetterTypesSuccess,
  resetCreateLOMNState,
  submitCreateLOMN,
  submitCreateLOMNFail,
  submitCreateLOMNSuccess,
  updateCreateLOMNForm
} from '../actions/create-lomn.actions';
import { cloneDeep } from 'lodash';
import { LOMN_INITIAL_STATE } from '../models/lomn-initial-state';
import {
  PBM_AUTHORIZATION_INITIAL_STATE,
  LINE_ACTION_RESPONSE_INITIAL_STATE
} from '../models/pbm-authorization-initial-state';

export const pbmAuthRootReducer = createReducer(
  PBM_AUTHORIZATION_INITIAL_STATE,
  on(
    loadRxAuthInfo,
    loadPaperAuthInfo,
    submitRxAuthClaimReassignment,
    submitPaperAuthClaimReassignment,
    (state) => ({
      ...state,
      isLoading: true
    })
  ),
  on(
    loadRxAuthInfoSuccess,
    loadPaperAuthInfoSuccess,
    submitRxAuthClaimReassignmentSuccess,
    submitPriorAuthLoadSuccess,
    submitByPassPriorAuthLoadSuccess,
    (state, authorizationDetails) => ({
      ...state,
      pbmAuthorizationInformationState: {
        ...state.pbmAuthorizationInformationState,
        authorizationDetails
      },
      isLoading: false
    })
  ),
  on(resetRxAuthorizationState, (state) => PBM_AUTHORIZATION_INITIAL_STATE),
  on(loadRxAuthInfoFail, (state, errors) => {
    return {
      ...state,
      pbmAuthorizationInformationState: {
        ...state.pbmAuthorizationInformationState,
        rxAuthorizationErrorState: errors.errors
      },
      isLoading: false
    } as PBMAuthorizationState;
  }),
  on(submitSamaritanDose, (state) => {
    state = cloneDeep(state);
    state.pbmAuthorizationInformationState.lineActionResponse =
      LINE_ACTION_RESPONSE_INITIAL_STATE;
    state.pbmAuthorizationInformationState.isSubmitingSamDose = true;
    return state;
  }),
  on(submitByPassPriorAuthLoad, (state) => {
    state = cloneDeep(state);
    state.pbmAuthorizationInformationState.isSubmitingByPassPriorAuth = true;
    return state;
  }),
  on(submitSamaritanDoseFail, submitSamaritanDoseSuccess, (state, response) => {
    state = cloneDeep(state);
    state.pbmAuthorizationInformationState.lineActionResponse =
      response.response;
    return state;
  }),
  on(
    submitSamaritanDoseSuccess,
    submitSamaritanDoseFail,
    submitByPassPriorAuthLoadFail,
    submitByPassPriorAuthLoadSuccess,
    (state, response) => {
      state = cloneDeep(state);
      state.pbmAuthorizationInformationState.isSubmitingSamDose = false;
      state.pbmAuthorizationInformationState.isSubmitingByPassPriorAuth = false;
      return state;
    }
  ),
  on(submitByPassPriorAuthLoadSuccess, (state, response) => {
    state = cloneDeep(state);
    state.pbmAuthorizationInformationState.isSubmitingByPassPriorAuthSuccess =
      true;
    return state;
  }),
  on(submitByPassPriorAuthLoadFail, (state, response) => {
    state = cloneDeep(state);
    state.pbmAuthorizationInformationState.isSubmitingByPassPriorAuthSuccess =
      false;
    return state;
  }),

  on(
    loadRxAuthInfoSuccess,
    loadPaperAuthInfoSuccess,
    loadRxAuthInfoFail,
    loadPaperAuthInfoFail,
    submitRxAuthClaimReassignmentSuccess,
    submitRxAuthClaimReassignmentFail,
    submitPaperAuthClaimReassignmentSuccess,
    submitPaperAuthClaimReassignmentFail,
    (state) => ({
      ...state,
      isLoading: false
    })
  ),
  on(resetRxAuthorizationClaimSearchResult, (state) => {
    state = cloneDeep(state);
    state.pbmAuthClaimReassignmentState.searchResponse = [];
    return state;
  }),
  on(loadExparteCopiesRequiredSuccess, (state, action) => ({
    ...state,
    pbmLOMNWizardState: {
      ...state.pbmLOMNWizardState,
      exparteCopiesRequired: action.exparteCopiesRequired,
      exparteWarningMessage: action.exparteWarningMessage
    }
  })),
  on(loadLetterTypesSuccess, (state, { letterTypes }) => ({
    ...state,
    pbmLOMNWizardState: { ...state.pbmLOMNWizardState, letterTypes }
  })),
  // Reset Fusion Create LOMN wizard
  on(resetCreateLOMNState, (state) => {
    state = cloneDeep(state);
    state.pbmLOMNWizardState.wizardFormState = cloneDeep(
      LOMN_INITIAL_STATE.wizardFormState
    );
    state.pbmLOMNWizardState.wizardResponse = cloneDeep(
      LOMN_INITIAL_STATE.wizardResponse
    );
    return state;
  }),
  on(updateCreateLOMNForm, (state, { formValues }) => {
    state.pbmLOMNWizardState.wizardFormState = { ...formValues };
    return { ...state };
  }),
  on(submitCreateLOMN, (state) => {
    const clone = cloneDeep(state);
    clone.pbmLOMNWizardState.submittingCreateLOMN = true;
    return clone;
  }),
  on(submitCreateLOMNSuccess, (state, { successful }) => {
    const clone = cloneDeep(state);
    clone.pbmLOMNWizardState.wizardResponse.successful = successful;
    clone.pbmLOMNWizardState.submittingCreateLOMN = false;
    return clone;
  }),
  on(submitCreateLOMNFail, (state, { errorResponse }) => {
    state = cloneDeep(state);
    state.pbmLOMNWizardState.wizardResponse = {
      errors: errorResponse,
      successful: false
    };
    state.pbmLOMNWizardState.submittingCreateLOMN = false;
    return state;
  }),
  on(saveRxAuthLineItemNoteSuccess, (state, { notes, lineItemKey }) => {
    state = cloneDeep(state);
    state.pbmAuthorizationInformationState.authorizationDetails.authorizationLineItems
      .filter((li) => li.posLineItemKey === lineItemKey)
      .forEach((li) => (li.notes = notes));
    return state;
  }),
  on(postInternalNoteSuccess, (state, { notes }) => {
    state = cloneDeep(state);
    state.pbmAuthorizationInformationState.authorizationDetails.authorizationNotes =
      notes;
    return state;
  }),
  on(
    unlockRxAuthorizationSuccess,
    (state: PBMAuthorizationState, { isLocked }) => {
      const clone = cloneDeep(state);
      clone.pbmAuthorizationInformationState.authorizationDetails.authorizationLockIndicatorBanner.locked = isLocked;
      return clone;
    }
  ),
  on(submitRxAuthorization, saveDecision, (state) => {
    const clone = cloneDeep(state);
    clone.pbmAuthorizationInformationState.submittingRxAuthorization = true;
    return clone;
  }),
  on(
    submitRxAuthorizationSuccess,
    submitPaperAuthorizationSuccess,
    (state, { successResponse, isLastDecisionSave }) => {
      return {
        ...state,
        pbmAuthorizationInformationState: {
          ...state.pbmAuthorizationInformationState,
          rxAuthorizationSubmitResponse: successResponse,
          authorizationDetails: successResponse.response,
          isLastDecisionSave,
          submittingRxAuthorization: false
        }
      };
    }
  ),
  on(saveDecisionSuccess, (state, { successResponse, isLastDecisionSave }) => {
    const clone = {
      ...state,
      pbmAuthorizationInformationState: {
        ...state.pbmAuthorizationInformationState,
        rxAuthorizationSubmitResponse: successResponse,
        isLastDecisionSave: isLastDecisionSave,
        submittingRxAuthorization: false,
        authorizationDetails: {
          ...state.pbmAuthorizationInformationState.authorizationDetails,
          authorizationDetailsHeader: {
            ...state.pbmAuthorizationInformationState.authorizationDetails
              .authorizationDetailsHeader,
            status: successResponse.response.authorizationDetailsHeader.status
          }
        }
      }
    };
    return clone;
  }),
  on(
    submitRxAuthorizationFail,
    saveDecisionFail,
    submitPriorAuthLoadFail,
    submitByPassPriorAuthLoadFail,
    submitPaperAuthorizationFail,
    (state, { errorResponse }) => {
      state = cloneDeep(state);
      state.pbmAuthorizationInformationState.rxAuthorizationSubmitResponse = {
        errors: errorResponse,
        successful: false
      };
      state.pbmAuthorizationInformationState.submittingRxAuthorization = false;
      return state;
    }
  ),

  // Search Claim for Reassignment
  on(searchRxAuthClaimForReassignment, (state) => {
    state = cloneDeep(state);
    state.pbmAuthClaimReassignmentState.isSearching = true;
    state.pbmAuthClaimReassignmentState.searchResponse = [];
    return state;
  }),
  on(searchRxAuthClaimForReassignmentSuccess, (state, { searchResult }) => {
    state = cloneDeep(state);
    state.pbmAuthClaimReassignmentState.isSearching = false;
    state.pbmAuthClaimReassignmentState.searchResponse = searchResult.map(
      (obj) => ({ ...obj })
    );
    return state;
  }),
  on(searchRxAuthClaimForReassignmentFail, (state) => {
    state = cloneDeep(state);
    state.pbmAuthClaimReassignmentState.isSearching = false;
    return state;
  }),

  // Reset Fusion RxAuthorization
  on(resetCreateLOMNState, (state) => {
    state = cloneDeep(state);
    state.pbmAuthorizationInformationState.formState = null;
    state.pbmAuthorizationInformationState.rxAuthorizationSubmitResponse = {
      successful: false
    };
    return state;
  }),
  on(savePaperAuthorization, (state) => {
    const clone = cloneDeep(state);
    clone.pbmAuthorizationInformationState.savingAuthorization = true;
    return clone;
  }),
  on(savePaperAuthorizationSuccess, (state, { successResponse }) => {
    const clone = cloneDeep(state);
    clone.pbmAuthorizationInformationState.authorizationSavingResponse =
      successResponse;
    clone.pbmAuthorizationInformationState.savingAuthorization = false;
    return clone;
  }),
  on(savePaperAuthorizationFail, (state, { errorResponse }) => {
    state = cloneDeep(state);
    state.pbmAuthorizationInformationState.authorizationSavingResponse =
      errorResponse;
    state.pbmAuthorizationInformationState.savingAuthorization = false;
    return state;
  }),
  on(submitPaperAuthorization, (state) => {
    const clone = cloneDeep(state);
    clone.pbmAuthorizationInformationState.submittingRxAuthorization = true;
    return clone;
  }),
  on(preparePaperAuthorization, (state) => {
    const clone = cloneDeep(state);
    clone.pbmAuthorizationInformationState.preparingPaperAuthorization = true;
    return clone;
  }),
  on(preparePaperAuthorizationSuccess, (state, { successResponse }) => {
    const clone = cloneDeep(state);
    clone.pbmAuthorizationInformationState.paperAuthorizationPrepareResponse =
      successResponse;
    clone.pbmAuthorizationInformationState.preparingPaperAuthorization = false;
    return clone;
  }),
  on(preparePaperAuthorizationFail, (state, { errorResponse }) => {
    const clone = cloneDeep(state);
    clone.pbmAuthorizationInformationState.paperAuthorizationPrepareResponse =
      errorResponse;
    clone.pbmAuthorizationInformationState.preparingPaperAuthorization = false;
    return clone;
  }),
  on(
    submitPaperAuthClaimReassignmentSuccess,
    submitPaperAuthClaimReassignmentFail,
    (state, response) => ({
      ...state,
      pbmAuthorizationInformationState: {
        ...state.pbmAuthorizationInformationState,
        paperReassignResponse: response
      }
    })
  )
);
