import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { filter, first } from 'rxjs/operators';
import { RootState } from '../../../../../../store/models/root.models';
import {
  PruneFormData,
  SetSectionDirty,
  SetSectionStatus,
  SetSelectedServiceDetailTypes
} from '../../../store/actions/make-a-referral.actions';
import {
  getSelectedServiceDetailTypes,
  getTransportationTypes
} from '../../../store/selectors/makeReferral.selectors';
import { TRANSPORTATION_STEP_DEFINITIONS } from '../transportation-step-definitions';
import { WizardStep } from '../../../store/models/make-a-referral.models';
import {
  FusionServiceName
} from '../../../store/models/fusion/fusion-make-a-referral.models';

@Component({
  selector: 'healthe-transportation-selection',
  templateUrl: './transportation-selection.component.html',
  styleUrls: ['./transportation-selection.component.scss']
})
export class TransportationSelectionComponent implements OnInit, AfterViewInit {
  transportationTypeFormGroup = new FormGroup(
    this.generateForm(TRANSPORTATION_STEP_DEFINITIONS)
  );

  transportationTypes: WizardStep[] = [];

  hiddenControl = new FormControl(
    this.mapItems(this.transportationTypeFormGroup.value)
  );

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {
    this.transportationTypes = [...TRANSPORTATION_STEP_DEFINITIONS];

    this.store$
      .pipe(
        select(getTransportationTypes),
        filter(
          (transportationTypes) =>
            transportationTypes !== null && transportationTypes.types.length > 0
        ),
        first()
      )
      .subscribe((transportationTypes) => {
        this.transportationTypes = TRANSPORTATION_STEP_DEFINITIONS.filter(
          (definition) =>
            transportationTypes.types.find(
              (type) =>
                type.code === definition.label ||
                type.group === definition.label
            )
        );

        let otherTypeIndex: number = this.transportationTypes
          .map((type: WizardStep) => type.label)
          .indexOf('Other');

        if (otherTypeIndex > 0) {
          let newHelp: string = 'Services may include: ';
          const serviceDelimiter: string = ', ';
          transportationTypes.types
            .filter((type) => type.group === 'Other')
            .forEach((type) => {
              newHelp += type.code + serviceDelimiter;
            });

          this.transportationTypes[otherTypeIndex].help =
            newHelp.slice(0, newHelp.lastIndexOf(serviceDelimiter)) + '.';
        }
      });

    this.transportationTypeFormGroup.valueChanges.subscribe((value) => {
      this.cleanupTransportationTypes(value, this.hiddenControl.value);
      this.store$.dispatch(new SetSectionDirty({ Transportation: true }));
      this.hiddenControl.setValue(this.mapItems(value));
    });
  }

  toggleCheckboxAndUpdateForm(name) {
    const control = this.transportationTypeFormGroup.controls[name];
    control.setValue(!control.value);
  }

  continue() {
    this.store$.dispatch(
      new SetSelectedServiceDetailTypes({
        Transportation: this.hiddenControl.value
      })
    );
    this.store$.dispatch(new SetSectionStatus({ Transportation: 'wizard' }));
  }

  private generateForm(transportationTypes: WizardStep[]) {
    const formControls = {};
    transportationTypes.forEach(
      (type) => (formControls[type.name] = new FormControl(false))
    );
    return formControls;
  }

  private mapItems(value: any) {
    return Object.keys(value).filter((type) => value[type]);
  }

  ngAfterViewInit(): void {
    this.store$
      .pipe(
        select(getSelectedServiceDetailTypes(FusionServiceName.Transportation)),
        first()
      )
      .subscribe((details) => {
        if (details.length > 0) {
          let value = {};
          details.forEach((d) => (value[d] = true));
          this.transportationTypeFormGroup.patchValue(value);
        }
      });
  }

  private cleanupTransportationTypes(newValues: any, oldValues: any) {
    Object.keys(newValues)
      .filter((type) => !newValues[type])
      .forEach((value) => {
        if (oldValues.indexOf(value) !== -1) {
          this.store$.dispatch(new PruneFormData(value));
        }
      });
  }
}
