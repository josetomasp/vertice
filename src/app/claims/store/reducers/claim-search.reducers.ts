import { mergeClone } from '@shared/lib/store/mergeClone';
import * as _ from 'lodash';
import * as fromClaimsSearch from '../actions/claim-search.actions';
import { ClaimSearchState } from '@shared/store/models';

export const INITIAL_STATE: ClaimSearchState = {
  /**
   * These are the claims search form defaults
   */
  assignedAdjuster: '',
  claimNumber: '',
  claimantFirstName: '',
  claimantLastName: '',
  dateOfInjury: null,
  riskCategory: 'All',
  riskLevel: 'All',
  stateOfVenue: 'All',

  claimsSearchOptions: {
    assignedAdjuster: [],
    riskCategory: [],
    riskLevel: [],
    stateOfVenue: []
  },
  claimsSearchResults: [],
  totalNumberOfClaimsFound: null,
  errors: [],
  filterSummary: '',
  isLoading: false
};

export function reducer(
  state: ClaimSearchState = INITIAL_STATE,
  action: fromClaimsSearch.Action
) {
  switch (action.type) {
    case fromClaimsSearch.ActionType.CLAIM_SEARCH_REQUEST:
      return mergeClone(state, { isLoading: true });
    case fromClaimsSearch.ActionType.CLAIM_SEARCH_OPTIONS_SUCCESS:
      return mergeClone(state, { claimsSearchOptions: action.payload });
    case fromClaimsSearch.ActionType.UPDATE_CLAIM_SEARCH_FORM:
      return mergeClone(state, action.payload);
    case fromClaimsSearch.ActionType.UPDATE_FILTER_SUMMARY:
      return mergeClone(state, { ...state, filterSummary: action.payload });
    case fromClaimsSearch.ActionType.CLAIM_SEARCH_SUCCESS:
      return mergeClone(state, {
        isLoading: false,
        claimsSearchResults: [...action.payload.claims],
        totalNumberOfClaimsFound: action.payload.totalNumberOfClaimsFound
      });

    case fromClaimsSearch.ActionType.CLAIM_SEARCH_FAIL:
      return mergeClone(state, {
        errors: [...state.errors, action.payload],
        claimsSearchResults: [],
        isLoading: false
      });

    case fromClaimsSearch.ActionType.CLAIM_SEARCH_OPTIONS_FAIL:
    case fromClaimsSearch.ActionType.CLAIM_SEARCH_EXPORT_FAIL:
      return mergeClone(state, {
        errors: [...state.errors, action.payload],
        isLoading: false
      });
  }

  return _.cloneDeep(state);
}
