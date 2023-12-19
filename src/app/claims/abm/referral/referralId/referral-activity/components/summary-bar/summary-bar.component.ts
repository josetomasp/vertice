import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { isEqual } from 'lodash';
import { combineLatest, Observable, pipe } from 'rxjs';
import {
  distinctUntilChanged,
  first,
  map,
  mergeMap,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';
import {
  getAuthorizationArchetype,
  getEncodedClaimNumber,
  getEncodedCustomerId
} from 'src/app/store/selectors/router.selectors';

import { RootState } from '../../../../../../../store/models/root.models';
import {
  loadFusionAuthReasons
} from '../../../../store/actions/fusion/fusion-authorization.actions';
import {
  UpdateSelectedServiceType
} from '../../../../store/actions/referral-activity.actions';
import { CurrentActivityStatusBarState } from '../../../../store/models';
import {
  AuthorizationExtendableStatuses,
  AuthorizationReasons,
  FusionAuthorization
} from '../../../../store/models/fusion/fusion-authorizations.models';
import {
  ReferralOverviewCardState
} from '../../../../store/models/referral-id.models';
import {
  getFusionAuthorizationReasons,
  getFusionAuthorizations
} from '../../../../store/selectors/fusion/fusion-authorization.selectors';
import {
  getServiceTypes,
  getStatusBarState
} from '../../../../store/selectors/referral-activity.selectors';
import {
  getReferralOverviewCardState,
  getReferralTypeAndStatus
} from '../../../../store/selectors/referral-id.selectors';
import {
  FusionAuthorizationService
} from '../../../referral-authorization/fusion/fusion-authorization.service';
import {
  ReferralAuthorizationArchetype
} from '../../../referral-authorization/referral-authorization.models';

enum SumType {
  AUTHORIZED = 'authorized',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  BILLED = 'billed',
  SERVICE_DATES = 'serviceDates'
}

@Component({
  selector: 'healthe-summary-bar',
  templateUrl: './summary-bar.component.html',
  styleUrls: ['./summary-bar.component.scss']
})
export class SummaryBarComponent extends DestroyableComponent
  implements OnInit {
  serviceTypes: string[] = [];
  selectedServiceType: string = '';
  services$: Observable<string[]> = this.store$.pipe(
    select(getServiceTypes),
    distinctUntilChanged(isEqual),
    map((services: string[]) => {
      if (services && services.length > 0) {
        this.serviceTypes = services.sort();

        if (
          this.selectedServiceType !== 'Sedan' &&
          this.selectedServiceType !== services[0]
        ) {
          if (services.includes('Sedan')) {
            this.selectedServiceType = 'Sedan';
          } else {
            this.selectedServiceType = services[0];
          }
          this.servicesFormControl.setValue(this.selectedServiceType);
        }
      }
      return this.serviceTypes;
    })
  );

  authorized$: Observable<string[]> = this.store$.pipe(
    getStatusBarSum(SumType.AUTHORIZED, this.services$)
  );
  scheduled$: Observable<string[]> = this.store$.pipe(
    getStatusBarSum(SumType.SCHEDULED, this.services$)
  );
  completed$: Observable<string[]> = this.store$.pipe(
    getStatusBarSum(SumType.COMPLETED, this.services$)
  );
  billed$: Observable<string[]> = this.store$.pipe(
    getStatusBarSum(SumType.BILLED, this.services$)
  );
  serviceDates$: Observable<string[]> = this.store$.pipe(
    getStatusBarSum(SumType.SERVICE_DATES, this.services$)
  );
  authorizationArchType$: Observable<
    ReferralAuthorizationArchetype
  > = this.store$.pipe(select(getAuthorizationArchetype));
  encodedCustomerId$ = this.store$.pipe(
    select(getEncodedCustomerId),
    first()
  );
  encodedClaimNumber$ = this.store$.pipe(
    select(getEncodedClaimNumber),
    first()
  );
  fusionAuthorizationReasons$: Observable<
    AuthorizationReasons
  > = this.store$.pipe(select(getFusionAuthorizationReasons));
  fusionReferralAuthorizations$: Observable<
    FusionAuthorization[]
  > = this.store$.pipe(
    select(getFusionAuthorizations),
    distinctUntilChanged(isEqual)
  );
  referralTypeAndAuthStatus$: Observable<{
    referralType: string;
    status: string;
  }> = this.store$.pipe(
    select(getReferralTypeAndStatus),
    distinctUntilChanged(isEqual)
  );

  referralOverview$: Observable<ReferralOverviewCardState> = this.store$.pipe(
    select(getReferralOverviewCardState),
    distinctUntilChanged(isEqual)
  );
  fusionReferralAuthorizations: FusionAuthorization[] = [];
  encodedCustomerId: string;
  encodedClaimNumber: string;
  authorizationArchType: ReferralAuthorizationArchetype;

  @Input()
  referralId: string;

  @Input()
  referralType$: Observable<string>;

  servicesFormControl = new FormControl();
  viewModeToggleFormControl = new FormControl();

  // VF-3922 Default is not displayed
  showExtensionButton: boolean = false;
  showCancelButton: boolean;

  constructor(
    public store$: Store<RootState>,
    private fusionAuthorizationService: FusionAuthorizationService,
    public activeRoute: ActivatedRoute,
    public router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    combineLatest([this.referralOverview$, this.fusionReferralAuthorizations$])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([referralOverview, fusionReferralAuthorizations]) => {
        this.fusionReferralAuthorizations = fusionReferralAuthorizations;
        if (
          fusionReferralAuthorizations &&
          fusionReferralAuthorizations.length > 0 &&
          fusionReferralAuthorizations.find(
            (auth) => auth.authorizationUnderReview.allowCancel
          ) !== undefined &&
          referralOverview.status === 'Authorized'
        ) {
          this.showCancelButton = true;
        } else {
          this.showCancelButton = false;
        }
        this.changeDetectorRef.detectChanges();
      });

    combineLatest([
      this.encodedCustomerId$,
      this.encodedClaimNumber$,
      this.authorizationArchType$
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        ([encodedCustomerId, encodedClaimNumber, authorizationArchType]) => {
          this.encodedCustomerId = encodedCustomerId;
          this.encodedClaimNumber = encodedClaimNumber;
          this.authorizationArchType = authorizationArchType;
        }
      );

    this.servicesFormControl.valueChanges.subscribe((service) =>
      this.store$.dispatch(new UpdateSelectedServiceType(service))
    );
    this.viewModeToggleFormControl.valueChanges.subscribe((viewMode) =>
      this.router.navigate([viewMode], { relativeTo: this.activeRoute })
    );
    this.activeRoute.firstChild.url
      .pipe(map((url) => url[0].path))
      .subscribe((viewMode) =>
        this.viewModeToggleFormControl.setValue(viewMode, {
          onlySelf: true,
          emitEvent: false
        })
      );

    // VF-3922 Fixed the show or no show of the PM Extend button
    this.referralTypeAndAuthStatus$
      .pipe(
        takeUntil(this.onDestroy$),
        mergeMap(
          () => this.serviceDates$,
          (referralTypeAndAuthStatus, serviceDates) => {
            return {
              ...referralTypeAndAuthStatus,
              serviceDatesList: serviceDates
            };
          }
        )
      )
      .subscribe(({ serviceDatesList, referralType, status }) => {
        if (referralType && referralType === 'Physical Medicine') {
          if (this.referralId && serviceDatesList && status) {
            // Only go through the logic if we haven't found an extendable line item.
            if (!this.showExtensionButton) {
              if (AuthorizationExtendableStatuses.includes(status)) {
                serviceDatesList.forEach((datesOfService) => {
                  // Only go through the logic if we haven't found an extendable line item.
                  if (!this.showExtensionButton) {
                    let endDate;
                    let dates: string[] = datesOfService.split(' - ');
                    dates.length > 1
                      ? (endDate = dates[1])
                      : (endDate = datesOfService);
                    this.showExtensionButton = this.showExtension(endDate);
                    this.changeDetectorRef.detectChanges();
                  }
                });
              }
            }
          }
        }
      });
  }

  /* This method is to check if the Extend button needs to be displayed,
  but we need to add it as an *ngIf to the button when we know where to get the date*/
  showExtension(date: string): boolean {
    let endDate = new Date(date);
    let currentDate = new Date();
    return (
      Math.round(
        (currentDate.getTime() - endDate.getTime()) / (1000 * 3600 * 24)
      ) <= 30
    );
  }

  openExtendReferralModal() {
    this.fusionAuthorizationService.openPMExtensionModal(this.referralId);
  }

  openCancelReferralModal() {
    // Get Reasons
    this.store$.dispatch(
      loadFusionAuthReasons({
        encodedCustomerId: this.encodedCustomerId
      })
    );
    // Display modal
    this.fusionAuthorizationService.openAuthorizationCancelationModal({
      referralId: this.referralId,
      encodedCustomerId: this.encodedCustomerId,
      encodedClaimNumber: this.encodedClaimNumber,
      fusionReferralAuthorizations: this.fusionReferralAuthorizations,
      fusionAuthorizationReasons$: this.fusionAuthorizationReasons$,
      archeType: this.authorizationArchType
    });
  }
}

function getStatusBarSum(sumType: SumType, services$: Observable<string[]>) {
  return pipe(
    select(getStatusBarState),
    withLatestFrom(services$),
    map(
      ([statusBarState, services]: [
        CurrentActivityStatusBarState,
        string[]
      ]) => {
        return services.map(
          (service) => statusBarState.summations[service][sumType]
        );
      }
    )
  );
}
