import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, first, map, tap } from 'rxjs/operators';
import { ReferralRoutes } from '../../store/models/referral.models';
import {
  getMakeReferralValidFormStates,
  getSelectableServices
} from '../../store/selectors/makeReferral.selectors';
import { combineLatest, Observable, zip } from 'rxjs';
import { ActiveReferralsModalService } from '@shared/components/active-referrals-modal/active-referrals-modal.service';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MakeReferralState,
  REFERRAL_REQUESTOR_INFORMATION
} from '../../store/models/make-a-referral.models';
import { PageTitleService } from '@shared/service/page-title.service';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../store/selectors/router.selectors';
import { MakeAReferralHelperService } from '../make-a-referral-helper.service';
import {
  getAbmClaimStatus,
  isMARAllowed
} from '@shared/store/selectors/claim.selectors';
import { ClaimStatusEnum } from '@healthe/vertice-library';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { isEqual } from 'lodash';
import { isUserInternal } from '../../../../../user/store/selectors/user.selectors';

@Component({
  selector: 'healthe-service-selection',
  templateUrl: './service-selection.component.html',
  styleUrls: ['./service-selection.component.scss']
})
export class ServiceSelectionComponent implements OnInit {
  @ViewChild('selectAllCheckbox')
  selectAllCheckbox: MatCheckbox;

  encodedClaimNumber$ = this.store$.pipe(
    select(getEncodedClaimNumber),
    first()
  );
  encodedCustomerId$ = this.store$.pipe(
    select(getEncodedCustomerId),
    first()
  );

  checkboxGroup = new FormGroup({});
  selectableServices$ = this.store$.pipe(
    select(getSelectableServices),
    tap((selectableServices) =>
      selectableServices.forEach((service) =>
        this.checkboxGroup.addControl(
          service.serviceType,
          new FormControl(false)
        )
      )
    )
  );

  ClaimStatusEnum = ClaimStatusEnum;

  abmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getAbmClaimStatus)
  );

  isMARAllowed$ = this.store$.pipe(select(isMARAllowed));

  hiddenControl = new FormControl(
    this.mapItems(this.checkboxGroup.value),
    Validators.required
  );
  faExclamationTriangle = faExclamationTriangle;

  isNextDisabled$ = combineLatest([
    this.store$.pipe(select(getMakeReferralValidFormStates)),
    this.hiddenControl.valueChanges,
    this.store$.pipe(select(isUserInternal))
  ]).pipe(
    distinctUntilChanged(isEqual),
    map(([validFormStates, hiddenControlValue, userIsInternal]) => {
      if (hiddenControlValue.length === 0) {
        return true;
      }
      return userIsInternal
        ? !validFormStates.includes(REFERRAL_REQUESTOR_INFORMATION)
        : false;
    })
  );

  constructor(
    public store$: Store<MakeReferralState>,
    public activeReferralModalService: ActiveReferralsModalService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private pageTitleService: PageTitleService,
    private makeAReferralHelperService: MakeAReferralHelperService
  ) {
    this.pageTitleService.setTitleWithClaimNumber('Make a Referral');
  }

  isNextDisabled = true;
  ngOnInit() {
    this.isNextDisabled$.subscribe(
      (disabled) => (this.isNextDisabled = disabled)
    );
    this.checkboxGroup.valueChanges.subscribe((checkbox) => {
      this.hiddenControl.setValue(this.mapItems(checkbox));
      if (this.selectAllCheckbox && this.selectAllCheckbox.checked) {
        this.selectAllCheckbox.checked = false;
      }

      if (
        Object.keys(this.checkboxGroup.getRawValue()).length ===
        this.mapItems(this.checkboxGroup.getRawValue()).length
      ) {
        this.selectAllCheckbox.checked = true;
      }
    });
  }

  /**
   * @description this gets the array of keys from an object and returns those that have true as a value
   * @param checkboxGroup
   */
  mapItems(checkboxGroup) {
    return Object.keys(checkboxGroup).filter(
      (serviceType) => checkboxGroup[serviceType]
    );
  }

  goToServiceDetailSelection() {
    zip(this.encodedCustomerId$, this.encodedClaimNumber$).subscribe(
      ([encodedCustomerId, encodedClaimNumber]) => {
        const services = this.mapItems(this.checkboxGroup.value);
        this.makeAReferralHelperService.prepareServices(
          services,
          encodedCustomerId,
          encodedClaimNumber
        );

        this.router.navigate([`../${ReferralRoutes.Create}`], {
          relativeTo: this.activeRoute
        });
      }
    );
  }

  showActiveReferralsModal(activeReferrals, serviceType) {
    zip(this.encodedCustomerId$, this.encodedClaimNumber$)
      .pipe(first())
      .subscribe(([customerId, claimNumber]) => {
        this.activeReferralModalService.showModal(
          activeReferrals,
          customerId,
          claimNumber,
          serviceType
        );
      });
  }

  selectAll() {
    Object.keys(this.checkboxGroup.getRawValue()).forEach((checkbox) =>
      this.checkboxGroup
        .get(checkbox)
        .setValue(!this.selectAllCheckbox.checked, { emitEvent: false })
    );

    setTimeout(() => {
      this.checkboxGroup.updateValueAndValidity();
    }, 100);
  }

  goBack() {
    window.history.back();
  }
}
