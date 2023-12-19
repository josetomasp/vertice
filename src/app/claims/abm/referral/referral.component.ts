import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ClaimStatusEnum } from '@healthe/vertice-library';
import { select, Store } from '@ngrx/store';
import { RequestClaimV2 } from '@shared/store/actions/claim.actions';
import {
  getAbmClaimStatus,
  getPbmClaimStatus
} from '@shared/store/selectors/claim.selectors';
import { combineLatest, Observable, zip } from 'rxjs';
import { first, map, startWith, take, takeWhile, tap } from 'rxjs/operators';

import { RootState } from '../../../store/models/root.models';
import {
  getDecodedClaimNumber,
  getDecodedReferralId,
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../store/selectors/router.selectors';
import { GetServiceSelectionValues } from './store/actions/make-a-referral.actions';
import { getReferralType } from './store/selectors/referral-id.selectors';
import { ReferralAuthorizationAction } from './referralId/referral-authorization/referral-authorization.models';
import { getReferralAuthorizationAction } from './store/selectors/referral-authorization.selectors';

@Component({
  selector: 'healthe-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit, OnDestroy {
  //#region   Observables
  decodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getDecodedClaimNumber),
    first()
  );
  decodedReferralId$: Observable<string> = this.store$.pipe(
    select(getDecodedReferralId),
    take(1)
  );
  pbmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getPbmClaimStatus)
  );

  abmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getAbmClaimStatus)
  );

  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId),
    first()
  );
  encodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getEncodedClaimNumber),
    first()
  );

  referralType$: Observable<string> = this.store$.pipe(select(getReferralType));

  claimViewLink$: Observable<string[]> = zip(
    this.encodedClaimNumber$,
    this.encodedCustomerId$
  ).pipe(
    tap(([eClaimNumber, eCustomerId]: [string, string]) => {
      this.store$.dispatch(
        new GetServiceSelectionValues({
          encodedCustomerId: eCustomerId,
          encodedClaimNumber: eClaimNumber
        })
      );

      this.store$.dispatch(
        new RequestClaimV2({
          claimNumber: eClaimNumber,
          customerId: eCustomerId
        })
      );
    }),
    map(([eClaimNumber, eCustomerId]: [string, string]) => {
      return [`/claimview/${eCustomerId}/${eClaimNumber}`];
    })
  );

  referralAuthorizationAction$: Observable<
    ReferralAuthorizationAction
  > = this.store$.pipe(select(getReferralAuthorizationAction));

  //#endregion

  //#region   Public Properties
  referralTabType: string;
  //#endregion

  //#region   Private Properties
  private isAlive = true;
  //#endregion

  //#region   Constructor
  constructor(private store$: Store<RootState>, private router: Router) {}
  //#endregion

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    combineLatest([
      this.referralAuthorizationAction$,
      this.router.events.pipe(startWith(new RouterEvent(0, this.router.url)))
    ])
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(
        ([referralAuthorizationAction, routerEvent]: [
          ReferralAuthorizationAction,
          RouterEvent
        ]) => {
          let url: string = routerEvent.url;
          if (url) {
            this.referralTabType = this.setReferralTabType(
              url.toLowerCase(),
              referralAuthorizationAction
            );
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  //#endregion

  //#region   Private Methods
  private setReferralTabType(
    url: string,
    referralAuthorizationAction: ReferralAuthorizationAction
  ): string {
    let prefix = '';
    if (url.includes('transportation')) {
      if (false === url.includes('legacytransportation')) {
        prefix = 'Transportation ';
      }
    }
    if (url.includes('authorization')) {
      if (
        referralAuthorizationAction === ReferralAuthorizationAction.AUTHORIZE
      ) {
        return prefix + 'Authorization';
      } else {
        return prefix + 'Modification';
      }
    } else if (url.includes('history')) {
      return prefix + 'History';
    } else if (url.includes('activity') || url.includes('allcontactattempts')) {
      return prefix + 'Activity';
    }
    return null;
  }
  //#endregion
}
