import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { RootState } from 'src/app/store/models/root.models';
import { Store } from '@ngrx/store';
import { TrendingRiskModalDataRequest } from '@shared/store/actions/trending-risk-modal.actions';

@Component({
  selector: 'healthe-risk-level-indicator',
  templateUrl: './risk-level-indicator.component.html',
  styleUrls: ['./risk-level-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RiskLevelIndicatorComponent implements OnInit {
  @Input()
  riskLevel: string;
  @Input()
  riskLevelNumber: number;
  @Input()
  daysSinceRiskLevelChange: number;
  @Input()
  riskIncreased: boolean;
  @Input()
  index: number = 0;
  @Input()
  uppyDownyEnabled: boolean = true;
  @Input()
  claimNumber: string;

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {}

  getColor() {
    switch (this.riskLevelNumber) {
      case 5:
        return 'highest-risk extended';
      case 4:
        return 'high-risk extended';
      case 3:
        return 'medium-risk extended';
      case 2:
        return 'low-risk extended';
      case 1:
        return 'lowest-risk extended';
      default:
        return 'unidentified-risk extended';
    }
  }

  getIconClass(): string {
    return this.riskIncreased ? 'far fa-arrow-up' : 'far fa-arrow-down';
  }

  getRiskTrend(): string {
    return this.riskIncreased ? 'Increased' : 'Decreased';
  }

  getDaysSinceDisplay(): string {
    return this.daysSinceRiskLevelChange + ' days';
  }

  openTrendingRiskModal(): void {
    this.store$.dispatch(
      new TrendingRiskModalDataRequest({ claimNumber: this.claimNumber })
    );
  }
}
