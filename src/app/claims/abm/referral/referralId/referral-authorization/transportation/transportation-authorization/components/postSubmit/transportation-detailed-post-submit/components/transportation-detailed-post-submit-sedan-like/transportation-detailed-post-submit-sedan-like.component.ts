import { Component, Input, OnInit } from '@angular/core';
import {
  ReferralAuthorizationTypeCode
} from '../../../../../../../referral-authorization.models';
import {
  ClaimLocation
} from '../../../../../../../../../store/models/make-a-referral.models';
import {
  TransportationDetailedPostSubmitSummaryBase
} from '../TransportationDetailedPostSubmitSummaryBase';

@Component({
  selector: 'healthe-transportation-detailed-post-submit-sedan-like',
  templateUrl:
    './transportation-detailed-post-submit-sedan-like.component.html',
  styleUrls: ['./transportation-detailed-post-submit-sedan-like.component.scss']
})
export class TransportationDetailedPostSubmitSedanLikeComponent
  extends TransportationDetailedPostSubmitSummaryBase
  implements OnInit {
  @Input()
  authItem: any;

  ReferralAuthorizationTypeCode = ReferralAuthorizationTypeCode;
  fromAddress = '';
  toAddress = '';
  typeCode;

  constructor() {
    super();
  }

  ngOnInit() {
    this.authItem = this.fixAuthDataForDenail(this.authItem);

    this.fromAddress = this.generateLocationString(
      this.authItem['fromAddress']
    );
    this.toAddress = this.generateLocationString(this.authItem['toAddress']);
    this.typeCode = this.authItem['authorizationTypeCode'];
  }

  generateLocationString(location: ClaimLocation) {
    return location.type + ' - ' + location.name + ' - ' + location.address;
  }
}
