import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { filter, first } from 'rxjs/operators';

import { RootState } from '../../../../../../store/models/root.models';
import {
  getLanguageOptions,
  getServiceOptions,
  getTransportationAppointmentTypes
} from '../../../store/selectors/makeReferral.selectors';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { WizardDateStepComponent } from '../../components/wizard-date-step.component';
import { generateDateRangeForm } from '../openAuthFormGenerators';
import { generateTransportationSpecificDateConfig } from '../generateTransportationSpecificDateConfig';
import { TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME } from '../transportation-step-definitions';
import { DateFormMode } from '../../../store/models/make-a-referral.models';
import { SpecificDateFormArrayConfig } from '../../components/specific-date-form-array/specific-date-form-config';
import { DateRangeValidators } from '../../components/date-range-form/dateRangeValidators';

@Component({
  selector: 'healthe-wheelchair-support-wizard-form',
  templateUrl: './wheelchair-support-wizard-form.component.html',
  styleUrls: ['./wheelchair-support-wizard-form.component.scss'],
  providers: [provideWizardBaseStep(WheelchairSupportWizardFormComponent)]
})
export class WheelchairSupportWizardFormComponent
  extends WizardDateStepComponent
  implements OnInit {
  faInfoCircle = faInfoCircle;
  booleanRadioValues: string[] = ['No', 'Yes'];
  wheelchairTypes: string[] = [
    'Requires Wheelchair',
    'Has Manual Wheelchair',
    'Has Power Wheelchair',
    'Unknown'
  ];

  public appointmentTypes$ = this.store$.pipe(
    select(getTransportationAppointmentTypes)
  );
  specificDateConfig = generateTransportationSpecificDateConfig(
    'wheelchair',
    this.appointmentTypes$
  );

  _languages: string[] = [];

  public transportationOptions$ = this.store$.pipe(select(getServiceOptions()));

  stepForm: FormGroup = new FormGroup({
    authorizationDateType: new FormControl(this.authorizationDateTypes[0]),
    driverLanguage: new FormControl('English'),
    rushServiceNeeded: new FormControl(this.booleanRadioValues[0]),
    paidAsExpense: new FormControl(this.booleanRadioValues[0]),
    schedulingForm: this.makeSpecificDateForm(),
    steps: new FormControl(null),
    wheelchairType: new FormControl(null, Validators.required)
  });

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService
  ) {
    super(
      TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME,
      store$,
      confirmationModalService,
      generateDateRangeForm
    );
  }

  ngOnInit(): void {
    // AFS-5613
    // By default specific date is the default for all transportation steps.
    // We are swapping to date range, before the base step ngOnInit. (to prevent messing the draft load)
    this.swapDateModeForms();

    super.ngOnInit();
    if (this.dateMode === DateFormMode.SpecificDate) {
      super.revalidateFromToAddress();
    }
    this.setLanguages();
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
          authorizationDateType,
          rushServiceNeeded,
          paidAsExpense,
          schedulingForm,
          driverLanguage,
          steps,
          wheelchairType
        }) => {
          this.dateMode = authorizationDateType;
          this.stepForm = new FormGroup({
            authorizationDateType: new FormControl(authorizationDateType),
            rushServiceNeeded: new FormControl(rushServiceNeeded),
            paidAsExpense: new FormControl(paidAsExpense),
            schedulingForm: this.loadSchedulingForm(
              schedulingForm,
              authorizationDateType,
              this.specificDateConfig
            ),
            driverLanguage: new FormControl(driverLanguage),
            steps: new FormControl(steps),
            wheelchairType: new FormControl(wheelchairType)
          });
        }
      );

    // I'm not sure why this additional setLanguages is needed for date range mode,
    //  but even without the filter() in it, the getLanguageOptions just wouldn't emit
    //  when called from ngOnInit()
    if (this.dateMode === DateFormMode.DateRange) {
      this.setLanguages();
    }
  }

  loadSchedulingForm(
    schedulingFormState: any,
    dateMode: DateFormMode,
    config: SpecificDateFormArrayConfig
  ): FormGroup | FormArray {
    if (dateMode === DateFormMode.SpecificDate) {
      return new FormArray(
        (schedulingFormState as []).map((lineItem) =>
          this.generateSpecificDateFormGroup<any>(config, lineItem)
        )
      );
    } else {
      const {
        startDate,
        endDate,
        tripsAuthorized,
        unlimitedTrips,
        noLocationRestrictions,
        approvedLocations,
        notes
      } = schedulingFormState as any;

      let formGroup = new FormGroup(
        {
          startDate: new FormControl(startDate, [
            Validators.required,
            DateRangeValidators.startDateValidation
          ]),
          endDate: new FormControl(endDate, [
            Validators.required,
            DateRangeValidators.endDateValidation
          ]),
          tripsAuthorized: new FormControl(
            tripsAuthorized,
            DateRangeValidators.tripsOrUnlimitedTrips
          ),
          unlimitedTrips: new FormControl(
            unlimitedTrips,
            DateRangeValidators.tripsOrUnlimitedTrips
          ),
          noLocationRestrictions: new FormControl(noLocationRestrictions),
          approvedLocations: new FormControl(approvedLocations),
          notes: new FormControl(notes)
        },
        [DateRangeValidators.validTwoLocationSelection]
      );

      if (formGroup.get('unlimitedTrips').value === true) {
        formGroup.get('tripsAuthorized').disable();
      }

      return formGroup;
    }
  }

  setLanguages() {
    this.store$
      .pipe(
        select(getLanguageOptions),
        filter((languages) => languages != null && languages.length !== 0),
        first()
      )
      .subscribe((languages) => (this._languages = languages));
  }
}
