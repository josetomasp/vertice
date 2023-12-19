import { createSelector } from '@ngrx/store';

export const getClaimV3 = createSelector(
  (state: any) => state.shared,
  (state: any) => state.v3
);
export const isClaimV3Loading = createSelector(
  getClaimV3,
  (state) => state.loadingV3
);
