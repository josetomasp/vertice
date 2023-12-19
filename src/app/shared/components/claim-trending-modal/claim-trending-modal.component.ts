import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';

import { RootState } from '../../../store/models/root.models';
import {
  getRiskTrendingClaimNumber,
  getRiskTrendingModalIsLoading
} from '@shared/store/selectors';
import { ClaimSearchClaim } from '@shared/store/models';
import { Router } from '@angular/router';
import { generateMakeAReferralServiceSelectionUrl } from '@shared/lib/links';
import { getUserInfo } from '../../../user/store/selectors/user.selectors';
import { first } from 'rxjs/operators';

export interface TrendingRiskModalClosedResponse {
  selectedAction: { type: string; action: string; url: string };
  claimNumber: string;
}

@Component({
  selector: 'healthe-claim-trending-modal',
  templateUrl: './claim-trending-modal.component.html',
  styleUrls: ['./claim-trending-modal.component.scss']
})
export class ClaimTrendingModalComponent implements OnInit {
  isLoading$ = this.store$.pipe(select(getRiskTrendingModalIsLoading));
  trendingRiskClaimNumber$ = this.store$.pipe(
    select(getRiskTrendingClaimNumber)
  );
  selectedAction;

  componentGroupName = 'claimTrendingModal';
  demoErrorMessage: string = 'This option should only be available for DEMO users. If you see this as any other user please send an email to jmontgomery@healthesystems.com';

  constructor(
    public store$: Store<RootState>,
    public dialogRef: MatDialogRef<ClaimTrendingModalComponent>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: ClaimSearchClaim
  ) {
    dialogRef.disableClose = true;
  }

  requestAction() {
    if (this.selectedAction) {
      switch (this.selectedAction.type) {
        case 'makeAReferral':
          console.error(this.demoErrorMessage);
          this.dialogRef.close();
          this.store$.select(getUserInfo).pipe((first())).subscribe(userInfo =>
            this.router.navigate(
              [generateMakeAReferralServiceSelectionUrl(
                userInfo.customerID,
                this.data.claimNumber)]));
          break;
        case 'mobileAppInvite':
          window.alert(this.demoErrorMessage);
          break;
        default:
          const url = this.selectedAction.url;
          if (url) {
            window.open(url, '_blank');
          }
          this.dialogRef.close({
            claimNumber: this.data.claimNumber,
            selectedAction: this.selectedAction
          });
      }
    }
  }

  ngOnInit() {
  }

  getTagColor(riskLevelNumber: any) {
    switch (riskLevelNumber) {
      case 5:
        return 'highest-risk';
      case 4:
        return 'high-risk';
      case 3:
        return 'medium-risk';
      case 2:
        return 'low-risk';
      case 1:
        return 'lowest-risk';
      default:
        return '';
    }
  }
}
