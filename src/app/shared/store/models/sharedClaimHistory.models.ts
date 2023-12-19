import { Range } from '@healthe/vertice-library';
import * as _moment from 'moment';
import { TableColumnState } from '@shared/models/table-column-state';
import { AllActivityData } from '@shared/models/claim-activity-data';
import { MatSortable } from '@angular/material/sort';

const moment = _moment;

export interface SharedClaimHistoryFiltersTriggerText {
  prescriberName: string;
  outcome: string;
  activityType: string;
  itemName: string;
}

export interface ExportColumn {
  columnTitle: string;
  columnPropertyName: string;
}

export class SharedClaimHistoryExportParameters {
  fromDate: string;
  toDate: string;
  exportType: string;
  columns: ExportColumn[];
  claimNumber: string;
  customerId: string;
  prescriberName: string[];
  outcome: string[];
  activityType: string[];
  itemName: string[];
}

export interface SharedClaimHistoryFilters {
  prescriberName: string[];
  outcome: string[];
  activityType: string[];
  itemName: string[];
}

export interface SharedClaimHistoryState {
  isLoading: boolean;
  dateRange: Range;
  tableColumnState: TableColumnState;
  tableColumns: string[];
  activityData: AllActivityData[];
  allFilters: SharedClaimHistoryFilters;
  currentFilters: SharedClaimHistoryFilters;
  tableSort: MatSortable;
}

export const SHARED_CLAIM_HISTORY_INITIAL_STATE: SharedClaimHistoryState = {
  isLoading: false,
  dateRange: {
    fromDate: moment()
      .subtract(6, 'month')
      .toDate(),
    toDate: moment().toDate()
  },
  tableColumnState: TableColumnState.TruncateText,
  tableColumns: [],
  activityData: [],
  allFilters: {
    prescriberName: [],
    outcome: [],
    activityType: [],
    itemName: []
  },
  currentFilters: {
    prescriberName: [],
    outcome: [],
    activityType: [],
    itemName: []
  },
  tableSort: {
    id: 'creationDate',
    start: 'desc',
    disableClear: false
  }
};
