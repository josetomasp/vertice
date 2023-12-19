import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { HealtheSelectOption } from '@shared';
import { BarVertical2DComponent } from '@swimlane/ngx-charts';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import { SearchNavService } from '../../search-nav/search-nav.service';
import { getSelectOptionsForCustomerSpecific } from '../../search-nav/shared/select-options-helpers';
import { RootState } from '../../store/models/root.models';
import { getUserInfo } from '../../user/store/selectors/user.selectors';
import { TableCondition, VerbiageService } from '../../verbiage.service';
import {
  GraphSeries,
  PendingAuthorizationsGraphDataByAdjuster
} from '../store/models/dashboard.models';

const METRIC_COLORS = {
  'Day 1': '#0075C9',
  'Day 2': '#2C975A',
  'Day 3': '#FFC658',
  'Day 4 and greater': '#EA6852'
};

@Component({
  selector: 'healthe-pending-authorizations-graph',
  templateUrl: './pending-authorizations-graph.component.html',
  styleUrls: ['./pending-authorizations-graph.component.scss']
})
export class PendingAuthorizationsGraphComponent implements OnInit {
  tableCondition = TableCondition;
  @ViewChild('barChart')
  barChart: BarVertical2DComponent;
  componentGroupName: string = 'pending-authorizations-graph';

  currentdate = new Date();
  lastUpdatedDateTimeString: string =
    this.currentdate.getMonth() +
    1 +
    '/' +
    this.currentdate.getDate() +
    '/' +
    this.currentdate
      .getFullYear()
      .toString()
      .substr(2) +
    ' at ' +
    (this.currentdate.getHours() % 12 > 0
      ? this.currentdate.getHours() % 12
      : this.currentdate.getHours()
    ).toString() +
    ':' +
    (this.currentdate.getMinutes() < 10
      ? '0' + this.currentdate.getMinutes()
      : this.currentdate.getMinutes()
    ).toString() +
    (this.currentdate.getHours() >= 12 ? 'PM' : 'AM').toString();

  assignedAdjusters: HealtheSelectOption<string>[];
  verticalBarChartData: GraphSeries[] = [];
  pendingAuthorizationsGraphDataByAdjusters: PendingAuthorizationsGraphDataByAdjuster[] = [];
  isResultLoading: boolean = false;

  constructor(
    private router: Router,
    private searchNavService: SearchNavService,
    private verbiageService: VerbiageService,
    private store$: Store<RootState>
  ) {}

  ngOnInit() {
    combineLatest([
      this.searchNavService.getSearchOptions(),
      this.store$.pipe(select(getUserInfo))
    ])
      .pipe(first())
      .subscribe(([searchOptions, userInfo]) => {
        this.assignedAdjusters = getSelectOptionsForCustomerSpecific(
          userInfo.internal,
          searchOptions.assignedAdjustersAllAuthByCustomer
        );
      });
  }

  updateAdjusterSelection(adjusterChange: MatSelectChange) {
    this.isResultLoading = true;
    this.searchNavService
      .getPendingAuthorizationsDashboardData(adjusterChange.value)
      .pipe(first())
      .subscribe((pendingAuthorizationDashboardDataByAdjuster) => {
        this.pendingAuthorizationsGraphDataByAdjusters = pendingAuthorizationDashboardDataByAdjuster;
        this.changeDataSet(adjusterChange.value);

        this.isResultLoading = false;
      });
  }

  goToAuthSearch(viewAllAuthorizationNav: boolean) {
    if (viewAllAuthorizationNav) {
      this.router.navigateByUrl('/search-nav/all-authorizations');
    } else {
      this.router.navigateByUrl('/referrals/authorizations');
    }
  }

  getCustomColor(categoryName: string) {
    return METRIC_COLORS[categoryName];
  }

  changeDataSet(assignedAdjusterSelection: string): void {
    let newVerticalBarChartData = [];

    this.pendingAuthorizationsGraphDataByAdjusters.forEach(
      (adjusterAuthorizations) => {
        if (
          adjusterAuthorizations.assignedAdjuster.toLowerCase() ===
          assignedAdjusterSelection.toLowerCase()
        ) {
          adjusterAuthorizations.pendingAuthorizationDashboardDataByType.forEach(
            (typedAuthorizationData) => {
              newVerticalBarChartData.push({
                name: typedAuthorizationData.authorizationTypeLabel,
                series: typedAuthorizationData.pendingAuthorizationDashboardData.map(
                  (authorizationData) => ({
                    name: authorizationData.age,
                    value: authorizationData.count
                  })
                )
              });
            }
          );
        }
      }
    );

    this.verticalBarChartData = newVerticalBarChartData;
    // Only bother updating if the chart exists and we didn't replace it with the no data available message
    if (this.barChart) {
      this.barChart.update();
    }
  }

  getVerbiage(condition: TableCondition) {
    return this.verbiageService.getTableVerbiage(condition);
  }
}
