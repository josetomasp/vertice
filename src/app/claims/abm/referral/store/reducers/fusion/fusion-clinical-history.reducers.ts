import { createReducer, on } from '@ngrx/store';
import {
  loadFusionClinicalHistory,
  loadFusionClinicalHistoryFail,
  loadFusionClinicalHistorySuccess
} from '../../actions/fusion/fusion-clinical-history.actions';
import { FUSION_CLINICAL_HISTORY_INITIAL_STATE } from '../../models/fusion/fusion-clinical-history.models';

export const fusionClinicalHistoryReducers = createReducer(
  FUSION_CLINICAL_HISTORY_INITIAL_STATE,
  on(loadFusionClinicalHistory, (state) => ({ ...state, isLoading: true })),
  on(loadFusionClinicalHistorySuccess, (state, { clinicalHistory }) => ({
    ...state,
    clinicalHistory,
    isLoading: false
  })),
  on(loadFusionClinicalHistoryFail, (state, { errors }) => ({
    ...state,
    errors: [...state.errors, ...errors]
  }))
);
