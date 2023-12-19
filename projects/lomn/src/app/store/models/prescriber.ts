export interface Prescriber {
  name: string;
  firstName: string;
  lastName: string;
  specality: string[];
  npi: string;
  orginization: string[];
  orginizationSpecality: string[];
  primaryAddress: string[];
  primaryPhone: string;
  primaryAltPhone: string;
  primaryFax: string;
  secondaryAddress: string[];
  secondaryPhone: string;
  secondaryAltPhone: string;
  secondaryFax: string;
}

export interface PrescriberModalData {
  prescriberId: string;
  prescriber: Prescriber;
}

export interface PrescriberDisplayItem {
  fieldName: string;
  label: string;
  isArray: boolean;
  isPhone: boolean;
  fieldValue: any;
  columnWidth: number;
}
