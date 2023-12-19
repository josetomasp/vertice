import { AfterViewInit, Directive, OnInit } from '@angular/core';
import { RootState } from 'src/app/store/models/root.models';
import { select, Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { WizardStep } from '../../store/models/make-a-referral.models';
import {
  SetSectionDirty,
  SetSectionStatus,
  SetSelectedServiceDetailTypes
} from '../../store/actions/make-a-referral.actions';
import { FusionServiceName } from '../../store/models/fusion/fusion-make-a-referral.models';
import { getSelectedServiceDetailTypes } from '../../store/selectors/makeReferral.selectors';
import { first, map } from 'rxjs/operators';
import { getFusionServiceGroupNamesByServiceName } from '../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { find } from 'lodash';
import { of } from 'rxjs';
import { DIAGNOSTICS_STEP_DEFINITIONS } from '../diagnostics/diagnostics-step-definitions';
import { PHYSICALMEDICINE_STEP_DEFINITIONS } from '../physical-medicine/physical-medicine-step-definitions';
import { LANGUAGE_ARCH_TYPE } from '../language/language-step-definitions';
import { HOMEHEALTH_ARCH_TYPE } from '../home-health/home-health-step-definitions';
import { ServiceType } from '../make-a-referral-shared';
import { DME_ARCH_TYPE } from '../dme/dme-step-definitions';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

@Directive()
export abstract class FusionServiceSelectionBase extends DestroyableComponent
  implements OnInit, AfterViewInit {
  constructor(
    public store$: Store<RootState>,
    public wizardStepDefinitions: WizardStep[],
    public fusionServiceName?: FusionServiceName
  ) {
    super();
  }

  selectionTypeFormGroup = new FormGroup(
    this.generateForm(this.wizardStepDefinitions)
  );
  hiddenControl = new FormControl(
    this.mapItems(this.selectionTypeFormGroup.value)
  );
  selectionTypes$ = this.getSelectionType();

  private getSelectionType() {
    let archType: ServiceType;
    // TODO: This is TEMP while we HU Diagnostics & Physical Medicine
    switch (this.fusionServiceName) {
      case FusionServiceName.Diagnostics: {
        // TEMP
        return of(DIAGNOSTICS_STEP_DEFINITIONS);
      }
      case FusionServiceName.PhysicalMedicine: {
        // TEMP
        return of(PHYSICALMEDICINE_STEP_DEFINITIONS);
      }
      case FusionServiceName.HomeHealth:
        {
          archType = HOMEHEALTH_ARCH_TYPE;
        }
        break;
      case FusionServiceName.DME:
        {
          archType = DME_ARCH_TYPE;
        }
        break;
      default:
        {
          archType = LANGUAGE_ARCH_TYPE;
        }
        break;
    }
    return this.store$.pipe(
      select(
        getFusionServiceGroupNamesByServiceName(archType),
        this.fusionServiceName
      ),
      map((groups) => {
        return groups
          .map((groupName) =>
            find(this.wizardStepDefinitions, { label: groupName })
          )
          .filter((o) => !!o);
      })
    );
  }
  toggleCheckboxAndUpdateForm(name) {
    const control = this.selectionTypeFormGroup.controls[name];
    control.setValue(!control.value);
  }
  ngOnInit() {
    this.selectionTypeFormGroup.valueChanges.subscribe((value) => {
      this.store$.dispatch(
        new SetSectionDirty({ [this.fusionServiceName]: true })
      );
      this.hiddenControl.setValue(this.mapItems(value));
    });
  }
  ngAfterViewInit(): void {
    this.store$
      .pipe(
        select(getSelectedServiceDetailTypes(this.fusionServiceName)),
        first()
      )
      .subscribe((details) => {
        if (details.length > 0) {
          let value = {};
          details.forEach((d) => (value[d] = true));
          this.selectionTypeFormGroup.patchValue(value);
        }
      });
  }

  continue() {
    this.store$.dispatch(
      new SetSelectedServiceDetailTypes({
        [this.fusionServiceName]: this.hiddenControl.value
      })
    );
    this.store$.dispatch(
      new SetSectionStatus({ [this.fusionServiceName]: 'wizard' })
    );
  }

  private generateForm(types: WizardStep[]) {
    const formControls = {};
    types.forEach((type) => (formControls[type.name] = new FormControl(false)));
    return formControls;
  }

  private mapItems(value: any) {
    return Object.keys(value).filter((type) => value[type]);
  }
}
