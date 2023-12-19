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

const getPrescriptionHistoryState = createSelector(
  getSharedState,
  (state: SharedState): SharedClaimHistoryState => state.prescriptionHistory
);

export const getPrescriptionHistoryIsLoading = createSelector(
  getPrescriptionHistoryState,
  (state: SharedClaimHistoryState): boolean => state.isLoading
);

export const getPrescriptionHistoryDateRange = createSelector(
  getPrescriptionHistoryState,
  (state: SharedClaimHistoryState): Range => state.dateRange
);

export const getPrescriptionHistory = createSelector(
  getPrescriptionHistoryState,
  (state: SharedClaimHistoryState): AllActivityData[] => state.activityData
);

export const getPrescriptionHistoryAllFilters = createSelector(
  getPrescriptionHistoryState,
  (state: SharedClaimHistoryState): SharedClaimHistoryFilters =>
    state.allFilters
);

export const getPrescriptionHistoryCurrentFilters = createSelector(
  getPrescriptionHistoryState,
  (state: SharedClaimHistoryState): SharedClaimHistoryFilters =>
    state.currentFilters
);

export const getPrescriptionHistoryTableSort = createSelector(
  getPrescriptionHistoryState,
  (state: SharedClaimHistoryState): MatSortable => state.tableSort
);

export const getPrescriptionHistoryTableColumnState = createSelector(
  getPrescriptionHistoryState,
  (state: SharedClaimHistoryState): TableColumnState => state.tableColumnState
);

export const getPrescriptionHistoryTableColumns = createSelector(
  getPrescriptionHistoryState,
  (state: SharedClaimHistoryState): string[] => state.tableColumns
);
