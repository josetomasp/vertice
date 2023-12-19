export interface AuthorizationHistoryResponse<T> {
  historyGroups: AuthorizationHistoryGroup<T>[];
}

export interface AuthorizationHistoryGroup<T> {
  // Sub type title
  title: string;
  history: T[];
}

export interface LanguageHistoryItem {
  action: string;
  reasonsForReview: string[];
  requestorRole: string;
  authorizedDates: string;
  numberOfAppointments: string;
  cumulativeNumberOfAppointments: number;
  amountAuthorized: string;
}

export interface DiagnosticsHistoryItem {
  authorizationId: number;
  action: string;
  requestorRole: string;
  authorizedDates: string;
  numberOfServices: string;
  authorizedEmail: string;
  reasonsForReview: string[];
}

export interface PhysicalMedicineHistoryItem {
  authorizationId: number;
  action: string;
  requestorRole: string;
  authorizedDates: string;
  numberOfVisits: string;
  cumulativeNumberOfVisits: string;
  authorizedEmail: string;
  reasonsForReview: string[];
}

export interface HomeHealthHistoryItem {
  authorizationId: number;
  action: string;
  reasonsForReview: string[];
  requestorRole: string;
  authorizedDates: string;
  numberOfVisits: string;
  cumulativeNumberOfVisits: string;
  amountAuthorized: string;
}

export interface DmeHistoryItem {
  authorizationId: number;
  action: string;
  reasonsForReview: string[];
  requestorRole: string;
  authorizedDates: string;
  numberOfUnits: string;
  amountAuthorized: string;
}

export interface LegacyTransportationHistoryItem {
  authorizationId: number;
  description: string;
  action: string;
  reasonsForReview: string[];
  requestorRole: string;
  authorizedDates: string;
  authorizedByEmail: string;
  quantity: string;
  maxAmount: string;
  cumulativeQuantity: string;
}

export type VerticeAuthHistoryItem = LanguageHistoryItem;

export interface AuthorizationHistoryState {
  isLoading: boolean;
  errors: string[];
  historyGroups: AuthorizationHistoryGroup<VerticeAuthHistoryItem>[];
}

export const authorizationHistoryInitialState = {
  isLoading: false,
  errors: [],
  historyGroups: []
};
