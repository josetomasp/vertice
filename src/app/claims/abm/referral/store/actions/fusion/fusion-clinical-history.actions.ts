import { createAction, props } from '@ngrx/store';
import { UIFusionClinicalHistory } from '../../models/fusion/fusion-clinical-history.models';

export const loadFusionClinicalHistory = createAction(
  '[Fusion :: Clinical History] Load Clinical History',
  props<{ referralId: string }>()
);
export const loadFusionClinicalHistorySuccess = createAction(
  '[Fusion :: Clinical History] Load Clinical History Success',
  props<UIFusionClinicalHistory>()
);
export const loadFusionClinicalHistoryFail = createAction(
  '[Fusion :: Clinical History] Load Clinical History Fail',
  props<{ errors: string[] }>()
);
