import {
  ReferralDocumentItem,
  ReferralInformationRequest
} from '../../../../../../store/models';

export interface ServiceScheduledFusionModel {
  title: string;
  referralId: string;
  status: string;
  createDate: string;
  vendorName: string;
  serviceType: string;
  itineraryType: string;
  quantity: string;
  date: string;
  time: string;
  fromAddress: Address;
  toAddress: Address;
  providerFax: string;
  providerPhone: string;
  isPaidExpense: boolean;
  additionalPassengers: string;
  translationServices: string;
  referralInformationRequest: ReferralInformationRequest;
  dateOfServiceForDocumentUpload: string;
  documents: ReferralDocumentItem[];
}

export interface Address {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
}
