import { Store } from '@ngrx/store';
import { RootState } from '../../../../../store/models/root.models';
import { AuthorizationInformationService } from '../../referralId/referral-authorization/authorization-information.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, mergeMap } from 'rxjs/operators';

import { of } from 'rxjs';
import {
  loadReferralAuthorizationAction,
  loadReferralAuthorizationActionFailure,
  loadReferralAuthorizationActionSuccess,
  loadReferralAuthorizationSet,
  loadReferralAuthorizationSetFailure,
  loadReferralAuthorizationSetSuccess
} from '../actions/referral-authorization.actions';

@Injectable()
export class ReferralAuthorizationEffects {
  constructor(
    private store$: Store<RootState>,
    private authorizationInformationService: AuthorizationInformationService,
    private actions$: Actions
  ) {}

  loadReferralAuthorizationSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReferralAuthorizationSet),
      mergeMap((action) => {
        if (action.isManualAuthorizations) {
          return this.authorizationInformationService
            .getReferralManualAuthorizationItems(
              action.encodedCustomerId,
              action.encodedReferralId,
              action.encodedClaimNumber
            )
            .pipe(
              map((referralAuthSet) => {
                referralAuthSet.referralAuthorization.authorizationItems.forEach(
                  (item) => {
                    item.uniqueId = this.authorizationInformationService.getUniqueId();
                    item.isAddedItem = false;
                  }
                );

                return loadReferralAuthorizationSetSuccess({
                  referralAuthSet
                });
              }),
              catchError(() => of(loadReferralAuthorizationSetFailure()))
            );
        } else {
          return this.authorizationInformationService
            .getReferralCurrentAuthorizationItems(
              action.encodedCustomerId,
              action.encodedReferralId,
              action.encodedClaimNumber
            )
            .pipe(
              map((referralAuthSet) => {
                referralAuthSet.referralAuthorization.authorizationItems.forEach(
                  (item) => {
                    item.uniqueId = this.authorizationInformationService.getUniqueId();
                    item.isAddedItem = false;
                  }
                );

                return loadReferralAuthorizationSetSuccess({
                  referralAuthSet
                });
              }),
              catchError(() => of(loadReferralAuthorizationSetFailure()))
            );
        }
      })
    )
  );

  loadReferralAuthorizationActions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReferralAuthorizationAction),
      mergeMap((action) => {
        return this.authorizationInformationService
          .getReferralAuthorizationActions(
            action.encodedCustomerId,
            action.encodedReferralId,
            action.encodedClaimNumber
          )
          .pipe(
            map((actions) =>
              loadReferralAuthorizationActionSuccess({
                referralAuthorizationActions: actions
              })
            ),
            catchError(() => of(loadReferralAuthorizationActionFailure()))
          );
      })
    )
  );
}
