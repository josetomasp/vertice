import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  GenericConfigurableStepConfig,
  GenericFormFieldType,
  GenericStepperStoreState,
  GenericStepType,
  GenericWizardConfig,
  GenericWizardStatus
} from '@modules/generic-wizard/generic-wizard.models';
import { flatten } from 'lodash';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { HealtheSelectOption } from '@shared';

@Injectable()
export class GenericWizardStore<FormState> extends ComponentStore<
  GenericStepperStoreState<FormState>
> {
  formGroup!: FormGroup;
  public vm$ = this.select(
    ({
       steps,
       formState,
       wizardOpen,
       serviceDisplayName,
       wizardStatus,
       referralOnly,
       activeStepIndex,
       touchedSteps,
       validSteps,
       displaySubmit,
       displayPreviousButton,
       expansionToggleLabel,
       optionMap,
       successMessage,
       warningMessage
     }) => ({
      steps,
      wizardOpen,
      serviceDisplayName,
      wizardStatus,
      formState,
      referralOnly,
      activeStepIndex,
      touchedSteps,
      validSteps,
      displaySubmit,
      displayPreviousButton,
      expansionToggleLabel,
      optionMap,
      successMessage,
      warningMessage
    })
  );

  constructor() {
    super();
  }

  init(config: GenericWizardConfig): void {
    const { steps, serviceType, serviceDisplayName, referralOnly } = config;
    const formState = this.generateDefaultFormState(config);
    this.formGroup = this.generateFormGroup(config, formState);
    this.setState({
      displayPreviousButton: false,
      displaySubmit: false,
      optionMap: {
        vendors: []
      },
      wizardStatus: GenericWizardStatus.NotStarted,
      wizardOpen: false,
      activeStepIndex: 0,
      touchedSteps: [],
      validSteps: [],
      formState,
      serviceDisplayName,
      serviceType,
      steps,
      referralOnly,
      expansionToggleLabel: 'BEGIN',
      successMessage: null,
      warningMessage: null
    });
  }

  getStepIndexByFormPath = (formPath: string) =>
    this.select(({ steps }) => {
      const [stepFormGroupName] = formPath.split('.');
      return steps.findIndex(({ stepName }) => stepName === stepFormGroupName);
    });
  getOptionByFormControlName = (formControlName: string) =>
    this.select((state) => state.optionMap[formControlName]);

  setWizardStatusSubmitted = this.updater((state) => {
    return { ...state, wizardStatus: GenericWizardStatus.Submitted };
  });
  toggleWizardExpansion = this.updater((state) => {
    let wizardStatus = state.wizardStatus;
    let wizardOpen = !state.wizardOpen;
    let expansionToggleLabel = wizardOpen ? 'CLOSE' : 'OPEN';
    if (wizardStatus === GenericWizardStatus.NotStarted) {
      wizardStatus = GenericWizardStatus.InProgress;
    }

    return { ...state, wizardStatus, wizardOpen, expansionToggleLabel };
  });
  setActiveStep = this.updater((state, activeStepIndex: number) => {
    let displaySubmit = activeStepIndex === state.steps.length - 1;
    let displayPreviousButton = activeStepIndex > 0;
    return {
      ...state,
      activeStepIndex,
      displayPreviousButton,
      displaySubmit
    };
  });
  setOptionsByFormControlName = this.updater(
    (
      state,
      {
        formControlName,
        options
      }: { formControlName: string; options: HealtheSelectOption<any>[] }
    ) => ({
      ...state,
      optionMap: { ...state.optionMap, [formControlName]: options }
    })
  );
  popValidStep = this.updater((state, index: number) => {
    let validSteps = [...state.validSteps];
    let stepIndex = validSteps.indexOf(index);
    if (stepIndex > -1) {
      validSteps.splice(stepIndex, 1);
    }
    // TODO: Add checks for whether step was touched
    return { ...state, validSteps };
  });
  pushValidStep = this.updater((state, index: number) => {
    const validSteps = state.validSteps;
    if (!validSteps.includes(index)) {
      validSteps.push(index);
    }
    // TODO: Add checks for whether step was touched
    // let wizardStatus: GenericWizardStatus = GenericWizardStatus.InProgress;
    // if(state.touchedSteps.length === state.steps.length) {
    //   if(validSteps.length === state.steps.length) {
    //     wizardStatus = GenericWizardStatus.Completed;
    //   } else {
    //     wizardStatus = GenericWizardStatus.Error;
    //   }
    // }
    return { ...state, validSteps };
  });
  pushTouchedStep = this.updater((state, index: number) => {
    const touchedSteps = state.touchedSteps;
    if (!touchedSteps.includes(index)) {
      touchedSteps.push(index);
    }
    return { ...state, touchedSteps };
  });
  popTouchedStep = this.updater((state, index: number) => {
    let touchedSteps = [...state.touchedSteps];
    let stepIndex = touchedSteps.indexOf(index);
    if (stepIndex > -1) {
      touchedSteps.splice(stepIndex, 1);
    }
    return { ...state, touchedSteps };
  });

  setSectionValidity(valid: boolean) {
  }

  saveAsDraft() {
    localStorage.setItem('draft', JSON.stringify(this.formGroup.value));
  }

  loadDraft() {
    const rawDraft = localStorage.getItem('draft');
    if (rawDraft) {
      try {
        const draft = JSON.parse(rawDraft);
        this.formGroup.patchValue(draft);
        this.formGroup.get('firstStep').markAsTouched();
        this.formGroup.get('secondStep').markAsTouched();
      } catch (e) {
        console.log(e);
        //who cares
      }
    }
  }

  private getSentinelValue(type: GenericFormFieldType) {
    switch (type) {
      case GenericFormFieldType.Input:
      case GenericFormFieldType.TextArea:
      case GenericFormFieldType.Autocomplete:
        return '';
      case GenericFormFieldType.Select:
      case GenericFormFieldType.MultiSelect:
      case GenericFormFieldType.RadioGroup:
        return null;
    }
  }

  private generateDefaultFormState(config: GenericWizardConfig): FormState {
    const formState = {};
    config.steps.forEach((step) => {
      if (step.stepType !== GenericStepType.ReviewStep) {
        formState[step.stepName] = {};
        if (step.stepType === GenericStepType.ConfigurableStep) {
          step.formSections.forEach((section) => {
            flatten(section.formFieldConfigs).forEach(
              ({ formControlName, formFieldType, initialState }) => {
                formState[step.stepName][formControlName] =
                  initialState ?? this.getSentinelValue(formFieldType);
              }
            );
          });
        } else if (step.stepType === GenericStepType.VendorStep) {
          formState[step.stepName] = '';
        } else if (step.stepType === GenericStepType.DocumentStep) {
          formState[step.stepName] = [];
        }
      } else {
        formState[step.stepName] = '';
      }
    });
    return formState as FormState;
  }

  private generateFormGroup(
    config: GenericWizardConfig,
    formState: FormState
  ): FormGroup {
    const stepperFormGroupConfig = {};
    config.steps.forEach((step) => {
      switch (step.stepType) {
        case GenericStepType.ConfigurableStep:
          stepperFormGroupConfig[step.stepName] =
            this.generateConfigurableStepFormGroup(step);
          break;
        case GenericStepType.DocumentStep:
          stepperFormGroupConfig[step.stepName] = new FormControl([]);
          break;
        case GenericStepType.VendorStep:
          stepperFormGroupConfig[step.stepName] = new FormControl(
            [],
            Validators.required
          );
          break;
        case GenericStepType.ReviewStep:
          stepperFormGroupConfig[step.stepName] = new FormControl('');
      }
    });
    const stepperFormGroup = new FormGroup(stepperFormGroupConfig);
    stepperFormGroup.setValue(formState);
    return stepperFormGroup;
  }

  private generateConfigurableStepFormGroup(
    config: GenericConfigurableStepConfig<any>
  ): FormGroup {
    const stepFormGroupConfig = {};
    config.formSections.forEach((section) =>
      flatten(section.formFieldConfigs).forEach((field) => {
        if (!(field.formControlName in stepFormGroupConfig)) {
          stepFormGroupConfig[field.formControlName] = new FormControl(
            this.getSentinelValue(field.formFieldType),
            (field.validators ?? []).map(this.getValidatorFnByName)
          );
        }
      })
    );
    return new FormGroup(stepFormGroupConfig);
  }

  private getValidatorFnByName(
    validatorNameOrArray: string | [string, number]
  ): ValidatorFn {
    if (
      typeof validatorNameOrArray == 'string' &&
      validatorNameOrArray in Validators
    ) {
      return Validators[validatorNameOrArray];
    } else if (Array.isArray(validatorNameOrArray)) {
      const [validatorName, param] = validatorNameOrArray;
      return Validators[validatorName](param);
    }
  }

  submit = this.updater(
    (
      state,
      {
        successMessage,
        warningMessage
      }: { successMessage: string; warningMessage: string }
    ) => ({
      ...state,
      wizardStatus: GenericWizardStatus.Submitted,
      successMessage,
      warningMessage
    })
  );
}
