import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'healthe-reassignment-referral-banner',
  templateUrl: './reassignment-referral-banner.component.html',
  styleUrls: ['./reassignment-referral-banner.component.scss']
})
export class ReassignmentReferralBannerComponent implements OnInit {
  @Input()
  reassignmentMessage: string;

  constructor() {}

  ngOnInit() {}
}
