import {
  AuthorizationInformationState,
  PbmAuthFooterConfig,
  PbmAuthFormMode,
  PbmAuthNotesConfig,
  PbmAuthPOSFooterConfig,
  PbmAuthSubmitResponse
} from './pbm-authorization-information.model';

import { FormGroup } from '@angular/forms';
import { LOMNWizardState } from './create-lomn.models';
import {
  PbmAuthClaimReassignmentState
} from './pbm-authorization-reassignment.model';
import { LOMN_INITIAL_STATE } from './lomn-initial-state';
import { Subject } from 'rxjs';

export interface SaveDecisionRequest {
  index: number;
  successSubject: Subject<null>;
}

export interface Authorization {
  authorizationType: string;
  authorizationId: string;
}

export interface PBMAuthorizationState {
  pbmAuthorizationInformationState: AuthorizationInformationState;
  pbmLOMNWizardState: LOMNWizardState;
  pbmAuthClaimReassignmentState: PbmAuthClaimReassignmentState;
  isLoading: boolean;
}

export interface AuthorizationQuery {
  authorizationId: string;
}

export const PBM_AUTH_POS_FOOTER_DEFAULT_CONFIG: PbmAuthPOSFooterConfig = {
  showRequestedCallbackFields: false,
  callerFormGroup: new FormGroup({})
};

export const PBM_AUTH_FOOTER_DEFAULT_CONFIG: PbmAuthFooterConfig = {
  footerConfig: PBM_AUTH_POS_FOOTER_DEFAULT_CONFIG,
  submitClickedBefore: false,
  showErrors: false,
  submitted: false,
  pbmAuthformGroup: new FormGroup({})
};

export const PBM_AUTH_NOTES_DEFAULT_STATE: PbmAuthNotesConfig = {
  noteTitle: 'Prescription Notes',
  placeholder: 'Enter Additional Notes',
  confirmServiceName: 'ePAQ',
  requiredErrorMessage: 'Please enter a note.',
  inLineNotes: true,
  authorizationLevelNotes: false,
  historyNotes: true,
  addNoteButton: true,
  warnAboutSavingNote: true,
  isAnExpandableSection: true,
  showCharCount: false,
  autoExpandOnLoad: false,
  autoExpandWhenNotesPresent: true,
  pendActionCondition: true,
  avoidSubmitOriginalValue: false,
  orginalValue: '',
  mode: PbmAuthFormMode.ReadWrite
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
    isSubmitingByPassPriorAuthSuccess: false,
    isSubmitingByPassPriorAuth: false,
    isLastDecisionSave: false,
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
  pbmAuthClaimReassignmentState: { isSearching: false, searchResponse: [] }
};
