import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ReferralRoutes } from '../../../store/models/referral.models';

@Component({
  selector: 'healthe-retry-banner',
  templateUrl: './retry-banner.component.html',
  styleUrls: ['./retry-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RetryBannerComponent implements OnInit {
  @Input() errorsLength = 1;
  constructor(private router: Router, private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  doRetry(): void {
    this.router.navigate([`../${ReferralRoutes.Create}`], {
      relativeTo: this.activeRoute
    });
  }
}
