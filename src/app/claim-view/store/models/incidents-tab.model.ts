export interface Incident {
  claimNumber: string;
  customerCode: string;
  productType: string;
  incidentNumber: number;
  incidentType: string;
  dateSubmitted: string;
  referralID: number;
  vendor: string;
  service: string;
  incidentDate: string;
  incidentStatus: string;
  submittedBy: string;
  submittedEmail: string;
  submittedPhone: string;
  claimantName: string;
  dateOfLoss: string;
  incidentDesc: string;
  incidentResolution: string;
  vendorIssue: string;
  isLegacy?: boolean;
}

export interface IncidentsResponse {
  incidents: Incident[];
  totalIncidents: number;
}

export interface IncidentsQuery {
  claimNumber: string;
  customerId: string;
}

export interface IncidentsTabState {
  isLoading: boolean;
  incidentsResponse: IncidentsResponse;
  didFetchFromServer: boolean;
  errors?: string[];
}

export const incidentsTabInitalState: IncidentsTabState = {
  isLoading: false,
  incidentsResponse: { incidents: [], totalIncidents: 0 },
  didFetchFromServer: false
};
