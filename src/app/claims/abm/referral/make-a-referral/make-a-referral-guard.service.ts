import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { RootState } from '../../../../store/models/root.models';
import { resetFusionMakeAReferral } from '../store/actions/fusion/fusion-make-a-referral.actions';
import { ResetMakeAReferral } from '../store/actions/make-a-referral.actions';
import {
  getFormState,
  getReferralLevelNotes,
  getReferralReviewMode,
  getSelectedServiceTypes
} from '../store/selectors/makeReferral.selectors';
import { MarNavExitConfirmModalComponent } from './components/mar-nav-exit-confirm-moodal/mar-nav-exit-confirm-modal.component';
import { MakeAReferralHelperService } from './make-a-referral-helper.service';
import { MakeAReferralComponent } from './make-a-referral.component';

@Injectable()
export class MakeAReferralGuardService
  implements CanDeactivate<MakeAReferralComponent>, CanActivate
{
  formState$ = this.store$.pipe(select(getFormState), first());
  referralLevelNotes$ = this.store$.pipe(select(getReferralLevelNotes()));
  hasSelectedServices$: Observable<boolean> = this.store$.pipe(
    select(getSelectedServiceTypes),
    map((services) => services.length > 0)
  );
  inReviewMode$ = this.store$.pipe(select(getReferralReviewMode));

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    public makeAReferralHelperService: MakeAReferralHelperService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.hasSelectedServices$.pipe(
      tap((hasServices) => {
        if (!hasServices) {
          let parentUrl = state.url.slice(
            0,
            state.url.indexOf(route.url[route.url.length - 1].path)
          );
          this.router.navigate([parentUrl, 'serviceSelection']);
        }
      })
    );
  }

  canDeactivate(
    component: MakeAReferralComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> {
    return zip(
      this.hasSelectedServices$,
      this.formState$,
      this.inReviewMode$
    ).pipe(
      first(),
      mergeMap(([hasServices, formState, inReviewMode]) => {
        const formStateKeys = Object.keys(formState);
        formStateKeys.splice(formStateKeys.indexOf('requestor-information'), 1);
        let openModal =
          hasServices && formStateKeys.length > 0 && !inReviewMode;
        if (openModal) {
          return this.dialog
            .open<MarNavExitConfirmModalComponent, any, string>(
              MarNavExitConfirmModalComponent,
              {
                height: '250px',
                width: '50%'
              }
            )
            .afterClosed()
            .pipe(
              mergeMap((action) => {
                if (action) {
                  // Action if they just want to navigate away
                  return of(true);
                }
                // action if they hit cancel
                return of(false);
              }),
              map((value) => !!value),
              tap((shouldNav) => {
                if (shouldNav) {
                  this.store$.dispatch(new ResetMakeAReferral(null));
                  this.store$.dispatch(resetFusionMakeAReferral());
                }
              })
            );
        } else {
          if (!openModal) {
            this.store$.dispatch(new ResetMakeAReferral(null));
            this.store$.dispatch(resetFusionMakeAReferral());
          }

          return of(!openModal);
        }
      })
    );
  }
}
