import { CdkStepper } from '@angular/cdk/stepper';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStep } from '@angular/material/stepper';
import { faPlus, faSync } from '@fortawesome/pro-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { has } from 'lodash';
import { isObservable, Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { RootState } from '../../../../../../store/models/root.models';
import { getServiceOptions } from '../../../store/selectors/makeReferral.selectors';
import {
  AncilliaryServiceCode,
  compareLocations,
  ServiceType
} from '../../make-a-referral-shared';
import { MakeAReferralService } from '../../make-a-referral.service';
import { TRANSPORTATION_ARCH_TYPE } from '../../transportation/transportation-step-definitions';
import {
  SpecificDateDynamicRow,
  SpecificDateFormArrayConfig
} from './specific-date-form-config';
import { dmeNotesValidation } from './specific-date-trip-information-form/components/hcpc-and-product-select-switch/hcpc-and-product-select-switch.validators';

@Component({
  selector: 'healthe-specific-date-form-array',
  templateUrl: './specific-date-form-array.component.html',
  styleUrls: ['./specific-date-form-array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecificDateFormArrayComponent implements OnInit, OnDestroy {
  faPlus = faPlus;
  faSync = faSync;
  compareLocations = compareLocations;
  @Input()
  config: SpecificDateFormArrayConfig;
  @Input()
  formArray: FormArray;
  // Transportation is the default value.
  @Input()
  selectedService: ServiceType = TRANSPORTATION_ARCH_TYPE;

  // We need to provide the parent service type.
  currentStepIndex: number;
  public transportationOptions$ = this.store$.pipe(
    select(getServiceOptions(this.selectedService))
  );
  private unsubscribe$ = new Subject<never>();

  constructor(
    public dialog: MatDialog,
    private makeAReferralService: MakeAReferralService,
    private confirmationModalService: ConfirmationModalService,
    errorStateMatcher: ErrorStateMatcher,
    public store$: Store<RootState>,
    currentStep: MatStep,
    @Inject(CdkStepper) stepper: CdkStepper,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    stepper.selectionChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((stepChange) => {
        this.currentStepIndex = stepChange.selectedIndex;
        changeDetectorRef.detectChanges();
      });
  }

  static generateEmptyFormGroup(
    config: SpecificDateFormArrayConfig
  ): FormGroup {
    const formGroupControls = {};

    for (let i = 0; i < config.controls.length; i++) {
      let controlRow = config.controls[i];

      if (has(controlRow, 'type')) {
        controlRow = (controlRow as SpecificDateDynamicRow).controls;
      }
      for (let {
        formControlName,
        formState,
        validatorOrOpts,
        asyncValidator
      } of controlRow) {
        if (isObservable(formState)) {
          formState
            .pipe(first())
            .subscribe((initialState) => (formState = initialState));
        }
        formGroupControls[formControlName] = new FormControl(
          formState,
          validatorOrOpts,
          asyncValidator
        );
      }
    }
    if (config.actionConfig.enableAddNote) {
      if (config.serviceActionType === AncilliaryServiceCode.DME) {
        formGroupControls['notes'] = new FormControl('', [dmeNotesValidation]);
      } else {
        formGroupControls['notes'] = new FormControl('');
      }
    }
    return new FormGroup(formGroupControls);
  }

  duplicateFormGroup(index) {
    const duplicate: FormGroup = SpecificDateFormArrayComponent.generateEmptyFormGroup(
      this.config
    );
    duplicate.setValue(this.formArray.controls[index].value);
    duplicate.markAsDirty();
    this.formArray.insert(index + 1, duplicate);
  }

  deleteItem(index: number): void {
    let deleteMessage = 'Delete Stop?';
    let deleteTitle =
      'Are you sure that you would like to remove the selected Stop?';
    if (this.config.deleteItemModal) {
      deleteMessage = this.config.deleteItemModal.deleteItemMessage;
      deleteTitle = this.config.deleteItemModal.deleteItemTitle;
    }

    if (this.formArray.length !== 1) {
      this.confirmationModalService
        .displayModal({
          titleString: deleteTitle,
          bodyHtml: deleteMessage,
          affirmString: 'Yes',
          denyString: 'No'
        })
        .afterClosed()
        .pipe(filter((confirmed) => confirmed))
        .subscribe(() => {
          this.formArray.removeAt(index);
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  makeRoundTripDisabled(): boolean {
    const formArray: any = this.formArray;
    return (
      formArray.controls[formArray.controls.length - 1].controls['fromAddress']
        .invalid ||
      formArray.controls[formArray.controls.length - 1].controls['toAddress']
        .invalid
    );
  }

  makeRoundTrip(): void {
    const {
      fromAddressFormControlName,
      toAddressFormControlName,
      appointmentTypeFormControlName,
      appointmentTimeFormControlName,
      pickupDateFormControlName
    } = this.config.roundTripConfig;

    if (
      this.config.roundTripConfig &&
      (toAddressFormControlName &&
        fromAddressFormControlName &&
        appointmentTypeFormControlName &&
        appointmentTimeFormControlName &&
        pickupDateFormControlName)
    ) {
      let roundTripStop: FormGroup = SpecificDateFormArrayComponent.generateEmptyFormGroup(
        this.config
      );

      roundTripStop
        .get(fromAddressFormControlName)
        .setValue(
          this.formArray.controls[this.formArray.length - 1].get(
            toAddressFormControlName
          ).value
        );

      roundTripStop
        .get(toAddressFormControlName)
        .setValue(
          this.formArray.controls[this.formArray.length - 1].get(
            fromAddressFormControlName
          ).value
        );

      roundTripStop
        .get(appointmentTypeFormControlName)
        .setValue(
          this.formArray.controls[this.formArray.length - 1].get(
            appointmentTypeFormControlName
          ).value
        );

      roundTripStop
        .get(appointmentTimeFormControlName)
        .setValue(
          this.formArray.controls[this.formArray.length - 1].get(
            appointmentTimeFormControlName
          ).value
        );

      roundTripStop
        .get(pickupDateFormControlName)
        .setValue(
          this.formArray.controls[this.formArray.length - 1].get(
            pickupDateFormControlName
          ).value
        );

      roundTripStop.get(fromAddressFormControlName).markAsDirty();
      roundTripStop.get(toAddressFormControlName).markAsDirty();
      roundTripStop.get(appointmentTypeFormControlName).markAsDirty();
      roundTripStop.get(appointmentTimeFormControlName).markAsDirty();
      roundTripStop.get(pickupDateFormControlName).markAsDirty();

      this.formArray.insert(this.formArray.length, roundTripStop);
    } else {
      console.error('Cant perform round trip. Round Trip is not configured!');
    }
  }

  ngOnInit() {
    if (this.formArray.length === 0) {
      this.addFormGroup(-1);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  trackByFn($controlIndex) {
    return $controlIndex;
  }

  addFormGroup(index) {
    this.formArray.insert(
      index + 1,
      SpecificDateFormArrayComponent.generateEmptyFormGroup(this.config)
    );
  }

  showAddLocationModal() {
    this.makeAReferralService.displayAddLocationModal({
      selectedServiceType: this.selectedService,
      enablePhysicianSpecialtyDropdown:
        this.selectedService === TRANSPORTATION_ARCH_TYPE
    });
  }
}
