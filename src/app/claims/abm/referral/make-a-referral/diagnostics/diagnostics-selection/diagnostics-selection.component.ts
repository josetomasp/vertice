import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
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
import { FusionServiceSelectionBase } from '../../components/fusion-service-selection-base.component';
import {
  DIAGNOSTICS_ARCH_TYPE,
  DIAGNOSTICS_OTHER_STEP_NAME,
  DIAGNOSTICS_STEP_DEFINITIONS
} from '../diagnostics-step-definitions';
import {
  getFusionServiceGroupOptionsByGroupName,
  isDiagnosticsCustomerServiceGroupConfigsLoading
} from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';
import { first, takeUntil } from 'rxjs/operators';
import { AncilliaryServiceCode } from '../../make-a-referral-shared';

@Component({
  selector: 'healthe-diagnostics-selection',
  templateUrl: './diagnostics-selection.component.html',
  styleUrls: ['./diagnostics-selection.component.scss']
})
export class DiagnosticsSelectionComponent extends FusionServiceSelectionBase
  implements OnInit {
  constructor(public store$: Store<RootState>) {
    super(store$, DIAGNOSTICS_STEP_DEFINITIONS, FusionServiceName.Diagnostics);
  }

  claimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  customerId$ = this.store$.pipe(select(getEncodedCustomerId));

  isLoading$ = this.store$.pipe(
    select(isDiagnosticsCustomerServiceGroupConfigsLoading),
    takeUntil(this.onDestroy$)
  );

  otherOptions$ = this.store$.pipe(
    select(
      getFusionServiceGroupOptionsByGroupName(
        FusionServiceName.Diagnostics,
        DIAGNOSTICS_ARCH_TYPE
      ),
      'Other Tests'
    )
  );

  ngOnInit() {
    super.ngOnInit();

    // Create the help tooltip message
    this.otherOptions$.subscribe((otherOpts) => {
      let otherStep = this.wizardStepDefinitions.find(
        (steps) => steps.name === DIAGNOSTICS_OTHER_STEP_NAME,
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
            serviceCode: AncilliaryServiceCode.DX,
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
