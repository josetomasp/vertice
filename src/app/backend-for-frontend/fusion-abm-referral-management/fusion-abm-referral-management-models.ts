export interface DashboardDataRequestMessage {
  displayLimit: number;
  // username: string fetched from Principal in ngVertice-service
  // customer: string fetched from Principal in ngVertice-service
  authorizationType: string;
  assignedAdjuster: string;
  claimNumber: string;
  claimantLastName: string;
  claimantFirstName: string;
}

export interface AuthInfo {
  type: string;
  rush: string;
  slr: boolean;
  secondaryPaperNotificationRule?: string;
  workflowGpi?: string;
  claimNumber: string;
  patientName: string;
  state: string;
  dateOfInjury: string;
  adjuster: string;
  afo: string;
  dateReceived: string;
  status: string;
  vendorName: string;
  customerId: string;
  expiring: boolean;
  billKey: string;
  referenceKey: string;
  legacyReferral: boolean;
  letterType: string;
}

export interface AllAuthorizations {
  dashboardClaims: AuthInfo[];
  totalRecordCount: number;
}

export interface AuthorizationTypes {
  authorizationTypes: AuthorizationType[];
}

export interface AuthorizationType {
  description: string;
  type: string;
}

export interface DashboardAdjusterResponseMessage {
  adjusters: string[];
  applicationIssues: string[];
}
