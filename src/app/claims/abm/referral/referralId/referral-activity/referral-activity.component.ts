import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, takeUntil, takeWhile } from 'rxjs/operators';
import { RootState } from '../../../../../store/models/root.models';
import { getDecodedReferralId } from '../../../../../store/selectors/router.selectors';
import {
  getCurrentActivityErrors,
  hasAdditionalContactAttempts,
  isReferralActivityLoading
} from '../../store/selectors/referral-activity.selectors';
import { getReferralType } from '../../store/selectors/referral-id.selectors';
import { PageTitleService } from '@shared/service/page-title.service';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import {
  AlertType,
  ConfirmationBannerComponent
} from '@shared/components/confirmation-banner/confirmation-banner.component';

@Component({
  templateUrl: './referral-activity.component.html',
  styleUrls: ['./referral-activity.component.scss']
})
export class ReferralActivityComponent extends DestroyableComponent
  implements OnInit, OnDestroy {
  @ViewChild('alert206', { static: true })
  alert206: ConfirmationBannerComponent;

  alertType = AlertType;

  errors$: Observable<string[]> = this.store$.pipe(
    select(getCurrentActivityErrors)
  );

  referralId$: Observable<string> = this.store$.pipe(
    select(getDecodedReferralId)
  );
  referralType$: Observable<string> = this.store$.pipe(select(getReferralType));

  isAlive: boolean;
  hasAdditionalContactAttempts$: Observable<boolean> = this.store$.pipe(
    select(hasAdditionalContactAttempts)
  );

  isReferralActivityLoading$: Observable<boolean> = this.store$.pipe(
    select(isReferralActivityLoading),
    takeUntil(this.onDestroy$)
  );

  constructor(
    private store$: Store<RootState>,
    private pageTitleService: PageTitleService
  ) {
    super();
    this.referralId$.pipe(first()).subscribe((referralId) => {
      this.pageTitleService.setTitleWithClaimNumber(
        'Referral Activity',
        'Referral - ' + referralId
      );
    });
  }

  ngOnInit(): void {
    this.isAlive = true;

    this.errors$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((serverErrors) => {
        if (serverErrors.length > 0) {
          this.alert206.show(
            'The following information is unavailable at this time. Please try again later.',
            serverErrors,
            this.alertType.DANGER
          );
        } else {
          if (this.alert206) {
            this.alert206.hide();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
