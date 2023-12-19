import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit
} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {faLock} from '@fortawesome/pro-regular-svg-icons/faLock';
import {
  faExclamationTriangle
} from '@fortawesome/pro-light-svg-icons/faExclamationTriangle';
import {select, Store} from '@ngrx/store';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import {
  getAbmClaimStatus,
  isLockedClaim
} from '@shared/store/selectors/claim.selectors';
import * as _ from 'lodash';
import {isEqual} from 'lodash';
import {combineLatest, Observable, of, ReplaySubject, Subscription} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import {ClaimsService} from 'src/app/claims/claims.service';
import {RootState} from '../../../../../store/models/root.models';
import {
  getAuthorizationArchetype,
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../store/selectors/router.selectors';
import {
  loadFusionAuthReasons,
  lockFusionAuthorization,
  restoreFusionAuthorizationState,
  unlockFusionAuthorization
} from '../../store/actions/fusion/fusion-authorization.actions';
import {
  AuthorizationReasons,
  FusionAuthorization,
  FusionClinicalAlert,
  FusionReferralAuthorizationLocked,
  NoteList
} from '../../store/models/fusion/fusion-authorizations.models';
import {
  fusinAuthorizationSubmitError,
  fusinAuthorizationSubmitResponse,
  fusinAuthorizationSubmitResponseStatus,
  getClinicalAlerts,
  getFusionActionableAuthorizations,
  getFusionAuthorizationNoteList,
  getFusionAuthorizationReasons,
  isFusionAuthorizationLoaded,
  isFusionAuthorizationLoading,
  isFusionAuthorizationLocked,
  isFusionAuthorizationRush
} from '../../store/selectors/fusion/fusion-authorization.selectors';
import {
  getReferralAuthorizationAction,
  getReferralAuthorizationIsLoaded,
  getReferralAuthorizationState,
  isReferralAuthLoading
} from '../../store/selectors/referral-authorization.selectors';
import {
  AuthorizationInformationService
} from './authorization-information.service';
import {
  ReferralAuthorizationAction,
  ReferralAuthorizationArchetype,
  ReferralAuthorizationSet
} from './referral-authorization.models';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {ClaimStatusEnum} from '@healthe/vertice-library';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  ErrorMessage,
  FormValidationExtractorService
} from "@modules/form-validation-extractor";

@Component({
  selector: 'healthe-referral-authorization',
  templateUrl: './referral-authorization.component.html',
  styleUrls: ['./referral-authorization.component.scss'],
  providers: [FormValidationExtractorService]
})
export class ReferralAuthorizationComponent extends DestroyableComponent
  implements OnInit {
  isLoaded = false;
  isLoading = false;

  referralAuthorizationSet: ReferralAuthorizationSet;
  referralAuthorizationActionSubject$: ReplaySubject<ReferralAuthorizationAction> = new ReplaySubject();
  isReferralAuthLoadedSubject$: ReplaySubject<boolean> = new ReplaySubject();
  isReferralAuthLoadingSubject$: ReplaySubject<boolean> = new ReplaySubject();
  referralArchetypeSubject$: ReplaySubject<ReferralAuthorizationArchetype> = new ReplaySubject();

  referralAuthorizationArchetype = ReferralAuthorizationArchetype;

  referralArchetype$: Observable<
    ReferralAuthorizationArchetype
  > = this.store$.pipe(select(getAuthorizationArchetype));
  isReferralAuthLoaded$ = this.referralArchetype$.pipe(
    switchMap((archetype) => {
      if (archetype === ReferralAuthorizationArchetype.Transportation) {
        return this.store$.pipe(select(getReferralAuthorizationIsLoaded));
      } else {
        return this.store$.pipe(select(isFusionAuthorizationLoaded));
      }
    })
  );
  isReferralAuthLoading$ = this.referralArchetype$.pipe(
    switchMap((archetype) => {
      if (archetype === ReferralAuthorizationArchetype.Transportation) {
        return this.store$.pipe(select(isReferralAuthLoading));
      } else {
        return this.store$.pipe(select(isFusionAuthorizationLoading));
      }
    })
  );
  referralAuthorizationAction$: Observable<
    ReferralAuthorizationAction
  > = this.store$.pipe(
    select(getReferralAuthorizationAction),
    filter(
      (authorizationAction) =>
        authorizationAction !== ReferralAuthorizationAction.DEFAULT
    )
  );

  fusionReferralAuthorizations$: Observable<
    FusionAuthorization[]
  > = this.store$.pipe(
    select(getFusionActionableAuthorizations),
    distinctUntilChanged(isEqual)
  );

  fusionClinicalAlerts$: Observable<FusionClinicalAlert[]> = this.store$.pipe(
    select(getClinicalAlerts)
  );

  fusionSubmitErrors$: Observable<string[]> = this.store$.pipe(
    select(fusinAuthorizationSubmitError)
  );

  fusionSubmitStatus$: Observable<number> = this.store$.pipe(
    select(fusinAuthorizationSubmitResponseStatus)
  );

  fusionSubmitResponse$: Observable<boolean> = this.store$.pipe(
    select(fusinAuthorizationSubmitResponse)
  );

  isFusionAuthorizationRush$: Observable<boolean> = this.store$.pipe(
    select(isFusionAuthorizationRush)
  );
  fusionAuthorizationNotes$: Observable<NoteList[]> = this.store$.pipe(
    select(getFusionAuthorizationNoteList)
  );
  isLockedClaim$: Observable<boolean> = this.store$.pipe(select(isLockedClaim));
  isLockedReferral$: Observable<
    FusionReferralAuthorizationLocked
  > = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(isFusionAuthorizationLocked),
    tap(
      (locked) =>
        (this.showLockAndDisable = locked
          ? !!(locked.isLocked && locked.message)
          : false)
    )
  );

  encodedReferralId: string;
  isLockedReferral: FusionReferralAuthorizationLocked;
  showLockAndDisable: boolean = false;
  currentlyLock: boolean = false;
  fusionFormArraySubscription: Subscription;
  fusionFormArray: FormArray = new FormArray([]);
  abmFusionParentFormGroup = new FormGroup({});
  abmLanguageAuthorizationFormGroup = new FormGroup({});
  abmFusionFormGroup = new FormGroup({});
  submitClickedBefore: false;
  faExclamationTriangle = faExclamationTriangle;

  faLock = faLock;
  fusionDocuments$ = of([
    {
      file: null,
      fileName: 'some file',
      submittedBy: 'some person',
      fileSize: 2,
      submitDate: 'toady'
    }
  ]);
  fusionAuthorizationReasons$: Observable<
    AuthorizationReasons
  > = this.store$.pipe(select(getFusionAuthorizationReasons));

  // Get the Claim statuses for the Important Notice
  abmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getAbmClaimStatus)
  );

  // Errors
  submitErrors: string[] = [];
  submitStatus: number;
  private validationErrors: ErrorMessage[];
  displayValidationErrors: ErrorMessage[];
  validationErrorMessages$: Observable<ErrorMessage[]> =
    this.formValidationExtractorService.errorMessages$.pipe(takeUntil(this.onDestroy$));

  constructor(
    private authorizationInformationService: AuthorizationInformationService,
    private store$: Store<RootState>,
    private changeDetectorRef: ChangeDetectorRef,
    private claimService: ClaimsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public formValidationExtractorService: FormValidationExtractorService
  ) {
    super();
    this.store$.dispatch(restoreFusionAuthorizationState());
    this.abmFusionParentFormGroup = this.authorizationInformationService.abmFusionFormGroup;
    this.abmFusionFormGroup = this.authorizationInformationService.abmFusionFormGroup;
    this.fusionFormArray = this.authorizationInformationService.fusionFormArray;
    this.validationErrorMessages$.subscribe((errors) => {
      this.displayValidationErrors = errors;
    });
  }

  fetchEvents() {
    this.isReferralAuthLoaded$.subscribe(isReferralAuthLoaded => {
      this.isReferralAuthLoadedSubject$.next(isReferralAuthLoaded);
    });

    this.isReferralAuthLoading$.subscribe(isReferralAuthLoading => {
      this.isReferralAuthLoadingSubject$.next(isReferralAuthLoading);
    });

    this.referralArchetype$.subscribe(referralauthArchetype => {
      this.referralArchetypeSubject$.next(referralauthArchetype);
    })

    this.referralAuthorizationAction$.subscribe(action => {
      this.referralAuthorizationActionSubject$.next(action);
    });
  }

  ngOnInit() {

    this.fetchEvents();

    this.displayValidationErrors = this.validationErrors;
    combineLatest([
      this.isReferralAuthLoadedSubject$,
      this.isReferralAuthLoadingSubject$,
      this.store$.pipe(select(getEncodedCustomerId)),
      this.store$.pipe(select(getEncodedReferralId)),
      this.store$.pipe(select(getEncodedClaimNumber)),
      this.referralArchetypeSubject$,
      this.referralAuthorizationActionSubject$
    ])
      .pipe(first())
      .subscribe(
        ([
          isLoaded,
          isLoading,
          encodedCustomerId,
          encodedReferralId,
          encodedClaimNumber,
          archetype,
          referralAuthorizationAction
        ]: [
          boolean,
          boolean,
          string,
          string,
          string,
          ReferralAuthorizationArchetype,
          ReferralAuthorizationAction
        ]) => {
          this.encodedReferralId = encodedReferralId;
          // Lock/Unlock Authorization and notes-only request only for Fusion
          if (archetype !== ReferralAuthorizationArchetype.Transportation) {
            this.store$.dispatch(
              loadFusionAuthReasons({
                encodedCustomerId
              })
            );
            if (!this.currentlyLock) {
              this.setFusionLockingUnlockigAuthorizationState(
                encodedReferralId
              );
            }
          }

          this.loadReferralAuthorizationInformationDetails(
            archetype,
            encodedReferralId,
            encodedCustomerId,
            encodedClaimNumber,
            referralAuthorizationAction
          )
        }
      );

    /**
     * Switched isLoaded depending on archetype
     */
    this.isReferralAuthLoading$
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged()
      )
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
        this.changeDetectorRef.detectChanges();
      });
    /**
     * Switched isLoading depending on archetype
     */
    this.isReferralAuthLoaded$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isLoaded) => {
        this.isLoaded = isLoaded;
        this.changeDetectorRef.detectChanges();
      });
    /**
     * This does the same thing as marks original approach, which is,
     * only run when isLoaded changes to a new value AND
     * only set the AuthorizationSet when isLoaded switches to TRUE
     *
     * The reason for the change is that fusion needs a separate isLoaded flag
     * that is set outside of a core process
     */
    this.store$
      .pipe(
        select(getReferralAuthorizationState),
        takeUntil(this.onDestroy$),
        distinctUntilChanged((a, b) => a.isLoaded === b.isLoaded),
        filter((authState) => authState.isLoaded),
        map((authState) => authState.referralAuthorizationSet)
      )
      .subscribe((referralAuthorizationSet) => {
        this.referralAuthorizationSet = _.cloneDeep(referralAuthorizationSet);
        this.changeDetectorRef.detectChanges();
      });

    combineLatest([this.fusionSubmitErrors$, this.fusionSubmitStatus$])
      .pipe(
        distinctUntilChanged(isEqual),
        mergeMap(([errors, status]) => {
          this.submitStatus = status;
          if (errors && errors.length > 0) {
            this.submitErrors = errors;
            if (this.submitStatus === 409) {
              return this._snackBar
                .open(this.submitErrors[0], 'CLICK TO REFRESH', {
                  panelClass: ['snackbar', 'danger', 'error-snackbar']
                })
                .onAction();
            }
          }
          return of();
        })
      )
      .subscribe(() => window.location.reload());

    this.fusionSubmitResponse$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((response) => {
        if (response !== undefined) {
          if (response) {
            this.router.navigate(['../review'], {
              relativeTo: this.activatedRoute
            });
          } else {
            this.claimService.showSnackBar(
              'Unable to Submit Authorization at this time',
              false
            );
          }
        }
      });
  }

  // waits until isLoaded and isLoading are false and then fetches referral authorizations.
  async loadReferralAuthorizationInformationDetails(
    archetype,
    encodedReferralId,
    encodedCustomerId,
    encodedClaimNumber,
    referralAuthorizationAction
  ) {

    await this.until(_ => !this.isLoaded === false && !this.isLoading == false);
    this.authorizationInformationService.dispatchGetReferralAuthorization(
        archetype,
        encodedReferralId,
        encodedCustomerId,
        encodedClaimNumber,
        referralAuthorizationAction === ReferralAuthorizationAction.AUTHORIZE
      );
  }

  until(conditionFunction){
    const poll = resolve => {
      if (conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 100);

      return new Promise(poll);
    }
  }

  setFusionLockingUnlockigAuthorizationState(encodedReferralId: string) {
    combineLatest([this.isLockedReferral$, this.fusionFormArray.valueChanges])
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged(
          (
            [referralLocked1, formArrayChanges1],
            [referralLocked2, formArrayChanges2]
          ) =>
            formArrayChanges1 &&
            formArrayChanges2 &&
            referralLocked1.isLocked === referralLocked2.isLocked &&
            referralLocked1.message === referralLocked2.message &&
            formArrayChanges1.length === formArrayChanges2.length
        )
      )
      .subscribe(([referralLocked, formArrayChanges]) => {
        this.isLockedReferral = referralLocked;
        if (this.showLockAndDisable) {
          this.fusionFormArray.controls.forEach(
            (abstractControl: AbstractControl) => abstractControl.disable()
          );
        }

        if (
          this.isLockedReferral.isLocked &&
          !this.showLockAndDisable &&
          (!this.fusionFormArraySubscription ||
            (this.fusionFormArraySubscription &&
              this.fusionFormArraySubscription.closed))
        ) {
          this.fusionFormArraySubscription = this.router.events
            .pipe(
              takeUntil(this.onDestroy$),
              filter((event) => event instanceof NavigationStart),
              distinctUntilChanged(
                (e1, e2) =>
                  (e1 as NavigationStart).url === (e2 as NavigationStart).url
              )
            )
            .subscribe((event) => {
              if (event instanceof NavigationStart) {
                this.store$.dispatch(
                  unlockFusionAuthorization({
                    encodedReferralId: this.encodedReferralId
                  })
                );
                this.currentlyLock = false;
              }
            });
        }
      });
    this.store$.dispatch(lockFusionAuthorization({ encodedReferralId }));
    this.currentlyLock = true;
  }

  @HostListener('window:unload', ['$event'])
  onWindowClose(event: any): void {
    if (
      this.isLockedReferral &&
      this.isLockedReferral.isLocked &&
      !this.showLockAndDisable
    ) {
      this.store$.dispatch(
        unlockFusionAuthorization({ encodedReferralId: this.encodedReferralId })
      );
      this.currentlyLock = false;
    }
  }

  setSubmittedClickedBefore($event) {
    this.submitClickedBefore = $event;
  }
  goToElement(el: HTMLElement) {
    el.scrollIntoView({ block: 'center', inline: 'center' });
    el.focus();
  }
}
