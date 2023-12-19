import { AbstractControl } from '@angular/forms';
import { MatStep } from '@angular/material/stepper';

export interface HealtheWizard {
  sharedForm: AbstractControl;
  stepHeaderValidation(step: MatStep, stepIndex: number): void;
}
