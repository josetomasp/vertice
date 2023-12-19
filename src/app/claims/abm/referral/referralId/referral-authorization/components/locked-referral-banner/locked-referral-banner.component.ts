import { Component, Input } from '@angular/core';
import { faLock } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'healthe-locked-referral-banner',
  templateUrl: './locked-referral-banner.component.html',
  styleUrls: ['./locked-referral-banner.component.scss']
})
export class LockedReferralBannerComponent {
  faLock = faLock;
  @Input()
  lockedMessage: string;
}
