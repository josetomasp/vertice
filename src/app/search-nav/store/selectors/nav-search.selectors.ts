import { createFeatureSelector, createSelector } from '@ngrx/store';
import { find } from 'lodash';
import { Preference } from 'src/app/preferences/store/models/preferences.models';
import { getAllPreferences } from 'src/app/preferences/store/selectors/user-preferences.selectors';
import { UserInfo } from 'src/app/user/store/models/user.models';
import { getUserInfo } from 'src/app/user/store/selectors/user.selectors';
import {
  NavigationSearchState,
  NavSearchAssignedAdjustersState,
  NavSearchState,
  navSearchStateKey
} from '../reducers/nav-search.reducers';

export const navSearchFeature = createFeatureSelector(navSearchStateKey);

export const getNavSearchState = createSelector(
  navSearchFeature,
  (state: NavSearchState) => state
);

export const getUserInfoPreferencesConfig = createSelector(
  getUserInfo,
  getAllPreferences,
  (userInfo: UserInfo, state: Preference<any>[], query) => {
    return {
      userInfo,
      preferences: find(state, query)
    };
  }
);

export const getSearchOptions = createSelector(
  getNavSearchState,
  (state: NavSearchState) => {
    return state.searchOptions;
  }
);

const getAssignedAdjusterState = createSelector(
  getNavSearchState,
  (state: NavSearchState) => {
    return state.assignedAdjustersState;
  }
);

export const getAssignedAdjusters = createSelector(
  getAssignedAdjusterState,
  (state: NavSearchAssignedAdjustersState) => {
    return state.assignedAdjusters;
  }
);

export const getNeedToLoadAssignedAdjusters = createSelector(
  getAssignedAdjusterState,
  (state: NavSearchAssignedAdjustersState) => {
    return !(state.isLoading || state.isLoadedSuccessfully);
  }
);

export const getSearchVendorsOptions = createSelector(
  getNavSearchState,
  (state: NavSearchState) => {
    return state.searchOptions && state.searchOptions.vendorsByCustomer
      ? state.searchOptions.vendorsByCustomer
      : [];
  }
);

export const getSearchABMServicesOptions = createSelector(
  getNavSearchState,
  (state: NavSearchState) => {
    return state.searchOptions && state.searchOptions.abmServiceTypesByCustomer
      ? state.searchOptions.abmServiceTypesByCustomer
      : [];
  }
);

export const getSearchReferralStatusQueuesOptions = createSelector(
  getNavSearchState,
  (state: NavSearchState) => {
    return state.searchOptions &&
      state.searchOptions.referralStatusQueuesByCustomer
      ? state.searchOptions.referralStatusQueuesByCustomer
      : [];
  }
);

export const getSearchStateOfVenueOptions = createSelector(
  getNavSearchState,
  (state: NavSearchState) => {
    return state.searchOptions && state.searchOptions.statesOfVenue
      ? state.searchOptions.statesOfVenue
      : { values: [], valuesByScreen: [] };
  }
);

export const getAdjusterOptions = createSelector(
  getNavSearchState,
  (state: NavSearchState) => {
    return state.searchOptions &&
      state.searchOptions.referralAdjustersByCustomer
      ? state.searchOptions.referralAdjustersByCustomer
      : [];
  }
);

export const getSearchOptionsIsLoading = createSelector(
  getNavSearchState,
  (state: NavSearchState) => state.searchOptions.isOptionsLoading
);

export const getNavigationSearchStateByName = createSelector(
  getNavSearchState,
  (
    state: NavSearchState,
    properties: { searchFormName: string }
  ): NavigationSearchState =>
    state.navigationSearchesStates[properties.searchFormName]
);

export const getSearchResultIsLoadingByName = createSelector(
  getNavSearchState,
  (state: NavSearchState, properties: { searchFormName: string }) =>
    state.navigationSearchesStates[properties.searchFormName]
      ? state.navigationSearchesStates[properties.searchFormName]
          .isResultLoading
      : true
);
