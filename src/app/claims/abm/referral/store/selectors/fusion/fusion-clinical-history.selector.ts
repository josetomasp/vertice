import { createSelector } from '@ngrx/store';
import { getReferralIdState } from '../referral-id.selectors';

export const getFusionClinicalHistoryState = createSelector(
  getReferralIdState,
  (state) => state.fusionClinicalHistory
);

export const getFusionClinicalHistory = createSelector(
  getFusionClinicalHistoryState,
  (state) => state.clinicalHistory
);
export const isFusionClinicalHistoryLoading = createSelector(
  getFusionClinicalHistoryState,
  (state) => state.isLoading
);

export const getFusionClinicalHistoryErrors = createSelector(
  getFusionClinicalHistoryState,
  (state) => state.errors
);
