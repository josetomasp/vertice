import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentChanges } from '@shared/models/component-changes';
import { SpecificDateFormFieldType } from '../../../../claims/abm/referral/make-a-referral/components/specific-date-form-array/specific-date-form-config';
import { filter, first, map, takeUntil } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { HealtheTableColumnDef, pageSizeOptions } from '@shared';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '@shared/models/healthe-data-source';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TableCondition, VerbiageService } from '../../../../verbiage.service';
import { environment } from '../../../../../environments/environment';
import * as _moment from 'moment';
import { SearchNavFormField } from '../../../shared/SearchNavTypes';
import { MatMenu } from '@angular/material/menu';
import { HealtheComponentConfig } from '@modules/healthe-grid';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { NavigationSearchResults } from '../../../store/reducers/nav-search.reducers';

const moment = _moment;

@Component({
  selector: 'healthe-authorizations-search-results',
  templateUrl: './authorizations-search-results.component.html',
  styleUrls: ['./authorizations-search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationsSearchResultsComponent
  extends DestroyableComponent
  implements OnInit, OnChanges
{
  @Input() // Used to build filter summary field labels since the controls use controlNames
  simpleSearchFormConfig: SearchNavFormField[][];
  @Input() // Used to build filter summary field labels since the controls use controlNames
  advancedSearchFormConfig: SearchNavFormField[][];
  @Input() // Configures columns
  resultsColumnsConfig: HealtheTableColumnDef[] = [];
  @Input() // Sets default sort column & direction
  resultsDefaultSort: MatSortable;
  @Input() // Holds page size preferences
  pageSize$: Observable<any>;
  @Input() // Used to build filter summary values
  searchFormValues: { [field: string]: any };
  @Input()
  resultsData$: Observable<NavigationSearchResults>;
  @Input() // Used to trigger summary filter building && TODO: potentially results displays
  isResultLoading$: Observable<boolean>;
  @Output()
  itemClicked: EventEmitter<any> = new EventEmitter();
  @Input()
  actionsConfig: HealtheComponentConfig;
  @Input()
  showExportButton = false;
  @Output()
  doExport: EventEmitter<String> = new EventEmitter();

  @ViewChild('matSort', { static: true })
  matSort: MatSort;
  @ViewChild('topPaginator', { static: true })
  topPaginator: MatPaginator;
  @ViewChild('bottomPaginator', { static: true })
  bottomPaginator: MatPaginator;

  filterSummaryText: string = '';
  tableDataSource: HealtheDataSource<any>;
  columnNames: string[];
  pageSizeOptions = pageSizeOptions;
  noDataForQueryVerbiage: string;
  exportMenuIcon = faChevronDown;
  exportDropdownOptions = ['PDF', 'EXCEL'];

  constructor(protected verbiageService: VerbiageService) {
    super();
    this.noDataForQueryVerbiage = verbiageService.getTableVerbiage(
      TableCondition.NoDataForQuery
    );
  }

  ngOnInit() {
    this.tableDataSource = new HealtheDataSource(
      this.resultsData$.pipe(map((resultsData) => resultsData.resultRows)),
      null,
      this.resultsColumnsConfig as HealtheSortableColumn[]
    );
    this.tableDataSource.sort = this.matSort;
    if (this.resultsDefaultSort) {
      this.tableDataSource.sort.sort(this.resultsDefaultSort);
    }
    this.tableDataSource.primaryPaginator = this.topPaginator;
    this.tableDataSource.secondaryPaginator = this.bottomPaginator;
  }

  ngOnChanges(changes: ComponentChanges<AuthorizationsSearchResultsComponent>) {
    // Set up subscription to automatically rebuild filter summary if results
    //  start loading (search has been initiated)
    if (changes.isResultLoading$ && changes.isResultLoading$.firstChange) {
      this.isResultLoading$
        .pipe(
          filter((isResultLoading) => isResultLoading),
          takeUntil(this.onDestroy$)
        )
        .subscribe(() => {
          // Move the user to the first page when loading new results
          if (this.tableDataSource) {
            this.tableDataSource.primaryPaginator.firstPage();
          }
          this.buildFilterSummary();
        });
    }

    // Build filter summary on the searchFormValues' first change (for when
    //  navigating between Referrals-Authorizations and Authorizations-Referrals)
    if (changes.searchFormValues && changes.searchFormValues.firstChange) {
      this.buildFilterSummary();
    }

    if (changes.resultsColumnsConfig) {
      this.columnNames = this.resultsColumnsConfig.map((config) => config.name);
    }
  }

  setOpenUntilClose(exportMenu: MatMenu) {
    this.exportMenuIcon = faChevronUp;
    exportMenu.closed.pipe(first()).subscribe(() => {
      this.exportMenuIcon = faChevronDown;
    });
  }

  buildFilterSummary() {
    this.filterSummaryText = '';
    let newFilterSummaryText = '';
    let allSearchFormConfigs = [].concat(
      ...this.simpleSearchFormConfig,
      ...this.advancedSearchFormConfig
    );

    Object.entries(this.searchFormValues)
      .filter(([filterName, filterValue]) => filterValue && filterValue !== '')
      .forEach(([filterName, filterValue]) => {
        let filterValueText = filterValue;
        let currentFieldConfig: SearchNavFormField = allSearchFormConfigs.find(
          (fieldConfig: SearchNavFormField) =>
            fieldConfig.formControlName === filterName
        );

        if (currentFieldConfig.type === SpecificDateFormFieldType.DateRange) {
          filterValueText =
            moment(filterValue.fromDate).format(environment.dateFormat) +
            ' - ' +
            moment(filterValue.toDate).format(environment.dateFormat);
        }

        // Translate the value into the label for switch statements.
        if (currentFieldConfig.type === SpecificDateFormFieldType.Select) {
          currentFieldConfig.options.pipe(first()).subscribe((options) => {
            if (options) {
              options.forEach((option) => {
                if (option.value === filterValue) {
                  filterValueText = option.label;
                }
              });
            }
          });
        }

        newFilterSummaryText +=
          currentFieldConfig.label + ' (' + filterValueText + '), ';
      });

    if (newFilterSummaryText === '') {
      newFilterSummaryText = 'None';
    } else {
      newFilterSummaryText = newFilterSummaryText.substring(
        0,
        newFilterSummaryText.length - 2
      );
    }

    this.filterSummaryText = newFilterSummaryText;
  }

  trackByMethod(index: number, element: any): number {
    return element.id;
  }
}
