import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  faAmbulance,
  faCarAlt,
  faExclamationTriangle,
  faHotel,
  faPlaneDeparture,
  faWheelchair
} from '@fortawesome/pro-light-svg-icons';
import { select, Store } from '@ngrx/store';
import { generateABMReferralTimeOptions, TimeOption } from '@shared';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { PageTitleService } from '@shared/service/page-title.service';
import { Observable } from 'rxjs';
import { first, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { MakeAReferralService } from 'src/app/claims/abm/referral/make-a-referral/make-a-referral.service';
import { RootState } from 'src/app/store/models/root.models';

import { getDecodedReferralId } from '../../../../../../../store/selectors/router.selectors';
import { TRANSPORTATION_ARCH_TYPE } from '../../../../make-a-referral/transportation/transportation-step-definitions';
import {
  GetTransportationOptions,
  GetTransportationTypes
} from '../../../../store/actions/make-a-referral.actions';
import {
  getApprovedLocations,
  getServiceOptions
} from '../../../../store/selectors/makeReferral.selectors';
import {
  getReferralAuthorizationSet,
  isAuthorizationIsSuccessfullySubmitted
} from '../../../../store/selectors/referral-authorization.selectors';
import { AuthorizationInformationService } from '../../authorization-information.service';
import {
  ReferralAuthorization,
  ReferralAuthorizationAction,
  ReferralAuthorizationItem,
  ReferralAuthorizationSet,
  ReferralAuthorizationType,
  ReferralAuthorizationTypeCode
} from '../../referral-authorization.models';
import { CreateNewAuthorizationService } from './components/createNewAuthorization/create-new-authorization.service';
import { NoteOriginator, ReferralNote } from '../../../../store/models';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

export interface ErrorBannerMessages {
  title: string;
  errors: string[];
}

@Component({
  selector: 'healthe-transportation-authorization',
  templateUrl: './transportation-authorization.component.html',
  styleUrls: ['./transportation-authorization.component.scss']
})
export class TransportationAuthorizationComponent extends DestroyableComponent
  implements OnInit, OnChanges, OnDestroy {
  ReferralAuthorizationActionEnum = ReferralAuthorizationAction;
  //#region   Public Properties`
  @Input()
  referralAuthorizationSet: ReferralAuthorizationSet;
  @Input()
  set referralAuthorizationAction(input: ReferralAuthorizationAction) {
    this._referralAuthorizationAction = input;
    this.setUpTransportationDetailsToggle();
  }
  get referralAuthorizationAction(): ReferralAuthorizationAction {
    return this._referralAuthorizationAction;
  }
  _referralAuthorizationAction: ReferralAuthorizationAction;
  authData: ReferralAuthorizationItem[];
  formGroup: FormGroup = new FormGroup({
    additionalNotes: new FormControl(),
    documents: new FormControl([]),
    authItems: new FormArray([])
  });
  rush = false;
  subHeaderNote: string = '';
  timeDropdownValues: TimeOption[] = generateABMReferralTimeOptions(30);
  vendorNote: ReferralNote[] = [];
  ReferralAuthorizationType = ReferralAuthorizationType;
  _isAuthorizationIsSuccessfullySubmitted = false;
  errorBannerErrors: string[] = [];
  errorBannerTitle = '';
  isCancelOnly: boolean = false;
  isReadOnlyForm: boolean = false;

  NoteOriginator = NoteOriginator;

  transportationLocations$ = this.store$.pipe(
    select(getApprovedLocations('transportation'))
  );

  referralId$: Observable<string> = this.store$.pipe(
    select(getDecodedReferralId)
  );

  claimV2OneTimeDispatch = true;
  //#endregion

  //#region   Icons
  faExclamationTriangle = faExclamationTriangle;

  //#endregion

  @ViewChild(ErrorBannerComponent)
  errorBanner: ErrorBannerComponent;

  constructor(
    private authorizationActionsService: AuthorizationInformationService,
    private createNewAuthorizationServiceService: CreateNewAuthorizationService,
    private store$: Store<RootState>,
    public changeDetectorRef: ChangeDetectorRef,
    private makeAReferralService: MakeAReferralService,
    private pageTitleService: PageTitleService
  ) {
    super();

    this.referralId$.pipe(first()).subscribe((referralId) => {
      this.pageTitleService.setTitleWithClaimNumber(
        'Authorization',
        'Referral - ' + referralId
      );
    });

    this.store$
      .pipe(
        select(isAuthorizationIsSuccessfullySubmitted),
        takeUntil(this.onDestroy$)
      )
      .subscribe((value) => {
        if (value !== this._isAuthorizationIsSuccessfullySubmitted) {
          this._isAuthorizationIsSuccessfullySubmitted = value;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    this.makeAReferralService.claimV2$
      .pipe(takeWhile(() => this.claimV2OneTimeDispatch))
      .subscribe((claimV2) => {
        if (claimV2 && claimV2.stateOfVenue !== '') {
          this.store$.dispatch(new GetTransportationOptions(null));
          this.claimV2OneTimeDispatch = false;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['referralAuthorizationSet'] &&
      changes['referralAuthorizationSet'].currentValue &&
      !this.authData
    ) {
      /**
       * Moved this out of ngOnInit so that it only builds if there's actually
       * a current value.
       *
       * I have it checking for the existence of authData to prevent this from running
       * again.
       */
      this.store$
        .pipe(
          select(getServiceOptions(TRANSPORTATION_ARCH_TYPE)),
          first()
        )
        .subscribe((transOptions) => {
          if (false === transOptions.isLoaded) {
            this.store$.dispatch(new GetTransportationTypes(null));
          }
        });

      this.formGroup.statusChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          this.authorizationActionsService.isAuthInformationValid.next(
            this.formGroup.valid
          );
        });

      this.authData = this.buildAuthData(
        this.referralAuthorizationSet.referralAuthorization
      );

      this.createNewAuthorizationServiceService.reloadAuthItems$
        .pipe(
          switchMap(() =>
            this.store$.pipe(
              select(getReferralAuthorizationSet),
              first()
            )
          ),
          takeUntil(this.onDestroy$)
        )
        .subscribe((referralAuthorizationSet) => {
          this.referralAuthorizationSet.referralAuthorization =
            referralAuthorizationSet.referralAuthorization;

          this.authData = this.buildAuthData(
            referralAuthorizationSet.referralAuthorization
          );
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  ngOnDestroy(): void {
    this.claimV2OneTimeDispatch = false;
  }

  //#endregion

  denialSubmitReset() {
    const authItems: FormArray = this.formGroup.controls[
      'authItems'
    ] as FormArray;
    const formGroup0: FormGroup = authItems.at(0) as FormGroup;

    const AuthAction_ApprovalType =
      formGroup0.controls['AuthAction_ApprovalType'].value;
    const AuthAction_ApprovalReason =
      formGroup0.controls['AuthAction_ApprovalReason'].value;

    formGroup0.patchValue(
      this.referralAuthorizationSet.referralAuthorization
        .originalAuthorizationItems[0].formGroup.value
    );

    formGroup0.patchValue({
      AuthAction_ApprovalType,
      AuthAction_ApprovalReason
    });
  }

  setIconAndTitle(item: ReferralAuthorizationItem) {
    const suffix = 'Transportation';

    switch (item.authData.authorizationTypeCode) {
      case ReferralAuthorizationTypeCode.DETAILED_FLIGHT:
        item.icon = faPlaneDeparture;
        item.title = 'Flight ' + suffix;
        break;

      case ReferralAuthorizationTypeCode.DETAILED_LODGING:
        item.icon = faHotel;
        item.title = 'Lodging ' + suffix;
        break;

      case ReferralAuthorizationTypeCode.DETAILED_OTHER:
      case ReferralAuthorizationTypeCode.OPEN_OTHER:
        item.icon = faAmbulance;
        item.title = 'Other ' + suffix;
        break;

      case ReferralAuthorizationTypeCode.DETAILED_SEDAN:
      case ReferralAuthorizationTypeCode.OPEN_SEDAN:
        item.icon = faCarAlt;
        item.title = 'Sedan ' + suffix;
        break;

      case ReferralAuthorizationTypeCode.DETAILED_WHEELCHAIR:
      case ReferralAuthorizationTypeCode.OPEN_WHEELCHAIR:
        item.icon = faWheelchair;
        item.title = 'Wheelchair ' + suffix;
        break;

      default:
        item.icon = faExclamationTriangle;
        item.title = 'Unknown kind of item';
    }
  }

  //#region   Private Properties
  private buildAuthData(
    data: ReferralAuthorization
  ): ReferralAuthorizationItem[] {
    const allAuthorizationItems: ReferralAuthorizationItem[] = [];

    // When adding items, we need to clear out the old form controls.
    (this.formGroup.controls['authItems'] as FormArray).clear();

    this.vendorNote = data.vendorNote;
    this.subHeaderNote = data.subHeaderNote;
    let rush = false;

    data.authorizationItems.forEach((item) => {
      allAuthorizationItems.push(item);
      rush = rush || item.authData.rush;
      this.setIconAndTitle(item);

      const authorizationFormGroup = new FormGroup({});

      item.formGroup = authorizationFormGroup;
      (this.formGroup.controls['authItems'] as FormArray).push(
        authorizationFormGroup
      );
    });

    this.rush = rush;

    return allAuthorizationItems;
  }

  //#endregion
  setSubmissionErrors(submissionErrors: ErrorBannerMessages) {
    this.errorBannerErrors = submissionErrors.errors;
    this.errorBannerTitle = submissionErrors.title;
    this.errorBanner.elementRef.nativeElement.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    });
  }
  setUpTransportationDetailsToggle() {
    this.isCancelOnly =
      this._referralAuthorizationAction ===
      ReferralAuthorizationAction.CANCEL_ONLY;

    this.isReadOnlyForm =
      this._referralAuthorizationAction ===
        ReferralAuthorizationAction.NOTHING ||
      this._referralAuthorizationAction ===
        ReferralAuthorizationAction.CANCEL_ONLY
        ? true
        : false;

    if (this.isReadOnlyForm) {
      this.formGroup.disable();
    }
  }
}
