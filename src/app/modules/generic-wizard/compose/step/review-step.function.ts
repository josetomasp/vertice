import {
  GenericStepType,
  ReviewStepConfig
} from '@modules/generic-wizard/generic-wizard.models';

export function reviewStep(): ReviewStepConfig {
  return {
    stepName: 'review',
    stepTitle: 'Review',
    stepType: GenericStepType.ReviewStep
  };
}
