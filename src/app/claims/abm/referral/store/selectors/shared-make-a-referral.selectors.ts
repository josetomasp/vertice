import { createSelector } from '@ngrx/store';

import { getReferralState } from './index';
import { ReferralState } from '../models/referral.models';
import { SharedMakeReferralState } from '../models/shared-make-a-referral.models';

const getSharedState = createSelector(
  getReferralState,
  (state: ReferralState) => state.sharedMakeReferral
);

export const isSubmittingReferrals = createSelector(
  getSharedState,
  (state: SharedMakeReferralState) => state.submittingReferrals
);

export const getDocumentUploadMeta = createSelector(
  getSharedState,
  ({ totalDocuments, uploadedDocuments }: SharedMakeReferralState) => ({
    totalDocuments,
    uploadedDocuments
  })
);

export const getSharedErrorsResponse = createSelector(
  getSharedState,
  ({ errors }: SharedMakeReferralState) => errors
);

export const getShowSuccessBanner = createSelector(
  getSharedState,
  ({ showSuccessBanner }: SharedMakeReferralState) => showSuccessBanner
);

export const getSuccessfulServices = createSelector(
  getSharedState,
  ({ successfulServices }: SharedMakeReferralState) => successfulServices
);

export const getPartialFail = createSelector(
  getSharedState,
  ({ partialFail }: SharedMakeReferralState) => partialFail
);
