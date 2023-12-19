import { createAction, props } from '@ngrx/store';

import { Range } from '@healthe/vertice-library';
import { TableColumnState } from '@shared';
import { AllActivityData } from '@shared/models/claim-activity-data';
import {
  SharedClaimHistoryExportParameters,
  SharedClaimHistoryFilters
} from '@shared/store/models/sharedClaimHistory.models';

export const setClinicalHistoryDateRange = createAction(
  '[Shared - Clinical History Tab] Set Date Range',
  props<{ range: Range }>()
);

export const loadClinicalHistory = createAction(
  '[Shared - Clinical History Tab] Load Data',
  props<{ range: Range }>()
);

export const loadClinicalHistorySuccess = createAction(
  '[Shared - Clinical History Tab] Load Data Success',
  props<{ data: AllActivityData[] }>()
);

export const loadClinicalHistoryFail = createAction(
  '[Shared - Clinical History Tab] Load Data Fail'
);

export const clearClinicalHistory = createAction(
  '[Shared - Clinical History Tab] Clear the table data'
);

export const exportClinicalHistory = createAction(
  '[Shared - Clinical History Tab] Export Clinical History',
  props<{ exportParams: SharedClaimHistoryExportParameters }>()
);

export const setClinicalHistoryTableColumnState = createAction(
  '[Shared - Clinical History Tab] Set Table Column State',
  props<{ tableColumnState: TableColumnState }>()
);

export const setClinicalHistoryTableColumns = createAction(
  '[Shared - Clinical History Tab] Set Table Columns',
  props<{ tableColumns: string[] }>()
);

export const setClinicalHistoryCurrentFilters = createAction(
  '[Shared - Clinical History Tab] Set Current Filters',
  props<{ currentTableFilters: SharedClaimHistoryFilters }>()
);
