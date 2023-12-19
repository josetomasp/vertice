import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { HealtheTableColumnDef } from '@shared/models/table-column';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '@shared/models/healthe-data-source';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TableCondition, VerbiageService } from '../../../../verbiage.service';
import { pageSizeOptions } from '@shared/models/pagerOptions';
import { isEqual } from 'lodash';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../../store/models/root.models';
import { getUserInfoPreferencesConfig } from '../../../../search-nav/store/selectors/make-a-referral-search.selectors';
import { PreferenceType } from '../../../../preferences/store/models/preferences.models';
import { debounceTime, first, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'healthe-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent extends DestroyableComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() // Selected columns by name
  displayedColumnNames: string[];
  @Input() // Configures columns
  resultsColumnsConfig: HealtheTableColumnDef[] = [];
  @Input() // Sets default sort column & direction
  resultsDefaultSort: MatSortable;
  @Input()
  pageSize: number = null;

  @Input()
  resultsData: any[];

  @Input()
  pageSizeOptions = pageSizeOptions;

  @Input()
  isResultLoading: boolean;
  @Input()
  showPaginator: boolean = true;
  @Output()
  itemClicked: EventEmitter<any> = new EventEmitter();

  @Output()
  pageSizeChanged: EventEmitter<number> = new EventEmitter();

  @ViewChild('matSort') matSort: MatSort;
  @ViewChild('topPaginator')
  topPaginator: MatPaginator;
  @ViewChild('bottomPaginator')
  bottomPaginator: MatPaginator;

  tableDataSource: HealtheDataSource<any>;
  noDataForQueryVerbiage: string;

  constructor(
    protected verbiageService: VerbiageService,
    protected store$: Store<RootState>
  ) {
    super();
    this.noDataForQueryVerbiage = verbiageService.getTableVerbiage(
      TableCondition.NoDataForQuery
    );
  }

  ngOnInit() {
    if (null == this.pageSize) {
      this.store$
        .pipe(
          first(),
          select(getUserInfoPreferencesConfig, {
            screenName: 'global',
            preferenceTypeName: PreferenceType.PageSize
          }),
          map((userData) => userData.preferences.value as number)
        )
        .subscribe((pageSize) => (this.pageSize = pageSize));
    }
  }

  ngAfterViewInit(): void {
    this.tableDataSource = new HealtheDataSource(this.resultsData, null, this
      .resultsColumnsConfig as HealtheSortableColumn[]);
    this.tableDataSource.sort = this.matSort;
    if (this.resultsDefaultSort && this.tableDataSource.sort) {
      this.tableDataSource.sort.sort(this.resultsDefaultSort);
    }
    this.tableDataSource.primaryPaginator = this.topPaginator;
    this.tableDataSource.secondaryPaginator = this.bottomPaginator;

    this.topPaginator.page
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(100)
      )
      .subscribe((page) => this.pageSizeChanged.emit(page.pageSize));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.tableDataSource &&
      changes.resultsData &&
      !isEqual(
        changes.resultsData.currentValue,
        changes.resultsData.previousValue
      )
    ) {
      this.tableDataSource.data = this.resultsData;
      if (this.showPaginator) {
        this.tableDataSource.primaryPaginator.firstPage();
      }
    }

    if (this.resultsDefaultSort && this.matSort && !this.tableDataSource.sort) {
      this.tableDataSource.sort = this.matSort;
      this.tableDataSource.sort.sort(this.resultsDefaultSort);
    }
  }

  trackByMethod(index: number, element: any): number {
    return element.id;
  }

  safeObjectMerge(object1: object = {}, object2: object = {}) {
    return Object.assign({}, object1, object2);
  }
}
