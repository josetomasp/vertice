import { Action as ngrxAction, createAction, props } from '@ngrx/store';

import {
  MakeReferralOptions,
  ReferralLocationCreateRequest,
  ReferralManagementTransportationTypes,
  ReferralSubmitMessage,
  RequestorInformationOptions, SelectableService
} from '../models/make-a-referral.models';
import { ErrorSharedMakeAReferral } from '../models/shared-make-a-referral.models';

export enum ActionType {
  GET_SERVICE_SELECTION_VALUES = '[Make a Referral] Get Selectable Services and Active Referrals Request',
  GET_SERVICE_SELECTION_VALUES_SUCCESS = '[Make a Referral] Get Selectable Services and Active Referrals Request Success',
  GET_SERVICE_SELECTION_VALUES_FAILURE = '[Make a Referral] Get Selectable Services and Active Referrals Request Failure',

  GET_TRANSPORTATION_OPTIONS = '[Make a Referral] Get Transportation options Request',
  GET_TRANSPORTATION_OPTIONS_SUCCESS = '[Make a Referral] Get Transportation options Success',
  GET_TRANSPORTATION_OPTIONS_FAILURE = '[Make a Referral] Get Transportation options Failure',

  GET_TRANSPORTATION_TYPES = '[Make a Referral] Get Transportation types Request',
  GET_TRANSPORTATION_TYPES_SUCCESS = '[Make a Referral] Get Transportation types Success',
  GET_TRANSPORTATION_TYPES_FAILURE = '[Make a Referral] Get Transportation types Failure',

  UPDATE_SECTION_FORM = '[Make a Referral] Update Section Form',

  REMOVE_SERVICE = '[Make a Referral] Remove Service',

  SET_SELECTED_SERVICE_TYPES = '[Make a Referral] Set Selected Service Types',
  SET_SELECTED_SERVICE_DETAIL_TYPES = '[Make a Referral] Set Selected Detail Service Types',

  SET_SECTION_STATUS = '[Make a Referral] Set Section Status',
  SET_SECTION_DIRTY = '[Make a Referral] Set Section Dirty',

  SET_SPECIFIC_DATE_NOTE = '[Make a Referral] Set Specific Date Note',

  RESET_MAKE_A_REFERRAL = '[Make a Referral] Reset',

  ADD_VALID_FORM_STATE = '[Make a Referral] Add Valid Form State',
  REMOVE_VALID_FORM_STATE = '[Make a Referral] Remove Valid Form State',

  PRUNE_FORM_DATA = '[Make a Referral] Prune Form Data',

  UPDATE_REFERRAL_LEVEL_NOTE = '[Make a Referral] Update Referral Level Note'
}

export class GetServiceSelectionValues implements ngrxAction {
  readonly type = ActionType.GET_SERVICE_SELECTION_VALUES;

  constructor(public payload) {}
}

export class GetServiceSelectionValuesSuccess implements ngrxAction {
  readonly type = ActionType.GET_SERVICE_SELECTION_VALUES_SUCCESS;

  constructor(public payload: SelectableService[]) {}
}

export class GetServiceSelectionValuesFailure implements ngrxAction {
  readonly type = ActionType.GET_SERVICE_SELECTION_VALUES_FAILURE;

  constructor(public payload) {}
}

export class GetTransportationOptions implements ngrxAction {
  readonly type = ActionType.GET_TRANSPORTATION_OPTIONS;

  constructor(public payload) {}
}

export class GetTransportationOptionsSuccess implements ngrxAction {
  readonly type = ActionType.GET_TRANSPORTATION_OPTIONS_SUCCESS;

  constructor(public payload: MakeReferralOptions) {}
}

export class GetTransportationOptionsFailure implements ngrxAction {
  readonly type = ActionType.GET_TRANSPORTATION_OPTIONS_FAILURE;

  constructor(public payload) {}
}

export class GetTransportationTypes implements ngrxAction {
  readonly type = ActionType.GET_TRANSPORTATION_TYPES;

  constructor(public payload) {}
}

export class GetTransportationTypesSuccess implements ngrxAction {
  readonly type = ActionType.GET_TRANSPORTATION_TYPES_SUCCESS;

  constructor(public payload: ReferralManagementTransportationTypes) {}
}

export class GetTransportationTypesFailure implements ngrxAction {
  readonly type = ActionType.GET_TRANSPORTATION_TYPES_FAILURE;

  constructor(public payload) {}
}

export const addTransportationLocation = createAction(
  '[Make a Referral] Add Transportation Location Attempt' as ActionType,
  props<{ newLocation: ReferralLocationCreateRequest }>()
);

export const addTransportationLocationSuccess = createAction(
  '[Make a Referral] Add Transportation Location Success' as ActionType,
  props<{ newLocation: ReferralLocationCreateRequest }>()
);

export const addTransportationLocationFailure = createAction(
  '[Make a Referral] Add Transportation Location Failure' as ActionType
);

export const submitTransportationReferralSuccess = createAction(
  '[Make a Referral] Submit Transportation Referral Success' as ActionType,
  props<{ referralData: ReferralSubmitMessage }>()
);

export const submitTransportationReferralFailure = createAction(
  '[Make a Referral] Submit Transportation Referral Failure' as ActionType,
  props<{ errors: string[] }>()
);

export const uploadTransportationDocument = createAction(
  '[Make a Referral] Upload Transportation Document' as ActionType,
  props<{ referralIds: number[]; document: File }>()
);

export const uploadTransportationDocumentSuccess = createAction(
  '[Make a Referral] Upload Transportation Document Success' as ActionType
);

export const uploadTransportationDocumentFail = createAction(
  '[Make a Referral] Upload Transportation Document Fail' as ActionType,
  props<{ errors: string[] }>()
);

export const removeFailedDocument = createAction(
  '[Make a Referral] Remove Failed Documents' as ActionType,
  props<{ documents: string[]; service: string }>()
);

export const saveAsDraft = createAction(
  '[Make a Referral :: Core] Save as Draft',
  props<{ submitMessage: ReferralSubmitMessage }>()
);

export const saveAsDraftSuccess = createAction(
  '[Make a Referral :: Core] Save as Draft Success',
  props<{ [key: string]: number }>()
);
export const saveAsDraftFail = createAction(
  '[Make a Referral :: Core] Save as Draft Fail',
  props<{ errors: string[] }>()
);

export class SetSelectedServiceTypes implements ngrxAction {
  readonly type = ActionType.SET_SELECTED_SERVICE_TYPES;

  constructor(public payload: string[]) {}
}

export class SetSelectedServiceDetailTypes implements ngrxAction {
  readonly type = ActionType.SET_SELECTED_SERVICE_DETAIL_TYPES;

  constructor(public payload: { [key: string]: string[] }) {}
}

export class SetSectionStatus implements ngrxAction {
  readonly type = ActionType.SET_SECTION_STATUS;

  constructor(public payload: { [key: string]: string }) {}
}

export class SetSectionDirty implements ngrxAction {
  readonly type = ActionType.SET_SECTION_DIRTY;

  constructor(public payload: { [key: string]: boolean }) {}
}

export class RemoveService implements ngrxAction {
  readonly type = ActionType.REMOVE_SERVICE;

  constructor(public payload: string) {}
}

export class SetSpecificDateNote implements ngrxAction {
  readonly type = ActionType.SET_SPECIFIC_DATE_NOTE;

  constructor(
    public payload: { ngrxStepName: string; index: number; note: string }
  ) {}
}

export class ResetMakeAReferral implements ngrxAction {
  readonly type = ActionType.RESET_MAKE_A_REFERRAL;

  constructor(public payload) {}
}

export class AddValidFormState implements ngrxAction {
  readonly type = ActionType.ADD_VALID_FORM_STATE;

  constructor(public payload: string) {}
}

export class RemoveValidFormState implements ngrxAction {
  readonly type = ActionType.REMOVE_VALID_FORM_STATE;

  constructor(public payload: string) {}
}

export class PruneFormData implements ngrxAction {
  readonly type = ActionType.PRUNE_FORM_DATA;

  constructor(public payload: string) {}
}

export class UpdateSectionForm implements ngrxAction {
  readonly type = ActionType.UPDATE_SECTION_FORM;

  constructor(public payload: { [key: string]: any }) {}
}

export class UpdateReferralLevelNote implements ngrxAction {
  readonly type = ActionType.UPDATE_REFERRAL_LEVEL_NOTE;

  constructor(public payload: string) {}
}

export const requestRequestorInformationOptions = createAction(
  '[Make a Referral] Get Requestor Information Options' as ActionType
);

export const requestRequestorInformationOptionsSuccess = createAction(
  '[Make a Referral] Get Requestor Information Options Success' as ActionType,
  props<{ requestorInformationOptions: RequestorInformationOptions }>()
);

export const requestRequestorInformationOptionsFail = createAction(
  '[Make a Referral] Get Requestor Information Options Fail' as ActionType,
  props<{ errors: string[] }>()
);

export const removeSuccessServicesFormState = createAction(
  '[Make a Referral] Remove Success Services & Form State' as ActionType,
  props<{ errorResponse: ErrorSharedMakeAReferral[] }>()
);

export type Action =
  | PruneFormData
  | AddValidFormState
  | RemoveValidFormState
  | SetSpecificDateNote
  | ResetMakeAReferral
  | GetTransportationOptions
  | GetTransportationOptionsSuccess
  | GetTransportationOptionsFailure
  | GetTransportationTypes
  | GetTransportationTypesSuccess
  | GetTransportationTypesFailure
  | GetServiceSelectionValues
  | GetServiceSelectionValuesSuccess
  | GetServiceSelectionValuesFailure
  | SetSelectedServiceTypes
  | SetSelectedServiceDetailTypes
  | SetSectionStatus
  | SetSectionDirty
  | RemoveService
  | UpdateSectionForm
  | UpdateReferralLevelNote;
