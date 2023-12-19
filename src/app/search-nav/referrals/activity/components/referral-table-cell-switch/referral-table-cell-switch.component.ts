import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { hexEncode } from '@shared';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';
import {
  generate3_0ABMReferralActivityTabUrl,
  generate3_0ABMReferralAuthorizationTabUrl
} from '@shared/lib/links';
import { getAncilliaryServiceCodeFromServiceName } from 'src/app/claims/abm/referral/make-a-referral/make-a-referral-shared';
import { NavigationLinkingService } from '../../../../navigation-linking.service';
import { NavReferral } from '../../../../store/models/nav-referral.model';

@Component({
  selector: 'healthe-referral-table-cell-switch',
  templateUrl: './referral-table-cell-switch.component.html',
  styleUrls: ['./referral-table-cell-switch.component.scss']
})
export class ReferralTableCellSwitchComponent implements OnInit {
  @Input()
  customerID: string;
  @Input()
  element: NavReferral;
  @Input()
  index: number;
  @Input()
  name: string;

  constructor(
    private router: Router,
    public navigationLinkingService: NavigationLinkingService
  ) {}

  ngOnInit(): void {}

  goToClaimView(element: NavReferral) {
    this.router.navigate([
      'claimview',
      hexEncode(this.customerID),
      hexEncode(element.claimNumber)
    ]);
  }

  referralClickNavigation(element: NavReferral): void {
    // If it's an RFS, go to the old 2.5 screen
    if (element.isRFS) {
      // Unless it's a draft, then complete draft
      if (element.status === 'Draft') {
        this.navigationLinkingService.gotoDraft(
          element.serviceType,
          element.referralId
        );
      } else {
        openCenteredNewWindowDefaultSize(
          '/abm/index.jsp?header=stripeonly#RFS;rfsId=' +
            element.referralId +
            ';fromPage=RFSSearch'
        );
      }
    } else {
      // Future state
      const serviceCode = getAncilliaryServiceCodeFromServiceName(
        element.serviceType ? element.serviceType.trim() : element.serviceType
      );
      let url = '';

      if (element.status === 'UNAUTHORIZED') {
        url = generate3_0ABMReferralAuthorizationTabUrl(
          this.customerID,
          element.claimNumber,
          element.referralId.toString(),
          serviceCode,
          element.legacyReferral
        );
      } else {
        url = generate3_0ABMReferralActivityTabUrl(
          this.customerID,
          element.claimNumber,
          element.referralId.toString(),
          serviceCode,
          element.legacyReferral
        );
      }

      this.router.navigate([url]);
    }
  }
}
