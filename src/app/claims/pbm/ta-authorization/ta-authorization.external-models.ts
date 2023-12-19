/**
 * == Warning! ==
 * Do not update models!
 * Reach out to Lawrence, Alan or Jim if any changes are needed.
 *
 * External models based on the fusion-clinical-services api v1.0.0 for TA Authorizations
 * @link https://app.swaggerhub.com/apis/Healthesystems/fusion-clinical-services-api/1.0.0#/
 *
 */

export enum StatusCode {
  B,
  C,
  E,
  F,
  L,
  M,
  R,
  U,
  W,
  X,
  Z
}

export enum StatusDescription {
  READY_FOR_BILLING = 'Ready for Billing',
  COMPLETE = 'Complete',
  EXPIRED = 'Expired',
  INTERNAL_TO_CODE_INDICATING_PROBLEM = 'Internal to code indicating problem',
  BILLED = 'Billed',
  REQUIRES_PRIOR_AUTHORIZATION = 'Requires Prior Authorization',
  ROI_AUTH_REFUSED = 'ROI Auth Refused',
  PRIOR_AUTH_NOT_REQUIRED = 'Prior Auth NOT required',
  WAITING_FOR_AUTHORIZATION = 'Waiting for Authorization',
  NO_LONGER_USED = 'No longer used',
  CLOSED_DUE_TO_ERROR = 'Closed due to error'
}
export interface LetterType {
  code: string;
  description: string;
}

export interface Status {
  '@type': string;
  code: StatusCode;
  description?: StatusDescription;
}

export type ApprovedStatus = Status & {
  approvedBy: string;
  approvedOn: string;
};
export type DeniedStatus = Status & {
  deniedBy: string;
  deniedOn: string;
  denialReason: string;
};

export interface Address {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ContactInformation {
  contactName: string;
  address: Address;
  phone: string;
  alternatePhone: string;
  fax: string;
  email: string;
}

export interface TaPrescription {
  ndc: number;
  itemName: string;
  rxNumber: number;
  dateFilled: string;
  quantity: number;
  refills: number;
  prescriberId: number;
  nabp: string;
}

export interface TherapeuticAlertAuthorization {
  '@type': string;
  id?: string;
  letterType?: LetterType;
  status?: Status | ApprovedStatus | DeniedStatus;
  attorneyInvolvement?: boolean;
  claimantDeliveryInformation?: ContactInformation;
  attorneyDeliveryInformation?: ContactInformation;
  physicians?: TaPrescribingPhysician[];
  pharmacies?: TaPharmacy[];
  prescriptionHistory?: TaPrescription[];
  exParteJurisdiction?: boolean;
  communicationSentByCustomer?: boolean;
}

export interface OrganizationReference {
  orgName: string;
  groupPracticeSpecialty1: string;
  groupPracticeSpecialty2: string;
  hmsPoid: string;
}

interface StateLicense {
  state: string;
  licenseNumber: string;
}

export interface TaPrescribingPhysician {
  prescriberType: string;
  cred: string;
  deaNumbers: string[];
  first: string;
  foundById: string;
  foundByIdType: string;
  last: string;
  middle: string;
  npis: string[];
  organizationReferences: OrganizationReference[];
  practitionerType: string;
  primaryAddress1: string;
  primaryAddress2: string;
  primaryCity: string;
  primaryFax: string;
  primaryPhone: string;
  primaryAlternatePhone: string;
  primaryState: string;
  primaryZip4: string;
  primaryZip5: string;
  secondaryAddress1: string;
  secondaryAddress2: string;
  secondaryCity: string;
  secondaryFax: string;
  secondaryPhone: string;
  secondaryAlternatePhone: string;
  secondaryState: string;
  secondaryZip4: string;
  secondaryZip5: string;
  suffix: string;
  hmsactivity1: string;
  hmsactivity2: string;
  hmsscid: string;
  hmsspecialty1: string;
  hmsspecialty2: string;
  npitaxonomy: string;
  upin: string;
  hmspiid: string;
  stateLicenses: StateLicense[];
}

export interface PharmacyHours {
  dayOfWeek: string;
  openHour: string;
  closeHour: string;
}

export interface TaPharmacy {
  nabp: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  affiliationCode: string;
  phoneNumber: string;
  faxNumber: string;
  h24Flag: boolean;
  providerHours: string;
  inNetwork: boolean;
  npi: string;
  latitude: string;
  longitude: string;
  timezone: string;
  dailyHours: PharmacyHours[];
  mailOrderPharmacy: boolean;
}
/**
 * == Warning! ==
 * Do not update models!
 * Reach out to Lawrence, Alan or Jim if any changes are needed.
 *
 * External models based on the fusion-clinical-services api v1.0.0 for TA Authorizations
 * @link https://app.swaggerhub.com/apis/Healthesystems/fusion-clinical-services-api/1.0.0#/
 */
