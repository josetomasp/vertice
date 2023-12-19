import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'healthe-make-a-referral-review-section',
  templateUrl: './make-a-referral-review-section.component.html',
  styleUrls: ['./make-a-referral-review-section.component.scss']
})
export class MakeAReferralReviewSectionComponent implements OnInit {
  @Input()
  service: string;

  constructor() {}

  ngOnInit() {}
}
