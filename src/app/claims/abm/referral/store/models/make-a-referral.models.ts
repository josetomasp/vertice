import { RequestorInformationFormFieldNames } from "../../make-a-referral/requestor-information-form/requestor-information.formFieldNames";

export interface WizardBaseStepConfig {
  serviceName: string;
  reviewName: string;
  vendorsName: string;
  documentsName: string;
}

export interface SubServiceStep {
  labelClass?: string;
  iconClass?: string;
  label: string;
  name: string;
}

export interface DocumentTableItem {
  fileName: string;
  fileSize: number;
  submittedBy: string;
  submitDate: string;
  file: File;
  documentType?: string;
  readOnly?: boolean;
  fileURL?: string;
}

export interface VendorsFormState {
  all: ReferralVendor[];
}

export interface DocumentsFormState {
  documents: DocumentTableItem[];
}

export interface CustomerServiceGroupSubType {
  customerSubTypeId: number;
  customerTypeId: number;
  subTypeDescription: string;
}

export interface CustomerServiceGroupConfiguration {
  groupName: string;
  subTypes: CustomerServiceGroupSubType[];
}

export interface CustomerServiceConfiguration {
  serviceId: number;
  serviceName: string;
  groupConfigurations: CustomerServiceGroupConfiguration[];
}

export enum DateFormMode {
  SpecificDate = 'Specific Date(s)',
  DateRange = 'Date Range'
}

export enum VendorSelectionMode {
  REORDER_SELECT = 'REORDER_SELECT',
  REORDER_ONLY = 'REORDER_ONLY',
  READ_ONLY = 'READ_ONLY'
}

export interface LocationType {
  code: string;
  description: string;
}

export interface MakeReferralOptions {
  isLoaded?: boolean;
  appointmentTypes: string[];
  languages: string[];
  approvedLocations: ClaimLocation[];
  locationTypes: LocationType[];
  physicianSpecialties: string[];
  vendors: ReferralVendor[];
  vendorMode: VendorSelectionMode;
  vendorAutoPopulation: boolean;
}

export interface ReferralManagementTransportationTypes {
  isLoaded?: boolean;
  types: ReferralManagementTransportationType[];
}

export interface ReferralManagementTransportationType {
  code: string;
  description: string;
  group: string;
  id: number;
  insurancePayer: string;
}

export interface ClaimLocation {
  id?: string;
  type: string;
  typeDescription?: string;
  address: string;
  name: string;
  tripsAuthorized?: number;
}

export interface ReferralBodyPart {
  ncciCode: string;
  desc: string;
  descOriginal?: string;
  sideOfBody: string;
  selected: boolean;
}

export interface ReferralVendor {
  name: string;
  code: string;
}

export interface ReferralLocationCreateRequest {
  address: ReferralGroundLocationAddress;
  locationName: string;
  physicianSpecialty: string;
  type: string;
  typeDescription: string;
  id?: number;
  locationRequestType?: string;
  locationPhone?: string;
}

export interface ReferralGroundLocationAddress {
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  state: string;
  zipCode: string;
  zipCodeExt: string;
}

export interface MakeReferralState {
  selectableServices: SelectableService[];
  /**
   *   These are the high level service
   *   Transportation, Language, DME, etc...
   */
  selectedServiceTypes: string[];
  /**
   * These are the subtypes
   * Transportation: ["sedan", "wheelchair"],
   * Language: ["on-site-translation"]
   */
  selectedServiceDetailTypes: { [key: string]: string[] };
  sectionStatuses: { [key: string]: string };
  sectionDirty: { [key: string]: boolean };
  referralId?: string;
  formState: { [key: string]: { [key: string]: any } };
  referralLevelNotes: string;

  validFormStates: string[];
  transportationOptions: MakeReferralOptions;
  requestorInformationOptions: RequestorInformationOptions;
  approvedLocationsIsLoaded: boolean;
  savingNewTransportationLocation: boolean;
  transportationTypes: ReferralManagementTransportationTypes;
  customerServiceConfigurations: CustomerServiceConfiguration[];

  returnedFormState: { [key: string]: { [key: string]: any } };
  returnedReferralLevelNotes: string;
  inReviewMode: boolean;
  loadedFromDraft: boolean;
  errors: string[];
}

export interface ActiveReferral {
  referralId: number;
  serviceType: string;
  datesOfService: string;
  vendor: string;
  status: string;
  submittedBy: string;
  url: string;
}

export interface SelectableService {
  domain: string;
  serviceType: string;
  serviceCode: string;
  activeReferrals?: ActiveReferral[];
}

export interface WizardStep {
  name: string;
  icon: string[];
  label: string;
  help?: string;
  groupName?: string;
}

export interface ReferralSubmitMessage {
  claimNumber: string;
  referralId?: string;
  customerId: string;
  saveAsDraft: boolean;
  referralLevelNotes: string;
  formValues: { [key: string]: any };
}

export interface RequestorRole {
  code: string;
  description: string;
}

export interface RequestorInformationOptions {
  intakeMethods: string[];
  providers: string[];
  roles: RequestorRole[];
  uros: string[];
}

export interface RequestorInformationFormState {
  [RequestorInformationFormFieldNames.CUSTOMER_TRACKING_NUMBER]?: string;
  [RequestorInformationFormFieldNames.HEALTHE_TRACKING_NUMBER]?: string;
  [RequestorInformationFormFieldNames.PASSPORT_PROVIDER_TAX_ID]?: string;
  [RequestorInformationFormFieldNames.REQUESTOR_EMAIL]?: string;
  [RequestorInformationFormFieldNames.REQUESTOR_NAME]?: string;
  [RequestorInformationFormFieldNames.REQUESTOR_ROLE]?: string;
  [RequestorInformationFormFieldNames.INTAKE_METHOD]?: string;
  [RequestorInformationFormFieldNames.REQUESTOR_PHONE]?: string;
  [RequestorInformationFormFieldNames.URO]?: string;
}

export const REFERRAL_REQUESTOR_INFORMATION = 'requestor-information';

export const REFERRAL_TRANSPORTATION_OPTIONS_INITIAL_STATE: MakeReferralOptions = {
  isLoaded: false,
  appointmentTypes: [],
  languages: [],
  approvedLocations: [],
  locationTypes: [],
  physicianSpecialties: [],
  vendors: [],
  vendorMode: VendorSelectionMode.REORDER_SELECT,
  vendorAutoPopulation: true
};

export const REFERRAL_TRANSPORTATION_TYPES_INITIAL_STATE: ReferralManagementTransportationTypes = {
  isLoaded: false,
  types: []
};

export const makeReferralInitialState: MakeReferralState = {
  selectableServices: [],
  selectedServiceTypes: [],
  selectedServiceDetailTypes: {},
  sectionDirty: {},
  sectionStatuses: {},
  formState: {},
  validFormStates: [],
  transportationOptions: REFERRAL_TRANSPORTATION_OPTIONS_INITIAL_STATE,
  requestorInformationOptions: {
    intakeMethods: [],
    uros: [],
    providers: [],
    roles: []
  },
  approvedLocationsIsLoaded: false,
  savingNewTransportationLocation: false,
  transportationTypes: REFERRAL_TRANSPORTATION_TYPES_INITIAL_STATE,
  referralLevelNotes: '',
  customerServiceConfigurations: [],
  loadedFromDraft: false,
  /**
   * Post Submit
   */
  inReviewMode: false,
  errors: null,
  returnedFormState: null,
  returnedReferralLevelNotes: undefined
};
