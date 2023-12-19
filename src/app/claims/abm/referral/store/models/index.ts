import {
  makeAReferralSearchInitialState
} from '../../../../../search-nav/store/reducers/make-a-referral-search.reducer';
import {
  referralAuthorizationInitialState
} from '../../referralId/referral-authorization/referral-authorization.models';
import {
  authorizationHistoryInitialState
} from './authorization-history.models';
import {
  fusionAuthorizationsInitialState
} from './fusion/fusion-authorizations.models';
import {
  FUSION_CLINICAL_HISTORY_INITIAL_STATE
} from './fusion/fusion-clinical-history.models';
import {
  fusionMakeReferralInitial
} from './fusion/fusion-make-a-referral.models';
import { makeReferralInitialState } from './make-a-referral.models';
import { ReferralActivityState } from './referral-activity.models';
import { ReferralIdState } from './referral-id.models';
import { ReferralRootState, ReferralState } from './referral.models';
import {
  sharedMakeReferralInitialState
} from './shared-make-a-referral.models';

const referralRootInitialState: ReferralRootState = {
  claimantOverviewBar: {
    fields: []
  },
  errors: []
};

export interface ReferralInformationRequest {
  dateOfService: string;
  requestType: string;
  vendorCode: string;
}

export interface ReferralDocumentItem {
  fileName: string;
  submittedBy: string;
  dateReceived: string;
}

export const referralActivityInitialState: ReferralActivityState = {
  details: {
    currentActivityCards: [],
    statusBar: {
      serviceTypes: [],
      summations: {}
    },
    activityTableFilters: {
      date: null,
      status: null,
      stage: null
    },
    hasAdditionalContactAttempts: false,
    allContactAttempts: [],
    selectedServiceType: null,
    isLoading: true,
    errors: []
  },
  referralNotes: {
    notes: [],
    errors: []
  }
};

export const referralIdInitialState: ReferralIdState = {
  referralOverviewCard: {
    referralType: '',
    referralId: '',
    dateCreated: '',
    status: '',
    vendorName: '',
    vendorCode: '',
    prescriberName: '',
    prescriberPhone: '',
    requestorName: '',
    requestorRoleAndTitle: '',
    requestorEmail: '',
    requestorPhone: '',
    diagnosisCodeAndDescription: [],
    icdCodes: [],
    icdCodesModal: { isSaving: false, icdCodeSaveDisabled: true },
    notes: [],
    isLoading: true,
    errors: [],
    authorizedLocationsModalData: {
      startDate: '',
      endDate: '',
      serviceType: '',
      unlimitedTrips: false,
      tripsAuthorized: 0,
      noLocationRestrictions: false,
      specifyTripsByLocation: false,
      authorizedLocationsByType: []
    },
    displayReferralLocationsLink: true
  },
  referralActivity: referralActivityInitialState,
  authorizationHistory: authorizationHistoryInitialState,
  fusionClinicalHistory: FUSION_CLINICAL_HISTORY_INITIAL_STATE
};

export const referralInitialState: ReferralState = {
  root: referralRootInitialState,
  referralId: referralIdInitialState,
  sharedMakeReferral: sharedMakeReferralInitialState,
  makeReferral: makeReferralInitialState,
  fusionMakeReferral: fusionMakeReferralInitial,
  referralAuthorization: referralAuthorizationInitialState,
  makeAReferralSearch: makeAReferralSearchInitialState,
  fusionAuthorization: fusionAuthorizationsInitialState
};

export * from './referral-activity.models';
