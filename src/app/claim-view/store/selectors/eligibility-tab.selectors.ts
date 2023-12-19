import { createSelector } from '@ngrx/store';
import { getClaimViewState } from './claim-view.selectors';

export const getEligibilityTabState = createSelector(
  getClaimViewState,
  (state) => state.eligibilityTab
);
export const getClaimDates = createSelector(
  getEligibilityTabState,
  (state) => state.claimDates
);
export const getClaimInfo = createSelector(
  getEligibilityTabState,
  (state) => state.claimInfo
);
export const getIdInfo = createSelector(
  getEligibilityTabState,
  (state) => state.idInfo
);
export const getPbmDates = createSelector(
  getEligibilityTabState,
  (state) => state.pbmDates
);
export const getAbmDates = createSelector(
  getEligibilityTabState,
  (state) => state.abmDates
);
