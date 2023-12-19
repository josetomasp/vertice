import { createAction, props } from '@ngrx/store';
import {
  AuthorizationHistoryResponse,
  DiagnosticsHistoryItem,
  DmeHistoryItem,
  HomeHealthHistoryItem,
  LanguageHistoryItem,
  LegacyTransportationHistoryItem,
  PhysicalMedicineHistoryItem
} from '../models/authorization-history.models';

export const loadLanguageAuthorizationHistory = createAction(
  '[ Authorization History ] Load Language Authorization History',
  props<{ encodedReferralId: string }>()
);

export const loadLanguageAuthorizationHistorySuccess = createAction(
  '[ Authorization History ] Load Language Authorization History Success',
  props<AuthorizationHistoryResponse<LanguageHistoryItem>>()
);

export const loadLanguageAuthorizationHistoryFail = createAction(
  '[ Authorization History ] Load Language Authorization History Fail',
  props<{ errors: string[] }>()
);

export const loadDiagnosticsAuthorizationHistory = createAction(
  '[ Authorization History ] Load Diagnostics Authorization History',
  props<{ encodedReferralId: string }>()
);

export const loadDiagnosticsAuthorizationHistorySuccess = createAction(
  '[ Authorization History ] Load Diagnostics Authorization History Success',
  props<AuthorizationHistoryResponse<DiagnosticsHistoryItem>>()
);

export const loadDiagnosticsAuthorizationHistoryFail = createAction(
  '[ Authorization History ] Load Diagnostics Authorization History Fail',
  props<{ errors: string[] }>()
);

export const loadPhysicalMedicineAuthorizationHistory = createAction(
  '[ Authorization History ] Load Physical Medicine Authorization History',
  props<{ encodedCustomerCode: string; encodedReferralId: string }>()
);

export const loadPhysicalMedicineAuthorizationHistorySuccess = createAction(
  '[ Authorization History ] Load Physical Medicine Authorization History Success',
  props<AuthorizationHistoryResponse<PhysicalMedicineHistoryItem>>()
);

export const loadPhysicalMedicineAuthorizationHistoryFail = createAction(
  '[ Authorization History ] Load Physical Medicine Authorization History Fail',
  props<{ errors: string[] }>()
);

// Home Health
export const loadHomeHealthAuthorizationHistory = createAction(
  '[ Authorization History ] Load Home Health Authorization History',
  props<{ encodedCustomerCode: string; encodedReferralId: string }>()
);

export const loadHomeHealthAuthorizationHistorySuccess = createAction(
  '[ Authorization History ] Load Home Health Authorization History Success',
  props<AuthorizationHistoryResponse<HomeHealthHistoryItem>>()
);

export const loadHomeHealthAuthorizationHistoryFail = createAction(
  '[ Authorization History ] Load Home Health Authorization History Fail',
  props<{ errors: string[] }>()
);

// DME
export const loadDmeAuthorizationHistory = createAction(
  '[ Authorization History ] Load DME Authorization History',
  props<{ encodedCustomerCode: string; encodedReferralId: string }>()
);

export const loadDmeAuthorizationHistorySuccess = createAction(
  '[ Authorization History ] Load DME Authorization History Success',
  props<AuthorizationHistoryResponse<DmeHistoryItem>>()
);

export const loadDmeAuthorizationHistoryFail = createAction(
  '[ Authorization History ] Load DME Authorization History Fail',
  props<{ errors: string[] }>()
);

// DME
export const loadLegacyTransportationAuthorizationHistory = createAction(
  '[ Authorization History ] Load Legacy Transportation Authorization History',
  props<{ encodedCustomerCode: string; encodedReferralId: string }>()
);

export const loadLegacyTransportationAuthorizationHistorySuccess = createAction(
  '[ Authorization History ] Load Legacy Transportation Authorization History Success',
  props<AuthorizationHistoryResponse<LegacyTransportationHistoryItem>>()
);

export const loadLegacyTransportationAuthorizationHistoryFail = createAction(
  '[ Authorization History ] Load Legacy Transportation Authorization History Fail',
  props<{ errors: string[] }>()
);
