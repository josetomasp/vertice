import { AuthorizationHistoryState } from './authorization-history.models';
import { FusionClinicalHistoryState } from './fusion/fusion-clinical-history.models';
import {
  ReferralActivityState,
  ReferralNote
} from './referral-activity.models';
import { ClaimLocation } from './make-a-referral.models';
import { Observable } from 'rxjs';

export interface ReferralOverviewCardState {
  referralType: string;
  referralId: string;
  dateCreated: string;
  status: string;
  vendorName: string;
  vendorCode: string;
  prescriberName: string;
  prescriberPhone: string;
  requestorName: string;
  requestorRoleAndTitle: string;
  requestorEmail: string;
  requestorPhone: string;
  diagnosisCodeAndDescription: string[];
  icdCodes: ICDCode[];
  icdCodesModal: ICDCodesModalState;
  notes: ReferralNote[];
  isLoading: boolean;
  errors: any[];
  authorizedLocationsModalData: AuthorizedLocationsModalData;
  displayReferralLocationsLink: boolean;
}

export interface ReferralIdState {
  referralOverviewCard: ReferralOverviewCardState;
  referralActivity: ReferralActivityState;
  authorizationHistory: AuthorizationHistoryState;
  fusionClinicalHistory: FusionClinicalHistoryState;
}

export interface ICDCodesModalState {
  isSaving: boolean;
  icdCodeSaveDisabled: boolean;
}

export interface ICDCode {
  icdCode: string;
  icdDescription: string;
  icdVersion: number;
}

export interface ICDCodeSaveRequest {
  icdCodeList: ICDCode[];
  referralId: string;
  customerId: string;
  isCore: boolean;
}

export interface ReferralDocument {
  attachmentSource: string;
  dateTimeCreated: string | Date;
  documentType: string;
  linkToDownloadAttachment: string;
  name: string;
  notes: string;
}

export interface ReferralGenericQuery {
  customerId?: string;
  claimNumber: string;
  referralId: string;
  archType?: string;
}

export interface ReferralOverviewQuery {
  customerId: string;
  claimNumber: string;
  referralId: string;
  archType?: string;
}

export interface AuthorizedLocationsModalData {
  startDate: string;
  endDate: string;
  serviceType: string;
  unlimitedTrips: boolean;
  tripsAuthorized: number;
  noLocationRestrictions: boolean;
  specifyTripsByLocation: boolean;
  authorizedLocationsByType: ClaimLocationsOfType[];
}

export interface ClaimLocationsOfType {
  locationTypeDescription: string;
  locations: ClaimLocation[];
}

export interface LabelValuePairWithModalData {
  label: string;
  value?: string | any;
  hasModalData: boolean;
  modalConfig?: ModalConfig;
  shouldDisplay?: Observable<boolean>;
}

export interface ModalConfig {
  linkDisplayText: string;
  modalData: any;
  modalType: ModalType;
}

export enum ModalType {
  ReferralLocations
}
