import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { filter, first, map } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  FusionServiceName,
  PhysicalMedicineCommonSchedulingForm
} from '../../../store/models/fusion/fusion-make-a-referral.models';
import { ReferralBodyPart } from '../../../store/models/make-a-referral.models';
import {
  getFusionBodyPartsForClaim,
  getFusionServiceGroupOptionsByGroupName
} from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { DateRangeValidators } from '../../components/date-range-form/dateRangeValidators';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { SpecificDateFormArrayComponent } from '../../components/specific-date-form-array/specific-date-form-array.component';
import {
  SpecificDateFormArrayConfig,
  SpecificDateFormFieldType
} from '../../components/specific-date-form-array/specific-date-form-config';
import { WizardDateStepComponent } from '../../components/wizard-date-step.component';
import { generatePMDateRangeForm } from '../generatePMDateRangeForm';
import {
  PHYSICALMEDICINE_ARCH_TYPE,
  PHYSICALMEDICINE_FCE_STEP_NAME
} from '../physical-medicine-step-definitions';
import { PhysicalMedicineWizardComponent } from '../physical-medicine-wizard/physical-medicine-wizard.component';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'healthe-physical-medicine-fce',
  templateUrl: './physical-medicine-fce.component.html',
  styleUrls: ['./physical-medicine-fce.component.scss'],
  providers: [provideWizardBaseStep(PhysicalMedicineFceComponent)]
})
export class PhysicalMedicineFceComponent extends WizardDateStepComponent
  implements OnInit {
  @Input()
  locations$;
  selectedService = PHYSICALMEDICINE_ARCH_TYPE;
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

  subTypeValues$ = this.store$.pipe(
    select(
      getFusionServiceGroupOptionsByGroupName(
        FusionServiceName.PhysicalMedicine,
        'physicalMedicine'
      ),
      'Functional Capacity Evaluation'
    ),
    first()
  );

  specificDateConfig: SpecificDateFormArrayConfig = {
    formTitle: 'Functional Capacity Evaluation',
    serviceActionType: 'FCE',
    stepName: this.stepName,
    addDateButtonLabel: 'Add Functional Capacity Evaluation',
    hideAddLocationButton: true,
    actionConfig: {
      enableAddNote: true,
      enableDelete: true,
      deleteLabel: 'Delete',
      enableDuplicate: false,
      enableAddStop: false
    },
    deleteItemModal: {
      deleteItemTitle: 'Delete Functional Capacity Evaluation?',
      deleteItemMessage:
        'Are you sure that you would like to remove the selected Functional Capacity Evaluation?'
    },
    controls: [
      [
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
        },
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
    subType: new FormControl(null),
    diagnosisCode: new FormControl([]),
    schedulingForm: new FormArray([
      SpecificDateFormArrayComponent.generateEmptyFormGroup(
        this.specificDateConfig
      )
    ]),
    rush: new FormControl(false)
  });

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService,
    @Inject(PhysicalMedicineWizardComponent)
    public wizard: PhysicalMedicineWizardComponent,
    @Optional() @Inject(MatStepper) public matStepper: MatStepper
  ) {
    super(
      PHYSICALMEDICINE_FCE_STEP_NAME,
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
    this.subTypeValues$.subscribe((dataArr) => {
      if (dataArr.length > 0) {
        this.stepForm.get('subType').setValue(dataArr[0].value);
      } else {
        console.warn(
          `Didn't find a subType for FCE! This is probably going to break something...`
        );
      }
    });
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
