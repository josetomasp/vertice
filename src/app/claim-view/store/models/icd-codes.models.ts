export interface IcdCode {
  icdCode: string;
  icdVersion: string;
  icdCodeId?: number;
  icdDescription?: string;
  icdSpecificityCode?: string;
  activeFlag?: string;
  compensabilityDescription: string;
}

export interface IcdCodeSet {
  icds: IcdCode[];
  status?: string;
  messages?: string[];
}

export interface IcdCodesTabState {
  isLoading: boolean;
  icdCodeSet: IcdCodeSet;
  didFetchFromServer: boolean;
}

export const icdCodesTabInitalState: IcdCodesTabState = {
  isLoading: false,
  icdCodeSet: { icds: [] },
  didFetchFromServer: false
};
