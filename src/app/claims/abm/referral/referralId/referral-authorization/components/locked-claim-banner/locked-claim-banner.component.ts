import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { faLock } from '@fortawesome/pro-regular-svg-icons';

@Component({
  selector: 'healthe-locked-claim-banner',
  templateUrl: './locked-claim-banner.component.html',
  styleUrls: ['./locked-claim-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LockedClaimBannerComponent {
  faLock = faLock;
  @Input()
  lockedBy: string;
}
