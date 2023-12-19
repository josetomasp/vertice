import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { noop } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { RootState } from '../../../../../store/models/root.models';
import { UpdateSectionForm } from '../../store/actions/make-a-referral.actions';
import { getFormStateByName } from '../../store/selectors/makeReferral.selectors';
import { isEmpty, isEqual } from 'lodash';
import { MatStep, MatStepHeader, MatStepper } from '@angular/material/stepper';
import { SpecificDateFormArrayConfig } from './specific-date-form-array/specific-date-form-config';
import { ERROR_MESSAGES } from '@shared/constants/form-field-validation-error-messages';
import { HealtheWizard } from './wizard.interface';

/**
 * @implements OnInit
 *
 * @property {AbstractControl} stepFormGroup where step form values are store.
 * When ngOnDestroy is called, those values will be persisted.
 *
 * @property {String} stepName Name of the step for persistence and ultimately how it will
 * be posted to the backend
 *
 *
 */
@Directive()
export abstract class WizardBaseStepDirective extends DestroyableComponent
  implements OnInit, ControlValueAccessor, OnDestroy {
  abstract stepForm: AbstractControl;
  private _onTouched: any = noop;
  private _onChange: any = noop;

  protected resetFormValues: any = null;

  @Input()
  stepIndex: number;

  ERROR_MESSAGES = ERROR_MESSAGES;

  protected constructor(
    public stepName: string,
    public store$: Store<RootState>,
    public wizard?: HealtheWizard,
    public matStepper?: MatStepper
  ) {
    super();
  }

  stepForm$ = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: this.stepName,
        useReturnedValues: false
      })
    )
  );

  abstract loadForm(): void;

  ngOnInit(): void {
    if (this.loadForm) {
      this.loadForm();
    }
    this.stepForm.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(500),
        distinctUntilChanged(isEqual)
      )
      .subscribe(() => {
        this.save();
      });
  }

  /**
   * @method
   * @description All steps need some sort of cancel mechanism.
   */
  abstract cancel(): void;

  /**
   * This will update the store with the form state of the current section or
   * step you are in
   */
  save() {
    this.store$.dispatch(
      new UpdateSectionForm({ [this.stepName]: this.stepForm.value })
    );
  }

  writeValue(obj: any): void {
    if (!isEmpty(obj)) {
      this.stepForm.setValue(obj);
    }
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.stepForm.disable();
    } else {
      this.stepForm.enable();
    }
  }

  subscribeSharedFormValidationHeader() {
    if (this.wizard && this.matStepper) {
      this.stepForm.valueChanges.subscribe(() => {
        this.stepValidation(false);
      });

      this.wizard.sharedForm.valueChanges.subscribe(() => {
        this.stepValidation(true);
      });
    } else {
      console.warn(
        'To use SharedForm HeaderValidation it is required to specify Wizard and MatStepper on the step constructor. '
      );
    }
  }

  private stepValidation(fromSharedForm) {
    if (this.matStepper.steps) {
      const step = this.matStepper.steps.toArray()[this.stepIndex] as MatStep;

      if (this.stepForm.dirty || this.wizard.sharedForm.dirty) {
        this.stepForm.status === 'VALID' &&
        this.wizard.sharedForm.status === 'VALID'
          ? (step.hasError = false)
          : (step.hasError = true);
        if (
          fromSharedForm &&
          this.matStepper.selectedIndex !== this.stepIndex
        ) {
          const stepHeader = this.matStepper._stepHeader.toArray()[
            this.stepIndex
          ];
          this.wizard.stepHeaderValidation(step, this.stepIndex);
          this.resetHeaderState(stepHeader);
          this.setHeaderState(stepHeader, step.hasError ? 'invalid' : 'valid');
        }
      }
    }
  }

  protected generateSpecificDateFormGroup<T>(
    config: SpecificDateFormArrayConfig,
    // Potentially this would be of type Observable<{[key: string]: any}>
    data: T
  ): FormGroup {
    const formGroupControls = {};
    if (config.actionConfig.enableAddNote) {
      formGroupControls['notes'] = new FormControl(data['notes']);
    }
    for (let i = 0; i < config.controls.length; i++) {
      let controlRow = config.controls[i];
      for (let {
        formControlName, // formControlName is the property name in json
        validatorOrOpts, // Validators or options for the FormControl
        asyncValidator // Async validators for the FormControl
      } of controlRow) {
        formGroupControls[formControlName] = new FormControl(
          data[formControlName], // Here is where the data would be loaded in
          validatorOrOpts,
          asyncValidator
        );
      }
    }
    return new FormGroup(formGroupControls);
  }

  protected generateDynamicDateFormGroup<T>(
    config,
    // Potentially this would be of type Observable<{[key: string]: any}>
    data: T
  ): FormGroup {
    const formGroupControls = {};
    if (config.actionConfig.enableAddNote) {
      formGroupControls['notes'] = new FormControl(data['notes']);
    }
    for (let i = 0; i < config.controls.length; i++) {
      let controlRow = config.controls[i];
      let controlRowList = controlRow.controls
        ? controlRow.controls
        : controlRow;

      for (let {
        formControlName, // formControlName is the property name in json
        validatorOrOpts, // Validators or options for the FormControl
        asyncValidator // Async validators for the FormControl
      } of controlRowList) {
        formGroupControls[formControlName] = new FormControl(
          data[formControlName], // Here is where the data would be loaded in
          validatorOrOpts,
          asyncValidator
        );
      }
    }
    return new FormGroup(formGroupControls);
  }

  private resetHeaderState(header: MatStepHeader): void {
    header._getHostElement().classList.remove('valid');
    header._getHostElement().classList.remove('invalid');
  }

  private setHeaderState(header: MatStepHeader, className: string): void {
    header._getHostElement().classList.add(className);
  }
}
