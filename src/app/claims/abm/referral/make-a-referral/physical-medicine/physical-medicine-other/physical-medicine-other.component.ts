import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import {
  FusionServiceName,
  PhysicalMedicineCommonSchedulingForm
} from '../../../store/models/fusion/fusion-make-a-referral.models';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import {
  PHYSICALMEDICINE_ARCH_TYPE,
  PHYSICALMEDICINE_OTHER_STEP_NAME
} from '../physical-medicine-step-definitions';
import { WizardDateStepComponent } from '../../components/wizard-date-step.component';
import {
  SpecificDateFormArrayConfig,
  SpecificDateFormFieldType
} from '../../components/specific-date-form-array/specific-date-form-config';
import { PhysicalMedicineWizardComponent } from '../physical-medicine-wizard/physical-medicine-wizard.component';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { ReferralBodyPart } from '../../../store/models/make-a-referral.models';
import {
  getFusionBodyPartsForClaim,
  getFusionServiceGroupOptionsByGroupName
} from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { filter, first, map } from 'rxjs/operators';
import { SpecificDateFormArrayComponent } from '../../components/specific-date-form-array/specific-date-form-array.component';
import { generatePMDateRangeForm } from '../generatePMDateRangeForm';
import { DateRangeValidators } from '../../components/date-range-form/dateRangeValidators';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'healthe-physical-medicine-other',
  templateUrl: './physical-medicine-other.component.html',
  styleUrls: ['./physical-medicine-other.component.scss'],
  providers: [provideWizardBaseStep(PhysicalMedicineOtherComponent)]
})
export class PhysicalMedicineOtherComponent extends WizardDateStepComponent
  implements OnInit {
  @Input()
  locations$;
  subType$ = this.store$.pipe(
    select(getFusionServiceGroupOptionsByGroupName(FusionServiceName.PhysicalMedicine, PHYSICALMEDICINE_ARCH_TYPE), 'Other')
  );
  bodyParts$ = this.store$.pipe(
    select(getFusionBodyPartsForClaim),
    map((values: ReferralBodyPart[]) =>
      values.map((bodyPart: ReferralBodyPart) => ({
        label: bodyPart.desc,
        value: bodyPart
      }))
    )
  );
  selectedBodyParts$ = this.store$.pipe(
    select(getFusionBodyPartsForClaim),
    map((values: ReferralBodyPart[]) =>
      values.filter((bodyPart) => bodyPart.selected)
    )
  );

  specificDateConfig: SpecificDateFormArrayConfig = {
    formTitle: 'Other Physical Medicine Services',
    serviceActionType: 'Other',
    stepName: this.stepName,
    addDateButtonLabel: 'Add Other Service',
    hideAddLocationButton: true,
    actionConfig: {
      enableAddNote: true,
      enableDelete: true,
      deleteLabel: 'Delete',
      enableDuplicate: false,
      enableAddStop: false
    },
    deleteItemModal: {
      deleteItemTitle: 'Delete Other Service?',
      deleteItemMessage:
        'Are you sure that you would like to remove the selected Other Physical Medicine Service?'
    },
    controls: [
      [
        {
          type: SpecificDateFormFieldType.Select,
          label: 'SELECT A SERVICE',
          placeholder: 'Select a Service',
          formControlName: 'subType',
          validatorOrOpts: Validators.required,
          errorMessages: { required: 'Select a Service' },
          formState: null,
          options: this.subType$
        },
        {
          type: SpecificDateFormFieldType.MultiSelect,
          label: 'BODY PART(S)',
          placeholder: 'Please select body part(s)',
          formControlName: 'bodyParts',
          validatorOrOpts: Validators.required,
          errorMessages: { required: 'Select at least one body part' },
          formState: this.selectedBodyParts$,
          compareWith: (option, selection) => {
            return (
              option &&
              selection &&
              option.ncciCode === selection.ncciCode &&
              option.sideOfBody === selection.sideOfBody
            );
          },
          options: this.bodyParts$
        }
      ],
      [
        {
          type: SpecificDateFormFieldType.Date,
          label: 'START DATE',
          placeholder: 'MM/DD/YYYY',
          formControlName: 'startDate',
          validatorOrOpts: [
            Validators.required,
            DateRangeValidators.startDateValidation
          ],
          errorMessages: {
            invalidDateRange: 'End Date cannot be before Start Date',
            required: 'Select Start Date'
          },
          formState: null
        },
        {
          type: SpecificDateFormFieldType.Date,
          label: 'END DATE',
          placeholder: 'MM/DD/YYYY',
          formControlName: 'endDate',
          validatorOrOpts: [
            Validators.required,
            DateRangeValidators.endDateValidation
          ],
          errorMessages: {
            invalidDateRange: 'End Date cannot be before Start Date',
            required: 'Select End Date'
          },
          formState: null
        },
        {
          type: SpecificDateFormFieldType.Number,
          label: 'NUMBER OF VISITS',
          placeholder: '#',
          hideNumberInputSpinner: true,
          formControlName: 'numberOfVisits',
          validatorOrOpts: [Validators.min(1), Validators.required],
          errorMessages: {
            min: 'Enter a valid number of session greater than 0',
            required: 'Enter the number of visits'
          },
          formState: null
        }
      ]
    ]
  };
  stepForm: FormGroup = new FormGroup({
    diagnosisCode: new FormControl([]),
    schedulingForm: new FormArray([
      SpecificDateFormArrayComponent.generateEmptyFormGroup(
        this.specificDateConfig
      )
    ]),
    rush: new FormControl(false)
  });
  selectedService = PHYSICALMEDICINE_ARCH_TYPE;

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService,
    @Inject(PhysicalMedicineWizardComponent)
    public wizard: PhysicalMedicineWizardComponent,
    @Optional() @Inject(MatStepper) public matStepper: MatStepper
  ) {
    super(
      PHYSICALMEDICINE_OTHER_STEP_NAME,
      store$,
      confirmationModalService,
      generatePMDateRangeForm,
      wizard,
      matStepper
    );
    this.subscribeSharedFormValidationHeader();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  cancel(): void {}

  loadForm() {
    this.stepForm$
      .pipe(
        first(),
        filter((initialState) => Object.keys(initialState).length > 0)
      )
      .subscribe(({ subType, diagnosisCode, schedulingForm, rush }) => {
        this.stepForm = new FormGroup({
          subType: new FormControl(subType),
          diagnosisCode: new FormControl(diagnosisCode),
          schedulingForm: this.loadSchedulingForm(
            schedulingForm,
            this.specificDateConfig
          ),
          rush: new FormControl(rush)
        });
      });
  }

  private loadSchedulingForm(
    schedulingForm: PhysicalMedicineCommonSchedulingForm[],
    specificDateConfig: SpecificDateFormArrayConfig
  ): FormArray {
    return new FormArray(
      schedulingForm.map((lineItem) =>
        this.generateSpecificDateFormGroup(specificDateConfig, lineItem)
      )
    );
  }
}
