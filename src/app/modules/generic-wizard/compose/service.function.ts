import {
  GenericStepConfig,
  GenericWizardConfig
} from '@modules/generic-wizard/generic-wizard.models';

/**
 *
 * Creates a service configuration for the generic wizard for use in the config map token
 *
 * @param {string} serviceType - the machine-readable name for a service referenced for configuration
 * @param {string} serviceDisplayName - the human-readable name for a service displayed to a user in the title section of the wizard
 * @param {boolean} referralOnly - a boolean that determines whether to show the "Referral Only" sub-heading
 * @param {GenericStepConfig[]} steps - A list of steps generated using the {@link genericConfigurableStep}, {@link vendorStep}, {@link documentsStep}, {@link reviewStep} functions
 */
export function wizardService(
  serviceType: string,
  serviceDisplayName: string,
  referralOnly: boolean,
  ...steps: GenericStepConfig[]
): GenericWizardConfig {
  return {
    serviceType,
    serviceDisplayName,
    referralOnly,
    steps
  };
}
