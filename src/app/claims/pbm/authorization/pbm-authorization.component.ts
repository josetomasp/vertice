import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { RequestClaimV2 } from '@shared/store/actions/claim.actions';
import { Observable, zip } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { RootState } from '../../../store/models/root.models';
import {
  getDecodedAuthorizationId,
  getDecodedClaimNumber,
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getPathSegments,
  getPbmServiceType
} from '../../../store/selectors/router.selectors';
import { ClaimSearchRequest, getClaimSearchResults } from '../../store';
import { ClaimStatusEnum } from '@healthe/vertice-library';
import { getCreateLOMNResponse } from './store/selectors/create-lomn.selectors';
import { MatDialog } from '@angular/material/dialog';
import {
  resetRxAuthorizationState, unlockPaperRxAuthorization,
  unlockRxAuthorization
} from './store/actions/pbm-authorization-information.actions';
import {
  getAuthorizationDetails,
  getAuthorizationHealtheHeaderBar,
  getAuthorizationLockBannerIndicator, getLockAuthorizationStatus,
  getRxAuthorizationErrorState
} from './store/selectors/pbm-authorization-information.selectors';
import { AuthorizationDetails } from './store/models/pbm-authorization-information.model';
import {
  getAbmClaimStatus,
  getPbmClaimStatus
} from '@shared/store/selectors/claim.selectors';
import {
  getUsername,
  isUserInternal
} from 'src/app/user/store/selectors/user.selectors';
import { LOMNWizardFormResponse } from './store/models/create-lomn.models';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

import { Router } from '@angular/router';
import { PbmAuthorizationService } from './pbm-authorization.service';
import { takeWhileRouteActive } from '@shared/lib/operators/takeWhileRouteActive';
import { HealtheSnackBarService } from '@shared/service/snackbar.service';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';
import { ClaimDocumentTableComponentStoreService } from '@shared/components/claim-documents-table/claim-document-table-component-store.service';
import {
  PbmAuthorizationConfigService
} from './authorization-information/pbm-authorization-configs/pbm-authorization-config.service';
import { PbmAuthorizationServiceType } from './store/models/pbm-authorization-service-type.models';

@Component({
  selector: 'healthe-authorization',
  templateUrl: './pbm-authorization.component.html',
  styleUrls: ['./pbm-authorization.component.scss'],
  providers: [ClaimDocumentTableComponentStoreService, PbmAuthorizationConfigService]
})
export class PbmAuthorizationComponent
  extends DestroyableComponent
  implements OnInit, OnDestroy
{
  alertType = AlertType;
  encodedClaimNumber$ = this.store$.pipe(
    select(getEncodedClaimNumber),
    first()
  );
  authorizationId$ = this.store$.pipe(
    select(getDecodedAuthorizationId),
    first()
  );
  customerId$ = this.store$.pipe(select(getEncodedCustomerId), first());
  userName$ = this.store$.pipe(select(getUsername), first());

  userIsInternal$: Observable<boolean> = this.store$.pipe(
    select(isUserInternal),
    first()
  );
  decodedClaimNumber$: Observable<string> = this.store$.pipe(
    takeWhileRouteActive('pbm'),
    select(getDecodedClaimNumber),
    first(),
    tap((claimNumber) => {
      this.store$.dispatch(
        new ClaimSearchRequest({
          claimNumber,
          claimantLastName: '',
          claimantFirstName: '',
          assignedAdjuster: 'All',
          dateOfInjury: null,
          riskLevel: 'All',
          riskCategory: 'All',
          stateOfVenue: 'All'
        })
      );
    })
  );
  claimViewLink$: Observable<string[]> = zip(
    this.encodedClaimNumber$,
    this.customerId$
  ).pipe(
    tap(([eClaimNumber, eCustomerId]: [string, string]) => {
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
  riskClaim$ = this.store$.pipe(
    select(getClaimSearchResults),
    filter((res) => res.length > 0),
    map((res) => res[0])
  );
  riskLevelNumber$ = this.riskClaim$.pipe(
    map((claim) => claim.riskLevelNumber)
  );
  riskLevel$ = this.riskClaim$.pipe(map((claim) => claim.riskLevel));
  pbmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getPbmClaimStatus)
  );
  abmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getAbmClaimStatus)
  );

  createLOMNResponse$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getCreateLOMNResponse)
  );
  serviceType$: Observable<PbmAuthorizationServiceType> = this.store$.pipe(
    select(getPbmServiceType)
  );
  authorizationDetails$: Observable<AuthorizationDetails> = this.store$.pipe(
    select(getAuthorizationDetails),
    first(
      (details) =>
        details !== null &&
        details.authorizationLineItems !== null &&
        details.authorizationLineItems.length > 0
    )
  );

  LockAuthorizationStatus$: Observable<boolean> = this.store$.pipe(
    select(getLockAuthorizationStatus)
  );

  authorizationErrorState$: Observable<string[]> = this.store$.pipe(
    select(getRxAuthorizationErrorState)
  );

  getIsAuthLockedByOtherUser = createSelector(
    getAuthorizationLockBannerIndicator,
    getUsername,
    (lockBannerIndicator, username) => {
      const retval = {
        username,
        locked: false,
        lockedBy: ''
      };
      if (null != lockBannerIndicator) {
        retval['locked'] = lockBannerIndicator.locked;
        retval['lockedBy'] = lockBannerIndicator.lockedBy;
      }

      return retval;
    }
  );

  isLocked: boolean = false;
  isLockedText: string;
  authorizationTitle: string = '';
  showLetterBanner: boolean = false;
  showTabBar: boolean = true;
  showLockedWarning: boolean = true;
  authorizationId: string;
  isOnLOMNComponent: boolean;
  showUnlockFailureBanner: boolean = false;
  isUnlockingAuth: boolean = false;

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    public router: Router,
    public pbmAuthorizationService: PbmAuthorizationService,
    public pbmAuthorizationConfigService: PbmAuthorizationConfigService,
    public snackBarService: HealtheSnackBarService
  ) {
    super();
  }

  ngOnInit() {
    this.createLOMNResponse$.subscribe((response: LOMNWizardFormResponse) => {
      if (response.successful) {
        this.showLetterBanner = true;
        this.changeDetectorRef.detectChanges();
      }
    });

    this.authorizationId$.pipe().subscribe((authorizationId) => {
      this.authorizationId = authorizationId;
    });

    this.store$
      .select(this.getIsAuthLockedByOtherUser)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (value.locked === true) {
          const username =
            value.username != null ? value.username.toLowerCase() : null;
          const lockedBy =
            value.lockedBy != null ? value.lockedBy.toLowerCase() : null;

          if (username !== lockedBy) {
            this.isLocked = true;
            this.isLockedText = 'This authorization has been locked by '.concat(
              value.lockedBy
            );
          } else {
            this.isLocked = false;
            this.isLockedText = '';
          }
        } else {
          this.isLocked = false;
          this.isLockedText = '';
        }
      });

    this.store$
      .pipe(select(getPathSegments))
      .pipe()
      .subscribe((screenLocation) => {
        this.isOnLOMNComponent = screenLocation.indexOf('createLomn') > -1;
      });

    this.store$
      .pipe(
        select(
          createSelector(
            getPbmServiceType,
            getAuthorizationHealtheHeaderBar,
            (serviceType, healtheHeaderBar) => {
              return { serviceType, healtheHeaderBar };
            }
          )
        )
      )
      .subscribe(({ serviceType, healtheHeaderBar }) => {
        this.setAuthorizationTitle(serviceType, healtheHeaderBar);
      });
  }

  setAuthorizationTitle(serviceType, healtheHeaderBar) {
    if (serviceType && healtheHeaderBar) {
      switch (serviceType) {
        case PbmAuthorizationServiceType.POS:
          {
            if (healtheHeaderBar.patientWaiting) {
              this.authorizationTitle = 'POS (ePAQ) Auth - Pt. Waiting';
            } else {
              switch (healtheHeaderBar.authorizationType.toUpperCase()) {
                case 'POS':
                  this.authorizationTitle = 'POS (ePAQ) Auth';
                  break;
                case 'PHARMACYCALL':
                  this.authorizationTitle = 'POS (ePAQ) Auth - Pharmacy Call';
                  break;
                case 'MAILORDER':
                  this.authorizationTitle = 'POS (ePAQ) Auth - Mail Order';
                  break;
                case 'EXPIRINGAUTHORIZATION':
                  this.authorizationTitle = 'POS (ePAQ) Auth - Expiring';
                  break;
                case 'HISTORICAL':
                  this.authorizationTitle = 'POS (ePAQ) Auth - Historical';
                  break;
              }
            }
          }
          break;

        case PbmAuthorizationServiceType.RTR:
          this.showTabBar = false;
          this.authorizationTitle = 'Create Authorization From RTR';
          break;

        case PbmAuthorizationServiceType.PAPER:
          this.authorizationTitle = 'Retro (Paper) Authorization';
          break;
        default:
          {
            this.authorizationTitle = 'POS (ePAQ) Auth';
          }
          break;
      }
      if (serviceType !== PbmAuthorizationServiceType.RTR) {
        this.authorizationTitle = this.authorizationTitle
          .concat(' - ')
          .concat(healtheHeaderBar.authorizationId.toString());
      }
    }
  }

  ngOnDestroy() {
   if (!this.isLocked) {
      this.pbmAuthorizationConfigService.unlockAuthorization$(this.authorizationId);
    }
    this.store$.dispatch(resetRxAuthorizationState());
  }

  @HostListener('window:unload', ['$event'])
  onWindowClose(event: any): void {
    // If it's not locked, it means this user locked it. So it must be unlocked at the end.
    if (!this.isLocked) {
      this.pbmAuthorizationConfigService.unlockAuthorization$(this.authorizationId);
    }
  }

  doUnlock() {
    this.showUnlockFailureBanner = false;
    this.isUnlockingAuth = true;
    this.pbmAuthorizationConfigService.unlockAuthorization$(this.authorizationId);

    this.serviceType$.pipe(first())
      .subscribe(type => {
        switch (type) {
          case PbmAuthorizationServiceType.RTR:
            this.router.navigate([
              'csc-administration/real-time-rejects-queue'
            ]);
            break;
          default:
            this.router.navigate([
              '/csc-administration/authorization-status-queue'
            ]);
            break;
        }
      });

    this.LockAuthorizationStatus$.pipe(distinctUntilChanged(), first()).subscribe(status => {
      if (status) {
        this.snackBarService.showSuccess(
          'You have unlocked Authorization #' + this.authorizationId + '.'
        );

      } else {
        this.showUnlockFailureBanner = true;
      }
    })
  }
}
