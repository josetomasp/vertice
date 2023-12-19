import { createAction, props } from '@ngrx/store';

import { Range } from '@healthe/vertice-library';
import { TableColumnState } from '@shared';
import { AllActivityData } from '@shared/models/claim-activity-data';
import {
  SharedClaimHistoryExportParameters,
  SharedClaimHistoryFilters
} from '@shared/store/models/sharedClaimHistory.models';

export const setPrescriptionHistoryDateRange = createAction(
  '[Shared - Prescription History Tab] Set Date Range',
  props<{ range: Range }>()
);

export const loadPrescriptionHistory = createAction(
  '[Shared - Prescription History Tab] Load Data',
  props<{ range: Range }>()
);

export const loadPrescriptionHistorySuccess = createAction(
  '[Shared - Prescription History Tab] Load Data Success',
  props<{ data: AllActivityData[] }>()
);

export const loadPrescriptionHistoryFail = createAction(
  '[Shared - Prescription History Tab] Load Data Fail'
);

export const exportPrescriptionHistory = createAction(
  '[Shared - Prescription History Tab] Export Prescription History',
  props<{ exportParams: SharedClaimHistoryExportParameters }>()
);

export const clearPrescriptionHistory = createAction(
  '[Shared - Prescription History Tab] Clear the table data'
);

export const setPrescriptionHistoryTableColumnState = createAction(
  '[Shared - Prescription History Tab] Set Table Column State',
  props<{ tableColumnState: TableColumnState }>()
);

export const setPrescriptionHistoryTableColumns = createAction(
  '[Shared - Prescription History Tab] Set Table Columns',
  props<{ tableColumns: string[] }>()
);

export const setPrescriptionHistoryCurrentFilters = createAction(
  '[Shared - Prescription History Tab] Set Current Filters',
  props<{ currentTableFilters: SharedClaimHistoryFilters }>()
);
