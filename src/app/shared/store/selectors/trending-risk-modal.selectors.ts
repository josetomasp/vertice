import { createSelector } from '@ngrx/store';
import { getSharedState } from '@shared/store/selectors/shared.selectors';
import { ClaimantInformation, SharedState } from '../models';

export const getRiskTrendingModalIsLoading = createSelector(
  getSharedState,
  (state: SharedState) => state.trendingRiskModalState.isLoading
);
export const getRiskTrendingDetails = createSelector(
  getSharedState,
  (state: SharedState) => state.trendingRiskModalState.riskDetails
);
export const getRiskTrendingClaimNumber = createSelector(
  getSharedState,
  (state: SharedState) => {
    return state.trendingRiskModalState.claimantInformation.claimNumber;
  }
);
export const getRiskTrendingGraphData = createSelector(
  getSharedState,
  (state: SharedState) => state.trendingRiskModalState.riskGraphData
);
export const getRiskTrendingClaimantInformation = createSelector(
  getSharedState,
  (state: SharedState): ClaimantInformation =>
    state.trendingRiskModalState.claimantInformation
);
