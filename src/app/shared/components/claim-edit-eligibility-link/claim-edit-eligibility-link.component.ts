import { Component, Input, OnInit } from '@angular/core';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';

@Component({
  selector: 'healthe-claim-edit-eligibility-link',
  templateUrl: './claim-edit-eligibility-link.component.html',
  styleUrls: ['./claim-edit-eligibility-link.component.scss']
})
export class ClaimEditEligibilityLinkComponent implements OnInit {
  url: string =
    '/HesDashboard/common.jsp#CLAIM;claimNum={claimNumber};cust={customerId}';

  constructor() {}

  @Input()
  decodedClaimNumber: string;

  @Input()
  decodedCustomerId: string;

  @Input()
  linkId:
    | 'apportionment'
    | 'height'
    | 'weight'
    | 'longTermCare'
    | 'abmTerminatedDate'
    | 'pbmTerminatedDate'
    | 'abmInactiveDate'
    | 'pbmInactiveDate';

  ngOnInit() {
    this.url = this.url.replace('{claimNumber}', this.decodedClaimNumber);
    this.url = this.url.replace('{customerId}', this.decodedCustomerId);
  }

  editEligibilityElement(): void {
    openCenteredNewWindowDefaultSize(this.url);
  }

  isInactiveDate(): boolean {
    return (
      this.linkId === 'abmInactiveDate' || this.linkId === 'pbmInactiveDate'
    );
  }
}
