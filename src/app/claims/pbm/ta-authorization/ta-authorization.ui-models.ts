/**
 * == Warning! ==
 * Do not update models!
 * Reach out to Lawrence, Alan or Jim if any changes are needed.
 *
 * Models for use in the UI transformed from the ta-authorization.external-models.ts
 *
 */
import { HealtheSelectOption } from '@shared';
import { ErrorMessage } from '@modules/form-validation-extractor';

export interface Address {
  /** @example 456 Blue St. */
  addressLine1: string;
  /** @example Suite 202 */
  addressLine2?: string;
  /** @example Clearwater */
  city: string;
  state: string;
  zipCode?: string;
}

export interface PrescriberLookupModalData {
  /** @example John Doe */
  prescriberName?: string;
  prescriberId?: string;
  /** @example Family practice */
  prescriberSpecialty?: string;
  /**
   * Format: integer
   * @example 1548277286
   */
  npi?: number;
  /** @description a list of organizations this prescriber belongs to */
  organization?: string[];
  /** @example Family Practice \n Extended care, skilled nursing facility */
  organizationSpecialty?: string;
  /** @example 104 E Culver Rd. \n Knox, IN 46506 */
  prescriberPrimaryAddress?: string;
  /** @default N/A */
  /** @example (123) 456-2323 */
  primaryPhoneNumber?: string;
  /** @default N/A */
  altPhoneNumber?: string;
  /** @default N/A */
  /** @example (123) 456-2323 */
  primaryFaxNumber?: string;
  /** @example 104 E Culver Rd. \n Knox, IN 46506 */
  prescriberSecondaryAddress?: string;
  /** @default N/A */
  /** @example (123) 456-2323 */
  secondaryPhoneNumber?: string;
  /** @default N/A */
  secondaryAltPhoneNumber?: string;
}

export interface PrescribingPhysicianTableRow {
  /**
   * @description Physician name in  "{first} {middle?} {last}" format
   * @example John Doe
   */
  physicianName?: string;
  /** @description Physicians NPI in "{npis.join(", ")}" format */
  prescriberId?: string;
  /**
   * @description Physicians Primary PhoneNumber
   * @default N/A
   */
  physicianPhoneNumber?: string;
}

export interface PharmacyTableRow {
  /** @example Walgreens */
  pharmacyName: string;
  /** @example 12345
   * Used to open the Pharmacy Modal
   */
  ncpdp: string;
  /** @example (123) 456-2323 */
  pharmacyPhone: string;
  /** @example 104 E Culver Rd. \n Knox, IN 46506 */
  pharmacyAddress: string;
}

export interface TaLetterActionFormModel {
  /** @example Multiple Prescriber */
  /** @readonly */
  letterType: string;
  /** @enum {string} */
  action: 'Approve' | 'Deny';

  denialReason?: string;
  miscellaneousReason?: string;
}
export type AttorneyContactInformationFormState = Address & {
  /** @example Amanda Johnson */
  attorneyName: string;
  /** @example (123) 456-2323 */
  phone: string;
  /** @example (123) 456-2323 */
  fax: string;
  /** @example person@example.com */
  email: string;
};

export type ClaimantContactInformationFormState = Address & {
  /** @example Amanda Johnson */
  claimantName: string;
  /** @example (123) 456-2323 */
  phone: string;
};
export interface TaLetterFormModel {
  actionForm: TaLetterActionFormModel;
  attorneyInvolvement: boolean;
  claimantContactInformationForm: ClaimantContactInformationFormState;
  attorneyInformationForm: AttorneyContactInformationFormState;
}

export interface PrescriptionTransaction {
  itemName: string;
  ndc: string;
  rxNumber: string;
  dateFilled: string;
  qty: number;
  refills: number;
  physicianName: string;
  pharmacyName: string;
}

/**
 * Data to handle the Authorization Information tab _only_
 */
export interface TaAuthorizationInformationViewModel {
  /**
   * @optional
   * @desc if this field exists, show the exParte warning banner
   */
  exParteMessage?: string;
  hasClickedSubmit: boolean;
  prescribingPhysicians: PrescribingPhysicianTableRow[];
  pharmacies: PharmacyTableRow[];
  transactionHistory: PrescriptionTransaction[];
  taLetterFormState: TaLetterFormModel;
  denialReasons: HealtheSelectOption<string>[];

  showContactForms: boolean;
  showMiscellaneousReason: boolean;
  showDenialReasons: boolean;

  showAttorneyInformationForm: boolean;
  miscellaneousReasonCharactersLeft: number;

  stateOptions: HealtheSelectOption<string>[];

  isTaAuthorizationLoading: boolean;
  areDenialReasonsLoading: boolean;
  isExParteMessageLoading: boolean;

  serverErrors: string[];
  formValidationErrors: ErrorMessage[];

  showErrorCard: boolean;
  showFormValidationErrors: boolean;
  showServerErrors: boolean;
}

/**
 * Data to handle the header bar link, claim number,
 * claim statuses, tab navigation & footer visibility
 */
export interface TaAuthorizationParentViewModel {
  decodedClaimNumber: string;
  decodedTaAuthorizationId: string;
  claimViewLink: string[];
  pbmClaimStatus: string;
  abmClaimStatus: string;
  riskLevelNumber: number;
  riskLevel: string;
  showFooter: boolean;
  selectedTabIndex?: number;
}
/**
 * == Warning! ==
 * Do not update models!
 * Reach out to Lawrence, Alan or Jim if any changes are needed.
 *
 * Models for use in the UI transformed from the ta-authorization.external-models.ts
 *
 */
