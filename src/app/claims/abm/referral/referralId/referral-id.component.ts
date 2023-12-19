import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { combineLatest, Observable, zip } from 'rxjs';
import { filter, first, map, takeUntil } from 'rxjs/operators';
import { FeatureFlagService } from '../../../../customer-configs/feature-flag.service';

import { RootState } from '../../../../store/models/root.models';
import {
  getAuthorizationArchetype,
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getEncodedReferralId,
  getPathSegments
} from '../../../../store/selectors/router.selectors';
import { resetFusionAuthorizationState } from '../store/actions/fusion/fusion-authorization.actions';
import { RequestReferralCurrentActivity } from '../store/actions/referral-activity.actions';
import { RequestReferralOverview } from '../store/actions/referral-id.actions';
import { ReferralRoutes } from '../store/models/referral.models';
import { AuthorizationInformationService } from './referral-authorization/authorization-information.service';
import {
  ReferralAuthorizationAction,
  ReferralAuthorizationArchetype
} from './referral-authorization/referral-authorization.models';
import { ReferralTab } from './referral-id.models';
import {
  RequestReferralNotes,
  RequestReferralNotesSuccess
} from '../store/actions/referral-notes.actions';
import { ResetReferralToInitialState } from '../store/actions/referral.actions';
import {
  loadReferralAuthorizationAction,
  loadReferralAuthorizationActionSuccess,
  loadReferralAuthorizationSet
} from '../store/actions/referral-authorization.actions';
import { getReferralAuthorizationAction } from '../store/selectors/referral-authorization.selectors';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';

@Component({
  selector: 'healthe-referral-id',
  templateUrl: './referral-id.component.html',
  styleUrls: ['./referral-id.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralIdComponent
  extends DestroyableComponent
  implements OnInit, OnDestroy
{
  authorizationArchType$: Observable<ReferralAuthorizationArchetype> =
    this.store$.pipe(select(getAuthorizationArchetype));
  referralAuthorizationAction$: Observable<ReferralAuthorizationAction> =
    this.store$.pipe(
      select(getReferralAuthorizationAction),
      filter(
        (authorizationAction) =>
          authorizationAction !== ReferralAuthorizationAction.DEFAULT
      )
    );
  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );
  encodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getEncodedClaimNumber)
  );
  encodedReferralId$: Observable<string> = this.store$.pipe(
    select(getEncodedReferralId)
  );

  url: string;
  tabs: ReferralTab[] = [
    {
      link: 'authorization',
      label: 'Authorization Information'
    },
    {
      link: 'activity',
      label: 'Referral Activity'
    }
  ];
  activeRoute$ = this.store$.pipe(
    select(getPathSegments),
    takeUntil(this.onDestroy$),
    map((segments) => segments[segments.length - 1])
  );

  ReferralAuthorizationArchetype = ReferralAuthorizationArchetype;
  AlertType = AlertType;

  public allContactAttemptsActive: boolean = false;
  private archType: ReferralAuthorizationArchetype;

  constructor(
    private store$: Store<RootState>,
    private router: Router,
    private authorizationActionsService: AuthorizationInformationService,
    private featureFlagService: FeatureFlagService
  ) {
    super();

    combineLatest([
      this.authorizationArchType$,
      this.referralAuthorizationAction$
    ])
      .pipe(first())
      .subscribe(
        ([archetype, authorizationPermissibleActions]: [
          string,
          ReferralAuthorizationAction
        ]) => {
          if (archetype !== ReferralAuthorizationArchetype.Transportation) {
            this.tabs.push({
              link: ReferralRoutes.AuthorizationHistory,
              label: 'Authorization History'
            });

            if (archetype === ReferralAuthorizationArchetype.PhysicalMedicine) {
              this.tabs.push({
                link: ReferralRoutes.ClinicalHistory,
                label: 'Clinical History'
              });
            }
          } else {
            if (
              authorizationPermissibleActions ===
                ReferralAuthorizationAction.MODIFY_OR_CANCEL ||
              authorizationPermissibleActions ===
                ReferralAuthorizationAction.CANCEL_ONLY
            ) {
              // Since we're re-using the authorization route for modify/cancel we need to set the new tab label when the user can modify/cancel
              this.tabs[
                this.tabs.findIndex((tab) => tab.link === 'authorization')
              ].label = 'Modify/Cancel Referral';
            }
          }

          this.tabs = this.tabs.filter(
            (tab) =>
              !this.featureFlagService.shouldElementBeRemoved(
                'referral-id-component',
                tab.link + 'Tab'
              )
          );
        }
      );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.store$.dispatch(resetFusionAuthorizationState());
    this.store$.dispatch(new ResetReferralToInitialState({}));
  }

  ngOnInit(): void {
    this.authorizationArchType$.subscribe(
      (archType) => (this.archType = archType)
    );

    // Clear out previous notes so that users do not see the old notes from other referrals while the
    // new notes load.
    this.store$.dispatch(new RequestReferralNotesSuccess([]));

    this.activeRoute$.subscribe((route) => {
      this.allContactAttemptsActive =
        route === ReferralRoutes.AllContactAttempts;
    });

    this.authorizationActionsService.reloadActivityData
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        zip(
          this.encodedCustomerId$,
          this.encodedClaimNumber$,
          this.encodedReferralId$,
          this.authorizationArchType$
        )
          .pipe(
            first(),
            map(([customerId, claimNumber, referralId, archType]) => {
              this.authorizationActionsService.init(customerId);
              return {
                customerId,
                claimNumber,
                referralId,
                archType
              };
            })
          )
          .subscribe((query) => {
            if (this.archType !== ReferralAuthorizationArchetype.Kinect) {
              this.store$.dispatch(
                loadReferralAuthorizationAction({
                  encodedReferralId: query.referralId,
                  encodedCustomerId: query.customerId,
                  encodedClaimNumber: query.claimNumber
                })
              );
            } else {
              // Kinect does not have authorization actions, so we need to set the actions to none
              this.store$.dispatch(
                loadReferralAuthorizationActionSuccess({
                  referralAuthorizationActions:
                    ReferralAuthorizationAction.NOTHING
                })
              );
            }

            if (query.archType === ReferralAuthorizationArchetype.Transportation) {
              this.store$.dispatch(
                loadReferralAuthorizationSet({
                  encodedCustomerId: query.customerId,
                  encodedReferralId: query.referralId,
                  encodedClaimNumber: query.claimNumber,
                  isManualAuthorizations: false
                })
              );
            }
            this.store$.dispatch(
              new RequestReferralCurrentActivity({
                referralId: query.referralId,
                claimNumber: query.claimNumber,
                customerId: query.customerId,
                archType: query.archType
              })
            );
            this.store$.dispatch(new RequestReferralOverview(query));

            // TODO: Consider removing or investigating the notes logic from the Referral Activity API
            //  at http://git.hestest.com:7990/projects/VER/repos/ngvertice-service/browse/src/main/java/com/healthesystems/ngVerticeService/referral/overview/ReferralOverviewACL.java#200
            //  The fusion notes seem to populate due to this notes specific call when landing directly
            //  on the 'Referral Activity' tab, but current ACL logic is attempting to fetch and include notes on the overview response
            if (
              this.archType !== ReferralAuthorizationArchetype.Transportation
            ) {
              this.store$.dispatch(
                new RequestReferralNotes({
                  customerId: query.customerId,
                  claimNumber: query.claimNumber,
                  referralId: query.referralId,
                  archType: query.archType
                })
              );
            }
          });
      });

    this.authorizationActionsService.reloadActivityData.next();

    this.url = this.router.url;
    this.router.events
      .pipe(
        takeUntil(this.onDestroy$),
        filter((evt) => evt instanceof NavigationEnd && !!evt.url)
      )
      .subscribe((evt: any) => (this.url = evt.url));
  }
}
