import {
  HealtheComponentConfig,
  PbmPharmacyModalOpenerData
} from '@modules/healthe-grid';
import { FormGroup } from '@angular/forms';
import { VerticeResponse } from '@shared/models/VerticeResponse';
import { PayeeInfoData } from './payee-info.data';
import {
  AuthorizationLineItem,
  PbmAuthorizationDatePickerPreset
} from './pbm-authorization-information/authorization-line-item.models';
import {
  PbmAuthorizationNote
} from './pbm-authorization-information/pbm-authorization-note.models';
import {
  PbmAuthorizationServiceType
} from './pbm-authorization-service-type.models';
import { CompoundModalData } from '@shared';
import {
  PrescriberInformationLookupModel
} from '@modules/prescriber-information-lookup';

export interface PrescriptionDetails {
  alertMessage: string;
  numberOfAlerts: number;
  prescriberName: string;
  prescriberId: string;
  serviceDate: string;
  reasonRejected: string[];
  dispensedPrescName: string;
  dispensedPrescNameID: string;
  fullPrescName: string;
  fullPrescNameID: string;
  brandGenericStatus: string;
  inDrugPlan: string;
  quantity: number;
  totalAWP: string;
  deaDrugClass: string;
  daysSupply: number;
  daw: number;
  previousDecision: string;
  previousDecisionDate: string;
}

export interface AuthorizationRiskInformation {
  prescriptionMME: number;
  mmeBeforeRX: number;
  mmeAfterRX: number;
  estimatedPillCountOnHand: number;
}

export interface RxAuthorizationInformationQuery {
  authorizationId: string;
  isRTR?: boolean;
}

export interface AuthorizationInformation {
  riskInformation: AuthorizationRiskInformation;
  prescriptionDetails: PrescriptionDetails;
  authorizationAlerts: AuthorizationAlert[];
}

export interface AuthorizationAlert {
  alertSummary: string;
  alertModalHTML: string;
}

export interface AuthorizationInformationState {
  isLoading: boolean;
  locked: boolean;
  formState?: RxAuthorizationFormState;
  submittingRxAuthorization: boolean;
  preparingPaperAuthorization: boolean;
  savingAuthorization: boolean;
  isLastDecisionSave: boolean;
  isSubmitingSamDose: boolean;
  isSubmitingByPassPriorAuth: boolean;
  isSubmitingByPassPriorAuthSuccess: boolean;
  rxAuthorizationSubmitResponse: PbmAuthSubmitResponse;
  authorizationSavingResponse?: VerticeResponse<void>;
  paperAuthorizationPrepareResponse?: VerticeResponse<PbmPreparePaperAuthorizationResponse>;
  lineActionResponse?: VerticeResponse<AuthorizationDetails>;
  authorizationDetails: AuthorizationDetails;
  rxAuthorizationErrorState?: string[];
  paperReassignResponse?: VerticeResponse<string>;
}

export interface AuthorizationDetailsHeader {
  status: string;
  creationDate: string;
  pharmacy: PbmPharmacyModalOpenerData;
  lomnSupported: boolean;
  // TODO: THIS WILL NEED TO BE MOVE TO A DIFFERENT MODEL ONCE WE KNOW HOW DIFFERENT THE PAPER MODEL IS
  dateLoaded?: string;
  dateBillReceived?: string;
  dateModified?: string;
  reconsideration?: boolean;
  attachments?: boolean;
  billLevelRejectionReason?: string;
  imageNumber?: string;
  imageNumberURL?: string;
  payee?: PayeeInfoData;
  invoiceTotal?: string;
  pharmacyNetworkProvider?: boolean;
}

export interface ActionCardConfig {
  actionFormConfig: PbmInfoAndActionsData;
  prescriberFormConfig: HealtheComponentConfig;
  authorizationId: number;
  authorizationType: string;
  mode: PbmAuthFormMode;
}

export interface AuthorizationDenialReason {
  value: string | number;
  label: string;
  validOnlyInLomnState: boolean;
  showURLetterWarningMessage: boolean;
  displaySecondaryDenialReason: boolean;
}

export interface AuthorizationDetails {
  pharmacyInformationForm: PbmPharmacyInformationForm;
  authorizationLockIndicatorBanner: PbmAuthorizationLockIndicator;
  authorizationReassignedIndicator: PbmAuthorizationReassignedIndicator;
  showReassignButton?: boolean;
  showSendEmailButton?: boolean;
  // TODO: Check which of the following properties can we delete after all refactor stories
  showDenialReasons: boolean;
  showSecondDenialReason: boolean;
  authorizationActionLabel: string;
  authorizationDenialReasons: AuthorizationDenialReason[];
  authorizationDiscardReasons: string[];
  authorizationDetailsHeader: AuthorizationDetailsHeader;
  authorizationLineItems: AuthorizationLineItem[];
  authorizationNotes?: PbmAuthorizationNote | PbmAuthorizationNote[];
  reviewerAlerts?: PbmAuthorizationReviewerAlert[];

  currentClaimNum: string;
  authorizationType: string;
  authorizationId: number;
  patientWaiting: boolean;
  adjusterEmail: string;
  claimMme: number;
  healtheHeaderBar: HealtheHeaderBar;

  isReconsideration: boolean;
  showLAThresholdMessage: boolean;

  fatalErrorFound: boolean;
  initializationErrors: string[];

  adjusterRequestCallbackDateTime?: string;
}

export interface PbmAuthorizationLockIndicator {
  locked: boolean;
  lockedBy: string;
  lockedUntil: string;
}

export interface HealtheHeaderBar {
  claimNumber: string;
  authorizationType: string;
  authorizationId: number;
  patientWaiting: string;
}

export interface PbmAuthorizationReassignedIndicator {
  phiMemberId: string;
  currentPhiMemberId: string;
  currentClaimNumber: string;
}

export interface PbmPharmacyInformationForm {
  pharmacy: PbmPharmacyModalOpenerData;
  callerName: string;
  callerNumber: string;
}

export interface PbmInfoAndActionsData {
  reviewLevelValue: string;
  effectiveDateTo: string;
  lomnActionDate?: string;
  lomnAction?: string;
  compoundModalData?: CompoundModalData;
  lomnSupported: boolean;
  currentUsersDecisionIsPreliminary?: boolean;
  claimMme: number;
  permissibleActionsForCurrentUser: string[];
  status: string;
  actionMessageReplacement?: string;
  showOneTimeOnlyMessage?: boolean;
  lastDesicionNarrative: string;
  drugDisplayName: PbmAuthLineItemDisplayName;
  maxDate: Date;
  slrMessage?: string;
  specialWorkflowMessage?: string;
  approveButtons: {
    displayInitial: boolean;
    displayFinal: boolean;
  };
}

export interface PbmAuthNotesConfig {
  noteTitle: string;
  placeholder: string;
  confirmServiceName?: string;
  requiredErrorMessage?: string;
  inLineNotes: boolean;
  authorizationLevelNotes: boolean;
  historyNotes: boolean;
  addNoteButton: boolean;
  warnAboutSavingNote: boolean;
  isAnExpandableSection: boolean;
  autoExpandOnLoad: boolean;
  autoExpandWhenNotesPresent: boolean;
  pendActionCondition: boolean;
  avoidSubmitOriginalValue: boolean;
  showCharCount: boolean;
  maxCharNumber?: number;
  orginalValue: string;
  customErrorMessages?: Map<string, string>;
  mode: PbmAuthFormMode;
}

export interface PbmAuthFooterConfig {
  footerConfig?: PbmAuthPOSFooterConfig;
  submitClickedBefore: boolean;
  showErrors: boolean;
  submitted: boolean;
  isCompletedAuthorization?: boolean;
  authorizationType?: PbmAuthorizationServiceType;
  pbmAuthformGroup: FormGroup;
  authorizationDetails?: AuthorizationDetails;
  mode?: PbmAuthFormMode;
}

export interface PbmAuthPOSFooterConfig {
  showRequestedCallbackFields: boolean;
  callerFormGroup?: FormGroup;
}

export interface PbmAuthSubmitSuccessModalConfig {
  title: string;
  bodyText: string;
  buttonClass: string[];
  returnToURL: string;
  returnToLabel: string;
  remainLabel: string;
  copyToClipboardLabel: string;
}

export enum PbmAuthFormMode {
  ReadWrite = 'editable',
  ReadOnly = 'review'
}

export enum ApprovalPeriodType {
  AUTH_INFO_APPROVAL_PERIOD_ONE_TIME = 'AUTH_INFO_APPROVAL_PERIOD_ONE_TIME',
  AUTH_INFO_APPROVAL_PERIOD_DATE = 'AUTH_INFO_APPROVAL_PERIOD_DATE'
}

export enum DenialPeriodType {
  AUTH_INFO_DENIAL_PERIOD_ONE_TIME = 'AUTH_INFO_DENIAL_PERIOD_ONE_TIME',
  AUTH_INFO_DENIAL_PERIOD_DATE = 'AUTH_INFO_DENIAL_PERIOD_DATE',
  AUTH_INFO_DENIAL_INDEFINITELY = 'AUTH_INFO_DENIAL_INDEFINITELY'
}

export interface RxAuthorizationFormState {
  lineItemsFormArray: AuthorizationLineItem[];
  noteFormControl: string;
}

export interface PbmAdjusterNotification {
  adjusterEmail: string;
  fullAuthorizationUrl: string;
  claimNumber: string;
}

export interface PbmAuthorizationReviewerAlert {
  alertMessage?: string;
  isThresholdAlert?: boolean;
  ncpdp?: number;
  npi?: number;
  rejectAlert?: string;
  thresholdCapAmount?: number;
  totalPaidToDate?: number;
}

export interface PbmAuthSubmitMessage {
  authorizationId: number;
  isPatientWaiting?: boolean;
  sendPatientWaitingStatusChangeNotification?: boolean;
  callerName?: string;
  callerNumber?: string;
  adjusterCallbackDate?: string;
  adjusterCallbackTime?: string;
  authorizationLineItems: PbmAuthSubmitMessageLineItem[];
}

export interface PbmAuthSubmitMessageLineItem {
  lineItemId: number;
  action: string;
  actionPeriodDate?: string;
  prescriberInformation?: PrescriberInformationLookupModel;
  denialReason1?: AuthorizationDenialReason;
  denialReason2?: AuthorizationDenialReason;
  note?: string;
}

export interface PbmAuthSubmitResponse {
  response?: AuthorizationDetails;
  errors?: string[];
  successful: boolean;
}

export interface PbmPosAuthorizationSaveRequest {
  callbackNumber: string;
  contactName: string;
  internalNote: string;
  isPatientWaiting: boolean;
  didPatientWaitingStatusChange: boolean;
  sendPatientWaitingStatusChangeNotification: boolean;
  adjusterCallbackDate?: string;
  adjusterCallbackTime?: string;
  adjusterNotification?: PbmAdjusterNotification;
}

export interface ValidationErrorFilter {
  includeFilter?: string[];
  removeFilter?: string[];
}

export interface PbmPaperAuthorizationSaveMessage {
  note: PbmPaperAuthorizationPrepareNote;
  submittedBy: String;
  prescriptionManualAuthorizations: PbmPaperAuthorizationPreparePrescriptionManualAuthorizations[];
}

export interface PbmPaperAuthorizationPrepareMessage {
  note: PbmPaperAuthorizationPrepareNote;
  submittedBy: String;
  prescriptionManualAuthorizations: PbmPaperAuthorizationPreparePrescriptionManualAuthorizations[];
}

export interface PbmPaperAuthorizationSubmitMessage
  extends PbmPaperAuthorizationPrepareMessage {
  positiveDrugs?: PbmSubmitDateLimit[];
  positiveDoctors?: PbmSubmitDateLimit[];
  negativeDrugs?: PbmSubmitDateLimit[];
  negativeDoctors?: PbmSubmitDateLimit[];
}

export interface PbmSubmitDateLimit {
  itemName: string;
  authType: string;
  actionUntilDate: string;
  dea?: string;
  ndc?: string;
}

export interface PbmPaperAuthorizationPrepareNote {
  createdBy: string;
  description: string;
}
export interface PbmPaperAuthorizationPreparePrescriptionManualAuthorizations {
  prescriptionId: number;
  claimsProfessionalOverrideAmount: number;
  authorizationActionInfo: PbmPaperAuthorizationPrepareAuthorizationActionInfo;
}
export interface PbmPaperAuthorizationPrepareAuthorizationActionInfo {
  action: string;
  primaryReasonCode: string;
  primaryReasonDescriptionForAction: string;
  secondaryReasonCodeForAction: string;
  secondaryReasonDescriptionForAction: string;
  actionUntilDate?: string;
  actionUntilMessage?: string;
}

export interface PbmPaperAuthorizationSubmitPrescription {
  action: string;
  prescriptionId: number;
  actionPeriodDate: string;
  actionUntilMessage?: string;
  denialReason1: AuthorizationDenialReason;
  denialReason2: AuthorizationDenialReason;
  claimsProfessionalOverrideAmount: number;
}

export interface PbmReassignNewClaim {
  phiMemberKey: string;
  claimNumber: string;
}
export interface PbmPreparePaperAuthorizationResponse {
  negativeDoctors: PbmPaperDateItem;
  positiveDoctors: PbmPaperDateItem;
  negativeDrugs: PbmPaperDateItem;
  positiveDrugs: PbmPaperDateItem;
}
export interface PbmPaperDateItem {
  commonLimits: PbmAuthorizationDatePickerPreset[];
  priorAuthlimits: PbmPriorAuthlimits[];
}

export interface PbmPriorAuthlimits {
  limits: PbmAuthorizationDatePickerPreset[];
  itemName: string;
  dateFilled: string;
  dea?: string;
  ndc?: string;
  authType: string;
}

export interface PbmAuthLineItemDisplayName {
  label: string;
  class?: string;
  isCompound: boolean;
  canItOpenLookupModal: boolean;
}
