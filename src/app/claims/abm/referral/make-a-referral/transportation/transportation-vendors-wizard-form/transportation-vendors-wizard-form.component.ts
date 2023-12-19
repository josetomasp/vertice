import { Component, OnDestroy, OnInit } from '@angular/core';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../../../../store/models/root.models';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import {
  TRANSPORTATION_ARCH_TYPE,
  TRANSPORTATION_VENDOR_STEP_NAME
} from '../transportation-step-definitions';
import { WizardVendorStepDirective } from '../../components/wizard-vendor-step.directive';
import { AddValidFormState } from '../../../store/actions/make-a-referral.actions';

import { getSelectedServiceDetailTypes } from '../../../store/selectors/makeReferral.selectors';
import { debounceTime, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'healthe-transportation-vendors-wizard-form',
  templateUrl: './transportation-vendors-wizard-form.component.html',
  styleUrls: ['./transportation-vendors-wizard-form.component.scss'],
  providers: [provideWizardBaseStep(TransportationVendorsWizardFormComponent)]
})
export class TransportationVendorsWizardFormComponent
  extends WizardVendorStepDirective
  implements OnInit, OnDestroy {
  sectionName = TRANSPORTATION_ARCH_TYPE;
  isAlive = true;
  isJustOneService = true;

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService
  ) {
    super(TRANSPORTATION_VENDOR_STEP_NAME, store$, confirmationModalService);
    this.vendorsSelectorServiceType = this.sectionName;
  }

  ngOnInit() {
    super.ngOnInit();
    this.store$
      .pipe(
        select(getSelectedServiceDetailTypes(this.vendorsSelectorServiceType)),
        takeWhile(() => this.isAlive),
        debounceTime(100)
      )
      .subscribe((value: Array<string>) => {
        this.isJustOneService = value.length === 1;
      });

    // This is done here because there isn't an invalid state for the vendors form.
    this.store$.dispatch(
      new AddValidFormState(TRANSPORTATION_VENDOR_STEP_NAME)
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.isAlive = false;
  }

  loadForm() {
    console.warn('Unimplemented');
  }
}
