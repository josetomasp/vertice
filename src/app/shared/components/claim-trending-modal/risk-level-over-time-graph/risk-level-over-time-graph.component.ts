import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  MatButtonToggle,
  MatButtonToggleChange
} from '@angular/material/button-toggle';
import { UpdateRiskLevelModalGraphInterval } from '@shared/store/actions/trending-risk-modal.actions';
import { select, Store } from '@ngrx/store';
import { LineChartComponent } from '@swimlane/ngx-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { RootState } from '../../../../store/models/root.models';
import {
  getRiskTrendingClaimNumber,
  getRiskTrendingGraphData
} from '../../../store/selectors';

@Component({
  selector: 'healthe-risk-level-over-time-graph',
  templateUrl: './risk-level-over-time-graph.component.html',
  styleUrls: ['./risk-level-over-time-graph.component.scss']
})
export class RiskLevelOverTimeGraphComponent implements OnInit {
  @ViewChild('lineChart', { static: true })
  lineChart: LineChartComponent;
  @ViewChild('template', { static: true })
  tooltipTemplate: TemplateRef<any>;
  @ViewChild('seriesTemplate', { static: true })
  seriesTemplate: TemplateRef<any>;
  @ViewChild('monthlyIntervalButton', { static: true })
  monthlyIntervalButton: MatButtonToggle;
  @ViewChild('quarterlyIntervalButton')
  quarterlyIntervalButton: MatButtonToggle;
  claimNumber$ = this.store$.pipe(select(getRiskTrendingClaimNumber));

  riskGraphData$ = this.store$.pipe(
    select(getRiskTrendingGraphData),
    map((data) => [data])
  );

  customColors = function(series) {
    return '#0075c9';
  };

  yAxisFormatting = function(value) {
    switch (value) {
      case 5:
        return 'Highest';
      case 4:
        return 'High';
      case 3:
        return 'Medium';
      case 2:
        return 'Low';
      case 1:
        return 'Lowest';
      case 0:
        return 'Unidentified';
    }
  };

  ngOnInit(): void {
    this.lineChart.tooltipTemplate = this.tooltipTemplate;
    this.lineChart.seriesTooltipTemplate = this.seriesTemplate;
    merge(this.monthlyIntervalButton.change)
      .pipe(
        map(
          (event: MatButtonToggleChange) =>
            new UpdateRiskLevelModalGraphInterval(event.value)
        )
      )
      .subscribe((action) => {
        this.store$.dispatch(action);
      });
  }

  constructor(public store$: Store<RootState>) {}
}
