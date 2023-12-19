import {
  DocumentsStepConfig,
  GenericStepType
} from '@modules/generic-wizard/generic-wizard.models';

export function documentsStep(): DocumentsStepConfig {
  return {
    stepType: GenericStepType.DocumentStep,
    stepName: 'documents',
    stepTitle: 'Documents'
  };
}
