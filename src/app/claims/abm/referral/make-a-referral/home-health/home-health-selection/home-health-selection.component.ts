import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../../store/selectors/router.selectors';
import {
  loadFusionApprovedLocations,
  loadLocationTypes
} from '../../../store/actions/fusion/fusion-make-a-referral.actions';
import { FusionServiceSelectionBase } from '../../components/fusion-service-selection-base.component';
import {
  HOMEHEALTH_ARCH_TYPE,
  HOMEHEALTH_OTHER_STEP_NAME,
  HOMEHEALTH_STEP_DEFINITIONS
} from '../home-health-step-definitions';
import { FusionServiceName } from '../../../store/models/fusion/fusion-make-a-referral.models';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import {
  getFusionServiceGroupOptionsByGroupName,
  isHomeHealthCustomerServiceGroupConfigsLoading
} from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { first, takeUntil } from 'rxjs/operators';
import { AncilliaryServiceCode } from '../../make-a-referral-shared';

@Component({
  selector: 'healthe-home-health-selection',
  templateUrl: './home-health-selection.component.html',
  styleUrls: ['./home-health-selection.component.scss']
})
export class HomeHealthSelectionComponent extends FusionServiceSelectionBase
  implements OnInit {
  claimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  customerId$ = this.store$.pipe(select(getEncodedCustomerId));

  isLoading$ = this.store$.pipe(
    select(isHomeHealthCustomerServiceGroupConfigsLoading),
    takeUntil(this.onDestroy$)
  );

  stepName = HOMEHEALTH_ARCH_TYPE;
  constructor(public store$: Store<RootState>) {
    super(store$, HOMEHEALTH_STEP_DEFINITIONS, FusionServiceName.HomeHealth);
  }

  otherOptions$ = this.store$.pipe(
    select(
      getFusionServiceGroupOptionsByGroupName(
        FusionServiceName.HomeHealth,
        HOMEHEALTH_ARCH_TYPE
      ),
      'Other'
    )
  );
  ngOnInit() {
    super.ngOnInit();

    // Create the help tooltip message
    this.otherOptions$.subscribe((otherOpts) => {
      let otherStep = this.wizardStepDefinitions.find(
        (steps) => steps.name === HOMEHEALTH_OTHER_STEP_NAME,
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
        this.store$.dispatch(
          loadFusionApprovedLocations({
            serviceCode: AncilliaryServiceCode.HH,
            encodedClaimNumber,
            encodedCustomerId
          })
        );
        this.store$.dispatch(loadLocationTypes({ encodedCustomerId }));
      });
  }
}
