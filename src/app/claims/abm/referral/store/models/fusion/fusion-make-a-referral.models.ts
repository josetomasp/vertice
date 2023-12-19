import {
  ClaimLocation,
  CustomerServiceConfiguration,
  CustomerServiceGroupSubType,
  DateFormMode,
  DocumentsFormState,
  LocationType,
  ReferralBodyPart,
  ReferralVendor,
  VendorSelectionMode,
  VendorsFormState
} from '../make-a-referral.models';
import { ICDCode } from '../referral-id.models';
import { ServiceType } from '../../../make-a-referral/make-a-referral-shared';

export interface PhysicalMedicineCommonSchedulingForm {
  bodyParts: ReferralBodyPart[];
  startDate: string;
  endDate: string;
  numberOfVisits: number;
  notes: string;
  subType?: CustomerServiceGroupSubType;
}

export interface PhysicalMedicineSharedForm {
  surgeryDate: string;
  postSurgical: boolean;
  scheduleNear: string;
  diagnosisCodes: ICDCode[];
  prescriberName: string;
  prescriberPhone: string;
  prescriberAddress: string;
}

export interface PhysicalMedicineCommonForm {
  postSurgical: boolean;
  scheduleNear: ClaimLocation;
  diagnosisCode: string[];
  rush: boolean;
  schedulingForm: PhysicalMedicineCommonSchedulingForm[];
  referralId?: string;
}

export interface PhysicalMedicineFormState {
  'physicalMedicine-physicalTherapy': PhysicalMedicineCommonForm;
  'physicalMedicine-occupationalTherapy': PhysicalMedicineCommonForm;
  'physicalMedicine-fce': PhysicalMedicineCommonForm;
  'physicalMedicine-other': PhysicalMedicineCommonForm;
  'physicalMedicine-vendors': VendorsFormState;
  'physicalMedicine-documents': DocumentsFormState;
  'physicalMedicine-shared': PhysicalMedicineSharedForm;
}

export interface LanguageFormState {
  'language-interpretation': InterpretationFormState;
  'language-translation': DocumentTranslationFormState;
  'language-vendors': VendorsFormState;
  'language-documents': DocumentsFormState;
}

export interface InterpretationDateRangeFormState {
  notes: any;
  tripsAuthorized: number;
  startDate: string;
  endDate: string;
  noLocationRestrictions: boolean;
  certification: CustomerServiceGroupSubType;
  approvedLocations: string[];
}

export interface InterpretationSpecificDateFormState {
  appointmentDate: string;
  appointmentTime: string;
  appointmentAddress: ClaimLocation;
  certification: CustomerServiceGroupSubType;
  notes: string;
}

export interface InterpretationFormState {
  referralId?: number;
  authorizationDateType: DateFormMode;
  certification: CustomerServiceGroupSubType;
  language: string;
  paidAsExpense: boolean;
  rushServiceNeeded: boolean;
  schedulingForm:
    | InterpretationSpecificDateFormState[]
    | InterpretationDateRangeFormState;
}

export interface DocumentTranslationSchedulingForm {
  appointmentAddress: ClaimLocation;
  appointmentDate: string;
  notes: string;
}

export interface DocumentTranslationFormState {
  referralId?: number;
  language: string;
  rushServiceNeeded: boolean;
  paidAsExpense: boolean;
  subType: CustomerServiceGroupSubType;
  schedulingForm: DocumentTranslationSchedulingForm[];
}

// Diagnostic Shared FormState
export interface DiagnosticsFormState {
  referralId?: number;
  postSurgical: boolean;
  scheduleNear: ClaimLocation;
  schedulingForm: DiagnosticsSchedulingForm[];
  rush: boolean;
  notes: string;
}

export interface DiagnosticsSchedulingForm {
  bodyParts: ReferralBodyPart[];
  serviceDate: string;
  notes: string;
  otherTypes?: CustomerServiceGroupSubType; // Only other sub-service
  contrastType?: CustomerServiceGroupSubType; // CT-Scan & MRI
  subType?: CustomerServiceGroupSubType;
}

// HOME HEALTH SHARED FormState
export interface HomeHealthCommonSchedulingForm {
  serviceType?: CustomerServiceGroupSubType;
  serviceAddress?: ClaimLocation;
  dynamicDateMode: string;
  startDate?: string;
  endDate?: string;
  appointmentDate?: string;
  numberOfVisits: number;
  notes: string;
}

export interface HomeHealthCommonForm {
  referralId?: number;
  rush: boolean;
  schedulingForm?: HomeHealthCommonSchedulingForm[];
}

export interface HomeHealthFormState {
  'homeHealth-nursing': HomeHealthCommonForm;
  'homeHealth-inHomeTherapy': HomeHealthCommonForm;
  'homeHealth-aides': HomeHealthCommonForm;
  'homeHealth-infusion': HomeHealthCommonForm;
  'homeHealth-other': HomeHealthCommonForm;
  'homeHealth-vendors': VendorsFormState;
  'homeHealth-documents': DocumentsFormState;
}

// DME SHARED FormState
export interface DMEFormState {
  'dme-equipment': DMECommonForm;
}

export interface DMECommonForm {
  referralId?: number;
  prescriberName?: string;
  prescriberPhone?: string;
  prescriberAddress?: string;
  rush: boolean;
  schedulingForm?: DMECommonSchedulingForm[];
}

export interface DMECommonSchedulingForm {
  productSelectionMode: string;
  category?: any;
  product?: CustomerServiceGroupSubType;
  hcpc?: string;
  deliveryAddress?: ClaimLocation;
  dynamicDateMode: string;
  startDate?: string;
  endDate?: string;
  deliveryDate?: string;
  quantity: number;
  rental?: boolean;
  notes: string;
}

export enum FusionServiceName {
  Language = 'Language',
  Diagnostics = 'Diagnostics',
  PhysicalMedicine = 'Physical Medicine',
  HomeHealth = 'Home Health',
  DME = 'DME',
  Transportation = 'Transportation'
}

// Fusion options
export interface MakeReferralFusionOptions {
  isLoaded?: boolean;
  languages: FusionLanguages;
  appointmentTypes: string[];
  approvedLocations: ClaimLocation[];
  approvedFusionLocations?: ServiceLocations;
  approvedLocationsIsLoaded: boolean;
  locationTypes: LocationType[];
  icdCodes?: FusionICDCode[];
  bodyParts?: ReferralBodyPart[];

  // Changed to key value pairs because of the service type.
  vendors: { serviceType: ServiceType; list: ReferralVendor[] }[];
  vendorMode: { serviceType: ServiceType; mode: VendorSelectionMode }[];
  vendorAutoPopulation: { serviceType: ServiceType; autoPopulation: boolean }[];
}

export interface ServiceLocations {
  DME?: ClaimLocation[];
  HH?: ClaimLocation[];
  TRP?: ClaimLocation[];
  LAN?: ClaimLocation[];
  CLN?: ClaimLocation[];
  MOR?: ClaimLocation[];
  RTL?: ClaimLocation[];
  OTH?: ClaimLocation[];
  PM?: ClaimLocation[];
  IMP?: ClaimLocation[];
  DX?: ClaimLocation[];
}

// Fusion Vendors
export interface FusionVendor {
  code: string;
  name: string;
  status: string;
}

// Fusion Vendor Allocation
export interface FusionVendorAllocation {
  autoPopulation: boolean;
  vendorMode: VendorSelectionMode;
  allocatedVendors: FusionVendor[];
  serviceType: ServiceType;
}

// Fusion languages
export interface FusionLanguages {
  list: string[];
  isLoaded: boolean;
}

// ICD Code for Claim
export interface FusionICDCode {
  code: string;
  desc: string;
  version: number;
  isNew?: boolean;
  isDeleted?: boolean;
  isReadOnly?: boolean;
  displayText?: string;
}

export interface ReferralSubmitError {
  statusCode: number;
  messages: string[];
}

interface ReferralSubmitResponse<T> {
  referralId: number;
  isCore: boolean;
  postSubmitData: T;
  error: ReferralSubmitError;
}

export interface ReferralSubmitResponseBundle {
  [service: string]: ReferralSubmitResponse<any>;
}

// Fusion add location request
export interface FusionAddLocationRequest {
  claimNumber?: string;
  insurancePayer?: string;
  locationRequest: FusionAddLocationInformation;
}

export interface FusionAddLocationInformation {
  address: FusionAddLocationAddress;
  name: string;
  phone: string;
  type: string;
  typeDescription: string;
  userCreated?: string;
}

export interface FusionAddLocationAddress {
  city: string;
  state: string;
  streetAddress1: string;
  streetAddress2: string;
  zipCode: string;
  zipCodeExt: string;
}

// Fusion approved locations
export interface FusionApprovedLocation {
  city: string;
  claimInfoAddressId: string;
  locationTypeDescription: string;
  name: string;
  phoneNumber: string;
  state: string;
  streetAddress1: string;
  streetAddress2: string;
  type: string;
  zipCode: string;
}

export interface FusionMakeReferralState {
  referralOptions: MakeReferralFusionOptions;
  // Name must start with the language ServiceType
  languageCustomerServiceConfigurationState: CustomerServiceConfigurationState;
  diagnosticsCustomerServiceConfigurationState: CustomerServiceConfigurationState;
  physicalMedicineCustomerServiceConfigurationState: CustomerServiceConfigurationState;
  homeHealthCustomerServiceConfigurationState: CustomerServiceConfigurationState;
  dmeCustomerServiceConfigurationState: CustomerServiceConfigurationState;
  defaultSubTypeValues: {
    [key: string]: { [key: string]: CustomerServiceGroupSubType };
  };
  savingDraft: boolean;
  errors: string[];
}

export interface CustomerServiceConfigurationState {
  list: CustomerServiceConfiguration[];
  isLoading: boolean;
}

export const fusionMakeReferralInitial: FusionMakeReferralState = {
  referralOptions: {
    languages: {
      list: [],
      isLoaded: false
    },
    vendors: [],
    vendorMode: [],
    appointmentTypes: [],
    approvedLocations: [],
    approvedLocationsIsLoaded: false,
    locationTypes: [],
    vendorAutoPopulation: [],
    icdCodes: [],
    bodyParts: []
  },
  languageCustomerServiceConfigurationState: { list: [], isLoading: false },
  diagnosticsCustomerServiceConfigurationState: { list: [], isLoading: false },
  physicalMedicineCustomerServiceConfigurationState: {
    list: [],
    isLoading: false
  },
  homeHealthCustomerServiceConfigurationState: {
    list: [],
    isLoading: false
  },
  dmeCustomerServiceConfigurationState: {
    list: [],
    isLoading: false
  },
  defaultSubTypeValues: {
    Language: {},
    Diagnostics: {},
    'Physical Medicine': {},
    'Home Health': {},
    DME: {}
  },
  savingDraft: false,
  errors: []
};
