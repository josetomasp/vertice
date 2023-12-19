import {
  GenericConfigurableFormSection,
  GenericConfigurableStepConfig,
  GenericFormFieldConfig,
  GenericFormFieldType,
  GenericStepType
} from '@modules/generic-wizard/generic-wizard.models';

export function genericConfigurableStep<StepConfig = any>(
  stepName: string,
  stepTitle: string,
  ...formSections: GenericConfigurableFormSection[]
): GenericConfigurableStepConfig<StepConfig> {
  return {
    stepType: GenericStepType.ConfigurableStep,
    stepName,
    stepTitle,
    formSections
  };
}

export function formSection(
  formSectionTitle: string,
  ...rows: GenericFormFieldConfig<any>[][]
): GenericConfigurableFormSection {
  return { formFieldConfigs: rows, formSectionTitle };
}

export function row(...formFieldConfig: GenericFormFieldConfig<any>[]) {
  return [...formFieldConfig];
}

export function textArea(
  formControlName: string,
  label: string,
  placeholder: string,
  maxLength?: number,
  validators?: (string | [string, number])[]
): GenericFormFieldConfig<{ maxLength?: number }> {
  return {
    formFieldType: GenericFormFieldType.TextArea,
    formControlName,
    label,
    placeholder,
    validators,
    options: { maxLength }
  };
}
