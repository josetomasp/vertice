import { Component } from '@angular/core';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { WizardVendorStepDirective } from '../../components/wizard-vendor-step.directive';
import {
  DIAGNOSTICS_ARCH_TYPE,
  DIAGNOSTICS_VENDOR_STEP_NAME
} from '../diagnostics-step-definitions';
import {
  AncilliaryServiceCode,
  ServiceType
} from '../../make-a-referral-shared';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { loadFusionVendorAllocations } from '../../../store/actions/fusion/fusion-make-a-referral.actions';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'healthe-diagnostics-vendors-wizard-form',
  templateUrl: './diagnostics-vendors-wizard-form.component.html',
  styleUrls: ['./diagnostics-vendors-wizard-form.component.scss'],
  providers: [provideWizardBaseStep(DiagnosticsVendorsWizardFormComponent)]
})
export class DiagnosticsVendorsWizardFormComponent extends WizardVendorStepDirective {
  sectionName: string = 'diagnostics';

  serviceType: ServiceType = DIAGNOSTICS_ARCH_TYPE;

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService
  ) {
    super(
      DIAGNOSTICS_VENDOR_STEP_NAME,
      store$,
      confirmationModalService,
      DIAGNOSTICS_ARCH_TYPE
    );
    combineLatest([this.customerId$, this.claimNumber$])
      .pipe(first())
      .subscribe(([encodedCustomerId, encodedClaimNumber]) => {
        this.store$.dispatch(
          loadFusionVendorAllocations({
            ancillaryServiceCode: AncilliaryServiceCode.DX,
            encodedCustomerId: encodedCustomerId,
            encodedClaimNumber: encodedClaimNumber,
            serviceType: this.serviceType
          })
        );
      });
  }
}
