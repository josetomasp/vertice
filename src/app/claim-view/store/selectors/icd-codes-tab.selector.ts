import { createSelector } from '@ngrx/store';
import { ClaimViewState } from '../models/claim-view.models';
import { IcdCodeSet, IcdCodesTabState } from '../models/icd-codes.models';
import { getClaimViewState } from './claim-view.selectors';

export const getIcdCodesState = createSelector(
  getClaimViewState,
  (state: ClaimViewState): IcdCodesTabState => state.icdCodeTab
);

export const getIsIcdCodesLoading = createSelector(
  getIcdCodesState,
  (state: IcdCodesTabState): boolean => state.isLoading
);

export const didIcdTabFetchFromServer = createSelector(
  getIcdCodesState,
  (state: IcdCodesTabState): boolean => state.didFetchFromServer
);

export const getIcdCodeSet = createSelector(
  getIcdCodesState,
  (state: IcdCodesTabState): IcdCodeSet => state.icdCodeSet
);
