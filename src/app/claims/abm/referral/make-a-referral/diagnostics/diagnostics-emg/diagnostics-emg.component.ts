import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { filter, first, map } from 'rxjs/operators';
import { RootState } from '../../../../../../store/models/root.models';
import { ReferralBodyPart } from '../../../store/models/make-a-referral.models';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { SpecificDateFormArrayComponent } from '../../components/specific-date-form-array/specific-date-form-array.component';
import {
  SpecificDateFormArrayConfig,
  SpecificDateFormFieldType
} from '../../components/specific-date-form-array/specific-date-form-config';
import { WizardDateStepComponent } from '../../components/wizard-date-step.component';
import {
  DIAGNOSTICS_ARCH_TYPE,
  DIAGNOSTICS_EMG_STEP_NAME
} from '../diagnostics-step-definitions';
import { DiagnosticsWizardComponent } from '../diagnostics-wizard/diagnostics-wizard.component';
import { generateDiagnosticsEmgDateRangeForm } from '../generateDiagnosticsEmgDateRangeForm';
import {
  getFusionBodyPartsForClaim,
  getFusionServiceGroupOptionsByGroupName
} from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import {
  DiagnosticsFormState,
  DiagnosticsSchedulingForm,
  FusionServiceName
} from '../../../store/models/fusion/fusion-make-a-referral.models';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'healthe-diagnostics-emg',
  templateUrl: './diagnostics-emg.component.html',
  styleUrls: ['./diagnostics-emg.component.scss'],
  providers: [provideWizardBaseStep(DiagnosticsEmgComponent)]
})
export class DiagnosticsEmgComponent extends WizardDateStepComponent
  implements OnInit {
  @Input()
  locations$;
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

  /**
   * This field/value is not shown in the UI but is
   * required to submit a language referral
   */
  subTypeValues$ = this.store$.pipe(
    select(
      getFusionServiceGroupOptionsByGroupName(
        FusionServiceName.Diagnostics,
        DIAGNOSTICS_ARCH_TYPE
      ),
      'EMG/NCS'
    ),
    first()
  );

  specificDateConfig: SpecificDateFormArrayConfig = {
    formTitle: 'EMG/NCS Services',
    serviceActionType: 'EMG/NCS',
    stepName: this.stepName,
    addDateButtonLabel: 'Add EMG/NCS Service',
    hideAddLocationButton: true,
    actionConfig: {
      enableAddNote: true,
      enableDelete: true,
      deleteLabel: 'Delete',
      enableDuplicate: false,
      enableAddStop: false
    },
    deleteItemModal: {
      deleteItemTitle: 'Delete EMG/NCS Service?',
      deleteItemMessage:
        'Are you sure that you would like to remove the selected EMG/NCS Service?'
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
    schedulingForm: new FormArray([
      SpecificDateFormArrayComponent.generateEmptyFormGroup(
        this.specificDateConfig
      )
    ]),
    rush: new FormControl(false),
    subType: new FormControl(null)
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
      DIAGNOSTICS_EMG_STEP_NAME,
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

    this.subTypeValues$.subscribe((dataArr) => {
      if (dataArr.length > 0) {
        this.stepForm.get('subType').setValue(dataArr[0].value);
      } else {
        console.warn(
          `Didn't find a subType for Diagnostics! This is probably going to break something...`
        );
      }
    });
  }

  loadForm() {
    this.stepForm$
      .pipe(
        first(),
        filter((initialState) => Object.keys(initialState).length > 0)
      )
      .subscribe((formValues: DiagnosticsFormState) => {
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
