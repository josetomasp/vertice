import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { RootState } from '../../../../../../store/models/root.models';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { WizardVendorStepDirective } from '../../components/wizard-vendor-step.directive';
import {
  LANGUAGE_ARCH_TYPE,
  LANGUAGE_VENDOR_STEP_NAME
} from '../language-step-definitions';
import {
  AncilliaryServiceCode,
  ServiceType
} from '../../make-a-referral-shared';
import { loadFusionVendorAllocations } from '../../../store/actions/fusion/fusion-make-a-referral.actions';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'healthe-language-vendors-wizard-form',
  templateUrl: './language-vendors-wizard-form.component.html',
  styleUrls: ['./language-vendors-wizard-form.component.scss'],
  providers: [provideWizardBaseStep(LanguageVendorsWizardFormComponent)]
})
export class LanguageVendorsWizardFormComponent extends WizardVendorStepDirective {
  sectionName: string = 'language';
  serviceType: ServiceType = LANGUAGE_ARCH_TYPE;

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService
  ) {
    super(
      LANGUAGE_VENDOR_STEP_NAME,
      store$,
      confirmationModalService,
      LANGUAGE_ARCH_TYPE
    );

    combineLatest([this.customerId$, this.claimNumber$])
      .pipe(first())
      .subscribe(([encodedCustomerId, encodedClaimNumber]) => {
        this.store$.dispatch(
          loadFusionVendorAllocations({
            ancillaryServiceCode: AncilliaryServiceCode.LAN,
            encodedCustomerId: encodedCustomerId,
            encodedClaimNumber: encodedClaimNumber,
            serviceType: this.serviceType
          })
        );
      });
  }
}
