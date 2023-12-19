import { Component, Inject, OnInit } from '@angular/core';
import { WizardBaseStepDirective } from '../../components/wizard-base-step.directive';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { DmeWizardComponent } from '../dme-wizard/dme-wizard.component';
import {
  DME_ARCH_TYPE,
  DME_EQUIPMENT_STEP_NAME
} from '../dme-step-definitions';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  SpecificDateControlConfigBuilder,
  SpecificDateDynamicRowType,
  SpecificDateFormArrayConfig
} from '../../components/specific-date-form-array/specific-date-form-config';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { filter, first, takeUntil } from 'rxjs/operators';
import {
  AddValidFormState,
  RemoveValidFormState
} from '../../../store/actions/make-a-referral.actions';
import { AncilliaryServiceCode } from '../../make-a-referral-shared';
import {
  DMECommonForm,
  DMECommonSchedulingForm
} from '../../../store/models/fusion/fusion-make-a-referral.models';

@Component({
  selector: 'healthe-dme-equipment',
  templateUrl: './dme-equipment.component.html',
  styleUrls: ['./dme-equipment.component.scss'],
  providers: [provideWizardBaseStep(DmeEquipmentComponent)]
})
export class DmeEquipmentComponent extends WizardBaseStepDirective
  implements OnInit {
  selectedService = DME_ARCH_TYPE;
  lastValidState = false;

  controlConfig = new SpecificDateControlConfigBuilder()
    .dynamicRow(SpecificDateDynamicRowType.HCPCAndProductSelectSwitch)
    .dynamicRow(SpecificDateDynamicRowType.DMESingleAndRangeSwitch);

  stepForm: FormGroup = new FormGroup({
    rush: new FormControl(false),
    prescriberName: new FormControl(null, Validators.required),
    prescriberPhone: new FormControl(null, Validators.required),
    prescriberAddress: new FormControl(null),
    schedulingForm: new FormArray([this.controlConfig.getEmptyDmeFormGroup()])
  });

  specificDateConfig: SpecificDateFormArrayConfig = {
    actionConfig: {
      enableAddNote: true,
      enableDelete: true,
      deleteLabel: 'Delete',
      enableAddStop: false,
      enableDuplicate: false
    },
    addDateButtonLabel: 'Add Equipment',
    addLocationButtonLabel: 'ADD LOCATION',
    controls: this.controlConfig.getControls(),
    deleteItemModal: {
      deleteItemMessage:
        'Are you sure you want to delete the selected DME Service?',
      deleteItemTitle: 'Delete DME Service'
    },
    formTitle: 'Equipment',
    hideAddLocationButton: false,
    serviceActionType: AncilliaryServiceCode.DME,
    stepName: this.stepName
  };

  constructor(
    public store$: Store<RootState>,
    @Inject(DmeWizardComponent) public wizard: DmeWizardComponent
  ) {
    super(DME_EQUIPMENT_STEP_NAME, store$);
  }

  ngOnInit() {
    super.ngOnInit();

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
      .subscribe((formValues: DMECommonForm) => {
        this.stepForm = new FormGroup({
          schedulingForm: this.loadSchedulingForm(
            formValues.schedulingForm,
            this.specificDateConfig
          ),
          rush: new FormControl(formValues.rush),
          prescriberName: new FormControl(
            formValues.prescriberName,
            Validators.required
          ),
          prescriberPhone: new FormControl(
            formValues.prescriberPhone,
            Validators.required
          ),
          prescriberAddress: new FormControl(formValues.prescriberAddress)
        });
      });
  }

  private loadSchedulingForm(
    schedulingForm: DMECommonSchedulingForm[],
    config
  ): FormArray {
    return new FormArray(
      schedulingForm.map((lineItem) =>
        this.generateDynamicDateFormGroup(config, lineItem)
      )
    );
  }
}
