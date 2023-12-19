import { createSelector } from '@ngrx/store';

import { getReferralState } from './index';
import {
  ReferralIdState,
  ReferralOverviewCardState
} from '../models/referral-id.models';
import { ReferralState } from '../models/referral.models';

export const getReferralIdState = createSelector(
  getReferralState,
  (state: ReferralState) => state.referralId
);

export const getReferralOverviewCardState = createSelector(
  getReferralIdState,
  (state: ReferralIdState) => state.referralOverviewCard
);

export const getDiagnosisCodesAndDescriptions = createSelector(
  getReferralOverviewCardState,
  (state) => state.diagnosisCodeAndDescription
);

export const getICDCodes = createSelector(
  getReferralOverviewCardState,
  (state) => state.icdCodes
);

export const getReferralType = createSelector(
  getReferralOverviewCardState,
  (state: ReferralOverviewCardState) => state.referralType
);

export const getReferralTypeAndStatus = createSelector(
  getReferralOverviewCardState,
  (state: ReferralOverviewCardState) => {
    return { referralType: state.referralType, status: state.status };
  }
);

export const isReferralOverviewLoading = createSelector(
  getReferralOverviewCardState,
  (state) => state.isLoading
);

export const getIcdModalIsSaving = createSelector(
  getReferralOverviewCardState,
  (state) => state.icdCodesModal.isSaving
);

export const getIcdModalIsSaveDisabled = createSelector(
  getReferralOverviewCardState,
  (state) => state.icdCodesModal.icdCodeSaveDisabled
);

export const getDisplayReferralLocationsLink = createSelector(
  getReferralOverviewCardState,
  (state) => state.displayReferralLocationsLink
);
