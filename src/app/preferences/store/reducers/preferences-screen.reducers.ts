import { mergeClone } from '@shared/lib/store/mergeClone';
import * as PreferencesScreenActions from '../actions/preferences-screen.actions';
import {
  preferencesInitialState,
  PreferencesViewState
} from '../models/preferences.models';

export function viewReducer(
  state: PreferencesViewState,
  action: PreferencesScreenActions.Action
) {
  switch (action.type) {
    case PreferencesScreenActions.ActionTypes.UPDATE_COLUMN_VIEWS_BY_TAB:
      return mergeClone(state, {
        claimViewColumnViews: {
          ...state.claimViewColumnViews,
          // @ts-ignore
          [action.payload.tab]: action.payload.columnView
        }
      });
    case PreferencesScreenActions.ActionTypes.SET_CLAIM_LIST_SELECTED_TAB:
      return mergeClone(state, {
        claimTableListSettingsSelectedTab: action.payload
      });
    case PreferencesScreenActions.ActionTypes
      .UPDATE_GENERAL_PREFERENCES_EXPANDED:
      return mergeClone(state, { generalSettingsExpanded: action.payload });
    case PreferencesScreenActions.ActionTypes
      .UPDATE_CLAIM_VIEW_BANNER_PREFERENCES_EXPANDED:
      return mergeClone(state, {
        claimViewBannerSettingsExpanded: action.payload
      });
    case PreferencesScreenActions.ActionTypes.UPDATE_CLAIM_VIEW_LISTS_EXPANDED:
      return mergeClone(state, { claimViewListsExpanded: action.payload });
    case PreferencesScreenActions.ActionTypes.UPDATE_GENERAL_PREFERENCES_DIRTY:
      return mergeClone(state, { generalSettingsDirty: action.payload });
    case PreferencesScreenActions.ActionTypes
      .UPDATE_CLAIM_VIEW_BANNER_PREFERENCES_DIRTY:
      return mergeClone(state, {
        claimViewBannerSettingsDirty: action.payload
      });
    case PreferencesScreenActions.ActionTypes.UPDATE_CLAIM_VIEW_LISTS_DIRTY:
      return mergeClone(state, { claimViewListsDirty: action.payload });

    case PreferencesScreenActions.ActionTypes
      .RESET_PREFS_VIEW_STATE_TO_PRISTINE:
      return mergeClone(state, {
        generalSettingsDirty: false,
        claimViewBannerSettingsDirty: false,
        claimViewListsDirty: preferencesInitialState.view.claimViewListsDirty
      });
    default:
      return state;
  }
}
