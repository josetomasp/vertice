import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';

import { RootState } from '../../../../../store/models/root.models';
import { resetFusionMakeAReferral } from '../../store/actions/fusion/fusion-make-a-referral.actions';
import {
  GetServiceSelectionValues,
  ResetMakeAReferral
} from '../../store/actions/make-a-referral.actions';
import { ErrorSharedMakeAReferral } from '../../store/models/shared-make-a-referral.models';
import { getFormState } from '../../store/selectors/makeReferral.selectors';
import {
  getPartialFail,
  getSharedErrorsResponse,
  getShowSuccessBanner,
  getSuccessfulServices
} from '../../store/selectors/shared-make-a-referral.selectors';
import {
  getDecodedClaimNumber,
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../store/selectors/router.selectors';
import { first } from 'rxjs/operators';
import {
  getClaimBannerFields
} from '@shared/store/selectors/claim.selectors';

@Component({
  selector: 'healthe-make-a-referral-review',
  templateUrl: './make-a-referral-review.component.html',
  styleUrls: ['./make-a-referral-review.component.scss']
})
export class MakeAReferralReviewComponent implements OnInit {
  MAKE_A_REFERRAL_SECTION_ID = 'make-a-referral-review-section';

  alertType = AlertType;

  //#region   Observables

  errors$: Observable<ErrorSharedMakeAReferral[]> = this.store$.pipe(
    select(getSharedErrorsResponse)
  );

  formData$ = this.store$.pipe(select(getFormState));
  partialFail$: Observable<boolean> = this.store$.pipe(select(getPartialFail));
  showSuccessBanner$ = this.store$.pipe(select(getShowSuccessBanner));
  successfulServices$ = this.store$.pipe(select(getSuccessfulServices));
  claimNumber: string;
  claimantName: string;

  //#endregion
  constructor(
    public store$: Store<RootState>,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    combineLatest([
      this.store$.pipe(select(getDecodedClaimNumber)),
      this.store$.pipe(select(getClaimBannerFields))
    ])
      .pipe(first())
      .subscribe(([claim, fields]) => {
        this.claimNumber = claim;
        this.claimantName = fields.find(f => f.elementName === 'claimantName')?.value ?? '';
      });
  }

  makeAnotherReferral() {
    // Dispatching an action to fetch the latest service selection values so that we can update
    // the active referrals modal with the referral created just before clicking this button
    combineLatest([
      this.store$.pipe(select(getEncodedCustomerId)),
      this.store$.pipe(select(getEncodedClaimNumber))
    ])
      .pipe(first())
      .subscribe(([eCustomerId, eClaimNumber]) =>
        this.store$.dispatch(
          new GetServiceSelectionValues({
            encodedCustomerId: eCustomerId,
            encodedClaimNumber: eClaimNumber
          })
        )
      );

    this.router.navigate(['../serviceSelection'], {
      relativeTo: this.activatedRoute
    });

    // This needs a delay because the navigation above will call the various wizard components to destroy, which causes a save action.
    // We need a delay to make sure this reset happens after all those lifecycles finish.
    setTimeout(() => {
      this.store$.dispatch(new ResetMakeAReferral(null));
      this.store$.dispatch(resetFusionMakeAReferral());
    }, 100);
  }

  copyToClipboard() {
    let reviewScreenText = document.getElementById(
      this.MAKE_A_REFERRAL_SECTION_ID
    ).innerText;

    this.copyText(`Claim Number: ${this.claimNumber}
Claimant Name: ${this.claimantName}
${reviewScreenText}
    `);

    this.snackbar.open('Copied to Clipboard!', null, {
      duration: 1500,
      panelClass: ['success', 'snackbar']
    });
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
