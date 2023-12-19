import { Component, Input, OnInit } from '@angular/core';
import { faClipboardList } from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'healthe-referral-reason-for-review',
  templateUrl: './referral-reason-for-review.component.html',
  styleUrls: ['./referral-reason-for-review.component.scss']
})
export class ReferralReasonForReviewComponent implements OnInit {
  @Input()
  idIndex;

  @Input()
  reasons: string[];

  panelExpanded = false;
  panelHeaderHeight = '';
  faClipboardList = faClipboardList;
  constructor() {}

  ngOnInit() {}
}
