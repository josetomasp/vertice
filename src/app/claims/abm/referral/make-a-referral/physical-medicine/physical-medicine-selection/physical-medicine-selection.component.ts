import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../../store/selectors/router.selectors';
import {
  loadFusionApprovedLocations,
  loadFusionBodyParts
} from '../../../store/actions/fusion/fusion-make-a-referral.actions';
import { FusionServiceName } from '../../../store/models/fusion/fusion-make-a-referral.models';
import {
  getFusionServiceGroupOptionsByGroupName,
  isPhysicalMedicineCustomerServiceGroupConfigsLoading
} from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { FusionServiceSelectionBase } from '../../components/fusion-service-selection-base.component';
import { AncilliaryServiceCode } from '../../make-a-referral-shared';
import {
  PHYSICALMEDICINE_ARCH_TYPE,
  PHYSICALMEDICINE_OTHER_STEP_NAME,
  PHYSICALMEDICINE_STEP_DEFINITIONS
} from '../physical-medicine-step-definitions';

@Component({
  selector: 'healthe-physical-medicine-selection',
  templateUrl: './physical-medicine-selection.component.html',
  styleUrls: ['./physical-medicine-selection.component.scss']
})
export class PhysicalMedicineSelectionComponent
  extends FusionServiceSelectionBase
  implements OnInit {
  claimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  customerId$ = this.store$.pipe(select(getEncodedCustomerId));

  isLoading$ = this.store$.pipe(
    select(isPhysicalMedicineCustomerServiceGroupConfigsLoading),
    takeUntil(this.onDestroy$)
  );

  otherOptions$ = this.store$.pipe(
    select(
      getFusionServiceGroupOptionsByGroupName(
        FusionServiceName.PhysicalMedicine,
        PHYSICALMEDICINE_ARCH_TYPE
      ),
      'Other'
    )
  );

  constructor(public store$: Store<RootState>) {
    super(
      store$,
      PHYSICALMEDICINE_STEP_DEFINITIONS,
      FusionServiceName.PhysicalMedicine
    );
  }

  ngOnInit() {
    super.ngOnInit();

    // Create the help tooltip message
    this.otherOptions$.subscribe((otherOpts) => {
      let otherStep = this.wizardStepDefinitions.find(
        (steps) => steps.name === PHYSICALMEDICINE_OTHER_STEP_NAME,
        first()
      );
      if (otherOpts.length > 0) {
        otherStep.help = 'Services may include: '.concat(
          otherOpts.map((opt) => opt.label).join(', ')
        );
      }
    });
    combineLatest([this.customerId$, this.claimNumber$])
      .pipe(first())
      .subscribe(([encodedCustomerId, encodedClaimNumber]) => {
        // Dispatch all controls shared across steps.
        this.store$.dispatch(
          loadFusionApprovedLocations({
            serviceCode: AncilliaryServiceCode.PM,
            encodedClaimNumber,
            encodedCustomerId
          })
        );
        this.store$.dispatch(
          loadFusionBodyParts({ encodedClaimNumber, encodedCustomerId })
        );
      });
  }
}
