import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { hexEncode } from '@shared';
import { first, map } from 'rxjs/operators';
import { RootState } from '../../../../store/models/root.models';
import * as fromUser from '../../../../user/store/selectors/user.selectors';
import { ClaimSearchClaim } from '@shared/store/models';

@Component({
  selector: 'healthe-claim-search-cell-switch',
  templateUrl: './claim-search-cell-switch.component.html',
  styleUrls: ['./claim-search-cell-switch.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimSearchCellSwitchComponent implements OnInit {
  @Input()
  name: string;
  @Input()
  index: number;
  @Input()
  element: ClaimSearchClaim;

  constructor(public store$: Store<RootState>, public router: Router) {}

  ngOnInit() {}

  goToClaimView(element: any) {
    this.store$
      .pipe(
        select(fromUser.getUserInfo),
        map((user) => user.customerID),
        first()
      )
      .subscribe((customerID) => {
        this.router
          .navigate([
            'claimview',
            hexEncode(customerID),
            hexEncode(element.claimNumber)
          ])
          .then();
      });
  }

  openTrendingRiskModal(element: ClaimSearchClaim) {}
}
