import { TableTabType } from '../../../claim-view/store/models/activity-tab.models';

export const preferencePathIDMatcher = /(\/[A-z/]+)#([A-z]+):([A-z]+)=([A-z]+)/;

export enum PreferenceComponentType {
  Table = 'table',
  Paginator = 'paginator'
}

export enum PreferenceType {
  Expanded = 'expanded',
  PageSize = 'pageSize',
  Alphabetize = 'alphabetize',
  ColumnList = 'columnList'
}

export enum ComponentType {
  LeftNav = 'leftNav',
  Paginator = 'paginator',
  Banner = 'banner'
}

export interface Preference<T> {
  id: string | number;
  value: T;
  screenName: string;
  componentName: string;
  componentTypeName: string;
  componentGroupName: string;
  preferenceTypeName: PreferenceType;
  debugValue?: string;
}

export interface PreferenceQuery {
  screenName: string;
  componentName: string;
  componentGroupName: string;
  preferenceTypeName: string;
  componentTypeName: string;
  id?: number;
}

export const bannerListQuery: PreferenceQuery = {
  componentGroupName: 'global',
  componentName: 'globalClaimBanner',
  screenName: 'global',
  preferenceTypeName: 'columnList',
  componentTypeName: 'banner'
};
export const expandedPreferenceQuery: PreferenceQuery = {
  componentGroupName: 'global',
  componentName: null,
  componentTypeName: 'banner',
  screenName: 'global',
  preferenceTypeName: 'expanded'
};

export interface PreferencesViewState {
  generalSettingsExpanded: boolean;
  claimViewBannerSettingsExpanded: boolean;
  claimViewListsExpanded: boolean;
  claimTableListSettingsSelectedTab: TableTabType;
  generalSettingsDirty: boolean;
  claimViewBannerSettingsDirty: boolean;
  claimViewListsDirty: {
    billing: boolean;
    all: boolean;
    pharmacy: boolean;
    clinical: boolean;
    ancillary: boolean;
  };
  claimViewColumnViews: {
    billing: string;
    all: string;
    pharmacy: string;
    clinical: string;
    ancillary: string;
  };
}

export interface PreferencesState {
  preferences: Preference<any>[];
  isLoading: boolean;
  errors: string[];
}

export interface RootPreferencesState {
  view: PreferencesViewState;
  preferencesStore: PreferencesState;
}

export const preferencesInitialState: RootPreferencesState = {
  view: {
    generalSettingsExpanded: true,
    claimViewBannerSettingsExpanded: true,
    claimViewListsExpanded: true,
    generalSettingsDirty: false,
    claimTableListSettingsSelectedTab: 'all',
    claimViewBannerSettingsDirty: false,
    claimViewListsDirty: {
      all: false,
      pharmacy: false,
      clinical: false,
      ancillary: false,
      billing: false
    },
    claimViewColumnViews: {
      all: '',
      pharmacy: '',
      clinical: '',
      ancillary: '',
      billing: ''
    }
  },
  preferencesStore: {
    preferences: [],
    errors: [],
    isLoading: false
  }
};
