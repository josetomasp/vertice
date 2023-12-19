import {
  GenericWizardConfig,
  GenericWizardServiceConfigMap
} from '@modules/generic-wizard/generic-wizard.models';

/**
 * Takes services created using the {@link wizardService} function to create a config map
 * @param {function} services
 */
export function wizardConfigMap(
  ...services: GenericWizardConfig[]
): GenericWizardServiceConfigMap {
  return services.reduce((previousValue, currentValue) => {
    previousValue[currentValue.serviceType] = currentValue;
    return previousValue;
  }, {});
}
