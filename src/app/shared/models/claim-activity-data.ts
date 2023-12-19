export interface AllActivityData {
  creationDate: string;
  activityType: string;
  productType: string;
  daysSupply: string;
  itemName: string;
  quantity: string;
  pharmacy: string;
  descriptionReason: string;
  outcome: string;
  paidAmount: string;
  dateModified: string;
  modifiedByUser: string;
  priorAuthDateRange: string;
  prescriberName: string;
  prescriberId: string;
  dateFilled: string;
  rush: boolean;
  serviceType: string;
  requestorRole: string;
  requestorName: string;
  vendor: string;
  vertice25Link: string;
  ndc: string;
  nabp: string;
}

export interface ClaimActivityDTO {
  activities: Array<AllActivityData>;
  serverErrors: Array<string>;
}

export interface ActivityResponse {
  activities: AllActivityData[];
  serverErrors: string[];
}
