import { HealtheSelectOption } from '@shared';

export const ALL_AUTHORIZATION_SEARCH_NAME: string = 'Authorization Search';
export const EPAQ_AUTHORIZATION_SEARCH_NAME: string =
  'ePAQ Authorization Search';
export const PAPER_AUTHORIZATION_SEARCH_NAME: string =
  'Paper Bill Roster Authorization Search';
export const CLINICAL_AUTHORIZATION_SEARCH_NAME: string =
  'Clinical Services Authorization Search';
export const REFERRAL_AUTHORIZATION_SEARCH_NAME: string =
  'Referral Authorization Search';
export const MAIL_ORDER_AUTHORIZATION_SEARCH_NAME: string =
  'Mail Order Authorization Search';
export const CLAIM_RESOLUTION_AUTHORIZATION_SEARCH_NAME: string =
  'Claim Resolution Authorization Search';
export const POS_AUTHORIZATION_SEARCH_NAME: string = 'POS Authorization Search';

export const DRAFT_REFERRALS_SEARCH_NAME: string = 'Draft Referral Search';

export interface SelectValueList {
  valuesByScreen: { [screenName: string]: ScreenSelectValueList };
}

export interface ScreenSelectValueList {
  defaultValue: string;
  values: HealtheSelectOption<string>[];
}

export interface SearchOptions {
  assignedAdjustersAllAuthByCustomer: { [key: string]: SelectValueList };
  assignedAdjustersPOSAuthByCustomer: { [key: string]: SelectValueList };
  assignedAdjustersPaperBillByCustomer: { [key: string]: SelectValueList };
  assignedAdjustersClinicalByCustomer: { [key: string]: SelectValueList };
  assignedAdjustersMailOrderAuthByCustomer: { [key: string]: SelectValueList };
  customerIds: SelectValueList;
  statesOfVenue: SelectValueList;
  vendorsByCustomer: { [key: string]: SelectValueList };
  abmServiceTypesByCustomer: { [key: string]: SelectValueList };
  allServiceTypesByCustomer: { [key: string]: SelectValueList };
  epaqStatusQueuesByCustomer: { [key: string]: SelectValueList };
  paperBillStatusQueuesByCustomer: { [key: string]: SelectValueList };
  pbmReconsiderations: SelectValueList;
  pbmClinicalServiceTypes: SelectValueList;
  claimResolutionStatusQueuesByCustomer: { [key: string]: SelectValueList };
  clinicalServiceStatusQueuesByCustomer: { [key: string]: SelectValueList };
  referralStatusQueuesByCustomer: { [key: string]: SelectValueList };
  referralAdjustersByCustomer: { [key: string]: SelectValueList };
  isOptionsLoading: boolean;
  hasSearchOptionsAttemptedToLoadOnce: boolean;
  errors: string[];
}

export const selectValueListsInitialState: SelectValueList = {
  valuesByScreen: {}
};

export const searchOptionsInitialState: SearchOptions = {
  assignedAdjustersAllAuthByCustomer: {},
  assignedAdjustersPOSAuthByCustomer: {},
  assignedAdjustersMailOrderAuthByCustomer: {},
  assignedAdjustersPaperBillByCustomer: {},
  assignedAdjustersClinicalByCustomer: {},
  customerIds: selectValueListsInitialState,
  statesOfVenue: selectValueListsInitialState,
  vendorsByCustomer: {},
  abmServiceTypesByCustomer: {},
  allServiceTypesByCustomer: {},
  epaqStatusQueuesByCustomer: {},
  paperBillStatusQueuesByCustomer: {},
  pbmReconsiderations: selectValueListsInitialState,
  pbmClinicalServiceTypes: selectValueListsInitialState,
  claimResolutionStatusQueuesByCustomer: {},
  clinicalServiceStatusQueuesByCustomer: {},
  referralStatusQueuesByCustomer: {},
  referralAdjustersByCustomer: {},
  isOptionsLoading: true,
  hasSearchOptionsAttemptedToLoadOnce: false,
  errors: []
};
