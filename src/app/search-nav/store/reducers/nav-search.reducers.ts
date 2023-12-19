import { FormGroup } from '@angular/forms';
import { combineReducers, createReducer, on } from '@ngrx/store';

import {
  navActivityReferralsInitialState,
  navActivityReferralsReducer
} from './activity-referrals.reducers';
import {
  navDraftReferralsInitialState,
  navDraftReferralsReducer
} from './draft-referrals.reducers';
import {
  navPendingReferralsInitialState,
  navPendingReferralsReducer
} from './pending-referrals.reducers';
import {
  EPAQ_AUTHORIZATION_SEARCH_NAME,
  SearchOptions,
  searchOptionsInitialState
} from '../models/search-options.model';
import * as NavSearchActions from '../actions/nav-search.actions';
import { HealtheSelectOption, mergeClone } from '@shared';
import { NavReferral } from '../models/nav-referral.model';

export const navSearchStateKey = 'navSearch';

export interface NavReferralBaseState {
  referrals: NavReferral[];
  searchForm: FormGroup;
  loading: boolean;
  errors: string[];
}
export interface NavSearchAssignedAdjustersState {
  assignedAdjusters: HealtheSelectOption<string>[];
  isLoading: boolean;
  isLoadedSuccessfully: boolean;
}

export const navSearchAssignedAdjustersInitialState: NavSearchAssignedAdjustersState =
  { assignedAdjusters: [], isLoadedSuccessfully: false, isLoading: false };

export interface NavSearchState {
  searchOptions: SearchOptions;
  assignedAdjustersState: NavSearchAssignedAdjustersState;
  draftReferrals: NavReferralBaseState;
  pendingReferrals: NavReferralBaseState;
  activityReferrals: NavReferralBaseState;
  navigationSearchesStates: {
    [key: string]: NavigationSearchState;
  };
}

export interface NavigationSearchState {
  searchInputs: { [key: string]: string };
  searchResults: NavigationSearchResults;
  isResultLoading: boolean;
  requestErrors: string[];
}

export interface NavigationSearchResults {
  resultRows: {}[];
  totalNumberOfResults: number;
  searchIsRecordCountLimited: boolean; // Used to determine if a search is actually limited and should use the red message in search-results-count.component.html
}

export const navSearchInitialState: NavSearchState = {
  searchOptions: searchOptionsInitialState,
  assignedAdjustersState: navSearchAssignedAdjustersInitialState,
  draftReferrals: navDraftReferralsInitialState,
  pendingReferrals: navPendingReferralsInitialState,
  activityReferrals: navActivityReferralsInitialState,
  navigationSearchesStates: {}
};

export const searchResultsInitialState: NavigationSearchResults = {
  resultRows: [],
  searchIsRecordCountLimited: false,
  totalNumberOfResults: 0
};

export function navSearchReducer(state = navSearchInitialState, action) {
  state = navSearchRootReducer(state, action);
  return combineReducers({
    searchOptions: searchOptionsReducer,
    assignedAdjustersState: NavSearchAssignedAdjustersReducer,
    draftReferrals: navDraftReferralsReducer,
    pendingReferrals: navPendingReferralsReducer,
    activityReferrals: navActivityReferralsReducer,
    navigationSearchesStates: (anotherNameForTheSameState) =>
      anotherNameForTheSameState
  })(state, action);
}

const NavSearchAssignedAdjustersReducer = createReducer(
  navSearchAssignedAdjustersInitialState,
  on(
    NavSearchActions.loadAssignedAdjustersRequest,
    (state: NavSearchAssignedAdjustersState) => {
      return mergeClone(state, {
        isLoading: true
      });
    }
  ),
  on(
    NavSearchActions.loadAssignedAdjustersSuccess,
    (state: NavSearchAssignedAdjustersState, { assignedAdjusters }) => {
      return {
        assignedAdjusters,
        isLoadedSuccessfully: true,
        isLoading: false
      };
    }
  ),
  on(
    NavSearchActions.loadAssignedAdjustersFail,
    (state: NavSearchAssignedAdjustersState, { errors }) => {
      return {
        assignedAdjusters: [],
        isLoadedSuccessfully: false,
        isLoading: false
      };
    }
  )
);

const navSearchRootReducer = createReducer(
  navSearchInitialState,
  on(
    NavSearchActions.initializeSearchState,
    (state: NavSearchState, { searchFormName }) => {
      return mergeClone(state, {
        navigationSearchesStates: {
          [searchFormName]: {
            searchResults: searchResultsInitialState,
            isResultLoading: false,
            requestErrors: []
          }
        }
      });
    }
  ),
  on(
    NavSearchActions.saveSearchFormValues,
    (state: NavSearchState, { searchFormName, searchFormValues }) => {
      return mergeClone(state, {
        navigationSearchesStates: {
          [searchFormName]: {
            ...state.navigationSearchesStates[searchFormName],
            searchInputs: searchFormValues
          }
        }
      });
    }
  ),
  on(
    NavSearchActions.executeNavigationSearchRequest,
    (state: NavSearchState, { searchFormName, searchFormValues }) => {
      return mergeClone(state, {
        navigationSearchesStates: {
          [searchFormName]: {
            searchResults: searchResultsInitialState,
            isResultLoading: true,
            requestErrors: []
          }
        }
      });
    }
  ),
  on(
    NavSearchActions.executeNavigationSearchSuccess,
    (state: NavSearchState, { searchFormName, searchResults }) => {
      return mergeClone(state, {
        navigationSearchesStates: {
          [searchFormName]: {
            searchResults: searchResults.responseBody,
            requestErrors: [],
            isResultLoading: false
          } as NavigationSearchState
        }
      });
    }
  ),
  on(
    NavSearchActions.executeNavigationSearchFail,
    (state: NavSearchState, { searchFormName, errors }) => {
      return mergeClone(state, {
        navigationSearchesStates: {
          [searchFormName]: {
            searchResults: searchResultsInitialState,
            requestErrors: errors,
            isResultLoading: false
          }
        }
      });
    }
  )
);

const searchOptionsReducer = createReducer(
  searchOptionsInitialState,
  on(NavSearchActions.loadSearchOptionsRequest, (state: SearchOptions) => {
    return mergeClone(state, {
      isOptionsLoading: true,
      hasSearchOptionsAttemptedToLoadOnce: true
    });
  }),
  on(
    NavSearchActions.loadSearchOptionsSuccess,
    (state: SearchOptions, { searchOptions }) => {
      // Something is wrong with mergeClone, it's corrupting the data.
      return {
        ...searchOptions,
        isOptionsLoading: false
      };
    }
  ),
  on(
    NavSearchActions.loadSearchOptionsFail,
    (state: SearchOptions, { errors }) => {
      return mergeClone(state, {
        errors: errors,
        isOptionsLoading: false
      });
    }
  )
);
