import { createSelector } from '@ngrx/store';

import { getClaims } from './claims.selectors';
import {
  ClaimSearchOptions,
  ClaimSearchState,
  ClaimsState
} from '@shared/store/models';

export const getClaimSearch = createSelector(
  getClaims,
  (state: ClaimsState) => state.claimSearch
);

export const getClaimSearchOptions = createSelector(
  getClaimSearch,
  (state: ClaimSearchState): ClaimSearchOptions => {
    return state.claimsSearchOptions;
  }
);

export const getStateOfVenueOptions = createSelector(
  getClaimSearchOptions,
  (options: ClaimSearchOptions) => {
    return options.stateOfVenue;
  }
);

export const getRiskLevelOptions = createSelector(
  getClaimSearchOptions,
  (options: ClaimSearchOptions) => {
    return options.riskLevel;
  }
);

export const getRiskCategoryOptions = createSelector(
  getClaimSearchOptions,
  (options: ClaimSearchOptions) => {
    return options.riskCategory;
  }
);

export const getAssignedAdjusterOptions = createSelector(
  getClaimSearchOptions,
  (options: ClaimSearchOptions) => {
    return options.assignedAdjuster;
  }
);

export const getClaimSearchResults = createSelector(
  getClaimSearch,
  (state) => state.claimsSearchResults
);
/**
 * This is for getting the form inputs between screens.
 */
export const getClaimSearchFormState = createSelector(
  getClaimSearch,
  (state: ClaimSearchState) => {
    let {
      claimNumber,
      claimantLastName,
      claimantFirstName,
      assignedAdjuster,
      dateOfInjury,
      riskLevel,
      riskCategory,
      stateOfVenue
    } = state;
    return {
      claimNumber,
      claimantLastName,
      claimantFirstName,
      assignedAdjuster,
      dateOfInjury,
      riskLevel,
      riskCategory,
      stateOfVenue
    };
  }
);

export const getClaimSearchErrors = createSelector(
  getClaimSearch,
  (state) => state.errors
);

export const getFilterSummary = createSelector(
  getClaimSearch,
  (state) => state.filterSummary
);

export const getIsLoading = createSelector(
  getClaimSearch,
  (state) => state.isLoading
);
