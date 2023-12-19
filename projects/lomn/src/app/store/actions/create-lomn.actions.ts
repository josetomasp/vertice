import { createAction, props } from '@ngrx/store';
import {
  CreateLOMNSubmitMessage,
  LOMNSubmitMessage,
  LOMNWizardFormState
} from '../models/create-lomn.models';

export const updateCreateLOMNForm = createAction(
  '[ Create LOMN ] Update Create LOMN Wizard',
  props<{ formValues: LOMNWizardFormState }>()
);

export const resetCreateLOMNState = createAction(
  '[ Create LOMN ] Reset Create LOMN Wizard'
);

export const submitCreateLOMN = createAction(
  '[ Create LOMN ] Submit Create LOMNs',
  props<{ submitMessage: CreateLOMNSubmitMessage[] }>()
);

export const submitCreateLOMNSuccess = createAction(
  '[ Create LOMN ] Submit Create LOMN Call Success',
  props<{
    successful: boolean;
  }>()
);
export const submitCreateLOMNFail = createAction(
  '[ Create LOMN ] Submit Create LOMN Fail',
  props<{ errorResponse: string[] }>()
);

export const previewLOMN = createAction(
  '[ Create LOMN ] Preview LOMN',
  props<LOMNSubmitMessage>()
);

export const loadExparteCopiesRequired = createAction(
  '[ Create Lomn ] Load Exparte Copies Required',
  props<{ encodedCustomerId: string; encodedClaimNumber: string }>()
);
export const loadExparteCopiesRequiredSuccess = createAction(
  '[ Create Lomn ] Load Exparte Copies Required Success',
  props<{ exparteCopiesRequired: boolean; exparteWarningMessage: string }>()
);
export const loadExparteCopiesRequiredFail = createAction(
  '[ Create Lomn ] Load Exparte Copies Required Fail',
  props<{ errors: string[] }>()
);

export const loadLetterTypes = createAction(
  '[ Create Lomn ] Load Letter Types',
  props<{ ndcs: string[] }>()
);
export const loadLetterTypesSuccess = createAction(
  '[ Create Lomn ] Load Letter Types Success',
  props<{ letterTypes: { [key: string]: string } }>()
);
export const loadLetterTypesFail = createAction(
  '[ Create Lomn ] Load Letter Types Fail',
  props<{ errors: string[] }>()
);
