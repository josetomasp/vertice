import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { createSelector, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map, mergeMap, tap } from 'rxjs/operators';
import { RootState } from '../../../../../store/models/root.models';
import {
  AuthorizationInformationService
} from './authorization-information.service';
import { ReferralAuthorizationAction } from './referral-authorization.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../store/selectors/router.selectors';

@Injectable()
export class ActiveAuthorizationGuardService implements CanActivate {
  constructor(
    public store$: Store<RootState>,
    private router: Router,
    private authorizationInformationService: AuthorizationInformationService
  ) {
  }

  private authRequestQuery = createSelector(
    getEncodedCustomerId,
    getEncodedReferralId,
    getEncodedClaimNumber,
    (...query) => query
  );

  authActions$ = this.store$.pipe(
    select(this.authRequestQuery),
    mergeMap(
      (query: [encodedCustomerId: string,
        encodedReferralId: string,
        encodedClaimNumber: string]) => this.authorizationInformationService.getReferralAuthorizationActions(...query))
  );

  // ActiveClaim Guard
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authActions$.pipe(
      tap((authorizationActionResponse) => {
        let parentUrl = state.url.slice(
          0,
          state.url.indexOf(route.url[route.url.length - 1].path)
        );
        if (
          authorizationActionResponse === ReferralAuthorizationAction.NOTHING
        ) {
          this.router.navigate([parentUrl, 'activity']);
        }
      }),
      map(
        (authorizationAction): boolean =>
          authorizationAction !== ReferralAuthorizationAction.NOTHING
      )
    );
  }
}
