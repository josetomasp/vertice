import { createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import {
  clearClinicalHistory,
  loadClinicalHistory,
  loadClinicalHistoryFail,
  loadClinicalHistorySuccess,
  setClinicalHistoryCurrentFilters,
  setClinicalHistoryDateRange,
  setClinicalHistoryTableColumns,
  setClinicalHistoryTableColumnState
} from '../actions/clinicalHistory.actions';
import {
  SHARED_CLAIM_HISTORY_INITIAL_STATE,
  SharedClaimHistoryState
} from '../models/sharedClaimHistory.models';

import { getAllSharedHistoryFilters } from '@shared/lib/formatters/sharedHistoryFilters';

export const clinicalHistoryReducer = createReducer(
  SHARED_CLAIM_HISTORY_INITIAL_STATE,
  on(
    setClinicalHistoryDateRange,
    (state: SharedClaimHistoryState, { range }) => {
      const cloneState: SharedClaimHistoryState = cloneDeep(state);
      cloneState.dateRange = range;
      return cloneState;
    }
  ),
  on(
    setClinicalHistoryTableColumnState,
    (state: SharedClaimHistoryState, { tableColumnState }) => {
      const cloneState: SharedClaimHistoryState = cloneDeep(state);
      cloneState.tableColumnState = tableColumnState;
      return cloneState;
    }
  ),
  on(
    setClinicalHistoryTableColumns,
    (state: SharedClaimHistoryState, { tableColumns }) => {
      const cloneState: SharedClaimHistoryState = cloneDeep(state);
      cloneState.tableColumns = tableColumns;
      return cloneState;
    }
  ),
  on(loadClinicalHistory, (state: SharedClaimHistoryState, { range }) => {
    const cloneState: SharedClaimHistoryState = cloneDeep(state);
    cloneState.isLoading = true;
    return cloneState;
  }),
  on(loadClinicalHistorySuccess, (state: SharedClaimHistoryState, { data }) => {
    const cloneState: SharedClaimHistoryState = cloneDeep(state);
    const allFilters = getAllSharedHistoryFilters(data);

    cloneState.isLoading = false;
    cloneState.activityData = data;
    cloneState.allFilters = allFilters;
    cloneState.currentFilters = allFilters;
    return cloneState;
  }),
  on(loadClinicalHistoryFail, (state: SharedClaimHistoryState) => {
    const cloneState: SharedClaimHistoryState = cloneDeep(state);
    const allFilters = getAllSharedHistoryFilters([]);

    cloneState.isLoading = false;
    cloneState.activityData = [];
    cloneState.allFilters = allFilters;
    cloneState.currentFilters = allFilters;
    return cloneState;
  }),
  on(clearClinicalHistory, (state: SharedClaimHistoryState) => {
    const cloneState: SharedClaimHistoryState = cloneDeep(state);
    const allFilters = getAllSharedHistoryFilters([]);

    cloneState.isLoading = false;
    cloneState.activityData = [];
    cloneState.allFilters = allFilters;
    cloneState.currentFilters = allFilters;
    return cloneState;
  }),
  on(
    setClinicalHistoryCurrentFilters,
    (state: SharedClaimHistoryState, { currentTableFilters }) => {
      const cloneState: SharedClaimHistoryState = cloneDeep(state);
      cloneState.currentFilters = currentTableFilters;
      return cloneState;
    }
  )
);
