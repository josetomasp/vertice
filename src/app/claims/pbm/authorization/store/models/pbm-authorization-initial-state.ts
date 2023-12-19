import {
  PbmAuthSubmitResponse,
  AuthorizationDetails
} from './pbm-authorization-information.model';
import { LOMN_INITIAL_STATE } from './lomn-initial-state';
import { ClaimReassignmentInitialState } from './claim-reassignment-initial-state';
import { PBMAuthorizationState } from './pbm-authorization.models';
import { VerticeResponse } from '@shared/models/VerticeResponse';

export const LINE_ACTION_RESPONSE_INITIAL_STATE: VerticeResponse<AuthorizationDetails> =
  {
    responseBody: null,
    errors: [],
    httpStatusCode: null
  };

export const PBM_AUTHORIZATION_INITIAL_STATE: PBMAuthorizationState = {
  isLoading: false,
  pbmAuthorizationInformationState: {
    isLoading: false,
    locked: false,
    submittingRxAuthorization: false,
    preparingPaperAuthorization: false,
    savingAuthorization: false,
    isSubmitingSamDose: false,
    isLastDecisionSave: false,
    isSubmitingByPassPriorAuth: false,
    isSubmitingByPassPriorAuthSuccess: false,
    lineActionResponse: LINE_ACTION_RESPONSE_INITIAL_STATE,
    rxAuthorizationSubmitResponse: {
      successful: false,
      errors: []
    } as PbmAuthSubmitResponse,
    authorizationDetails: {
      pharmacyInformationForm: {
        pharmacy: null,
        callerName: null,
        callerNumber: null
      },
      authorizationReassignedIndicator: {
        currentPhiMemberId: null,
        currentClaimNumber: null,
        phiMemberId: null
      },
      authorizationLockIndicatorBanner: {
        locked: false,
        lockedBy: null,
        lockedUntil: null
      },
      showDenialReasons: false,
      showSecondDenialReason: false,
      authorizationDenialReasons: [],
      authorizationDiscardReasons: [],
      authorizationActionLabel: '',
      authorizationDetailsHeader: {
        creationDate: null,
        status: null,
        pharmacy: null,
        lomnSupported: false
      },
      authorizationLineItems: [],
      authorizationNotes: [],
      currentClaimNum: null,
      authorizationType: null,
      authorizationId: 0,
      patientWaiting: false,
      adjusterEmail: '',
      claimMme: null,
      healtheHeaderBar: {
        claimNumber: '',
        authorizationType: '',
        authorizationId: 0,
        patientWaiting: ''
      },
      isReconsideration: false,
      showLAThresholdMessage: false,
      fatalErrorFound: false,
      initializationErrors: []
    }
  },
  pbmLOMNWizardState: { ...LOMN_INITIAL_STATE },
  pbmAuthClaimReassignmentState: { ...ClaimReassignmentInitialState }
};
