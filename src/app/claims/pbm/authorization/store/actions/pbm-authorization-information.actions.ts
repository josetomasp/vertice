import { createAction, props } from '@ngrx/store';
import {
  AuthorizationDetails,
  PbmAuthSubmitMessage,
  PbmAuthSubmitResponse,
  PbmPaperAuthorizationSubmitMessage,
  RxAuthorizationFormState,
  RxAuthorizationInformationQuery,
  PbmPaperAuthorizationPrepareMessage,
  PbmPreparePaperAuthorizationResponse,
  PbmPaperAuthorizationSaveMessage
} from '../models/pbm-authorization-information.model';
import {
  PbmAuthSearchClaimRequest,
  PbmAuthSearchClaimResponse,
  PbmAuthSubmitClaimRequest
} from '../models/pbm-authorization-reassignment.model';
import { VerticeResponse } from '@shared/models/VerticeResponse';
import { Subject } from 'rxjs';
import { PbmAuthorizationNote } from '../models/pbm-authorization-information/pbm-authorization-note.models';

// Get RX Authorization
export const loadRxAuthInfo = createAction(
  '[ PBM Authorizations ] Load RX Auth Info',
  props<RxAuthorizationInformationQuery>()
);
export const loadRxAuthInfoSuccess = createAction(
  '[ PBM Authorizations ] Load RX Auth Info Success',
  props<AuthorizationDetails>()
);
export const loadRxAuthInfoFail = createAction(
  '[ PBM Authorizations ] Load RX Auth Info Fail',
  props<{ errors: string[] }>()
);

// Get Paper  Authorization
export const loadPaperAuthInfo = createAction(
  '[ PBM Paper Authorizations ] Load Paper Auth Info',
  props<RxAuthorizationInformationQuery>()
);
export const loadPaperAuthInfoSuccess = createAction(
  '[ PBM Paper Authorizations ] Load Paper Auth Info Success',
  props<AuthorizationDetails>()
);
export const loadPaperAuthInfoFail = createAction(
  '[ PBM Paper Authorizations ] Load Paper Auth Info Fail',
  props<{ errors: string[] }>()
);

// Save Rx Authorization Line Item Note
export const saveRxAuthLineItemNote = createAction(
  '[ PBM Authorizations ] Save RX Auth Line Item Note',
  props<{ note: PbmAuthorizationNote; authorizationId: number }>()
);

// Save Rx Authorization  Note
export const saveRxAuthNote = createAction(
  '[ PBM Authorizations ] Save RX AuthNote',
  props<{ note: PbmAuthorizationNote }>()
);

export const saveRxAuthLineItemNoteSuccess = createAction(
  '[ PBM Authorizations ] Save RX Auth Line Item Note Success',
  props<{ notes: PbmAuthorizationNote[]; lineItemKey: number }>()
);
export const saveRxAuthLineItemNoteFail = createAction(
  '[ PBM Authorizations ] Save RX Auth Line Item Note Fail',
  props<{ errors: string[] }>()
);

// Search Claim for Reassignment
export const searchRxAuthClaimForReassignment = createAction(
  '[ PBM Authorizations ] Search Claim For Reassignment',
  props<{ searchRequest: PbmAuthSearchClaimRequest }>()
);
export const searchRxAuthClaimForReassignmentSuccess = createAction(
  '[ PBM Authorizations ] Search Claim For Reassignment Success',
  props<{ searchResult: PbmAuthSearchClaimResponse[] }>()
);
export const searchRxAuthClaimForReassignmentFail = createAction(
  '[ PBM Authorizations ] Search Claim For Reassignment Fail',
  props<{ errors: string[] }>()
);

export const resetRxAuthorizationClaimSearchResult = createAction(
  '[ PBM Authorizations ] Reset Search Claim for Reassignment Results'
);

// Submit Rx Authorization Claim Reassignment
export const submitRxAuthClaimReassignment = createAction(
  '[ PBM Authorizations ] Submit Rx Authorization Claim Reassignment',
  props<PbmAuthSubmitClaimRequest>()
);
export const submitRxAuthClaimReassignmentSuccess = createAction(
  '[ PBM Authorizations ] Submit Rx Authorization Claim Reassignment Success',
  props<AuthorizationDetails>()
);
export const submitRxAuthClaimReassignmentFail = createAction(
  '[ PBM Authorizations ] Submit Rx Authorization Claim Reassignment Fail',
  props<{ errors: string[] }>()
);

export const submitPaperAuthClaimReassignment = createAction(
  '[ PBM Paper Authorizations ] Submit Paper Authorization Claim Reassignment',
  props<PbmAuthSubmitClaimRequest>()
);
export const submitPaperAuthClaimReassignmentSuccess = createAction(
  '[ PBM Paper Authorizations ] Submit Paper Authorization Claim Reassignment Success',
  props<VerticeResponse<string>>()
);
export const submitPaperAuthClaimReassignmentFail = createAction(
  '[ PBM Paper Authorizations ] Submit Paper Authorization Claim Reassignment Fail',
  props<VerticeResponse<string>>()
);

// Unlock Rx Authorization
export const unlockRxAuthorization = createAction(
  '[ PBM Authorizations ] Unlock Authorization',
  props<{ authorizationId: string }>()
);
export const unlockPaperRxAuthorization = createAction(
  '[ PBM Authorizations ] Unlock Paper Authorization',
  props<{ authorizationId: string }>()
);
export const unlockRxAuthorizationSuccess = createAction(
  '[ PBM Authorizations ] Unlock Authorization Success',
  props<{ isLocked: boolean }>()
);
export const unlockRxAuthorizationFail = createAction(
  '[ PBM Authorizations ] Unlock Authorization Fail',
  props<{ errors: string[] }>()
);

export const updateRxAuthorizationFormState = createAction(
  '[ PBM Authorizations ] Update Authorization FormState',
  props<{ formState: RxAuthorizationFormState }>()
);

export const submitRxAuthorization = createAction(
  '[ PBM Authorizations ] Submit Authorizations',
  props<{ submitMessage: PbmAuthSubmitMessage; isLastDecisionSave: boolean }>()
);

export const submitRxAuthorizationSuccess = createAction(
  '[ PBM Authorizations ] Submit Authorizations Call Success',
  props<{
    successResponse: PbmAuthSubmitResponse;
    isLastDecisionSave?: boolean;
  }>()
);

export const submitRxAuthorizationFail = createAction(
  '[ PBM Authorizations ] Submit Authorizations Fail',
  props<{ errorResponse: string[] }>()
);

export const resetRxAuthorizationState = createAction(
  '[ PBM Authorizations ] Reset RxAuthorizationState'
);

export const postInternalNote = createAction(
  '[ PBM Authorizations :: Internal ] Post Internal Note ',
  props<{ note: string; encodedAuthId: string }>()
);
export const postInternalNoteSuccess = createAction(
  '[ PBM Authorizations :: Internal ] Post Internal Note Success',
  props<{ notes: PbmAuthorizationNote[] }>()
);
export const postInternalNoteFail = createAction(
  '[ PBM Authorizations :: Internal ] Post Internal Note Fail',
  props<{ errors: string[] }>()
);

export const savePaperAuthorization = createAction(
  '[ PBM Paper Authorizations ] Save Paper Authorizations',
  props<{
    saveRequestBody: PbmPaperAuthorizationSaveMessage;
    authorizationId: string;
  }>()
);

export const savePaperAuthorizationSuccess = createAction(
  '[ PBM Paper Authorizations ] Save Paper Authorizations Call Success',
  props<{ successResponse: VerticeResponse<void> }>()
);

export const savePaperAuthorizationFail = createAction(
  '[ PBM Paper Authorizations ] Save Paper Authorizations Fail',
  props<{ errorResponse: VerticeResponse<void> }>()
);

export const submitPaperAuthorization = createAction(
  '[ PBM Paper Authorizations ] Submit Paper Authorizations',
  props<{
    submitMessage: PbmPaperAuthorizationSubmitMessage;
    authorizationId: string;
  }>()
);

export const submitPaperAuthorizationSuccess = createAction(
  '[ PBM Paper Authorizations ] Submit Paper Authorizations Success',
  props<{
    successResponse: PbmAuthSubmitResponse;
    isLastDecisionSave?: boolean;
  }>()
);

export const submitPaperAuthorizationFail = createAction(
  '[ PBM Paper Authorizations ] Submit Paper Authorizations Fail',
  props<{ errorResponse: string[] }>()
);

export const submitSamaritanDose = createAction(
  '[ PBM Authorizations :: ] Submit Samaritan Dose ',
  props<{ submit: PbmAuthSubmitMessage }>()
);
export const submitSamaritanDoseSuccess = createAction(
  '[ PBM Authorizations :: ] Submit Samaritan Dose Success',
  props<{ response: VerticeResponse<AuthorizationDetails> }>()
);
export const submitSamaritanDoseFail = createAction(
  '[ PBM Authorizations :: ] Submit Samaritan Dose Fail',
  props<{ response: VerticeResponse<AuthorizationDetails> }>()
);
export const submitByPassPriorAuthLoad = createAction(
  '[ PBM Authorizations :: Bypass ] Submit ByPass Prior Auth Load ',
  props<{
    submit: PbmAuthSubmitMessage;
    authorizationDetails: AuthorizationDetails;
  }>()
);
export const submitByPassPriorAuthLoadSuccess = createAction(
  '[ PBM Authorizations :: Prior Auth ] Submit ByPass Prior Auth Load Response',
  props<AuthorizationDetails>()
);
export const submitByPassPriorAuthLoadFail = createAction(
  '[ PBM Authorizations :: Prior Auth ] Submit ByPass Prior Auth Load Fail',
  props<{ errorResponse: string[] }>()
);
export const submitPriorAuthLoad = createAction(
  '[ PBM Authorizations :: Prior Auth ] Submit Prior Auth Load ',
  props<{
    submit: PbmAuthSubmitMessage;
    authorizationDetails: AuthorizationDetails;
  }>()
);
export const submitPriorAuthLoadSuccess = createAction(
  '[ PBM Authorizations :: ] Submit Prior Auth Load Response',
  props<AuthorizationDetails>()
);
export const submitPriorAuthLoadFail = createAction(
  '[ PBM Authorizations :: ] Submit Prior Auth Load Fail',
  props<{ errorResponse: string[] }>()
);
export const saveDecision = createAction(
  '[ PBM Authorizations ] save Decision Authorizations',
  props<{
    submitMessage: PbmAuthSubmitMessage;
    isLastDecisionSave: boolean;
    successSubject: Subject<null>;
  }>()
);

export const saveDecisionSuccess = createAction(
  '[ PBM Authorizations ] save Decision Authorizations Call Success',
  props<{
    successResponse: PbmAuthSubmitResponse;
    isLastDecisionSave?: boolean;
  }>()
);

export const saveDecisionFail = createAction(
  '[ PBM Authorizations ] save Decision Authorizations Fail',
  props<{ errorResponse: string[] }>()
);

export const preparePaperAuthorization = createAction(
  '[ PBM Paper Authorizations ] Prepare Paper Authorizations',
  props<{
    submitMessage: PbmPaperAuthorizationPrepareMessage;
    authorizationId: string;
  }>()
);
export const preparePaperAuthorizationSuccess = createAction(
  '[ PBM Paper Authorizations ] Prepare Paper Authorizations Call Success',
  props<{
    successResponse: VerticeResponse<PbmPreparePaperAuthorizationResponse>;
    successful: boolean;
  }>()
);

export const preparePaperAuthorizationFail = createAction(
  '[ PBM Paper Authorizations ] Prepare Paper Authorizations Fail',
  props<{ errorResponse:  VerticeResponse<PbmPreparePaperAuthorizationResponse> }>()
);
