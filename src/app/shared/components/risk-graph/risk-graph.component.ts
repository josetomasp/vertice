import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { LineChartComponent } from '@swimlane/ngx-charts';
import {
  curveCardinal,
  curveMonotoneX,
  curveMonotoneY,
  curveNatural
} from 'd3-shape';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { fromEvent, Observable } from 'rxjs';
import { delay, takeWhile } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { TableCondition, VerbiageService } from '../../../verbiage.service';
import { HealtheSelectOption } from '../../models/select-option.interface';
import { RiskGraphAgeRange, RiskGraphType } from './risk-graph.models';
import {
  GraphMetricItem,
  GraphSeries
} from 'src/app/dashboard/store/models/dashboard.models';

const moment = _moment;

export const RiskGraphLineCurve = {
  MONOTONE_X: curveMonotoneX,
  MONOTONE_Y: curveMonotoneY,
  NATURAL: curveNatural,
  CARDINAL: curveCardinal
};

const METRIC_COLORS = {
  'Medication Selection': '#0075c9',
  Financial: '#6610f2',
  'Patient Safety': '#ffc658',
  'Multiple Prescribers': '#00b3e3',
  Highest: '#CE202E',
  High: '#EA6852',
  Medium: '#FFC658',
  Low: '#7AE582',
  Lowest: '#2C975A'
};

@Component({
  selector: 'healthe-risk-graph',
  templateUrl: './risk-graph.component.html',
  styleUrls: ['./risk-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RiskGraphComponent implements OnInit, OnDestroy {
  tableCondition = TableCondition;
  isAlive = true;
  curve = RiskGraphLineCurve.MONOTONE_X;
  @ViewChild('lineChart', { static: true })
  lineChart: LineChartComponent;
  @ViewChild('template', { static: true })
  tooltipTemplate: TemplateRef<any>;

  @Input()
  currentMetrics$: Observable<GraphMetricItem[]>;

  @Input()
  currentSeries$: Observable<GraphSeries[]>;

  @Input()
  isLoading$: Observable<boolean>;

  @Output()
  metricClicked: EventEmitter<GraphMetricItem> = new EventEmitter<
    GraphMetricItem
  >();
  @Output()
  dataPointClicked: EventEmitter<string> = new EventEmitter();

  @Output()
  ageRangeChange: EventEmitter<RiskGraphAgeRange> = new EventEmitter();

  @Output()
  riskTypeChanged: EventEmitter<RiskGraphType> = new EventEmitter();

  public claimAgeRange: RiskGraphAgeRange;

  @Input()
  riskGraphType: RiskGraphType;

  metricColors = METRIC_COLORS;

  riskGraphTypeOptions: HealtheSelectOption<RiskGraphType>[] = [
    {
      label: 'By Risk Category',
      value: RiskGraphType.CATEGORY
    },
    {
      label: 'By Risk Level',
      value: RiskGraphType.LEVEL
    }
  ];

  claimAgeRangesOptions: HealtheSelectOption<RiskGraphAgeRange>[] = [
    {
      label: 'All age claims',
      value: {
        fromDate: moment()
          .subtract(100, 'year')
          .format(environment.dateFormat),
        toDate: moment().format(environment.dateFormat)
      }
    },
    {
      label: 'Less than 1 year',
      value: {
        fromDate: moment()
          .subtract(1, 'year')
          .format(environment.dateFormat),
        toDate: moment().format(environment.dateFormat)
      }
    },
    {
      label: '2 years',
      value: {
        fromDate: moment()
          .subtract(2, 'year')
          .format(environment.dateFormat),
        toDate: moment().format(environment.dateFormat)
      }
    },
    {
      label: '3 years',
      value: {
        fromDate: moment()
          .subtract(3, 'year')
          .format(environment.dateFormat),
        toDate: moment().format(environment.dateFormat)
      }
    },
    {
      label: '4 years',
      value: {
        fromDate: moment()
          .subtract(4, 'year')
          .format(environment.dateFormat),
        toDate: moment().format(environment.dateFormat)
      }
    },
    {
      label: '6 - 10 years',
      value: {
        fromDate: moment()
          .subtract(10, 'year')
          .format(environment.dateFormat),
        toDate: moment()
          .subtract(6, 'year')
          .format(environment.dateFormat)
      }
    },
    {
      label: '11 - 15 years',
      value: {
        fromDate: moment()
          .subtract(15, 'year')
          .format(environment.dateFormat),
        toDate: moment()
          .subtract(11, 'year')
          .format(environment.dateFormat)
      }
    },
    {
      label: '16 - 20 years',
      value: {
        fromDate: moment()
          .subtract(20, 'year')
          .format(environment.dateFormat),
        toDate: moment()
          .subtract(16, 'year')
          .format(environment.dateFormat)
      }
    },
    {
      label: 'Greater than 20 years',
      value: {
        fromDate: moment()
          .subtract(100, 'year')
          .format(environment.dateFormat),
        toDate: moment()
          .subtract(20, 'year')
          .format(environment.dateFormat)
      }
    }
  ];

  constructor(public verbiageService: VerbiageService) {
    this.claimAgeRange = this.claimAgeRangesOptions[0].value;
  }

  ngOnInit() {
    this.lineChart.tooltipTemplate = this.tooltipTemplate;
    fromEvent(window, 'mouseup')
      .pipe(
        takeWhile(() => this.isAlive),
        delay(100)
      )
      .subscribe(() => {
        this.lineChart.update();
      });
  }

  onSelect($event) {
    // The string type comes from the legend, which is the only clicks we wish to allow.
    if (typeof $event === 'string') {
      this.dataPointClicked.emit($event);
    }
  }

  getCustomColor(categoryName: string) {
    return METRIC_COLORS[categoryName];
  }

  getTooltip(dateRangeValue: string | { fromDate: string; toDate: string }) {
    if (dateRangeValue === 'all') {
      return 'All age claims';
    } else {
      return _.find(
        this.claimAgeRangesOptions,
        (option) => option.value === dateRangeValue
      ).label;
    }
  }

  getVerbiage(condition: TableCondition) {
    return this.verbiageService.getTableVerbiage(condition);
  }

  hasData(data: any) {
    return !_.isEmpty(data);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
