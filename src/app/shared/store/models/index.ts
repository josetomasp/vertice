import {
  ClaimState,
  claimV2InitialState,
  ClaimV3
} from '@shared/store/models/claim.models';
import {
  TRENDING_RISK_MODAL_INITIAL_STATE,
  TrendingRiskModalState
} from './trending-risk-modal.models';
import {
  SHARED_CLAIM_HISTORY_INITIAL_STATE,
  SharedClaimHistoryState
} from '@shared/store/models/sharedClaimHistory.models';
import { ClaimSearchState } from '@shared/store/models/claim-search-models';

export * from './trending-risk-modal.models';
export * from './claim-search-models';

export interface SharedState {
  claimSearchState: ClaimSearchState;
  trendingRiskModalState: TrendingRiskModalState;
  claim: ClaimState;
  prescriptionHistory: SharedClaimHistoryState;
  clincalHistory: SharedClaimHistoryState;
}

export const initialClaimState: ClaimState = {
  v3: claimV2InitialState as ClaimV3,
  loadingV3: true,
  loadingV3Banner: true,
  claimBannerFields: [],
  errors: []
};

export const initialSharedState: SharedState = {
  claimSearchState: {
    claimsSearchOptions: null,
    errors: [],
    claimsSearchResults: [],
    totalNumberOfClaimsFound: 0,
    filterSummary: '',
    isLoading: false
  },
  trendingRiskModalState: TRENDING_RISK_MODAL_INITIAL_STATE,
  claim: initialClaimState,
  prescriptionHistory: SHARED_CLAIM_HISTORY_INITIAL_STATE,
  clincalHistory: SHARED_CLAIM_HISTORY_INITIAL_STATE
};
