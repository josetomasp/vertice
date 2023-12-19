import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { RootState } from '../../../../../../store/models/root.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../../store/selectors/router.selectors';
import { FusionServiceName } from '../../../store/models/fusion/fusion-make-a-referral.models';
import { LANGUAGE_STEP_DEFINITIONS } from '../language-step-definitions';
import { FusionServiceSelectionBase } from '../../components/fusion-service-selection-base.component';
import { select, Store } from '@ngrx/store';
import {
  loadFusionApprovedLocations,
  loadFusionLanguages,
  loadLocationTypes
} from '../../../store/actions/fusion/fusion-make-a-referral.actions';
import { AncilliaryServiceCode } from '../../make-a-referral-shared';
import { isLanguageCustomerServiceGroupConfigsLoading } from '../../../store/selectors/fusion/fusion-make-a-referrral.selectors';

@Component({
  selector: 'healthe-language-selection',
  templateUrl: './language-selection.component.html',
  styleUrls: ['./language-selection.component.scss']
})
export class LanguageSelectionComponent extends FusionServiceSelectionBase
  implements OnInit {
  constructor(public store$: Store<RootState>) {
    super(store$, LANGUAGE_STEP_DEFINITIONS, FusionServiceName.Language);
  }

  claimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  customerId$ = this.store$.pipe(select(getEncodedCustomerId));

  isLoading$ = this.store$.pipe(
    select(isLanguageCustomerServiceGroupConfigsLoading),
    takeUntil(this.onDestroy$)
  );

  ngOnInit() {
    super.ngOnInit();
    combineLatest([this.customerId$, this.claimNumber$])
      .pipe(first())
      .subscribe(([encodedCustomerId, encodedClaimNumber]) => {
        this.store$.dispatch(
          loadFusionApprovedLocations({
            serviceCode: AncilliaryServiceCode.LAN,
            encodedCustomerId,
            encodedClaimNumber
          })
        );
        this.store$.dispatch(loadLocationTypes({ encodedCustomerId }));
        this.store$.dispatch(loadFusionLanguages({ encodedCustomerId }));
      });
  }
}
