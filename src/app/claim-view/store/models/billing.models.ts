export interface BillingHistory {
  claimNumber: string;
  customerCode: string;
  userName: string;
  productType: string;
  serviceFromDate: string;
  serviceToDate: string;
  totalNumberOfRows: string;
  totalBilledAmount: string;
  totalUcFeeAmount: string;
  totalPaidFee: string;
  totalPaidAmount: string;
  billHistory: BillingHistoryItem[];
}

export interface BillingHistoryItem {
  claimNumber: string;
  productType: string;
  providerID: string;
  providerName: string;
  serviceDate: string;
  code: string;
  itemName: string;
  quantity: string;
  daysSupply: string;
  prescriberName: string;
  prescriberID: string;
  billedAmount: string;
  ucFeeAmount: string;
  paidAmount: string;
  paidFee: string;
  paidDate: string;
  imageNumber: string;
  imagePath: string;
  billSource: string;
  dataSource: string;
  status: string;
  modifiedBy: string;
  copayPercentage: string;
  copayAmount: string;
  eobPath: string;
}

export interface BillingRequestParams {
  claimNumber: string;
  customerId: string;
  productType: string;
  serviceFromDate: string;
  serviceToDate: string;
}

export interface BillingFilters {
  productType: string[];
  prescriberName: string[];
  itemName: string[];
  status: string[];
}

export interface BillingFilterTriggerText {
  product: string;
  prescriberName: string;
  itemName: string;
  status: string;
}


