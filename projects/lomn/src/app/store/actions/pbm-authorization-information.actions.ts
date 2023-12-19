import { createAction, props } from '@ngrx/store';
import {
  AuthorizationDetails,
  PbmAuthSubmitMessage,
  RxAuthorizationInformationQuery
} from '../models/pbm-authorization-information.model';

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

// Unlock Rx Authorization
export const unlockRxAuthorization = createAction(
  '[ PBM Authorizations ] Unlock Authorization',
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

export const submitRxAuthorization = createAction(
  '[ PBM Authorizations ] Submit Authorizations',
  props<{ submitMessage: PbmAuthSubmitMessage; isLastDecisionSave: boolean }>()
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

// Get LOMN Paper Authorization Data
export const loadLOMNPaperAuthorizationData = createAction(
  '[ PBM LOMN Authorizations ] Load LOMN Paper Info',
  props<{authorizationId: string}>()
);

export const loadLOMNPaperAuthorizationDataSuccess = createAction(
  '[ PBM LOMN Authorizations ] Load LOMN Paper Info Success',
  props<AuthorizationDetails>()
);

export const loadLOMNPaperAuthorizationDataFail = createAction(
  '[ PBM LOMN Authorizations ] Load LOMN Paper Info Fail',
  props<{ errors: string[] }>()
);
