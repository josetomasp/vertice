import {
  ReferralAuthorizationItem
} from '../../referral-authorization/referral-authorization.models';

export enum CancelTransportationReferralModalModelActionResultType {
  Success,
  Submit,
  Cancel,
  Fail
}

export interface CancelRecord {
  cancelReason: string;
  authorizationId: number;
}

export interface CancelTransportationReferralModalResult {
  actionResult: CancelTransportationReferralModalModelActionResultType;
  cancelRecords: CancelRecord[];
}

export interface CancelTransportationReferralResult {
  actionResult: CancelTransportationReferralModalModelActionResultType;
  errors: string[];
}

export interface CancelTransportationReferralModalData {
  authData: ReferralAuthorizationItem[];
  cancelReasons: string[];
}
