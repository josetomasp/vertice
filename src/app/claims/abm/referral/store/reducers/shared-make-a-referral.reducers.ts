import { createReducer, on } from '@ngrx/store';

import {
  uploadFusionDocument,
  uploadFusionDocumentFail,
  uploadFusionDocumentSuccess
} from '../actions/fusion/fusion-make-a-referral.actions';
import {
  uploadTransportationDocument,
  uploadTransportationDocumentFail,
  uploadTransportationDocumentSuccess
} from '../actions/make-a-referral.actions';
import {
  partialFail, resetSharedMakeAReferral,
  resetSharedMakeAReferralErrors,
  resetUploadDocumentsMeta,
  submitReferralFail,
  submitReferrals,
  submitReferralsDone,
  submitReferralSuccess
} from '../actions/shared-make-a-referral.actions';
import {
  sharedMakeReferralInitialState,
  SharedMakeReferralState
} from '../models/shared-make-a-referral.models';

export const sharedMakeAReferralReducer = createReducer(
  sharedMakeReferralInitialState,
  on(submitReferrals, (state: SharedMakeReferralState) => {
    const clone = { ...state };
    clone.submittingReferrals = true;
    return clone;
  }),
  on(submitReferralsDone, (state: SharedMakeReferralState) => {
    const clone = { ...state };
    clone.submittingReferrals = false;
    return clone;
  }),
  on(uploadFusionDocument, uploadTransportationDocument, (state) => {
    const clone = { ...state };
    clone.totalDocuments += 1;
    return clone;
  }),
  on(
    uploadFusionDocumentSuccess,
    uploadFusionDocumentFail,
    uploadTransportationDocumentSuccess,
    uploadTransportationDocumentFail,
    (state) => {
      const clone = { ...state };
      clone.uploadedDocuments += 1;
      return clone;
    }
  ),
  on(resetUploadDocumentsMeta, (state) => {
    const clone = { ...state };
    clone.uploadedDocuments = 0;
    clone.totalDocuments = 0;
    return clone;
  }),

  // Submit
  on(
    submitReferralSuccess,
    (state, { errorResponse, showSuccessBanner, successfulServices }) => {
      return {
        ...state,
        errors: errorResponse ? [...errorResponse] : null,
        showSuccessBanner: showSuccessBanner,
        successfulServices: [...state.successfulServices, ...successfulServices]
      };
    }
  ),

  on(submitReferralFail, (state, { errorResponse }) => {
    return {
      ...state,
      errors: [...errorResponse]
    };
  }),

  // Submit
  on(resetSharedMakeAReferralErrors, (state) => {
    return {
      ...state,
      errors: [],
      partialFail: false
    };
  }),

  on(resetSharedMakeAReferral, (state) => {
    return {...sharedMakeReferralInitialState};
  }),

  on(partialFail, (state) => {
    return {
      ...state,
      partialFail: true
    };
  })
);
