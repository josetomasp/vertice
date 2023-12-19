import {
  MakeAReferralSearchState
} from '../../../../../search-nav/store/models/make-a-referral-search.models';
import {
  ReferralAuthorizationState
} from '../../referralId/referral-authorization/referral-authorization.models';
import {
  FusionReferralAuthorizationState
} from './fusion/fusion-authorizations.models';
import {
  FusionMakeReferralState
} from './fusion/fusion-make-a-referral.models';
import { MakeReferralState } from './make-a-referral.models';
import { ReferralIdState } from './referral-id.models';
import { SharedMakeReferralState } from './shared-make-a-referral.models';

interface ClaimantOverviewBarState {
  fields: any[];
}

export interface ReferralRootState {
  claimantOverviewBar: ClaimantOverviewBarState;
  errors: any[];
}

export interface ReferralState {
  root: ReferralRootState;
  referralId: ReferralIdState;
  sharedMakeReferral: SharedMakeReferralState;
  makeReferral: MakeReferralState;
  makeAReferralSearch: MakeAReferralSearchState;
  fusionMakeReferral: FusionMakeReferralState;
  referralAuthorization: ReferralAuthorizationState;
  fusionAuthorization: FusionReferralAuthorizationState;
}

export enum ReferralRoutes {
  Create = 'create',
  ServiceSelection = 'serviceSelection',
  Review = 'review',
  Activity = 'activity',
  AuthorizationHistory = 'history',
  ClinicalHistory = 'clinicalHistory',
  AuthorizationReview = 'review',
  Authorization = 'authorization',
  Transportation = 'transportation',
  AllContactAttempts = 'allContactAttempts',
  Language = 'language'
}
