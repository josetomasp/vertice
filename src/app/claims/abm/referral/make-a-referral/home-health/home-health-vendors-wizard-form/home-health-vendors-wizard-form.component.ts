import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { RootState } from '../../../../../../store/models/root.models';
import { loadFusionVendorAllocations } from '../../../store/actions/fusion/fusion-make-a-referral.actions';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { WizardVendorStepDirective } from '../../components/wizard-vendor-step.directive';
import { AncilliaryServiceCode } from '../../make-a-referral-shared';
import {
  HOMEHEALTH_ARCH_TYPE,
  HOMEHEALTH_VENDOR_STEP_NAME
} from '../home-health-step-definitions';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'healthe-home-health-vendors-wizard-form',
  templateUrl: './home-health-vendors-wizard-form.component.html',
  styleUrls: ['./home-health-vendors-wizard-form.component.scss'],
  providers: [provideWizardBaseStep(HomeHealthVendorsWizardFormComponent)]
})
export class HomeHealthVendorsWizardFormComponent
  extends WizardVendorStepDirective
  implements OnInit {
  sectionName = HOMEHEALTH_ARCH_TYPE;

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService
  ) {
    super(
      HOMEHEALTH_VENDOR_STEP_NAME,
      store$,
      confirmationModalService,
      HOMEHEALTH_ARCH_TYPE
    );
  }

  ngOnInit() {
    super.ngOnInit();

    combineLatest([this.customerId$, this.claimNumber$])
      .pipe(first())
      .subscribe(([encodedCustomerId, encodedClaimNumber]) => {
        this.store$.dispatch(
          loadFusionVendorAllocations({
            ancillaryServiceCode: AncilliaryServiceCode.HH,
            encodedCustomerId: encodedCustomerId,
            encodedClaimNumber: encodedClaimNumber,
            serviceType: this.serviceType
          })
        );
      });
  }

  loadForm() {
    console.warn('Unimplemented');
  }
}
