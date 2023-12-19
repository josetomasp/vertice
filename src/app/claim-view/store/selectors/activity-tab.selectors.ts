import { MatSortable } from '@angular/material/sort';
import { Range } from '@healthe/vertice-library';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TableColumnState } from '@shared';
import {
  AllActivityData,
  FilterPredicates,
  PendingActivityData,
  PendingActivityTotals,
  TableTabType
} from '../models/activity-tab.models';
import { ClaimViewState } from '../models/claim-view.models';

/**
 * This 'createFeatureSelector' functions breaks the RootState into ClaimViewState
 * the key name 'claimview' is set up in the claim-view.module.ts
 */
const getClaimViewState = createFeatureSelector<ClaimViewState>('claimview');
/**
 * Activity Specific Tab Selectors
 */
export const getActivityTab = createSelector(
  getClaimViewState,
  (state: ClaimViewState): TableTabType => state.activityTab.activityTab
);
export const getAllActivityData = createSelector(
  getClaimViewState,
  (state: ClaimViewState): Array<AllActivityData> =>
    state.activityTab.allActivityData
);
export const getPendingActivityData = createSelector(
  getClaimViewState,
  (state: ClaimViewState): Array<PendingActivityData> =>
    state.activityTab.pendingActivityData
);
export const getDateRange = createSelector(
  getClaimViewState,
  (state: ClaimViewState): Range => state.activityTab.dateRange
);
export const getColumnViewState = createSelector(
  getClaimViewState,
  (state: ClaimViewState): TableColumnState => state.activityTab.columnView
);
export const getColumnSort = createSelector(
  getClaimViewState,
  (state: ClaimViewState): MatSortable => state.activityTab.columnSort
);
export const getFilterPredicates = createSelector(
  getClaimViewState,
  (state: ClaimViewState): FilterPredicates =>
    state.activityTab.filterPredicates
);
export const isActivityTabInitialized = createSelector(
  getClaimViewState,
  (state: ClaimViewState): boolean => state.activityTab.initialized
);
export const isActivityTabLoading = createSelector(
  getClaimViewState,
  (state: ClaimViewState): boolean => state.activityTab.isAllActivityLoading
);
export const isPendingLoading = createSelector(
  getClaimViewState,
  (state: ClaimViewState) => state.activityTab.isPendingActivityLoading
);
export const getServerErrors = createSelector(
  getClaimViewState,
  (state: ClaimViewState): Array<string> => state.activityTab.serverErrors
);
export const getPendingTotals = createSelector(
  getClaimViewState,
  (state: ClaimViewState): PendingActivityTotals =>
    state.activityTab.pendingActivityTotals
);
export const getPagers = createSelector(
  getClaimViewState,
  (state: ClaimViewState) => state.activityTab.pagers
);
