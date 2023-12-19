import { HttpResponse } from '@angular/common/http';
import { MatSortable } from '@angular/material/sort';
import { Action as ngrxAction } from '@ngrx/store';
import { TableColumnState } from '@shared';
import { FilterOptions } from '../../activity/activity-table/activity-table.component';
import {
  ActivityRequestQuery,
  ClaimActivityDTO,
  PagerPatch,
  PendingActivityDTO,
  PendingActivityTotals
} from '../models/activity-tab.models';
import { ExportParameters } from '../models/claim-view.models';

export enum ActionType {
  UPDATE_COLUMN_SORT = '[Claim View - Activity Tab] Update Column Sort',
  UPDATE_FILTERS = '[Claim View - Activity Tab] Update Filters',
  UPDATE_COLUMN_VIEW = '[Claim View - Activity Tab] Update Column View',

  INITIALIZED = '[Claim View - Activity Tab] Initialized',
  SELECT_ACTIVITY_TAB = '[Claim View - Activity Tab] Select Activity Tab',

  REQUEST_ALL_ACTIVITY = '[Claim View - Activity Tab] Request All Activity',
  REQUEST_ALL_ACTIVITY_SUCCESS = '[Claim View - Activity Tab] Request All Activity Success',
  REQUEST_ALL_ACTIVITY_FAIL = '[Claim View - Activity Tab] Request All Activity Fail',

  REQUEST_PENDING_ACTIVITY = '[Claim View - Activity Tab] Request Pending Activity',
  REQUEST_PENDING_ACTIVITY_SUCCESS = '[Claim View - Activity Tab] Request Pending Activity Success',
  REQUEST_PENDING_ACTIVITY_FAIL = '[Claim View - Activity Tab] Request Pending Activity Fail',

  PROCESS_PENDING_ACTIVITY = '[Claim View - Activity Tab] Process Pending Activity',

  EXPORT_DOCUMENT_REQUEST = '[Claim View - Activity Tab] Export Document Request',
  EXPORT_DOCUMENT_SUCCESS = '[Claim View - Activity Tab] Export Document Success',
  EXPORT_DOCUMENT_FAILURE = '[Claim View - Activity Tab] Export Document Failure',

  SET_ACTIVITY_PAGER = '[Claim View - Activity Tab] Set Pager State'
}

export class SelectActivityTab implements ngrxAction {
  readonly type: ActionType = ActionType.SELECT_ACTIVITY_TAB;

  constructor(public payload: string) {}
}

export class RequestAllActivity implements ngrxAction {
  readonly type: ActionType = ActionType.REQUEST_ALL_ACTIVITY;

  constructor(public payload: ActivityRequestQuery) {}
}

export class RequestAllActivityFail implements ngrxAction {
  readonly type: ActionType = ActionType.REQUEST_ALL_ACTIVITY_FAIL;

  constructor(public payload: string) {}
}

export class RequestAllActivitySuccess implements ngrxAction {
  readonly type: ActionType = ActionType.REQUEST_ALL_ACTIVITY_SUCCESS;

  constructor(public payload: HttpResponse<ClaimActivityDTO>) {}
}

export class UpdateColumnView implements ngrxAction {
  readonly type: ActionType = ActionType.UPDATE_COLUMN_VIEW;

  constructor(public payload: TableColumnState) {}
}

export class UpdateColumnSort implements ngrxAction {
  readonly type: ActionType = ActionType.UPDATE_COLUMN_SORT;

  constructor(public payload: MatSortable) {}
}

export class UpdateFilters implements ngrxAction {
  readonly type: ActionType = ActionType.UPDATE_FILTERS;

  constructor(public payload: FilterOptions) {}
}

export class Initialized implements ngrxAction {
  readonly type: ActionType = ActionType.INITIALIZED;

  constructor(public payload?) {}
}

export class ExportDocumentRequest {
  readonly type: ActionType = ActionType.EXPORT_DOCUMENT_REQUEST;

  constructor(public payload: ExportParameters) {}
}

export class ExportDocumentSuccess {
  readonly type: ActionType = ActionType.EXPORT_DOCUMENT_SUCCESS;

  constructor(public payload) {}
}

export class ExportDocumentFailure {
  readonly type: ActionType = ActionType.EXPORT_DOCUMENT_FAILURE;

  constructor(public payload) {}
}

export class SetPendingActivityTotals implements ngrxAction {
  readonly type: ActionType = ActionType.PROCESS_PENDING_ACTIVITY;

  constructor(public payload: PendingActivityTotals) {}
}

export class RequestPendingActivity implements ngrxAction {
  readonly type: ActionType = ActionType.REQUEST_PENDING_ACTIVITY;

  constructor(public payload: { customerId: string; claimNumber: string }) {}
}

export class RequestPendingActivitySuccess implements ngrxAction {
  readonly type: ActionType = ActionType.REQUEST_PENDING_ACTIVITY_SUCCESS;

  constructor(public payload: PendingActivityDTO) {}
}

export class RequestPendingActivityFail implements ngrxAction {
  readonly type: ActionType = ActionType.REQUEST_PENDING_ACTIVITY_FAIL;

  constructor(public payload) {}
}

export class SetActivityViewPager implements ngrxAction {
  readonly type: ActionType = ActionType.SET_ACTIVITY_PAGER;

  constructor(public payload: PagerPatch) {}
}

export type Action =
  | SetActivityViewPager
  | SelectActivityTab
  | RequestAllActivity
  | RequestAllActivitySuccess
  | RequestAllActivityFail
  | UpdateColumnView
  | UpdateColumnSort
  | UpdateFilters
  | Initialized
  | ExportDocumentRequest
  | ExportDocumentSuccess
  | SetPendingActivityTotals
  | ExportDocumentFailure
  | RequestPendingActivity
  | RequestPendingActivitySuccess
  | RequestPendingActivityFail;
