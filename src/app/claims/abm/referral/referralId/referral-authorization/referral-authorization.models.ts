import { FormGroup } from '@angular/forms';

import {
  ClaimLocation,
  ReferralLocationCreateRequest
} from '../../store/models/make-a-referral.models';

export enum ReferralAuthorizationType {
  DETAILED = 'DETAILED',
  OPEN = 'OPEN'
}

export enum ReferralAuthorizationTypeCode {
  DETAILED_SEDAN = 'DETAILED_SEDAN',
  OPEN_SEDAN = 'OPEN_SEDAN',
  DETAILED_FLIGHT = 'DETAILED_FLIGHT',
  DETAILED_WHEELCHAIR = 'DETAILED_WHEELCHAIR',
  OPEN_WHEELCHAIR = 'OPEN_WHEELCHAIR',
  DETAILED_LODGING = 'DETAILED_LODGING',
  DETAILED_OTHER = 'DETAILED_OTHER',
  OPEN_OTHER = 'OPEN_OTHER'
}

export enum ReferralAuthorizationArchetype {
  Transportation = 'transportation',
  LegacyTransportation = 'legacyTransportation',
  Language = 'language',
  Diagnostics = 'diagnostics',
  PhysicalMedicine = 'physicalMedicine',
  HomeHealth = 'homeHealth',
  Dme = 'dme',
  Kinect = 'kinect'
}

export enum AuthApprovalState {
  Approve = 'APPROVED',
  Deny = 'DENIED',
  Pending = 'PENDING'
}

export enum AuthNarrativeMode {
  PostSubmit = 'PostSubmit',
  EditDetails = 'EditDetails',
  EditNarrative = 'EditNarrative'
}

export enum ReferralAuthorizationAction {
  AUTHORIZE = 'AUTHORIZE',
  CANCEL_ONLY = 'CANCEL_ONLY',
  MODIFY_OR_CANCEL = 'MODIFY_OR_CANCEL',
  NOTHING = 'NOTHING',
  DEFAULT = 'DEFAULT'
}

// This will be used to map form values from the form group to the narrative item's fields.
// IE: quantity will have the form control name that represents quantity.  For transportation,
// quantity would be 'tripsAuthorized'.
export interface AuthNarrativeConfig {
  startDate: AuthNarrativeConfigControl;
  endDate: AuthNarrativeConfigControl;
  originalEndDate?: AuthNarrativeConfigControl;
  quantity: AuthNarrativeConfigControl;

  // Leave null if its not used.
  unlimitedQuantity?: string;

  // In case there's no range, then show a single date
  serviceDate?: AuthNarrativeConfigControl;
}

export interface AuthNarrativeConfigControl {
  controlName: string;
  isDisabled?: boolean;
  useFormControl?: boolean;
  min?: number;
  equalGreaterThan?: string;
}

export interface ActionReasonSelectSet {
  selectReasons: string[];
  selectLabel: string;
  selectPlaceholder: string;
  errorMessage: string;
}

export interface ReferralAuthorizationOptions {
  denialReasons: string[];
  pendingReasons: string[];
}

// Optional fields are probably used in submit, but not in the UI
export interface ReferralAuthData {
  authorizationId?: number;
  authorizationTypeCode: ReferralAuthorizationTypeCode;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  doctorNameAndSpecialty: string;
  rush: boolean;
  paidAsExpense?: boolean;

  [key: string]: any;
}

export interface TransportationAuthorizationDetailedFormDataBase
  extends ReferralAuthData {
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  doctorNameAndSpecialty: string;
}

export interface TransportationAuthorizationOpenSedanFormData
  extends ReferralAuthData {
  startDate: string;
  endDate: string;
  specifyTripsByLocation: boolean;
  unlimitedTrips: boolean;
  tripsAuthorized: number;
  noLocationRestrictions: boolean;
  approvedLocations: ReferralLocationsMap;
}

export interface TransportationAuthorizationOpenWheelchairFormData
  extends TransportationAuthorizationOpenSedanFormData {
  steps: number;
  wheelchairType: string;
}

export interface TransportationAuthorizationDetailedSedanFormData
  extends TransportationAuthorizationDetailedFormDataBase {
  fromAddress: ClaimLocation;
  toAddress: ClaimLocation;
  pickupTime: string;
  pickupDate: string;
  appointment: ReferralAppointment;
}

export interface TransportationAuthorizationDetailedOtherFormData
  extends TransportationAuthorizationDetailedSedanFormData {
  typeOfTransportation: string;
}

export interface TransportationAuthorizationDetailedWheelchairFormData
  extends TransportationAuthorizationDetailedSedanFormData {
  wheelchairType: string;
  steps: number;
  appointment: ReferralAppointment;
}

export interface TransportationAuthorizationDetailedLodgingFormData
  extends TransportationAuthorizationDetailedFormDataBase {
  destination: string;
  numberOfGuests: number;
  numberOfRooms: number;
  priceOfRoom: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;

  // I still have no idea what this will actually look like.
  // It may be a list or something else.
  relatedAppointmentData: number;
  appointments: ReferralAppointment[];
}

export interface TransportationAuthorizationDetailedFlightFormData
  extends TransportationAuthorizationDetailedFormDataBase {
  flyingFrom: string;
  flyingTo: string;
  numberOfTravelers: number;
  departureDate: string;
  returnDate: string;

  // I still have no idea what this will actually look like.
  // It may be a list or something else.
  relatedAppointmentData: number;
  appointments: ReferralAppointment[];
}

export interface NarrativeLocationLimitItem {
  location: ReferralLocationCreateRequest;
  limitValue: number;
}

export interface NarrativeTextItem {
  type: string;
  actionDescriptor: string;
  quantityDescriptor?: string;

  locationId?: number;
  limitValue?: number;
  limitChange?: number;
  originalLimit?: number;
  locationIdList?: number[];
  originalLocationLimits?: NarrativeLocationLimitItem[];
  hasNewOpenAuth?: boolean;

  // Fusion new total
  newTotalLimit?: number;
  startDate?: string;
  endDate?: string;
  originalEndDate?: string;
  serviceDate?: string;
  anticipatedServiceDate?: string;
}

export interface ReferralAuthorizationItem {
  reasonsReviewIsNeeded: string[];
  narrativeTextList: NarrativeTextItem[];
  authData:
    | ReferralAuthData
    | TransportationAuthorizationDetailedFlightFormData
    | TransportationAuthorizationDetailedLodgingFormData
    | TransportationAuthorizationDetailedOtherFormData
    | TransportationAuthorizationDetailedSedanFormData
    | TransportationAuthorizationDetailedWheelchairFormData
    | TransportationAuthorizationOpenSedanFormData
    | TransportationAuthorizationOpenWheelchairFormData;
  icon?: any;
  title?: string;
  formGroup?: FormGroup;
  uniqueId?: number;
  isAddedItem?: boolean;
}

export interface ReferralAuthorizationSet {
  archeType: ReferralAuthorizationArchetype;
  authorizationType: ReferralAuthorizationType;
  referralAuthorization: ReferralAuthorization;
  claimLocations: ClaimLocation[];
}

export interface ReferralAuthorization {
  authorizationItems: ReferralAuthorizationItem[];
  originalAuthorizationItems: ReferralAuthorizationItem[];
  vendorNote: any;
  subHeaderNote: string;
}

export interface ReferralAuthorizationState {
  referralAuthorizationOptions: ReferralAuthorizationOptions;
  referralAuthorizationAction: ReferralAuthorizationAction;
  referralAuthorizationSet: ReferralAuthorizationSet;
  isOpenAuthDetailsExpanded: boolean;
  isAuthorizationSuccessfullySubmitted: boolean;
  isLoaded: boolean;
  isLoading: boolean;
}

export interface ReferralLocationsMap {
  // ReferralLocationsMap is a map of (location types) to (a map of (location IDs) to (ReferralLocationSelection))
  [key: string]: { [key: string]: ReferralLocationSelection };
}

export interface ReferralLocationSelection {
  locationSelected: boolean;
  locationTripCount: number;
}

export interface ReferralAppointment {
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  locationId: number;
}

export interface ReferralLocationHeader {
  service: string;
  dateRangeFrom: string;
  dateRangeTo: string;
}

export interface ReferralLocationDetail {
  summaryLocation: string;
  locationStatus: string;
  dateApproved: string;
  estimatedNumAppts: string;
  hesReferralDetailId: number;
}

export interface ReferralLocationResponse {
  locationHeaders: ReferralLocationHeader[];
  locationDetails: ReferralLocationDetail[];
}

export const referralAuthorizationInitialState: ReferralAuthorizationState = {
  referralAuthorizationOptions: {
    denialReasons: [],
    pendingReasons: []
  },
  referralAuthorizationAction: ReferralAuthorizationAction.DEFAULT,
  referralAuthorizationSet: {
    archeType: ReferralAuthorizationArchetype.Transportation,
    authorizationType: ReferralAuthorizationType.DETAILED,
    referralAuthorization: {
      authorizationItems: [],
      originalAuthorizationItems: [],
      vendorNote: [],
      subHeaderNote: ''
    },
    claimLocations: []
  },
  isOpenAuthDetailsExpanded: false,
  isAuthorizationSuccessfullySubmitted: false,
  isLoaded: false,
  isLoading: false
};
