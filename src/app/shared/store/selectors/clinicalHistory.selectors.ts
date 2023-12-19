import { createSelector } from '@ngrx/store';
import { getSharedState } from '@shared/store/selectors/shared.selectors';
import { SharedState } from '@shared/store/models';
import {
  SharedClaimHistoryFilters,
  SharedClaimHistoryState
} from '@shared/store/models/sharedClaimHistory.models';
import { Range } from '@healthe/vertice-library';
import { TableColumnState } from '@shared/models/table-column-state';
import { AllActivityData } from '@shared/models/claim-activity-data';
import { MatSortable } from '@angular/material/sort';

const getClinicalHistoryState = createSelector(
  getSharedState,
  (state: SharedState): SharedClaimHistoryState => state.clincalHistory
);

export const getClinicalHistoryIsLoading = createSelector(
  getClinicalHistoryState,
  (state: SharedClaimHistoryState): boolean => state.isLoading
);

export const getClinicalHistoryDateRange = createSelector(
  getClinicalHistoryState,
  (state: SharedClaimHistoryState): Range => state.dateRange
);

export const getClinicalHistory = createSelector(
  getClinicalHistoryState,
  (state: SharedClaimHistoryState): AllActivityData[] => state.activityData
);

export const getClinicalHistoryAllFilters = createSelector(
  getClinicalHistoryState,
  (state: SharedClaimHistoryState): SharedClaimHistoryFilters =>
    state.allFilters
);

export const getClinicalHistoryCurrentFilters = createSelector(
  getClinicalHistoryState,
  (state: SharedClaimHistoryState): SharedClaimHistoryFilters =>
    state.currentFilters
);

export const getClinicalHistoryTableSort = createSelector(
  getClinicalHistoryState,
  (state: SharedClaimHistoryState): MatSortable => state.tableSort
);

export const getClinicalHistoryTableColumnState = createSelector(
  getClinicalHistoryState,
  (state: SharedClaimHistoryState): TableColumnState => state.tableColumnState
);

export const getClinicalHistoryTableColumns = createSelector(
  getClinicalHistoryState,
  (state: SharedClaimHistoryState): string[] => state.tableColumns
);
