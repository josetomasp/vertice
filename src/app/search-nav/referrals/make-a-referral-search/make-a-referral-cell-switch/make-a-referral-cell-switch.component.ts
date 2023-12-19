import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { hexEncode } from '@shared';
import { ClaimResult } from '../../../../claims/abm/referral/store/models/claimResult.model';

@Component({
  selector: 'healthe-make-a-referral-cell-switch',
  templateUrl: './make-a-referral-cell-switch.component.html',
  styleUrls: ['./make-a-referral-cell-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakeAReferralCellSwitchComponent implements OnInit {
  @Input() customerID: string;
  @Input()
  element: ClaimResult;
  @Input()
  index: number;
  @Input()
  name: string;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToMakeAReferral(element: ClaimResult): void {
    this.router.navigate([
      './claims',
      hexEncode(this.customerID),
      hexEncode(element.claimNumber),
      'referral',
      'serviceSelection'
    ]);
  }

  goToClaimView(element: ClaimResult) {
    this.router.navigate([
      'claimview',
      hexEncode(this.customerID),
      hexEncode(element.claimNumber)
    ]);
  }
}
