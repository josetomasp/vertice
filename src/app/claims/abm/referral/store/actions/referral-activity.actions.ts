import { Action as ngrxAction, createAction, props } from '@ngrx/store';
import {
  ActivityTableFilters,
  ReferralCurrentActivity,
  ReferralInformationServiceRequest,
  ReferralStage,
  ReferralTableDocumentExportRequest
} from '../models';
import { ReferralGenericQuery } from '../models/referral-id.models';
import { VerticeResponse } from '@shared';

export enum ActionType {
  REQUEST_REFERRAL_CURRENT_ACTIVITY = '[Referral Activity - Details] Request Current Activity',
  REQUEST_REFERRAL_CURRENT_ACTIVITY_SUCCESS = '[Referral Activity - Details] Request Current Activity Success',

  REQUEST_REFERRAL_CURRENT_ACTIVITY_FAIL = '[Referral Activity - Details] Request Current Activity Fail',
  UPDATE_SELECTED_SERVICE_TYPE = '[Referral Activity - Details] Update Selected Service Type',

  UPDATE_TABLE_FILTERS = '[Referral Activity - Details - Table] Update Table Filters',

  OPEN_DETAIL_MODAL = '[Referral Activity - Details] Open Modal',

  EXPORT_TABLE_VIEW = '[Referral Activity] Export Table View Request',
  EXPORT_TABLE_VIEW_SUCCESS = '[Referral Activity] Export Table View Success',
  EXPORT_TABLE_VIEW_FAIL = '[Referral Activity] Export Table View Fail'
}

export class RequestReferralCurrentActivity implements ngrxAction {
  readonly type = ActionType.REQUEST_REFERRAL_CURRENT_ACTIVITY;

  constructor(public payload: ReferralGenericQuery) {}
}

export class RequestReferralCurrentActivitySuccess implements ngrxAction {
  readonly type = ActionType.REQUEST_REFERRAL_CURRENT_ACTIVITY_SUCCESS;

  constructor(public payload: VerticeResponse<ReferralCurrentActivity>) {}
}

export class RequestReferralCurrentActivityFail implements ngrxAction {
  readonly type = ActionType.REQUEST_REFERRAL_CURRENT_ACTIVITY_FAIL;

  constructor(public payload: string) {}
}

export class UpdateSelectedServiceType implements ngrxAction {
  readonly type = ActionType.UPDATE_SELECTED_SERVICE_TYPE;

  constructor(public payload: string) {}
}

export class UpdateTableFilters implements ngrxAction {
  readonly type = ActionType.UPDATE_TABLE_FILTERS;

  constructor(public payload: ActivityTableFilters) {}
}

export class OpenReferralDetailModal implements ngrxAction {
  readonly type = ActionType.OPEN_DETAIL_MODAL;

  constructor(public payload: { stage: ReferralStage; modalData: any }) {}
}

export class ExportTableView implements ngrxAction {
  readonly type = ActionType.EXPORT_TABLE_VIEW;

  constructor(public payload: ReferralTableDocumentExportRequest) {}
}

export class ExportTableViewSuccess implements ngrxAction {
  readonly type = ActionType.EXPORT_TABLE_VIEW_SUCCESS;

  constructor(public payload: any) {}
}

export class ExportTableViewFail implements ngrxAction {
  readonly type = ActionType.EXPORT_TABLE_VIEW_FAIL;

  constructor(public payload: any) {}
}

export const referralInformationRequest = createAction(
  '[Referral Activity] Information Request',
  props<{ serviceRequest: ReferralInformationServiceRequest }>()
);

export type Action =
  | ExportTableView
  | ExportTableViewSuccess
  | ExportTableViewFail
  | RequestReferralCurrentActivity
  | RequestReferralCurrentActivitySuccess
  | RequestReferralCurrentActivityFail
  | UpdateSelectedServiceType
  | UpdateTableFilters
  | OpenReferralDetailModal;
