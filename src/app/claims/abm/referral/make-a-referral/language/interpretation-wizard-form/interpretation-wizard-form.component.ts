import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { HealtheSelectOption } from '@shared';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { filter, first, map, takeUntil } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  FusionServiceName,
  InterpretationDateRangeFormState,
  InterpretationFormState,
  InterpretationSpecificDateFormState
} from '../../../store/models/fusion/fusion-make-a-referral.models';
import { DateFormMode } from '../../../store/models/make-a-referral.models';
import {
  getFusionReferralOptions,
  getFusionServiceGroupOptionsByGroupName
} from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { isLoadedFromDraft } from '../../../store/selectors/makeReferral.selectors';
import { DateRangeValidators } from '../../components/date-range-form/dateRangeValidators';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { SpecificDateFormArrayComponent } from '../../components/specific-date-form-array/specific-date-form-array.component';
import {
  SpecificDateFormArrayConfig,
  SpecificDateFormFieldType
} from '../../components/specific-date-form-array/specific-date-form-config';
import { WizardDateStepComponent } from '../../components/wizard-date-step.component';
import { generateLanguageDateRangeForm } from '../generateLanguageDateRangeForm';
import {
  LANGUAGE_ARCH_TYPE,
  LANGUAGE_INTERPRETATION_STEP_NAME
} from '../language-step-definitions';
import { LanguageWizardComponent } from '../language-wizard/language-wizard.component';

@Component({
  selector: 'healthe-interpretation-wizard-form',
  templateUrl: './interpretation-wizard-form.component.html',
  styleUrls: ['./interpretation-wizard-form.component.scss'],
  providers: [provideWizardBaseStep(InterpretationWizardFormComponent)]
})
export class InterpretationWizardFormComponent extends WizardDateStepComponent
  implements OnInit {
  LANGUAGE_ARCH_TYPE = LANGUAGE_ARCH_TYPE;
  certificationTooltipLabels = {
    'Non-Certified':
      'Non-Certified: Typically used for routine medical appointments.',
    Certified:
      'Certified: Typically used for IME, FCE, AME, or QME appointments.',
    'Legal-Certified': 'Legal-Certified: Typically used for legal appointments.'
  };

  certificationValues$ = this.store$.pipe(
    select(
      getFusionServiceGroupOptionsByGroupName(
        FusionServiceName.Language,
        LANGUAGE_ARCH_TYPE
      ),
      'On-Site Interpretation'
    ),
    takeUntil(this.onDestroy$)
  );

  public languages$ = this.store$.pipe(
    select(getFusionReferralOptions),
    map((options) => {
      return options.languages.list;
    })
  );
  isLoadedFromDraft$ = this.store$.pipe(
    select(isLoadedFromDraft),
    takeUntil(this.onDestroy$)
  );
  subTypeDefaultValue;
  specificDateConfig = {
    formTitle: 'Interpretation Information',
    serviceActionType: 'On-Site Interpretation',
    stepName: this.stepName,
    addDateButtonLabel: 'Add Session',
    addLocationButtonLabel: 'ADD LOCATION',
    actionConfig: {
      enableAddNote: true,
      enableAddStop: false,
      enableDelete: true,
      enableDuplicate: false,
      deleteLabel: 'Delete'
    },
    deleteItemModal: {
      deleteItemTitle: 'Delete Session?',
      deleteItemMessage:
        'Are you sure that you would like to remove the selected Session?'
    },
    controls: [
      [
        {
          formControlName: 'appointmentDate',
          type: SpecificDateFormFieldType.Date,
          formState: null,
          validatorOrOpts: [Validators.required],
          label: 'DATE',
          placeholder: 'MM/DD/YYYY',
          errorMessages: {
            required: 'Select a date for the session'
          }
        },
        {
          formControlName: 'appointmentAddress',
          formState: null,
          type: SpecificDateFormFieldType.Location,
          validatorOrOpts: [Validators.required],
          label: 'ADDRESS',
          placeholder: 'Select a location',
          errorMessages: {
            required: "Select a value for 'Address' "
          }
        }
      ],
      [
        {
          formControlName: 'appointmentTime',
          type: SpecificDateFormFieldType.Time,
          formState: null,
          validatorOrOpts: [Validators.required],
          label: 'APPOINTMENT TIME',
          placeholder: 'Choose time',
          errorMessages: {
            required: 'Select an appointment time'
          }
        },
        {
          formControlName: 'certification',
          formState: null,
          compareWith: (option, selection) => {
            return (
              option &&
              selection &&
              selection.subTypeDescription &&
              option.customerTypeId === selection.customerTypeId &&
              option.customerSubTypeId === selection.customerSubTypeId
            );
          },
          type: SpecificDateFormFieldType.Select,
          options: this.certificationValues$,
          validatorOrOpts: [Validators.required],
          label: 'CERTIFICATION',
          tooltip: this.getCertificationTooltip(),
          placeholder: 'Select a certification',
          errorMessages: {
            required: "Select a value for 'Certification'"
          }
        }
      ]
    ]
  };
  faInfoCircle = faInfoCircle;
  booleanRadioValues: HealtheSelectOption<boolean>[] = [
    { label: 'No', value: false },
    { label: 'Yes', value: true }
  ];

  stepForm = new FormGroup({
    authorizationDateType: new FormControl(DateFormMode.SpecificDate),
    rushServiceNeeded: new FormControl(this.booleanRadioValues[0].value),
    paidAsExpense: new FormControl(this.booleanRadioValues[0].value),
    schedulingForm: new FormArray([
      SpecificDateFormArrayComponent.generateEmptyFormGroup(
        this.specificDateConfig
      )
    ]),
    language: new FormControl('Spanish')
  });

  certificationCompare(option, selection) {
    return (
      option &&
      selection &&
      selection.subTypeDescription &&
      option.customerTypeId === selection.customerTypeId &&
      option.customerSubTypeId === selection.customerSubTypeId
    );
  }

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService,
    @Inject(LanguageWizardComponent) public wizard: LanguageWizardComponent
  ) {
    super(
      LANGUAGE_INTERPRETATION_STEP_NAME,
      store$,
      confirmationModalService,
      () => {
        const formGroup = generateLanguageDateRangeForm();
        formGroup
          .get('certification')
          .setValue({ ...this.subTypeDefaultValue });
        return formGroup;
      }
    );
  }

  get schedulingForm() {
    return this.stepForm.get('schedulingForm') as FormGroup | FormArray;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initValidFormStateListener();
  }

  validateCertification(
    control: AbstractControl
  ): { [key: string]: any } | null {
    // Parent will always be null when the form initializes
    if (control.parent == null) {
      return null;
    }
    const authorizationDateType: AbstractControl = control.parent.get(
      'authorizationDateType'
    );
    if (
      !control.value &&
      authorizationDateType.value === DateFormMode.DateRange
    ) {
      return { certificationInvalid: true };
    }
    return null;
  }

  getCertificationTooltip() {
    let tooltip = '';
    this.certificationValues$.subscribe((certifications) => {
      certifications.forEach((certification) => {
        tooltip += `${
          this.certificationTooltipLabels[certification.label]
        } \n\n`;
      });
    });
    return tooltip;
  }

  validateTrips() {
    this.schedulingForm.get('tripsAuthorized').updateValueAndValidity();
  }

  getSharedControl() {
    return this.wizard.stepWizardForm.get('someSharedValue');
  }

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
          language
        }: InterpretationFormState) => {
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
            language: new FormControl(language)
          });
        }
      );
  }

  loadSchedulingForm(
    schedulingFormState:
      | InterpretationSpecificDateFormState[]
      | InterpretationDateRangeFormState,
    dateMode: DateFormMode,
    config: SpecificDateFormArrayConfig
  ): FormGroup | FormArray {
    if (dateMode === DateFormMode.SpecificDate) {
      return new FormArray(
        (schedulingFormState as InterpretationSpecificDateFormState[]).map(
          (lineItem) =>
            this.generateSpecificDateFormGroup<
              InterpretationSpecificDateFormState
            >(config, lineItem)
        )
      );
    } else {
      const {
        startDate,
        endDate,
        tripsAuthorized,
        certification,
        noLocationRestrictions,
        // TODO: Figure out this mess
        approvedLocations,
        notes
      } = schedulingFormState as InterpretationDateRangeFormState;
      return new FormGroup(
        {
          startDate: new FormControl(startDate, [
            Validators.required,
            DateRangeValidators.startDateValidation
          ]),
          endDate: new FormControl(endDate, [
            Validators.required,
            DateRangeValidators.endDateValidation
          ]),
          tripsAuthorized: new FormControl(tripsAuthorized, [
            Validators.required,
            Validators.min(1)
          ]),
          certification: new FormControl(certification, [Validators.required]),
          noLocationRestrictions: new FormControl(noLocationRestrictions),
          approvedLocations: new FormControl(approvedLocations),
          notes: new FormControl(notes)
        },
        [DateRangeValidators.validLocationSelection]
      );
    }
  }
}
