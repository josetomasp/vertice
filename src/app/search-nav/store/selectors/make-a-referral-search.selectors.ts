import { createSelector } from '@ngrx/store';
import { find } from 'lodash';
import { Preference } from 'src/app/preferences/store/models/preferences.models';
import { getAllPreferences } from 'src/app/preferences/store/selectors/user-preferences.selectors';
import { UserInfo } from 'src/app/user/store/models/user.models';
import { getUserInfo } from 'src/app/user/store/selectors/user.selectors';
import { MakeAReferralSearchState } from '../models/make-a-referral-search.models';
import { getReferralState } from '../../../claims/abm/referral/store/selectors';
import { ReferralState } from '../../../claims/abm/referral/store/models/referral.models';

// TODO: Move make a referral state to search nav state rather than referral state
export const getMakeAReferralSearchState = createSelector(
  getReferralState,
  (state: ReferralState) => state.makeAReferralSearch
);

export const getClaimResults = createSelector(
  getMakeAReferralSearchState,
  (state: MakeAReferralSearchState) => state.claimResult
);

export const getLoading = createSelector(
  getMakeAReferralSearchState,
  (state: MakeAReferralSearchState) => state.loading
);

export const getSavedForm = createSelector(
  getMakeAReferralSearchState,
  (state: MakeAReferralSearchState) => state.searchForm
);

export const getServerErrors = createSelector(
  getMakeAReferralSearchState,
  (state: MakeAReferralSearchState): Array<string> => state.serverErrors
);

export const getUserInfoPreferencesConfig = createSelector(
  getUserInfo,
  getAllPreferences,
  (userInfo: UserInfo, state: Preference<any>[], query) => {
    return {
      userInfo: userInfo,
      preferences: find(state, query)
    };
  }
);
