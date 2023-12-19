import { NarrativeTextItem } from '../../../referralId/referral-authorization/referral-authorization.models';
import { DocumentTableItem } from '../make-a-referral.models';
import { FusionICDCode } from './fusion-make-a-referral.models';
import { NoteOriginator } from '..';

export interface FusionClinicalAlert {
  hesReferralDetailId: number;
  authorizationId: number;
  id: number;
  name: string;
  message: string;
  attachmentName: string;
  type: string;
  attachmentUrl: string;
}

export interface FusionAuthorizationResponse {
  rush: boolean;
  pendExpireDate?: string;
  noteList: NoteList[];
  authorizations: FusionAuthorization[];
  clinicalAlerts: FusionClinicalAlert[];
}

export interface FusionAuthorization {
  action: string;
  actionId?: number | number[];
  pendType: string;
  reasonForAction: string;
  explanationId?: number;
  actionValue?: AuthorizationReasonCombined;
  authorizationUnderReview: AuthorizationUnderReview;
  authorizationChangeSummary: AuthorizationChangeSummary[];
  narrativeTextList: NarrativeTextItem[];
  reasonsReviewNeeded: string[];
  alertInfoList?: AlertInfo[];
  customerStatusReasonDesc?: string;
}

export interface FusionSubmitAuthorization {
  action?: string;
  pendType?: string;
  reasonForAction?: string;
  authorizationUnderReview: AuthorizationUnderReview;
  authorizationChangeSummary: AuthorizationChangeSummary[];
  reasonsReviewNeeded: string[];
  alertInfoList?: AlertInfo[];
  customerStatusReasonDesc?: string;
}

export interface FusionAuthorizationCancel {
  isCancelling: boolean;
  description: string;
  dateOfServiceOrDateRange: string;
  cancelReason: AuthorizationDetailReason;
  authorizationId: number; // Hidden from table
  allowCancel: boolean; // Hidden from table
  reasonForAction: string;
}

export interface FusionAuthorizationCancelSubmitReason {
  authorizationId: number;
  reasonId: number;
}

export interface FusionAuthorizationCancelSubmit {
  referralId: string;
  authorizations: FusionAuthorizationCancelSubmitReason[];
}

export interface AlertInfo {
  alertDescription: string;
  alertModalBody: string;
  attachmentId: string;
  url: string;
  alertDate: string;
}

export interface LocationSummary {
  locationId: number;
  remainingQuantity: number;
  totalQuantity: number;
}

export interface AuthorizationChangeSummary {
  changeType?: string;
  newQuantity?: number;
  quantityRequested?: number;
  quantityCompleted?: number;
  previousQuantityApproved?: number;
  newTotalQuantityApproved?: number;
  newStartDate?: string;
  newEndDate?: string;
  originalEndDate?: string;
  locationID?: number;
  limit?: number;
  locationSummary?: LocationSummary[];
}

export interface AuthorizationUnderReview {
  authType: string;
  authSubType?: string;
  allowCancel?: boolean;
  categoryDesc: string;
  categoryLongDesc?: string;
  authorizationId: number;
  hesReferralDetailId?: number;
  rush: boolean;
  noteList: NoteList[];
  startDate?: string;
  endDate?: string;
  lastServiceDate?: string;
  quantity: number;
  authorizationAmount?: number;
  authMaxQty?: number;
  quantityCompleted?: string;
  authorizedPrice?: string;
  feeUcrAmt?: string;
  feeUcr?: string;
  perDiem?: number;
  requestedByRole?: string;
  requestedByName?: string;
  requestorName?: string;
  requestorRole?: string;
  expectedAmount?: string;
  vendorExpectedAmount?: string;
  hcpcCode?: string;
  hcpc?: string;
  uom?: string;
  unitOfMeasure?: string;
  anticipatedDeliveryDate?: string;
  locations?: FusionAuthorizationLocation[];
  bodyParts?: FusionAuthorizationBodyPart[];
  dateOfService?: string;
  appointmentDate?: string;
  icdCodes?: FusionICDCode[];

  // DME Susbtitution
  isSubstitution?: boolean;
  substitutionApproved?: boolean;
  substitutionAuthorizationUnderReview?: SubstitutionAuthorizationUnderReview;
}

export interface SubstitutionAuthorizationUnderReview {
  action?: string;
  pendType?: string;
  reasonForAction?: string;
  authMaxQty?: number;
  authorizedPrice?: string;
  feeUcrAmt?: string;
  dateOfService?: string;
  startDate?: string;
  endDate?: string;
  anticipatedDeliveryDate?: string;
  description?: string;
  hcpc?: string;
  uom?: string;
  vendorExpectedAmount?: string;
  status?: string;
  authMaxAmount?: string;
  authorizationId?: string;
  originalQuantity?: string;
}

export enum FusionAuthorizationLocationStatus {
  UnderReview = 'Under Review',
  Approved = 'Approved',
  ApprovedOneTime = 'Approved One Time'
}

export interface FusionAuthorizationLocation {
  status: FusionAuthorizationLocationStatus;
  approved?: boolean;
  serviceLevelTypeDesc: string;
  numAppointments: number;
  locationId: number;
  locationDetails: LocationDetail[];
}

export interface FusionAuthorizationBodyPart {
  id: string | number;
  description: string;
  descOriginal?: string;
  sideOfBody?: string;
  lastActionDate: string;
  status?: string;
  disabled?: boolean;
}

export interface FusionBodyPartHistory {
  authorizationDescription: string;
  bodyParts: FusionAuthorizationBodyPart[];
}

export interface FusionAuthorizationBodyPartApprovalOptions {
  label: string;
  value: string;
}

export interface FusionDisplayAuthorizationLocation
  extends FusionAuthorizationLocation {
  change: LocationSummary;
}

export interface LocationDetail {
  locationTypeDesc: string;
  locationDetailName: string;
}

export interface NoteList {
  createdDate: string;
  createdBy: string;
  description: string;
  noteOrigination?: NoteOriginator;
}

export interface DocumentFusionTableItem {
  fileName: string;
  fileSize: number;
  submittedBy: string;
  submitDate: string;
  fileURL: string;
  file: string; // encoded in Uint8Array
  documentType?: string;
}

export interface DocumentsFusionFormState {
  documents: DocumentFusionTableItem[];
}

export interface DocumentsAuthorization {
  list: DocumentTableItem[];
  isLoading: boolean;
}

// Fusion Authorization Reasons
export enum AuthorizationHeaderReasonGroupCodes {
  APPROVAL = 'APPR',
  DENY = 'DENY',
  PEND = 'PEND',
  PENDINT = 'PENDINT',
  PENDVEND = 'PENDVEND'
}

export enum AuthorizationDetailReasonGroupCodes {
  APPROVAL = 'APPR',
  APPROVALSUB = 'APPRSUB',
  CANC = 'CANC',
  DENY = 'DENY',
  PEND = 'PEND',
  PENDINT = 'PENDINT',
  PENDVEND = 'PENDVEND'
}

export const AuthorizationExtendableStatuses = ['Authorized', 'AUTHORIZED'];

export interface AuthorizationReasonCombined {
  explanationId?: number;
  explanationDescription?: string;
  actionId: number | number[];
  actionDescription: string;
  actionGroupCode: string;
  actionConfig?: AuthorizationHeaderReasonConfig;
}

export interface AuthorizationHeaderReason {
  actionDescription: string;
  actionId: number[];
  actionGroupCode: string;
  actionConfig?: AuthorizationHeaderReasonConfig;
}

export interface AuthorizationHeaderReasonConfig {
  expirationDateNeeded: boolean;
  expirationDateMaxDate: string;
  inlineHide?: boolean;
  disableInlineActions?: boolean;
}

export interface AuthorizationDetailReason {
  explanationId: number;
  explanationDescription: string;
  actionDescription: string;
  actionId: number;
  isOtherReason: string;
  actionGroupCode: string;
}

export interface AuthorizationReasonsResponse {
  headerActions: AuthorizationHeaderReason[];
  detailActions: AuthorizationDetailReason[];
}

export interface AuthorizationReasons {
  approvalLineItemReasons: AuthorizationReasonCombined[];
  approvalHeaderReasons: AuthorizationReasonCombined[];
  denialLineItemReasons: AuthorizationReasonCombined[];
  denialHeaderReasons: AuthorizationReasonCombined[];
  pendLineItemReasons: AuthorizationReasonCombined[];
  pendHeaderReasons: AuthorizationReasonCombined[];
}

export interface FusionAuthorizationPhysicalMedicineDetailsTable {
  dateOfService: string;
  perDiem: string;
  qtyCompleted: string;
  authAmount: string;
  requestorName: string;
}

export interface FusionAuthorizationDiagnosticsDetailsTable {
  dateOfService: string;
  perDiem: string;
  qtyCompleted: string;
  authAmount: string;
  requestorName: string;
}

export interface FusionAuthorizationDMEDetailsTable {
  description: string;
  dateOfService: string;
  qty: string;
  hcpc: string;
  uom: string;
  feeAmount: string;
  expectedAmount: string;
  requestorName: string;
}

export type FusionDetailsTableType = FusionAuthorizationDiagnosticsDetailsTable;

/**
 * Fusions Authorization State
 *
 **/
export interface FusionAuthorizationState {
  authorizations: FusionAuthorization[];
  noteList: NoteList[];
  attachments: DocumentsAuthorization;
  clinicalAlerts: FusionClinicalAlert[];
  pendExpireDate?: string;
}

export interface FusionReferralAuthorizationState {
  originalAuthorizations: FusionAuthorizationState;
  workingAuthorizations: FusionAuthorizationState;
  rush: boolean;
  locked: FusionReferralAuthorizationLocked;
  isLoading: boolean;
  reasons: AuthorizationReasons;
  submittingAuthorizations: boolean;
  submitResponse?: FusionAuthorizationSubmitResponse;
  submittingPMExtension: boolean;
  submittingAuthCancel: boolean;
  submitPMExtensionResponse?: FusionAuthorizationSubmitResponse;
}

export interface FusionReferralAuthorizationLocked {
  isLocked: boolean;
  message?: string;
}

export interface FusionReferralAuthorizationLockedResponse {
  isLocked: boolean;
  errors: string[];
}

export interface AuthorizationFusionSubmitMessage {
  claimNumber: string;
  customerId: string;
  referralId: string;
  archeType: string;
  formValues: { [key: string]: { [key: string]: any } };
}

export interface FusionAuthorizationSubmitResponse {
  status?: number;
  successful?: boolean;
  errors?: string[];
  formValues?: FusionAuthorizationResponse;
}

export interface FusionPMExtensionSubmitMessage {
  customerId: string;
  referralId: string;
  extensions: FusionPMExtensionDetail[];
}

export interface FusionPMExtensionDetail {
  authorizationId: string;
  startDate: string;
  endDate: string;
  orderingProviderName: string;
  orderingProviderPhone: string;
  totalApproved: number;
  icdCodes?: FusionICDCode[];
  bodyParts?: FusionAuthorizationBodyPart[];
  originalBodyParts?:FusionAuthorizationBodyPart[];
  noteList?: NoteList[];
}

export const fusionAuthorizationsInitialState: FusionReferralAuthorizationState =
  {
    originalAuthorizations: {
      authorizations: [],
      noteList: [],
      attachments: {
        list: [],
        isLoading: false
      },
      clinicalAlerts: []
    },
    workingAuthorizations: {
      authorizations: [],
      noteList: [],
      attachments: {
        list: [],
        isLoading: false
      },
      clinicalAlerts: []
    },
    locked: {
      isLocked: false
    },
    rush: false,
    isLoading: false,
    reasons: {
      approvalLineItemReasons: [],
      approvalHeaderReasons: [],
      denialLineItemReasons: [],
      denialHeaderReasons: [],
      pendLineItemReasons: [],
      pendHeaderReasons: []
    },
    submittingAuthorizations: false,
    submitResponse: {},
    submittingPMExtension: false,
  submitPMExtensionResponse: {},
  submittingAuthCancel: false
};
