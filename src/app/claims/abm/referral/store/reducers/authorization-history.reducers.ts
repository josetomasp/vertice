import { createReducer, on } from '@ngrx/store';
import {
  loadDiagnosticsAuthorizationHistory,
  loadDiagnosticsAuthorizationHistoryFail,
  loadDiagnosticsAuthorizationHistorySuccess,
  loadDmeAuthorizationHistory,
  loadDmeAuthorizationHistoryFail,
  loadDmeAuthorizationHistorySuccess,
  loadHomeHealthAuthorizationHistory,
  loadHomeHealthAuthorizationHistoryFail,
  loadHomeHealthAuthorizationHistorySuccess,
  loadLanguageAuthorizationHistory,
  loadLanguageAuthorizationHistoryFail,
  loadLanguageAuthorizationHistorySuccess,
  loadLegacyTransportationAuthorizationHistory,
  loadLegacyTransportationAuthorizationHistoryFail,
  loadLegacyTransportationAuthorizationHistorySuccess,
  loadPhysicalMedicineAuthorizationHistory,
  loadPhysicalMedicineAuthorizationHistoryFail,
  loadPhysicalMedicineAuthorizationHistorySuccess
} from '../actions/authorization-history.actions';
import { authorizationHistoryInitialState } from '../models/authorization-history.models';

export const authorizationReducer = createReducer(
  authorizationHistoryInitialState,
  on(
    loadLanguageAuthorizationHistory,
    loadDiagnosticsAuthorizationHistory,
    loadPhysicalMedicineAuthorizationHistory,
    loadHomeHealthAuthorizationHistory,
    loadDmeAuthorizationHistory,
    loadLegacyTransportationAuthorizationHistory,
    (state) => ({
      ...state,
      isLoading: true
    })
  ),
  on(
    loadLanguageAuthorizationHistorySuccess,
    loadDiagnosticsAuthorizationHistorySuccess,
    loadPhysicalMedicineAuthorizationHistorySuccess,
    loadHomeHealthAuthorizationHistorySuccess,
    loadDmeAuthorizationHistorySuccess,
    loadLegacyTransportationAuthorizationHistorySuccess,
    (state, { historyGroups }) => ({
      ...state,
      historyGroups
    })
  ),
  on(
    loadLanguageAuthorizationHistoryFail,
    loadDiagnosticsAuthorizationHistoryFail,
    loadPhysicalMedicineAuthorizationHistoryFail,
    loadHomeHealthAuthorizationHistoryFail,
    loadDmeAuthorizationHistoryFail,
    loadLegacyTransportationAuthorizationHistoryFail,
    (state, { errors }) => ({
      ...state,
      errors: errors
    })
  ),
  on(
    loadLanguageAuthorizationHistorySuccess,
    loadLanguageAuthorizationHistoryFail,
    loadDiagnosticsAuthorizationHistorySuccess,
    loadDiagnosticsAuthorizationHistoryFail,
    loadPhysicalMedicineAuthorizationHistorySuccess,
    loadPhysicalMedicineAuthorizationHistoryFail,
    loadHomeHealthAuthorizationHistorySuccess,
    loadHomeHealthAuthorizationHistoryFail,
    loadDmeAuthorizationHistorySuccess,
    loadDmeAuthorizationHistoryFail,
    loadLegacyTransportationAuthorizationHistorySuccess,
    loadLegacyTransportationAuthorizationHistoryFail,
    (state) => ({ ...state, isLoading: false })
  )
);
