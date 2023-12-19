export interface Pharmacy {
  affiliationCode: string;
  dailyHours: DailyHour[];
  faxNumber: string;
  h24Flag: boolean;
  inNetwork: boolean;
  latitude: string;
  longitude: string;
  mailOrderPharmacy: boolean;
  nabp: string;
  name: string;
  npi: string;
  phoneNumber: string;
  providerHours: string;
  timezone: string;
  address: string[];
}

export interface DailyHour {
  closeHour: string;
  dayOfWeek: string;
  openHour: string;
}

export interface PharmacyModalData {
  pharmacy: Pharmacy;
}

export interface PharmacyDisplayItem {
  fieldName: string;
  label: string;
  isArray: boolean;
  fieldValue: any;
}
