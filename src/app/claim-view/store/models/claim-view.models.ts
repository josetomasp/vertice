import { Range } from '@healthe/vertice-library';
import { HealtheTableColumnDef, TableColumnState } from '@shared';
import * as _moment from 'moment';

import { DocumentExportDocumentType } from '../../../../common/documentExporter/documentExportDTO';
import { DATE_PICKER_BASE_OPTIONS } from '../../activity/activity-table/date-picker-options';
import { ActivityTabState } from './activity-tab.models';
import {
  eligibilityTabInitialState,
  EligibilityTabState,
  LabelValue
} from './eligibility-tab.models';
import { icdCodesTabInitalState, IcdCodesTabState } from './icd-codes.models';
import {
  incidentsTabInitalState,
  IncidentsTabState
} from './incidents-tab.model';
import { ClaimSearchClaim } from '@shared/store/models';

const moment = _moment;

export interface ClaimViewState {
  root: ClaimViewRoot;
  activityTab: ActivityTabState;
  icdCodeTab: IcdCodesTabState;
  incidentsTab: IncidentsTabState;
  eligibilityTab: EligibilityTabState;
}

export interface ClaimViewRoot {
  errors: Array<string>;
  claimsSearchResults: Array<ClaimSearchClaim>;
  totalNumberOfClaimsFound: number;
}

export interface ExportParameters {
  productType: string;
  dateRange: Range;
  exportType: DocumentExportDocumentType;
  tableColumns: Array<string>;
  columnOptions: Array<HealtheTableColumnDef>;
  claimNumber: string;
  customerId: string;
  activityTypeFilterPredicates: Array<string>;
  outcomeFilterPredicates: Array<string>;
  prescriberNameFilterPredicates: Array<string>;
  itemNameFilterPredicates: Array<string>;
}

export interface ClaimantTabInfo {
  attorneyName: string;
  claimantDetails: LabelValue[];
  employerInfo: LabelValue[];
}

export const claimViewInitialState: ClaimViewState = {
  root: {
    errors: [],
    claimsSearchResults: [],
    totalNumberOfClaimsFound: 0
  },
  activityTab: {
    dateRange: {
      fromDate: moment()
        .subtract(1, 'month')
        .toDate(),
      toDate: moment().toDate()
    },
    activityTab: 'all',
    pendingActivityTotals: { all: 0, pharmacy: 0, clinical: 0, ancillary: 0 },
    initialized: false,
    isAllActivityLoading: true,
    isPendingActivityLoading: true,
    allActivityData: [],
    pendingActivityData: [],
    filterPredicates: {
      activityType: [],
      itemName: [],
      outcome: [],
      prescriberName: []
    },
    columnView: TableColumnState.TruncateText,
    columnSort: {
      id: 'creationDate',
      start: 'desc',
      disableClear: false
    },
    pagers: {
      all: { currentPage: 0, pageSize: 0 },
      pharmacy: { currentPage: 0, pageSize: 0 },
      ancillary: { currentPage: 0, pageSize: 0 },
      clinical: { currentPage: 0, pageSize: 0 }
    },
    serverErrors: []
  },

  icdCodeTab: icdCodesTabInitalState,
  incidentsTab: incidentsTabInitalState,
  eligibilityTab: eligibilityTabInitialState
};

export const CLAIM_VIEW_DATE_PICKER_OPTIONS = {
  range: {
    fromDate: moment()
      .subtract(1, 'month')
      .toDate(),
    toDate: moment().toDate()
  },
  ...DATE_PICKER_BASE_OPTIONS
};
