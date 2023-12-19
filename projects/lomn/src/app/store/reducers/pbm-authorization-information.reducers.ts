import { createReducer, on } from '@ngrx/store';
import {
  loadPaperAuthInfo,
  loadPaperAuthInfoFail,
  loadPaperAuthInfoSuccess,
  loadRxAuthInfo,
  loadRxAuthInfoFail,
  loadRxAuthInfoSuccess,
  unlockRxAuthorizationSuccess,
  loadLOMNPaperAuthorizationDataFail,
  loadLOMNPaperAuthorizationData,
  loadLOMNPaperAuthorizationDataSuccess
} from '../actions/pbm-authorization-information.actions';
import { PBMAuthorizationState } from '../models/pbm-authorization.models';
import {
  resetCreateLOMNState,
  updateCreateLOMNForm,
  submitCreateLOMN,
  submitCreateLOMNSuccess,
  submitCreateLOMNFail,
  loadLetterTypesSuccess,
  loadExparteCopiesRequiredSuccess
} from '../actions/create-lomn.actions';
import { cloneDeep } from 'lodash';
import { LOMN_INITIAL_STATE } from '../models/lomn-initial-state';
import { PBM_AUTHORIZATION_INITIAL_STATE } from '../models/pbm-authorization-initial-state';

export const pbmAuthRootReducer = createReducer(
  PBM_AUTHORIZATION_INITIAL_STATE,
  on(
    loadRxAuthInfo,
    loadPaperAuthInfo,
    loadLOMNPaperAuthorizationData,
    (state) => ({
      ...state,
      isLoading: true
    })
  ),
  on(
    loadRxAuthInfoSuccess,
    loadPaperAuthInfoSuccess,
    loadLOMNPaperAuthorizationDataSuccess,
    (state, authorizationDetails) => ({
      ...state,
      pbmAuthorizationInformationState: {
        ...state.pbmAuthorizationInformationState,
        authorizationDetails
      }
    })
  ),
  on(
    loadRxAuthInfoFail,
    loadPaperAuthInfoFail,
    loadLOMNPaperAuthorizationDataFail,
    (state, errors) => {
      return {
        ...state,
        pbmAuthorizationInformationState: {
          ...state.pbmAuthorizationInformationState,
          rxAuthorizationErrorState: errors.errors
        }
      } as PBMAuthorizationState;
    }
  ),
  on(
    loadRxAuthInfoSuccess,
    loadRxAuthInfoFail,
    loadPaperAuthInfoSuccess,
    loadPaperAuthInfoFail,
    loadLOMNPaperAuthorizationDataSuccess,
    loadLOMNPaperAuthorizationDataFail,
    (state) => ({
      ...state,
      isLoading: false
    })
  ),
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
  on(loadLetterTypesSuccess, (state, { letterTypes }) => ({
    ...state,
    pbmLOMNWizardState: { ...state.pbmLOMNWizardState, letterTypes }
  })),
  on(updateCreateLOMNForm, (state, { formValues }) => {
    return {
      ...state,
      pbmLOMNWizardState: {
        ...state.pbmLOMNWizardState,
        wizardFormState: formValues
      }
    };
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
  on(
    unlockRxAuthorizationSuccess,
    (state: PBMAuthorizationState, { isLocked }) => {
      const clone = cloneDeep(state);
      clone.pbmAuthorizationInformationState.locked = isLocked;
      return clone;
    }
  ),
  // Reset Fusion RxAuthorization
  on(resetCreateLOMNState, (state) => {
    state = cloneDeep(state);
    state.pbmAuthorizationInformationState.formState = null;
    state.pbmAuthorizationInformationState.rxAuthorizationSubmitResponse = {
      successful: false
    };
    return state;
  }),
  on(loadExparteCopiesRequiredSuccess, (state, action) => ({
    ...state,
    pbmLOMNWizardState: {
      ...state.pbmLOMNWizardState,
      exparteCopiesRequired: action.exparteCopiesRequired,
      exparteWarningMessage: action.exparteWarningMessage
    }
  }))
);
