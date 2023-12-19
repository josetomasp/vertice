import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import {
  allOrNothingValidator,
  generateABMReferralTimeOptions,
  TimeOption
} from '@shared';
import * as _moment from 'moment';
import { merge } from 'rxjs';
import { delay, filter, first, takeUntil } from 'rxjs/operators';
import { RootState } from '../../../../../../store/models/root.models';
import {
  AddValidFormState,
  RemoveValidFormState
} from '../../../store/actions/make-a-referral.actions';
import { MakeReferralOptions } from '../../../store/models/make-a-referral.models';
import { getServiceOptions } from '../../../store/selectors/makeReferral.selectors';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { WizardBaseStepDirective } from '../../components/wizard-base-step.directive';
import { TRANSPORTATION_LODGING_STEP_NAME } from '../transportation-step-definitions';
import { checkingDateBeforeCheckoutDateValidator } from './lodging-wizard-form-validators';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

const moment = _moment;

@Component({
  selector: 'healthe-lodging-wizard-form',
  templateUrl: './lodging-wizard-form.component.html',
  styleUrls: ['./lodging-wizard-form.component.scss'],
  providers: [provideWizardBaseStep(LodgingWizardFormComponent)]
})
export class LodgingWizardFormComponent extends WizardBaseStepDirective
  implements AfterViewInit {
  countSelections: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  priceSelections: string[] = [
    'Best Available',
    '$',
    '$$',
    '$$$',
    '$$$$',
    '$$$$$'
  ];

  errorBoxClass = ['noError'];
  skipFirstStepperTransition = true;

  lastValidState = false;
  stepForm: FormGroup = new FormGroup(
    {
      destination: new FormControl(''),
      numberOfGuests: new FormControl('1'),
      numberOfRooms: new FormControl('1'),
      checkInDate: new FormControl(null, [
        Validators.required,
        checkingDateBeforeCheckoutDateValidator
      ]),
      checkOutDate: new FormControl(null, [
        Validators.required,
        checkingDateBeforeCheckoutDateValidator
      ]),
      priceOfRoom: new FormControl('Best Available'),
      // This numberOfNights FormControl is only for use on the review screen
      numberOfNights: new FormControl(''),
      appointmentType: new FormControl(null),
      appointmentDate: new FormControl(null),
      appointmentTime: new FormControl(null),
      notes: new FormControl('')
    },
    allOrNothingValidator
  );

  numberOfNights = '';

  public transportationOptions: MakeReferralOptions;

  timeDropdownValues: TimeOption[] = generateABMReferralTimeOptions(30);

  constructor(
    public store$: Store<RootState>,
    public matStepper: MatStepper,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    super(TRANSPORTATION_LODGING_STEP_NAME, store$);
    this.store$
      .pipe(
        select(getServiceOptions()),
        filter((options) => {
          const opts = options as MakeReferralOptions;
          return opts.appointmentTypes.length > 0;
        }),
        first()
      )
      .subscribe((options) => {
        this.transportationOptions = options as MakeReferralOptions;
      });
  }

  ngAfterViewInit(): void {
    this.matStepper.selectionChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event: StepperSelectionEvent) => {
        if (event.selectedIndex === this.stepIndex) {
          // The logic here is that the first time you transition to this step we do not want to mark all as touched.
          // So skip the 'first' time this event happens.  However, if this is the very first step in the stepper
          // then we DO want to mark all as touched.
          if (
            false === this.skipFirstStepperTransition ||
            this.stepIndex === 0
          ) {
            this.stepForm.markAllAsTouched();
            this.stepForm.updateValueAndValidity();
          } else {
            this.skipFirstStepperTransition = false;
          }
        }
      });

    this.stepForm.statusChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        if (this.stepForm.hasError('allOrNothing') && this.allTouched()) {
          this.errorBoxClass = ['errorBox'];
        } else {
          this.errorBoxClass = ['noError'];
        }
      });

    this.stepForm.get('destination').setValidators(Validators.required);

    this.stepForm.get('destination').updateValueAndValidity();

    merge(
      this.stepForm.get('checkInDate').valueChanges,
      this.stepForm.get('checkOutDate').valueChanges
    )
      .pipe(
        delay(500),
        takeUntil(this.onDestroy$)
      )
      .subscribe((newValue) => this.autoCalculateDatesAndNights());

    // These next two steps are needed to setup the Submit button validity checks.
    this.save();
    this.stepForm.statusChanges.subscribe((status) => {
      if (this.stepForm.valid !== this.lastValidState) {
        this.lastValidState = this.stepForm.valid;
        if (this.stepForm.valid) {
          this.store$.dispatch(
            new AddValidFormState(TRANSPORTATION_LODGING_STEP_NAME)
          );
        } else {
          this.store$.dispatch(
            new RemoveValidFormState(TRANSPORTATION_LODGING_STEP_NAME)
          );
        }
      }
    });
  }

  clearAppointments() {
    this.stepForm.get('appointmentDate').setValue(null);
    this.stepForm.get('appointmentTime').setValue(null);
    this.stepForm.get('appointmentType').setValue(null);
  }

  allTouched(): boolean {
    return (
      this.stepForm.get('appointmentDate').touched &&
      this.stepForm.get('appointmentTime').touched &&
      this.stepForm.get('appointmentType').touched
    );
  }

  updateValidityOnBlur() {
    this.stepForm.get('checkInDate').updateValueAndValidity();
    this.stepForm.get('checkOutDate').updateValueAndValidity();
  }

  autoCalculateDatesAndNights(): void {
    // This fcNumberOfNights is for use on the review screen
    const fcNumberOfNights: AbstractControl = this.stepForm.get(
      'numberOfNights'
    );
    const fcCheckInDate: AbstractControl = this.stepForm.get('checkInDate');
    const fcCheckOutDate: AbstractControl = this.stepForm.get('checkOutDate');

    const checkInValue: string = fcCheckInDate.value;
    const checkOutValue: string = fcCheckOutDate.value;
    const checkInDateObj: Date = moment(checkInValue).toDate();
    const checkOutDateObj: Date = moment(checkOutValue).toDate();

    fcNumberOfNights.setValue('', { emitEvent: false });
    this.numberOfNights = '';

    // Try and calculate number of nights if we can
    if (checkInDateObj && checkOutDateObj) {
      if (moment.isDate(checkInDateObj) && moment.isDate(checkOutDateObj)) {
        const checkin = moment(checkInDateObj);
        const checkout = moment(checkOutDateObj);
        const days = checkout.diff(checkin, 'days');
        if (days >= 0) {
          fcNumberOfNights.setValue(days, { emitEvent: false });
          this.numberOfNights = days + '';
        }
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  cancel(): void {}

  poistiveNumberOfNights() {
    const fcNumberOfNights: AbstractControl = this.stepForm.get(
      'numberOfNights'
    );

    const value = parseInt(fcNumberOfNights.value, 10);
    if (isNaN(value) || value <= 0) {
      fcNumberOfNights.setValue('');
    }
  }

  loadForm() {
    this.stepForm$
      .pipe(
        first(),
        filter((initialState) => Object.keys(initialState).length > 0)
      )
      .subscribe(
        ({
          appointmentTime,
          appointmentType,
          appointmentDate,
          destination,
          numberOfGuests,
          numberOfRooms,
          checkInDate,
          checkOutDate,
          priceOfRoom
        }) => {
          // The mat-option values for numberOfGuests and numberOfRooms are strings so we need to set the value as a string
          this.stepForm
            .get('numberOfGuests')
            .setValue(numberOfGuests.toString());
          this.stepForm.get('numberOfRooms').setValue(numberOfRooms.toString());
          this.stepForm.get('checkInDate').setValue(checkInDate);
          this.stepForm.get('checkOutDate').setValue(checkOutDate);
          this.stepForm.get('destination').setValue(destination);
          this.stepForm.get('priceOfRoom').setValue(priceOfRoom);
          this.stepForm.get('appointmentType').setValue(appointmentType);
          this.stepForm.get('appointmentDate').setValue(appointmentDate);
          this.stepForm.get('appointmentTime').setValue(appointmentTime);

          this.autoCalculateDatesAndNights();
        }
      );
  }
}
