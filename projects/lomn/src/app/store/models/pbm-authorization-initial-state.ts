import { PbmAuthSubmitResponse } from './pbm-authorization-information.model';
import { LOMN_INITIAL_STATE } from './lomn-initial-state';
import { PBMAuthorizationState } from './pbm-authorization.models';

export const PBM_AUTHORIZATION_INITIAL_STATE: Partial<PBMAuthorizationState> = {
  pbmAuthorizationInformationState: {
    isLoading: false,
    locked: false,
    submittingRxAuthorization: false,
    savingAuthorization: false,
    isSubmitingSamDose: false,
    isLastDecisionSave: false,
    rxAuthorizationSubmitResponse: {
      successful: false,
      errors: []
    } as PbmAuthSubmitResponse,
    authorizationDetails: {
      pharmacyInformationForm: {
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
        lomnSupported: false
      },
      authorizationLineItems: [],
      authorizationNotes: [],
      currentClaimNum: null,
      authorizationType: null,
      authorizationId: 0,
      patientWaiting: false,
      claimMme: null,
      healtheHeaderBar: {
        claimNumber: '',
        authorizationType: '',
        authorizationId: 0,
        patientWaiting: ''
      }
    }
  },
  pbmLOMNWizardState: { ...LOMN_INITIAL_STATE }
};
