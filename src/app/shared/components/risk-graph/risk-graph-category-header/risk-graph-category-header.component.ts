import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { Observable } from 'rxjs';
import { GraphMetricItem } from 'src/app/dashboard/store/models/dashboard.models';

@Component({
  selector: 'healthe-risk-graph-category-header',
  templateUrl: './risk-graph-category-header.component.html',
  styleUrls: ['./risk-graph-category-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RiskGraphCategoryHeaderComponent implements OnInit {
  @Input()
  riskMetrics$: Observable<GraphMetricItem[]>;

  @Input()
  ColorMap: any;

  @Output()
  metricClicked: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
