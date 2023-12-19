import { PbmAuthorizationServiceType } from './pbm-authorization.models';
import { FormGroup } from '@angular/forms';
import { PayeeInfoData } from './payee-info.data';

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
  savingAuthorization: boolean;
  isLastDecisionSave: boolean;
  isSubmitingSamDose: boolean;
  rxAuthorizationSubmitResponse: PbmAuthSubmitResponse;
  authorizationDetails: AuthorizationDetails;
  rxAuthorizationErrorState?: string[];
}

export interface AuthorizationLineItem {
  currentStateName: string;
  nabp: string;
  ndc: string;
  npi: string;
  drugDisplayName: string;
  transactionalMme?: number;
  claimMmeWithPrescription?: number;
  paperLineItemKey: number;
  posLineItemKey: number;
  prescriberFax: string;
  rejectCodes: string;
  rxNumber: string;
  inFormulary: boolean;
  prescriber: AuthorizationLineItemPrescriber;
  dateFilled: string;
  compound: boolean;
  daysSupply: number;
  quantity: number;
  letterType: string;
  displayNotes: string;
  slrIndicator: string; // workflowTransactionPattern
  slrDrugName: string;
  drugItemName: string; // itemName
  brand: string; // multiSource
  totalAwp: number; // drug.currentAwpPrice
  deaClass: string; // deaClass
  lomnActionDate?: string;
  lomnAction?: string;
  previousDecisionNote?: string;
  workflowNotificationType?: string;
  currentUsersDecisionIsPreliminary?: boolean;
  twoLevelApproval: boolean;
  estimatedDaysSupplyOnHand?: number;
  isRxNewToClaim?: boolean;
  previousDecision?: string;
  previousDecisionDate?: string;
  previousDecisionMessage?: string;
  previousDecisionPrimaryReasonCode?: string;
  previousDecisionPrimaryReasonDescription?: string;
  previousDecisionSecondaryReasonCode?: string;
  previousDecisionSecondaryReasonDescription?: string;
  mostRecentQuantity?: number;
  mostRecentDaysSupply?: number;
  reasons?: PbmAuthorizationReason[];
  datePickerPresets?: PbmAuthorizationDatePickerPreset[];
  notes?: PbmAuthorizationNote[];
  ingredients?: PbmAuthorizationIngredient[];
  permissibleActionsForCurrentUser?: string[];
  alerts: any[];
  // TODO: THIS WILL NEED TO BE MOVE TO A DIFFERENT MODEL ONCE WE KNOW HOW DIFFERENT THE PAPER MODEL IS
  totalAmount: number;
  daw: number;
  amountEditable: boolean;
  message?: string;
  // VER-5114 Added last decision
  lastDecisionDateTime?: string;
  lastDecisionComment?: string;
  lastDecisionAction?: string;
  lastDecisionPeriod?: number;
  lastDenialReason1?: number;
  lastDenialReason2?: number;
  isPriorAuthPreviouslyLoaded?: boolean;
}

export interface PbmAuthorizationDatePickerPreset {
  displayString: string;
  numberOfDays: number;
}

export interface PbmAuthorizationReason {
  description: string;
  ncpdpRejectCode: string;
}

export interface PbmAuthorizationIngredient {
  name: string;
  ndc: string;
  quantity: number;
}

export interface AuthorizationLineItemPrescriber {
  prescriberId: string;
  prescriberType: string;
  credential: string;
  name: string;
  foundById: string;
  foundByIdType: string;
  lastName: string;
  middleName: string;
  specialty: string[];
  npi: string;
  deaLicense: string;
  organizations: string[];
  organizationsSpecialty: string[];
  primaryAddress: string[];
  primaryPhone: string;
  primaryAltPhone: string;
  primaryFax: string;
  secondaryAddress: string[];
  secondaryPhone: string;
  secondaryAltPhone: string;
  secondaryFax: string;
}

export interface AuthorizationDetailsHeader {
  status: string;
  creationDate: string;
  lomnSupported: boolean;
  // TODO: THIS WILL NEED TO BE MOVE TO A DIFFERENT MODEL ONCE WE KNOW HOW DIFFERENT THE PAPER MODEL IS
  dateLoaded?: string;
  dateModified?: string;
  reconsideration?: boolean;
  attachments?: boolean;
  billLevelRejectionReason?: string;
  imageNumber?: string;
  imageNumberURL?: string;
  payee?: PayeeInfoData;
  invoiceTotal?: string;
}

export interface ActionCardConfig {
  actionFormConfig: PbmInfoAndActionsData;
  authorizationId: number;
  authorizationType: string;
}

export interface AuthorizationDenialReason {
  value: string;
  label: string;
  validOnlyInLomnState: boolean;
  showURLetterWarningMessage: boolean;
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

  currentClaimNum: string;
  authorizationType: string;
  authorizationId: number;
  patientWaiting: boolean;
  claimMme: number;
  healtheHeaderBar: HealtheHeaderBar;
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
  callerName: string;
  callerNumber: string;
  pharmacy?: {
    displayText: string;
    nabp: string;
    npi: string;
    phone: string;
    timezone: string;
  };
}

export interface PbmAuthorizationNote {
  noteId?: number;
  parentId?: number;
  comment: string;
  userId: string;
  userRole?: string;
  dateTimeCreated: string;
  userModified?: string;
  dateTimeModified?: string;
}

export interface PbmInfoAndActionsData {
  reviewLevelValue: string;
  effectiveDateTo: string;
  lomnActionDate?: string;
  lomnAction?: string;
  lomnSupported: boolean;
  currentUsersDecisionIsPreliminary?: boolean;
  claimMme: number;
  permissibleActionsForCurrentUser: string[];
  status: string;
  actionMessageReplacement?: string;
  showOneTimeOnlyMessage?: boolean;
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

export interface RxAuthorizationLineItemFormState {
  lineItemId?: number;
  action?: string;
  actionPeriodDate?: string;
  approvalPeriodType?: string;
  denialPeriodType?: string;
  primaryDenialReason?: any;
  secondaryDenialReason?: any;
  amount?: number;
  note?: string;
}

export interface PbmAuthSubmitMessage {
  authorizationId: number;
  isPatientWaiting?: boolean;
  callerName?: string;
  callerNumber?: string;
  authorizationLineItems: PbmAuthSubmitMessageLineItem[];
}

export interface PbmAuthSubmitMessageLineItem {
  lineItemId: number;
  action: string;
  actionPeriodDate?: string;
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
  lineItemNote: string;
  rxAuthorizationLineItemIds: string[];
  isPatientWaiting: boolean;
}

export interface PbmPaperAuthorizationSubmitMessage {
  note?: string;
  authorizationPrescriptions: PbmPaperAuthorizationSubmitPrescription[];
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
