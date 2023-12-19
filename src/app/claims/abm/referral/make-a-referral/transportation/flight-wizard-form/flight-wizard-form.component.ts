import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import {
  allOrNothingValidator,
  generateABMReferralTimeOptions,
  TimeOption
} from '@shared';
import {
  debounceTime,
  filter,
  finalize,
  first,
  map,
  startWith,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { RootState } from '../../../../../../store/models/root.models';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { WizardBaseStepDirective } from '../../components/wizard-base-step.directive';
import { getTransportationAppointmentTypes } from '../../../store/selectors/makeReferral.selectors';
import {
  departureBeforeReturnValidator,
  duplicateAirportValidator
} from './flight-wizard-form-validators';
import { merge, Observable } from 'rxjs';
import { TRANSPORTATION_FLIGHT_STEP_NAME } from '../transportation-step-definitions';
import {
  AddValidFormState,
  RemoveValidFormState
} from '../../../store/actions/make-a-referral.actions';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatStepper } from '@angular/material/stepper';
import {
  AutocompleteOption,
  LocationService
} from '@shared/service/location.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'healthe-flight-wizard-form',
  templateUrl: './flight-wizard-form.component.html',
  styleUrls: ['./flight-wizard-form.component.scss'],
  providers: [provideWizardBaseStep(FlightWizardFormComponent)]
})
export class FlightWizardFormComponent extends WizardBaseStepDirective
  implements OnInit, AfterViewInit {
  lastValidState = false;
  flightFormGroup: FormGroup = null;
  stepForm = null;
  errorBoxClass = ['noError'];
  skipFirstStepperTransition = true;

  @ViewChild('flyingFromMenuAutocompleteTrigger', { static: true })
  flyingFromAutocompleteTrigger: MatMenuTrigger;

  @ViewChild('flyingToMenuAutocompleteTrigger', { static: true })
  flyingToAutocompleteTrigger: MatMenuTrigger;

  flyingFromSuggestions$: Observable<AutocompleteOption[]>;
  flyingToSuggestions$: Observable<AutocompleteOption[]>;

  public appointmentTypes$ = this.store$.pipe(
    select(getTransportationAppointmentTypes)
  );

  timeByHalfHour: TimeOption[] = generateABMReferralTimeOptions(30);

  constructor(
    public store$: Store<RootState>,
    private locationService: LocationService,
    public matStepper: MatStepper
  ) {
    super(TRANSPORTATION_FLIGHT_STEP_NAME, store$);
  }

  ngOnInit(): void {
    this.matStepper.selectionChange
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event: StepperSelectionEvent) => {
        // The logic here is that the first time you transition to this step we do not want to mark all as touched.
        // So skip the 'first' time this event happens.  However, if this is the very first step in the stepper
        // then we DO want to mark all as touched.
        if (event.selectedIndex === this.stepIndex) {
          if (
            false === this.skipFirstStepperTransition ||
            this.stepIndex === 0
          ) {
            this.flightFormGroup.markAllAsTouched();
            this.flightFormGroup.updateValueAndValidity();
          } else {
            this.skipFirstStepperTransition = false;
          }
        }
      });

    this.flightFormGroup = new FormGroup(
      {
        flyingFrom: new FormControl('', [
          Validators.required,
          duplicateAirportValidator
        ]),
        flyingTo: new FormControl('', [
          Validators.required,
          duplicateAirportValidator
        ]),
        appointmentTime: new FormControl(),
        appointmentType: new FormControl(),
        departureDate: new FormControl(null, [Validators.required, departureBeforeReturnValidator]),
        returnDate: new FormControl(null, [departureBeforeReturnValidator]),
        appointmentDate: new FormControl(null),
        notes: new FormControl()
      },
      allOrNothingValidator
    );

    this.stepForm = this.flightFormGroup;

    super.ngOnInit();

    this.flightFormGroup.statusChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        if (
          this.flightFormGroup.hasError('allOrNothing') &&
          this.allTouched()
        ) {
          this.errorBoxClass = ['errorBox'];
        } else {
          this.errorBoxClass = ['noError'];
        }
      });

    // The following sections are meant to "fix" validation errors when paired controls change values.
    // IE: You have two controls with the same value, and both show the error that they have the same value.
    // You change one control, then the following will make sure both controls clear their errors (or get errors).
    const fcFlyingFrom = this.flightFormGroup.get('flyingFrom');
    const fcFlyingTo = this.flightFormGroup.get('flyingTo');

    merge(fcFlyingFrom.valueChanges, fcFlyingTo.valueChanges).subscribe(() => {
      fcFlyingFrom.updateValueAndValidity({ emitEvent: false });
      fcFlyingTo.updateValueAndValidity({ emitEvent: false });
    });

    const fcDepartureDate = this.flightFormGroup.get('departureDate');
    const fcReturnDate = this.flightFormGroup.get('returnDate');
    const fcAppointmentDate = this.flightFormGroup.get('appointmentDate');
    merge(
      fcDepartureDate.valueChanges,
      fcReturnDate.valueChanges,
      fcAppointmentDate.valueChanges
    ).subscribe(() => {
      fcDepartureDate.updateValueAndValidity({ emitEvent: false });
      fcReturnDate.updateValueAndValidity({ emitEvent: false });
      fcAppointmentDate.updateValueAndValidity({ emitEvent: false });
    });

    // These next two steps are needed to setup the Submit button validity checks.
    this.save();
    this.stepForm.statusChanges.subscribe(() => {
      if (this.stepForm.valid !== this.lastValidState) {
        this.lastValidState = this.stepForm.valid;
        if (this.stepForm.valid) {
          this.store$.dispatch(
            new AddValidFormState(TRANSPORTATION_FLIGHT_STEP_NAME)
          );
        } else {
          this.store$.dispatch(
            new RemoveValidFormState(TRANSPORTATION_FLIGHT_STEP_NAME)
          );
        }
      }
    });
  }

  ngAfterViewInit() {
    const fcFlyingFrom = this.flightFormGroup.get('flyingFrom');
    const fcFlyingTo = this.flightFormGroup.get('flyingTo');

    this.flyingFromSuggestions$ = fcFlyingFrom.valueChanges.pipe(
      filter((value) => !!value),
      this.getOptions(() => this.flyingFromAutocompleteTrigger)
    );

    this.flyingToSuggestions$ = fcFlyingTo.valueChanges.pipe(
      filter((value) => !!value),
      this.getOptions(() => this.flyingToAutocompleteTrigger)
    );
  }

  clearAppointments() {
    this.flightFormGroup.get('appointmentDate').setValue(null);
    this.flightFormGroup.get('appointmentTime').setValue(null);
    this.flightFormGroup.get('appointmentType').setValue(null);
  }

  allTouched(): boolean {
    return (
      this.flightFormGroup.get('appointmentDate').touched &&
      this.flightFormGroup.get('appointmentTime').touched &&
      this.flightFormGroup.get('appointmentType').touched
    );
  }

  getOptions(
    trigger: () => MatMenuTrigger
  ): (o: Observable<any>) => Observable<AutocompleteOption[]> {
    return (o: Observable<any>): Observable<AutocompleteOption[]> =>
      o.pipe(
        debounceTime(250),
        switchMap((value) => {
          return this.locationService
            .getAirportOptions(value)
            .pipe(
              finalize(() => {
                setTimeout(() => {
                  trigger().openMenu();
                }, 500);
              })
            )
            .pipe(map((options) => options.slice(0, 10)));
        }),
        startWith([])
      );
  }

  selectOption(
    value: string,
    trigger: MatMenuTrigger,
    formControlName: string
  ) {
    const formControl = this.flightFormGroup.get(formControlName);
    formControl.markAsPristine();
    formControl.setValue(value, { emitEvent: false });
    trigger.closeMenu();
    this.save();
  }

  cancel(): void {}

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
          flyingFrom,
          flyingTo,
          departureDate,
          returnDate
        }) => {
          this.flightFormGroup.get('flyingFrom').setValue(flyingFrom);
          this.flightFormGroup.get('flyingTo').setValue(flyingTo);
          this.flightFormGroup.get('appointmentDate').setValue(appointmentDate);
          this.flightFormGroup.get('appointmentTime').setValue(appointmentTime);
          this.flightFormGroup.get('appointmentType').setValue(appointmentType);
          this.flightFormGroup.get('departureDate').setValue(departureDate);
          this.flightFormGroup.get('returnDate').setValue(returnDate);
        }
      );
  }
}
