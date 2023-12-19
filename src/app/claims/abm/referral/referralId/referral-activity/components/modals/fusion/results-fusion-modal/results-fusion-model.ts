import { Address } from '../service-scheduled-fusion-modal/service-scheduled-fusion-model';
import { ReferralInformationRequest } from '../../../../../../store/models';

export interface ResultsFusionModel {
  referralId: string;
  serviceDate: string;
  status: string;
  title: string;
  vendorName: string;
  details: Array<ResultsModalDetailsModel>;
  referralInformationRequestDocumentation: ReferralInformationRequest;
  referralInformationRequestBilling: ReferralInformationRequest;
}

export interface ResultsModalDetailsModel {
  cost: string;
  destination: string;
  itemDescription: string;
  fromAddress: Address;
  quantity: string;
  serviceDetailType: string;
  toAddress: Address;
}
