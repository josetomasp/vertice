import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  AuthNarrativeMode,
  NarrativeTextItem
} from '../../../../../../referral-authorization.models';

@Component({
  selector: 'healthe-narrative-quantity-used',
  templateUrl: './narrative-quantity-used.component.html',
  styleUrls: ['./narrative-quantity-used.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NarrativeQuantityUsedComponent implements OnInit {
  @Input()
  narrativeTextItem: NarrativeTextItem;

  @Input()
  authNarrativeMode: AuthNarrativeMode;

  @Input()
  chosenAction: string;

  limitValue: string;

  quantityUsed: string = '';

  constructor() {}

  ngOnInit() {
    if (this.narrativeTextItem.originalLimit != null) {
      this.quantityUsed = this.narrativeTextItem.originalLimit.toString();
    } else {
      // While there is a 'unlimited' flag in auth data, the rational here is that
      // original limit should only ever be null in the unlimited case.
      this.quantityUsed = 'unlimited';
    }
    if (
      !this.narrativeTextItem.limitValue &&
      this.narrativeTextItem.limitValue !== 0
    ) {
      this.limitValue = '<#>';
    } else {
      this.limitValue = this.narrativeTextItem.limitValue.toString();
    }
  }
}
