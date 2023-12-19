import { forwardRef } from '@angular/core';
import { WizardBaseStepDirective } from './wizard-base-step.directive';

export function provideWizardBaseStep(componentClass) {
  return {
    provide: WizardBaseStepDirective,
    useExisting: forwardRef(() => componentClass),
    multi: true
  };
}
