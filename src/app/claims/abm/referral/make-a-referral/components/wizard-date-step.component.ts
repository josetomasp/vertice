import { Directive, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { takeUntil } from 'rxjs/operators';

import { RootState } from '../../../../../store/models/root.models';
import {
  AddValidFormState,
  RemoveValidFormState
} from '../../store/actions/make-a-referral.actions';
import { DateFormMode } from '../../store/models/make-a-referral.models';
import { SpecificDateFormArrayComponent } from './specific-date-form-array/specific-date-form-array.component';
import { SpecificDateFormArrayConfig } from './specific-date-form-array/specific-date-form-config';
import { WizardBaseStepDirective } from './wizard-base-step.directive';
import { WizardBaseDirective } from './wizard-base.directive';
import { MatStepper } from '@angular/material/stepper';

@Directive()
export abstract class WizardDateStepComponent extends WizardBaseStepDirective
  implements OnInit, OnDestroy {
  abstract stepForm: AbstractControl;
  abstract specificDateConfig: SpecificDateFormArrayConfig;
  dateMode: DateFormMode = DateFormMode.SpecificDate;
  authorizationDateTypes: DateFormMode[] = [
    DateFormMode.SpecificDate,
    DateFormMode.DateRange
  ];

  lastValidState = false;

  protected constructor(
    public stepName: string,
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService,
    public dateRangeFormGenerator,
    public wizard?: WizardBaseDirective,
    public matStepper?: MatStepper
  ) {
    super(stepName, store$, wizard, matStepper);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (null != this.resetFormValues) {
      if (
        this.resetFormValues.authorizationDateType === DateFormMode.DateRange
      ) {
        this.swapDateModeForms();
        this.stepForm.reset(this.resetFormValues, { emitEvent: false });
      }
    }

    // These next three steps are needed to setup the Submit button validity checks.
    // This also marks sections valid if loaded from a draft with valid forms
    this.save();
    this.initValidFormStateListener();
    this.stepForm.updateValueAndValidity();
  }

  initValidFormStateListener() {
    this.stepForm.statusChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((_) => {
        if (this.stepForm.valid !== this.lastValidState) {
          this.lastValidState = this.stepForm.valid;
          if (this.stepForm.valid) {
            this.store$.dispatch(new AddValidFormState(this.stepName));
          } else {
            this.store$.dispatch(new RemoveValidFormState(this.stepName));
          }
        }
      });
  }

  cancel(): void {}

  makeSpecificDateForm() {
    return new FormArray(
      [
        SpecificDateFormArrayComponent.generateEmptyFormGroup(
          this.specificDateConfig
        )
      ],
      Validators.required
    );
  }

  makeDateRangeForm() {
    return this.dateRangeFormGenerator();
  }

  dateModeSwitch($event: Event, type: DateFormMode) {
    $event.preventDefault();
    if (type !== this.dateMode) {
      if (this.stepForm.get('schedulingForm').dirty) {
        this.confirmationModalService
          .displayModal({
            titleString: 'Are you sure?',
            bodyHtml:
              'The data entered in this mode will be lost, are you sure to continue?',
            affirmString: 'Yes',
            denyString: 'No'
          })
          .afterClosed()
          .subscribe((confirmed) => {
            if (confirmed) {
              this.swapDateModeForms();
            }
          });
      } else {
        this.swapDateModeForms();
      }
    }
  }

  protected revalidateFromToAddress(): void {
    const form = (this.stepForm as any).controls.schedulingForm;
    const controls = form.controls[0].controls;
    const fromAddress: FormControl = controls['fromAddress'];
    const toAddress: FormControl = controls['toAddress'];

    toAddress.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((_) => {
      if (fromAddress.hasError('duplicate') && toAddress.valid) {
        fromAddress.patchValue({ ...fromAddress.value });
      }
    });

    fromAddress.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((_) => {
      if (toAddress.hasError('duplicate') && fromAddress.valid) {
        toAddress.patchValue({ ...toAddress.value });
      }
    });
  }

  protected swapDateModeForms() {
    if (this.dateMode === DateFormMode.SpecificDate) {
      this.dateMode = DateFormMode.DateRange;
      (this.stepForm as FormGroup).setControl(
        'schedulingForm',
        this.makeDateRangeForm()
      );
    } else {
      this.dateMode = DateFormMode.SpecificDate;
      (this.stepForm as FormGroup).setControl(
        'schedulingForm',
        this.makeSpecificDateForm()
      );
    }
    this.stepForm.get('authorizationDateType').setValue(this.dateMode);
  }
}
