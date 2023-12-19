import {
  GenericStepType,
  VendorStepConfig
} from '@modules/generic-wizard/generic-wizard.models';

export function vendorStep(
  autoPopulation: boolean = true,
  vendorChangeAllowed: boolean = true,
  priorityChangeAllowed: boolean = true
): VendorStepConfig {
  return {
    stepName: 'vendors',
    stepTitle: 'Vendors',
    stepType: GenericStepType.VendorStep,
    autoPopulation,
    vendorChangeAllowed,
    priorityChangeAllowed
  };
}
