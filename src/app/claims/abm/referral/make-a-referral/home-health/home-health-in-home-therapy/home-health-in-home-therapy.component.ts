import { Component, Inject, OnInit, Optional } from '@angular/core';
import { filter, first, takeUntil } from 'rxjs/operators';
import {
  AddValidFormState,
  RemoveValidFormState
} from '../../../store/actions/make-a-referral.actions';
import {
  getFusionServiceGroupOptionsByGroupName
} from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import {
  SpecificDateControlConfigBuilder,
  SpecificDateDynamicRowType,
  SpecificDateFormArrayConfig,
  SpecificDateFormFieldType
} from '../../components/specific-date-form-array/specific-date-form-config';
import { WizardBaseStepDirective } from '../../components/wizard-base-step.directive';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import {
  HOMEHEALTH_ARCH_TYPE,
  HOMEHEALTH_INHOMETHERAPY_STEP_NAME
} from '../home-health-step-definitions';
import { HomeHealthWizardComponent } from '../home-health-wizard/home-health-wizard.component';
import { MatStepper } from '@angular/material/stepper';
import {
  FusionServiceName,
  HomeHealthCommonForm,
  HomeHealthCommonSchedulingForm
} from '../../../store/models/fusion/fusion-make-a-referral.models';

@Component({
  selector: 'healthe-home-health-in-home-therapy',
  templateUrl: './home-health-in-home-therapy.component.html',
  styleUrls: ['./home-health-in-home-therapy.component.scss'],
  providers: [provideWizardBaseStep(HomeHealthInHomeTherapyComponent)]
})
export class HomeHealthInHomeTherapyComponent extends WizardBaseStepDirective
  implements OnInit {
  selectedService = HOMEHEALTH_ARCH_TYPE;

  inHomeTherapyOptions$ = this.store$.pipe(
    select(getFusionServiceGroupOptionsByGroupName(FusionServiceName.HomeHealth, HOMEHEALTH_ARCH_TYPE), 'In-Home Therapy'),
    takeUntil(this.onDestroy$)
  );

  subTypeDefaultValue;
  controlConfig = new SpecificDateControlConfigBuilder()
    .staticRow((controlBuilder) =>
      controlBuilder
        .control({
          errorMessages: {
            required: 'Select a Service Type'
          },
          formControlName: 'serviceType',
          formState: null,
          label: 'SERVICE TYPE',
          options: this.inHomeTherapyOptions$,
          placeholder: 'Select Service Type',
          type: SpecificDateFormFieldType.Select,
          validatorOrOpts: [Validators.required],
          compareWith: (option, selection) => {
            return (
              option &&
              selection &&
              selection.subTypeDescription &&
              option.customerTypeId === selection.customerTypeId &&
              option.customerSubTypeId === selection.customerSubTypeId
            );
          }
        })
        .control({
          errorMessages: {
            required: 'Select a Service Address'
          },
          formControlName: 'serviceAddress',
          formState: null,
          label: 'SERVICE ADDRESS',
          placeholder: 'Select Service Address',
          type: SpecificDateFormFieldType.Location,
          validatorOrOpts: [Validators.required]
        })
    )
    .dynamicRow(SpecificDateDynamicRowType.HHSingleAndRangeSwitch);

  stepForm: FormGroup = new FormGroup({
    rush: new FormControl(false),
    schedulingForm: new FormArray([this.controlConfig.getEmptyFormGroup()])
  });
  specificDateConfig: SpecificDateFormArrayConfig = {
    actionConfig: {
      enableAddNote: true,
      enableDelete: true,
      deleteLabel: 'Delete',
      enableAddStop: false,
      enableDuplicate: false
    },
    addDateButtonLabel: 'Add In-Home Therapy Service',
    addLocationButtonLabel: '',
    controls: this.controlConfig.getControls(),
    deleteItemModal: {
      deleteItemMessage:
        'Are you sure you want to delete the selected In-Home Therapy Service?',
      deleteItemTitle: 'Delete In-Home Therapy Service'
    },
    formTitle: 'In-Home Therapy Services',
    hideAddLocationButton: true,
    serviceActionType: 'In-Home Therapy',
    stepName: this.stepName
  };
  private lastValidState: boolean;
  constructor(
    public store$: Store<RootState>,
    @Inject(HomeHealthWizardComponent) public wizard: HomeHealthWizardComponent,
    @Optional() @Inject(MatStepper) public matStepper: MatStepper
  ) {
    super(HOMEHEALTH_INHOMETHERAPY_STEP_NAME, store$, wizard, matStepper);
    this.subscribeSharedFormValidationHeader();
  }

  ngOnInit() {
    super.ngOnInit();
    this.save();
    this.stepForm.statusChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((_) => {
        if (this.stepForm.valid !== this.lastValidState) {
          this.lastValidState = this.stepForm.valid;
          if (this.stepForm.valid) {
            this.store$.dispatch(new AddValidFormState(this.stepName));
          } else {
            this.store$.dispatch(new RemoveValidFormState(this.stepName));
          }
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
      .subscribe((formValues: HomeHealthCommonForm) => {
        formValues.schedulingForm.forEach((schedulingForm) =>
          schedulingForm.appointmentDate
            ? (schedulingForm.dynamicDateMode = 'singleDate')
            : (schedulingForm.dynamicDateMode = 'dateRange')
        );
        this.stepForm = new FormGroup({
          schedulingForm: this.loadSchedulingForm(
            formValues.schedulingForm,
            this.specificDateConfig
          ),
          rush: new FormControl(formValues.rush)
        });
      });
  }

  private loadSchedulingForm(
    schedulingForm: HomeHealthCommonSchedulingForm[],
    config
  ): FormArray {
    return new FormArray(
      schedulingForm.map((lineItem) =>
        this.generateDynamicDateFormGroup(config, lineItem)
      )
    );
  }
}
