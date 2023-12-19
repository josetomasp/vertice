import {
  AfterContentInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatSortable } from '@angular/material/sort';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Range } from '@healthe/vertice-library';
import { select, Store } from '@ngrx/store';
import { capitalize, pluckPrefValue, TableColumnState } from '@shared';
import * as _moment from 'moment';
import { combineLatest, from, Observable, zip } from 'rxjs';
import {
  distinct,
  filter,
  first,
  map,
  mergeMap,
  switchMap,
  takeWhile,
  toArray
} from 'rxjs/operators';
import { PreferenceType } from '../../preferences/store/models/preferences.models';
import { getPreferenceByQuery } from '../../preferences/store/selectors/user-preferences.selectors';
import { RootState } from '../../store/models/root.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../store/selectors/router.selectors';
import {
  ExportDocumentRequest,
  Initialized,
  RequestAllActivity,
  SelectActivityTab,
  SetActivityViewPager,
  UpdateColumnSort,
  UpdateColumnView,
  UpdateFilters
} from '../store/actions/activity-tab.actions';
import {
  ActivityPagerState,
  AllActivityData,
  FilterPredicates,
  PendingActivityData,
  PendingActivityTotals,
  TableTabType
} from '../store/models/activity-tab.models';
import { ExportParameters } from '../store/models/claim-view.models';
import {
  getActivityTab,
  getAllActivityData,
  getColumnViewState,
  getDateRange,
  getFilterPredicates,
  getPagers,
  getPendingActivityData,
  getPendingTotals,
  getServerErrors,
  isActivityTabInitialized,
  isActivityTabLoading
} from '../store/selectors/activity-tab.selectors';
import { ClaimActivityTableColumnSettingsService } from '../../preferences/claim-table-list-settings/claim-activity-table-column-settings.service';
import {
  ConfirmationBannerComponent,
  AlertType
} from '@shared/components/confirmation-banner/confirmation-banner.component';

const moment = _moment;

@Component({
  selector: 'healthe-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnDestroy, AfterContentInit {
  isAlive: boolean = false;
  alertType = AlertType;
  componentGroupName = 'activity';

  @ViewChild('tabgroup', { static: true })
  tabGroup: MatTabGroup;
  @ViewChildren(MatTab)
  tabs: QueryList<MatTab>;
  @ViewChild('alert206', { static: true })
  alert206: ConfirmationBannerComponent;
  defaultDateRange: Range = {
    fromDate: moment()
      .subtract(6, 'month')
      .toDate(),
    toDate: moment().toDate()
  };
  activeTabText: string;
  activityTab$: Observable<string> = this.store$.pipe(select(getActivityTab));
  dateRange$: Observable<Range> = this.store$.pipe(select(getDateRange));
  claimNumber$: Observable<string> = this.store$.pipe(
    select(getEncodedClaimNumber)
  );
  customerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );
  pageSize$ = this.store$.pipe(
    select(getPreferenceByQuery, {
      screenName: 'global',
      preferenceTypeName: PreferenceType.PageSize
    }),
    pluckPrefValue
  );

  getPagers$: Observable<ActivityPagerState> = this.store$.pipe(
    select(getPagers)
  );

  isActivityTabInitialized$: Observable<boolean> = this.store$.pipe(
    select(isActivityTabInitialized)
  );
  allActivityData$: Observable<Array<AllActivityData>> = combineLatest(
    this.store$.pipe(select(getActivityTab)),
    this.store$.pipe(select(getAllActivityData))
  ).pipe(
    mergeMap(
      ([activityTab, activityData]: [TableTabType, Array<AllActivityData>]) =>
        from(activityData).pipe(
          filter((row) => this.activityFilter(row, activityTab)),
          toArray()
        )
    )
  );
  pendingActivities$: Observable<Array<PendingActivityData>> = combineLatest(
    this.store$.pipe(select(getActivityTab)),
    this.store$.pipe(select(getPendingActivityData))
  ).pipe(
    mergeMap(([tab, pendingData]) =>
      from(pendingData).pipe(
        filter((row) => this.activityFilter(row, tab)),
        toArray()
      )
    )
  );
  serverErrors$: Observable<Array<string>> = this.store$.pipe(
    select(getServerErrors)
  );
  tableColumnList$ = this.store$.pipe(
    select(getActivityTab),
    mergeMap((tab) =>
      this.store$.pipe(
        select(getPreferenceByQuery, {
          screenName: 'global',
          componentGroupName: 'global',
          componentName: this.columnService.getComponentNameFromTab(tab),
          preferenceTypeName: PreferenceType.ColumnList
        }),
        pluckPrefValue
      )
    )
  );
  activeColumnView$: Observable<TableColumnState> = this.store$.pipe(
    select(getColumnViewState)
  );
  filterPredicates$: Observable<FilterPredicates> = this.store$.pipe(
    select(getFilterPredicates)
  );
  pendingActvityTotals$: Observable<PendingActivityTotals> = this.store$.pipe(
    select(getPendingTotals)
  );
  isLoadingData$: Observable<boolean> = this.store$.pipe(
    select(isActivityTabLoading)
  );

  constructor(
    public store$: Store<RootState>,
    public router: Router,
    public route: ActivatedRoute,
    public columnService: ClaimActivityTableColumnSettingsService
  ) {}

  activityFilter(row, tab) {
    switch (tab) {
      default:
      case 'all':
        return true;
      case 'pharmacy':
      case 'clinical':
      case 'ancillary':
        return row.productType === capitalize(tab);
    }
  }

  ngAfterContentInit() {
    this.activityTab$.pipe(takeWhile(() => this.isAlive)).subscribe((tab) => {
      setTimeout(() => {
        this.tabs.forEach((matTab, idx) => {
          if (tab === matTab.textLabel) {
            this.tabGroup.selectedIndex = idx;
          }
        });
      });
      this.router.navigate([`../${tab}`], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        preserveFragment: true
      });
      switch (tab) {
        default:
        case 'all':
          this.activeTabText = '';
          break;
        case 'pharmacy':
        case 'clinical':
        case 'ancillary':
          this.activeTabText = capitalize(tab);
          break;
      }
    });
  }

  ngOnInit() {
    this.isAlive = true;
    this.route.paramMap
      .pipe(
        first((paramMap) => paramMap.has('tab')),
        map((paramMap) => paramMap.get('tab'))
      )
      .subscribe((tab) => {
        this.store$.dispatch(new SelectActivityTab(tab));
      });
    this.isActivityTabInitialized$
      .pipe(
        takeWhile(() => this.isAlive),
        first(),
        filter(initialized => !initialized),
        switchMap(() => {
          this.store$.dispatch(new Initialized());
          return zip(
            this.claimNumber$.pipe(first((v) => v !== '')),
            this.customerId$.pipe(first((v) => v !== ''))
          );
        }),
      )
      .subscribe(([claimNumber, customerId]) => {
        this.store$.dispatch(
          new RequestAllActivity({
            claimNumber,
            customerId,
            dateRange: this.defaultDateRange
          })
        );
      });

    this.serverErrors$
      .pipe(
        takeWhile(() => this.isAlive),
        distinct((val: string[]) => val.join())
      )
      .subscribe((serverErrors) => {
        if (serverErrors.length > 0) {
          this.alert206.show(
            'The following transactions are unavailable at this time. Please try again later.',
            serverErrors,
            this.alertType.DANGER
          );
        } else {
          this.alert206.hide();
        }
      });

    // The logic here is to set the page sizes only if they have not been set before.
    combineLatest([this.pageSize$, this.getPagers$])
      .pipe(first())
      .subscribe(([pageSize, pagers]: [number, ActivityPagerState]) => {
        const tabs = Object.keys(pagers);
        tabs.forEach((tab) => {
          if (0 === pagers[tab].pageSize) {
            this.store$.dispatch(
              new SetActivityViewPager({
                [tab]: { currentPage: pagers[tab].currentPage, pageSize }
              })
            );
          }
        });
      });

    // End ngOnInit
  }

  changeTab($event: MatTabChangeEvent) {
    switch ($event.index) {
      case 0:
        this.store$.dispatch(new SelectActivityTab('all'));
        break;
      case 1:
        this.store$.dispatch(new SelectActivityTab('pharmacy'));
        break;
      case 2:
        this.store$.dispatch(new SelectActivityTab('clinical'));
        break;
      case 3:
        this.store$.dispatch(new SelectActivityTab('ancillary'));
        break;
    }
  }

  filterChange($event: any) {
    this.store$.dispatch(new UpdateFilters($event));
  }

  dateRangeChange(dateRange: Range) {
    zip(this.claimNumber$, this.customerId$)
      .pipe(first())
      .subscribe(([claimNumber, customerId]) => {
        this.store$.dispatch(
          new RequestAllActivity({ claimNumber, customerId, dateRange })
        );
      });
  }

  refresh() {
    zip(this.claimNumber$, this.customerId$, this.dateRange$)
      .pipe(first())
      .subscribe(([claimNumber, customerId, dateRange]) => {
        this.store$.dispatch(
          new RequestAllActivity({
            claimNumber,
            customerId,
            dateRange
          })
        );
      });
  }

  exportDocument(exportParameters: Partial<ExportParameters>) {
    zip(
      this.dateRange$,
      this.claimNumber$,
      this.customerId$,
      this.filterPredicates$,
      this.activityTab$
    )
      .pipe(first())
      .subscribe(
        ([dateRange, claimNumber, customerId, filterPredicates, activeTab]) => {
          const {
            activityType,
            outcome,
            itemName,
            prescriberName
          } = filterPredicates;
          this.store$.dispatch(
            new ExportDocumentRequest({
              activityTypeFilterPredicates: activityType,
              outcomeFilterPredicates: outcome,
              itemNameFilterPredicates: itemName,
              prescriberNameFilterPredicates: prescriberName,
              productType: activeTab,
              dateRange: dateRange,
              customerId: customerId,
              claimNumber: claimNumber,
              exportType: exportParameters.exportType,
              tableColumns: exportParameters.tableColumns,
              columnOptions: exportParameters.columnOptions
            })
          );
        }
      );
  }

  columnViewChange(columnView: TableColumnState) {
    this.store$.dispatch(new UpdateColumnView(columnView));
  }

  columnSortChange(columnSort: MatSortable) {
    this.store$.dispatch(new UpdateColumnSort(columnSort));
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
