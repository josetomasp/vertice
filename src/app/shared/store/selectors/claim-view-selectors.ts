import { createSelector } from '@ngrx/store';
import { ClaimViewRoot } from '../../../claim-view/store/models/claim-view.models';
import { ClaimSearchClaim } from '@shared/store/models';
import { getSharedState } from '@shared/store/selectors/shared.selectors';

export const getClaimViewRootState = createSelector(
  getSharedState,
  (state) => state.claimSearchState
);
/**
 * Base Claim View selectors
 */
export const getClaimViewSearchResults = createSelector(
  getClaimViewRootState,
  (state: ClaimViewRoot): Array<ClaimSearchClaim> => state.claimsSearchResults
);
