import { Component } from '@angular/core';
import { find } from 'lodash';
import { FusionServiceName } from '../../../store/models/fusion/fusion-make-a-referral.models';
import { getPhysicalMedicineCustomerServiceGroupConfigs } from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { getSelectedServiceDetailTypes } from '../../../store/selectors/makeReferral.selectors';
import { provideWizardBaseStep } from '../../components/provideWizardBaseComponent';
import { WizardVendorStepDirective } from '../../components/wizard-vendor-step.directive';
import {
  AncilliaryServiceCode,
  ServiceType
} from '../../make-a-referral-shared';
import {
  PHYSICALMEDICINE_ARCH_TYPE,
  PHYSICALMEDICINE_STEP_DEFINITIONS,
  PHYSICALMEDICINE_VENDOR_STEP_NAME
} from '../physical-medicine-step-definitions';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { loadFusionVendorAllocations } from '../../../store/actions/fusion/fusion-make-a-referral.actions';
import {
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';

@Component({
  selector: 'healthe-physical-medicine-vendors-wizard-form',
  templateUrl: './physical-medicine-vendors-wizard-form.component.html',
  styleUrls: ['./physical-medicine-vendors-wizard-form.component.scss'],
  providers: [provideWizardBaseStep(PhysicalMedicineVendorsWizardFormComponent)]
})
export class PhysicalMedicineVendorsWizardFormComponent extends WizardVendorStepDirective {
  sectionName: string = 'physical-medicine';

  serviceType: ServiceType = PHYSICALMEDICINE_ARCH_TYPE;
  pmCustomerServiceConfigurations$ = this.store$.pipe(
    select(getPhysicalMedicineCustomerServiceGroupConfigs)
  );
  selectedServiceTypes$ = this.store$.pipe(
    select(getSelectedServiceDetailTypes(FusionServiceName.PhysicalMedicine)),
    map((services) =>
      services
        .map((name) => find(PHYSICALMEDICINE_STEP_DEFINITIONS, { name }))
        .filter((step) => !!step)
        .map((step) => step.groupName)
    )
  );

  firstSelectedSubServiceCustomerServiceConfig$ = this.selectedServiceTypes$.pipe(
    switchMap((subServices) =>
      this.pmCustomerServiceConfigurations$.pipe(
        map((customerServiceConfigs) => {
          const emptyGroupConfig = {
            customerSubTypeId: null,
            customerTypeId: null,
            subTypeDescription: null
          };
          if (subServices.length > 0) {
            const [masterSubServiceLabel] = subServices;
            const groupConfig = customerServiceConfigs.find(
              ({ groupName }) => groupName === masterSubServiceLabel
            );
            return groupConfig && groupConfig.subTypes.length > 0
              ? groupConfig.subTypes[0]
              : emptyGroupConfig;
          }
          return emptyGroupConfig;
        })
      )
    )
  );

  constructor(
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService
  ) {
    super(
      PHYSICALMEDICINE_VENDOR_STEP_NAME,
      store$,
      confirmationModalService,
      PHYSICALMEDICINE_ARCH_TYPE
    );
    this.firstSelectedSubServiceCustomerServiceConfig$
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged(
          (groupConfig1, groupConfig2) =>
            groupConfig1.customerSubTypeId === groupConfig2.customerSubTypeId
        ),
        withLatestFrom(this.customerId$, this.claimNumber$)
      )
      .subscribe(
        ([
          { customerSubTypeId, customerTypeId },
          encodedCustomerId,
          encodedClaimNumber
        ]) => {
          this.store$.dispatch(
            loadFusionVendorAllocations({
              encodedCustomerId,
              encodedClaimNumber,
              serviceType: 'physicalMedicine',
              serviceProductTypeId: customerTypeId,
              serviceProductSubTypeId: customerSubTypeId,
              ancillaryServiceCode: AncilliaryServiceCode.PM
            })
          );
        }
      );
  }

  loadForm() {
    console.warn('Unimplemented');
  }
}
