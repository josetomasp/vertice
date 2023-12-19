import { createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import { getAllSharedHistoryFilters } from '@shared/lib/formatters/sharedHistoryFilters';

import {
  SHARED_CLAIM_HISTORY_INITIAL_STATE,
  SharedClaimHistoryState
} from '../models/sharedClaimHistory.models';
import {
  clearPrescriptionHistory,
  loadPrescriptionHistory,
  loadPrescriptionHistoryFail,
  loadPrescriptionHistorySuccess,
  setPrescriptionHistoryCurrentFilters,
  setPrescriptionHistoryDateRange,
  setPrescriptionHistoryTableColumns,
  setPrescriptionHistoryTableColumnState
} from '@shared/store/actions/prescriptionHistory.actions';

export const prescriptionHistoryReducer = createReducer(
  SHARED_CLAIM_HISTORY_INITIAL_STATE,
  on(
    setPrescriptionHistoryDateRange,
    (state: SharedClaimHistoryState, { range }) => {
      const cloneState: SharedClaimHistoryState = cloneDeep(state);
      cloneState.dateRange = range;
      return cloneState;
    }
  ),
  on(
    setPrescriptionHistoryTableColumnState,
    (state: SharedClaimHistoryState, { tableColumnState }) => {
      const cloneState: SharedClaimHistoryState = cloneDeep(state);
      cloneState.tableColumnState = tableColumnState;
      return cloneState;
    }
  ),
  on(
    setPrescriptionHistoryTableColumns,
    (state: SharedClaimHistoryState, { tableColumns }) => {
      const cloneState: SharedClaimHistoryState = cloneDeep(state);
      cloneState.tableColumns = tableColumns;
      return cloneState;
    }
  ),
  on(loadPrescriptionHistory, (state: SharedClaimHistoryState, { range }) => {
    const cloneState: SharedClaimHistoryState = cloneDeep(state);
    cloneState.isLoading = true;
    return cloneState;
  }),
  on(
    loadPrescriptionHistorySuccess,
    (state: SharedClaimHistoryState, { data }) => {
      const cloneState: SharedClaimHistoryState = cloneDeep(state);
      const allFilters = getAllSharedHistoryFilters(data);

      cloneState.isLoading = false;
      cloneState.activityData = data;
      cloneState.allFilters = allFilters;
      cloneState.currentFilters = allFilters;
      return cloneState;
    }
  ),
  on(loadPrescriptionHistoryFail, (state: SharedClaimHistoryState) => {
    const cloneState: SharedClaimHistoryState = cloneDeep(state);
    const allFilters = getAllSharedHistoryFilters([]);

    cloneState.isLoading = false;
    cloneState.activityData = [];
    cloneState.allFilters = allFilters;
    cloneState.currentFilters = allFilters;
    return cloneState;
  }),
  on(clearPrescriptionHistory, (state: SharedClaimHistoryState) => {
    const cloneState: SharedClaimHistoryState = cloneDeep(state);
    const allFilters = getAllSharedHistoryFilters([]);

    cloneState.isLoading = false;
    cloneState.activityData = [];
    cloneState.allFilters = allFilters;
    cloneState.currentFilters = allFilters;
    return cloneState;
  }),
  on(
    setPrescriptionHistoryCurrentFilters,
    (state: SharedClaimHistoryState, { currentTableFilters }) => {
      const cloneState: SharedClaimHistoryState = cloneDeep(state);
      cloneState.currentFilters = currentTableFilters;
      return cloneState;
    }
  )
);
