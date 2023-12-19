import { Action as ngrxAction } from '@ngrx/store';
import { PostReferralNoteRequestObject, ReferralNote } from '../models';
import { ReferralGenericQuery } from '../models/referral-id.models';

export enum ActionType {
  REQUEST_REFERRAL_NOTES = '[Referral Activity - Notes] Request Referral Notes',
  REQUEST_REFERRAL_NOTES_SUCCESS = '[Referral Activity - Notes] Request Referral Notes Success',
  REQUEST_REFERRAL_NOTES_FAIL = '[Referral Activity - Notes] Request Referral Notes Fail',

  POST_REFERRAL_NOTES_REQUEST = '[Referral Activity - Notes] Post Referral Note',
  POST_REFERRAL_NOTES_REQUEST_SUCCESS = '[Referral Activity - Notes] Post Referral Note Success',
  POST_REFERRAL_NOTES_REQUEST_FAIL = '[Referral Activity - Notes] Post Referral Note Fail'
}

export class RequestReferralNotes implements ngrxAction {
  readonly type = ActionType.REQUEST_REFERRAL_NOTES;

  constructor(public payload: ReferralGenericQuery) {}
}

export class RequestReferralNotesSuccess implements ngrxAction {
  readonly type = ActionType.REQUEST_REFERRAL_NOTES_SUCCESS;

  constructor(public payload: ReferralNote[]) {}
}

export class RequestReferralNotesFail implements ngrxAction {
  readonly type = ActionType.REQUEST_REFERRAL_NOTES_FAIL;

  constructor(public payload: string) {}
}

export class PostReferralNoteRequest implements ngrxAction {
  readonly type = ActionType.POST_REFERRAL_NOTES_REQUEST;

  constructor(public payload: PostReferralNoteRequestObject) {}
}

export class PostReferralNoteRequestSuccess implements ngrxAction {
  readonly type = ActionType.POST_REFERRAL_NOTES_REQUEST_SUCCESS;

  constructor(public payload: any) {}
}

export class PostReferralNoteRequestFail implements ngrxAction {
  readonly type = ActionType.POST_REFERRAL_NOTES_REQUEST_FAIL;

  constructor(public payload: any) {}
}

export type Action =
  | RequestReferralNotes
  | RequestReferralNotesSuccess
  | RequestReferralNotesFail
  | PostReferralNoteRequest
  | PostReferralNoteRequestSuccess
  | PostReferralNoteRequestFail;
