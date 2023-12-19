// View Specific selectors
import { createSelector } from '@ngrx/store';
import { TableTabType } from '../../../claim-view/store/models/activity-tab.models';
import {
  PreferencesViewState,
  RootPreferencesState
} from '../models/preferences.models';
import { getPreferencesRootState } from './root.selectors';

export const getClaimTableListSettingsSelectedTab = createSelector(
  getPreferencesRootState,
  (state: RootPreferencesState): TableTabType => {
    return state.view.claimTableListSettingsSelectedTab;
  }
);

export const getPreferencesScreenState = createSelector(
  getPreferencesRootState,
  (state: RootPreferencesState): PreferencesViewState => state.view
);

export const isGeneralSettingsExpanded = createSelector(
  getPreferencesRootState,
  (state: RootPreferencesState): boolean => state.view.generalSettingsExpanded
);
export const isClaimBannerSettingsExpanded = createSelector(
  getPreferencesRootState,
  (state: RootPreferencesState): boolean =>
    state.view.claimViewBannerSettingsExpanded
);
export const isClaimViewListsExpanded = createSelector(
  getPreferencesRootState,
  (state: RootPreferencesState): boolean => state.view.claimViewListsExpanded
);

export const isGeneralSettingsDirty = createSelector(
  getPreferencesRootState,
  (state: RootPreferencesState): boolean => state.view.generalSettingsDirty
);
export const isClaimBannerSettingsDirty = createSelector(
  getPreferencesRootState,
  (state: RootPreferencesState): boolean =>
    state.view.claimViewBannerSettingsDirty
);
export const isClaimViewListsDirty = createSelector(
  getPreferencesRootState,
  (state: RootPreferencesState): boolean => {
    const allDirt = state.view.claimViewListsDirty.all;
    const pharmacyDirt = state.view.claimViewListsDirty.pharmacy;
    const clinicalDirt = state.view.claimViewListsDirty.clinical;
    const ancillaryDirt = state.view.claimViewListsDirty.ancillary;
    const billingDirt = state.view.claimViewListsDirty.billing;
    return (
      allDirt || pharmacyDirt || clinicalDirt || ancillaryDirt || billingDirt
    );
  }
);
export const getClaimViewListsDirt = createSelector(
  getPreferencesRootState,
  (
    state: RootPreferencesState
  ): {
    all: boolean;
    pharmacy: boolean;
    clinical: boolean;
    ancillary: boolean;
    billing: boolean;
  } => state.view.claimViewListsDirty
);
