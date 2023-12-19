import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  faBan,
  faCheck,
  faClock,
  IconDefinition
} from '@fortawesome/pro-light-svg-icons';
import { select, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { getOpenAuthData } from 'src/app/claims/abm/referral/store/selectors/referral-authorization.selectors';
import { RootState } from 'src/app/store/models/root.models';

import { FeatureFlagService } from '../../../../../../../../../../customer-configs/feature-flag.service';
import { ClaimLocation } from '../../../../../../../store/models/make-a-referral.models';
import {
  AuthApprovalState,
  ReferralAuthorizationItem
} from '../../../../../referral-authorization.models';

@Component({
  selector: 'healthe-transportation-open-post-submit',
  templateUrl: './transportation-open-post-submit.component.html',
  styleUrls: ['./transportation-open-post-submit.component.scss']
})
export class TransportationOpenPostSubmitComponent implements OnInit {
  @Input()
  formValues: any;
  // for formValue['additionalNotes'] -> right now there's nothing on the sotre
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;

  @Input()
  claimLocations: ClaimLocation[];

  REFERRAL_AUTH_REVIEW_SECTION_ID = 'referral-auth-review-section-copy-section';
  faCheck = faCheck;
  additionalNotes: any;
  authItem0: any;

  AuthApprovalState = AuthApprovalState;
  statusIcon: IconDefinition;
  approvalType: AuthApprovalState;
  approvalTypeName: string;
  approvalReason: string;
  totalNumberOfTrips: string;

  locations: string[] = [];

  constructor(
    private snackbar: MatSnackBar,
    private store$: Store<RootState>,
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit() {
    this.store$
      .pipe(
        first(),
        select(getOpenAuthData)
      )
      .subscribe((data) => {
        this.authItem0 = data;
      });

    this.setApprovalStatus();
    this.setLocations();

    if (this.authItem0['unlimitedTrips']) {
      this.totalNumberOfTrips = 'Unlimited';
    } else {
      this.totalNumberOfTrips = this.authItem0['tripsAuthorized'];
    }
  }

  copyToClipboard() {
    let reviewScreenText = document.getElementById(
      this.REFERRAL_AUTH_REVIEW_SECTION_ID
    ).innerText;

    this.copyText(reviewScreenText);

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
  setLocations() {
    if (this.authItem0['noLocationRestrictions']) {
      this.locations.push('No Location Restrictions');
    } else {
      const approvedLocations = this.authItem0['approvedLocations'];
      Object.entries(approvedLocations).forEach(
        ([locationType, locationsList]) => {
          Object.entries(locationsList).forEach(([locationID, location]) => {
            if (location['locationSelected']) {
              this.locations.push(
                this.generateLocation(locationType, parseInt(locationID, 10))
              );
            }
          });
        }
      );
    }
  }

  private generateLocation(locationType: string, locationID: number) {
    let claimLocation: ClaimLocation = null;
    this.claimLocations.forEach((claimLoc) => {
      if (parseInt(claimLoc.id, 10) === locationID) {
        claimLocation = claimLoc;
      }
    });

    if (null != claimLocation) {
      return (
        locationType +
        ' - ' +
        claimLocation.name +
        ' - ' +
        claimLocation.address
      );
    }
    // This return should never actually be hit.  If it was hit, then we got some bad data sent up to us.
    return 'error';
  }

  private setApprovalStatus() {
    const approvalType = this.authItem0['AuthAction_ApprovalType'];

    this.approvalReason = this.authItem0['AuthAction_ApprovalReason'];
    switch (approvalType) {
      case AuthApprovalState.Approve:
        this.approvalType = AuthApprovalState.Approve;
        this.approvalTypeName = 'Approved';
        this.statusIcon = faCheck;
        break;
      case AuthApprovalState.Deny:
        this.approvalType = AuthApprovalState.Deny;
        this.approvalTypeName = this.featureFlagService.labelChange(
          'Denied',
          'denied'
        );
        this.statusIcon = faBan;
        break;
      case AuthApprovalState.Pending:
        this.approvalType = AuthApprovalState.Pending;
        this.approvalTypeName = 'Pend';
        this.statusIcon = faClock;
        break;
    }
  }
}
