import { Component, Input, OnInit } from '@angular/core';
import {
  ReferralAuthorizationTypeCode
} from '../../../../../../../referral-authorization.models';

@Component({
  selector: 'healthe-transportation-detailed-post-submit-header',
  templateUrl: './transportation-detailed-post-submit-header.component.html',
  styleUrls: ['./transportation-detailed-post-submit-header.component.scss']
})
export class TransportationDetailedPostSubmitHeaderComponent implements OnInit {
  @Input()
  authItem: any;

  @Input()
  index: number;

  ReferralAuthorizationTypeCode = ReferralAuthorizationTypeCode;

  constructor() {}

  ngOnInit() {}
}
