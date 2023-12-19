import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { WizardDateStepComponent } from '../../components/wizard-date-step.component';
import { select, Store } from '@ngrx/store';
import {
  getFusionBodyPartsForClaim,
  getFusionServiceGroupOptionsByGroupName
} from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import {
  SpecificDateFormArrayConfig,
  SpecificDateFormFieldType
} from '../../components/specific-date-form-array/specific-date-form-config';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SpecificDateFormArrayComponent } from '../../components/specific-date-form-array/specific-date-form-array.component';
import {
  DIAGNOSTICS_ARCH_TYPE,
  DIAGNOSTICS_MRI_STEP_NAME
} from '../diagnostics-step-definitions';
import { filter, first, map, takeUntil } from 'rxjs/operators';
import { ReferralBodyPart } from '../../../store/models/make-a-referral.models';
import { RootState } from '../../../../../../store/models/root.models';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { generateDiagnosticsEmgDateRangeForm } from '../generateDiagnosticsEmgDateRangeForm';
import { DiagnosticsWizardComponent } from '../diagnostics-wizard/diagnostics-wizard.component';
import {
  DiagnosticsFormState,
  DiagnosticsSchedulingForm,
  FusionServiceName
} from '../../../store/models/fusion/fusion-make-a-referral.models';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'healthe-diagnostics-mri',
  templateUrl: './diagnostics-mri.component.html',
  styleUrls: ['./diagnostics-mri.component.scss'],
  providers: [provideWizardBaseStep(DiagnosticsMriComponent)]
})
export class DiagnosticsMriComponent extends WizardDateStepComponent
  implements OnInit {
  @Input()
  locations$;
  contrastType$ = this.store$.pipe(
    select(
      getFusionServiceGroupOptionsByGroupName(
        FusionServiceName.Diagnostics,
        DIAGNOSTICS_ARCH_TYPE
      ),
      'MRI'
    ),
    takeUntil(this.onDestroy$)
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
      values
        .filter((bodyPart) => bodyPart.selected)
        .map((bodyPart: ReferralBodyPart) => bodyPart)
    )
  );
  subTypeDefaultValue;
  specificDateConfig: SpecificDateFormArrayConfig = {
    formTitle: 'MRI Services',
    serviceActionType: 'MRI',
    stepName: this.stepName,
    addDateButtonLabel: 'Add MRI Service',
    hideAddLocationButton: true,
    actionConfig: {
      enableAddNote: true,
      enableDelete: true,
      deleteLabel: 'Delete',
      enableDuplicate: false,
      enableAddStop: false
    },
    deleteItemModal: {
      deleteItemTitle: 'Delete MRI Service?',
      deleteItemMessage:
        'Are you sure that you would like to remove the selected MRI Service?'
    },
    controls: [
      [
        {
          type: SpecificDateFormFieldType.Select,
          label: 'CONTRAST TYPE',
          placeholder: 'Select service subtype',
          formControlName: 'contrastType',
          validatorOrOpts: Validators.required,
          errorMessages: { required: 'Select a Contrast Type' },
          formState: null,
          options: this.contrastType$,
          compareWith: (option, selection) => {
            return (
              option &&
              selection &&
              selection.value &&
              selection.value.subTypeDescription &&
              option.value.customerTypeId === selection.value.customerTypeId &&
              option.value.customerSubTypeId ===
                selection.value.customerSubTypeId
            );
          }
        },
        {
          type: SpecificDateFormFieldType.MultiSelect,
          label: 'BODY PART(S)',
          placeholder: 'Please select body part(s)',
          formControlName: 'bodyParts',
          validatorOrOpts: Validators.required,
          errorMessages: { required: 'Select at least one body part' },
          formState: this.selectedBodyParts$,
          options: this.bodyParts$,
          compareWith: (option, selection) => {
            return (
              option &&
              selection &&
              option.ncciCode === selection.ncciCode &&
              option.sideOfBody === selection.sideOfBody
            );
          }
        },
        {
          type: SpecificDateFormFieldType.Date,
          label: 'SERVICE DATE (NEEDED BY)',
          placeholder: 'MM/DD/YYYY',
          formControlName: 'serviceDate',
          formState: null
        }
      ]
    ]
  };

  stepForm = new FormGroup({
    diagnosisCode: new FormControl([]),
    schedulingForm: new FormArray([
      SpecificDateFormArrayComponent.generateEmptyFormGroup(
        this.specificDateConfig
      )
    ]),
    rush: new FormControl(false)
  });
  selectedService = DIAGNOSTICS_ARCH_TYPE;

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService,
    @Inject(DiagnosticsWizardComponent)
    public wizard: DiagnosticsWizardComponent,
    @Optional() @Inject(MatStepper) public matStepper: MatStepper
  ) {
    super(
      DIAGNOSTICS_MRI_STEP_NAME,
      store$,
      confirmationModalService,
      generateDiagnosticsEmgDateRangeForm,
      wizard,
      matStepper
    );
    this.subscribeSharedFormValidationHeader();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  loadForm() {
    this.stepForm$
      .pipe(
        first(),
        filter((initialState) => Object.keys(initialState).length > 0)
      )
      .subscribe((formValues: DiagnosticsFormState) => {
        formValues.schedulingForm.map((schedulingForm) => {
          schedulingForm.contrastType = schedulingForm.subType;
        });
        this.stepForm = new FormGroup({
          diagnosisCode: new FormControl([]),
          schedulingForm: this.loadSchedulingForm(
            formValues.schedulingForm,
            this.specificDateConfig
          ),
          rush: new FormControl(formValues.rush)
        });
      });
  }

  private loadSchedulingForm(
    schedulingForm: DiagnosticsSchedulingForm[],
    config: SpecificDateFormArrayConfig
  ): FormArray {
    return new FormArray(
      schedulingForm.map((lineItem) =>
        this.generateSpecificDateFormGroup<DiagnosticsSchedulingForm>(
          config,
          lineItem
        )
      )
    );
  }
}
