import { Component, OnInit } from '@angular/core';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { WizardVendorStepDirective } from '../../components/wizard-vendor-step.directive';
import { DME_ARCH_TYPE, DME_VENDOR_STEP_NAME } from '../dme-step-definitions';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { AncilliaryServiceCode } from '../../make-a-referral-shared';
import { loadFusionVendorAllocations } from '../../../store/actions/fusion/fusion-make-a-referral.actions';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'healthe-dme-vendors-wizard-form',
  templateUrl: './dme-vendors-wizard-form.component.html',
  styleUrls: ['./dme-vendors-wizard-form.component.scss'],
  providers: [provideWizardBaseStep(DmeVendorsWizardFormComponent)]
})
export class DmeVendorsWizardFormComponent extends WizardVendorStepDirective
  implements OnInit {
  sectionName: string = DME_ARCH_TYPE;

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService
  ) {
    super(
      DME_VENDOR_STEP_NAME,
      store$,
      confirmationModalService,
      DME_ARCH_TYPE
    );
  }

  ngOnInit() {
    super.ngOnInit();

    combineLatest([this.customerId$, this.claimNumber$])
      .pipe(first())
      .subscribe(([encodedCustomerId, encodedClaimNumber]) => {
        this.store$.dispatch(
          loadFusionVendorAllocations({
            ancillaryServiceCode: AncilliaryServiceCode.DME,
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
