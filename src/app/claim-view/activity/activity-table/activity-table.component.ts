import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { faCalendarAlt } from '@fortawesome/pro-light-svg-icons/faCalendarAlt';
import {
  HealtheStaticTableDirective,
  HealtheTableColumnDef,
  NgxDrpOptions,
  NgxMatDrpComponent,
  Range
} from '@healthe/vertice-library';
import { select, Store } from '@ngrx/store';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '@shared/models/healthe-data-source';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { combineLatest, from, Observable, zip } from 'rxjs';
import {
  distinct,
  first,
  map,
  mergeMap,
  takeUntil,
  takeWhile,
  toArray
} from 'rxjs/operators';
import { DocumentExportDocumentType } from '../../../../common/documentExporter/documentExportDTO';
import { ClaimActivityTableColumnSettingsService } from '../../../preferences/claim-table-list-settings/claim-activity-table-column-settings.service';
import {
  SetClaimTableListPreferencesTab,
  UpdateClaimViewListsCardExpanded
} from '../../../preferences/store/actions/preferences-screen.actions';
import { SavePreferences } from '../../../preferences/store/actions/preferences.actions';
import { PreferenceType } from '../../../preferences/store/models/preferences.models';
import { getPreferenceByQuery } from '../../../preferences/store/selectors/user-preferences.selectors';
import { TableCondition, VerbiageService } from '../../../verbiage.service';
import { SetActivityViewPager } from '../../store/actions/activity-tab.actions';
import {
  AllActivityData,
  FilterPredicates,
  TableTabType
} from '../../store/models/activity-tab.models';
import {
  CLAIM_VIEW_DATE_PICKER_OPTIONS,
  ClaimViewState,
  ExportParameters
} from '../../store/models/claim-view.models';
import {
  getActivityTab,
  getColumnSort,
  getColumnViewState,
  getPagers
} from '../../store/selectors/activity-tab.selectors';
import {
  ALL_TAB_COLUMNS,
  ANCILLARY_TAB_COLUMNS,
  CLINICAL_TAB_COLUMNS,
  PHARMACY_TAB_COLUMNS
} from './columns';

import { PageTitleService } from '@shared/service/page-title.service';
import { FeatureFlagService } from '../../../customer-configs/feature-flag.service';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from 'src/app/store/selectors/router.selectors';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';
import { Router } from '@angular/router';
import {
  generate3_0ABMReferralActivityTabUrl,
  generateExternal3_0PBMAuthorizationTabUrl
} from '@shared/lib/links';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { faSyncAlt } from '@fortawesome/pro-solid-svg-icons';
import { faThList } from '@fortawesome/pro-light-svg-icons';
import { TableColumnState } from '@shared/models/table-column-state';
import { HealtheSelectOption } from '@shared/models/select-option.interface';
import { HealtheMenuOption } from '@shared/models/menu-option.interface';
import { hexDecode } from '@shared/lib/formatters/hexDecode';
import { pageSizeOptions } from '@shared/models/pagerOptions';

const moment = _moment;

class FilterPlaceholder {
  summaryText: string = '';
}

@Component({
  selector: 'healthe-activity-table',
  templateUrl: './activity-table.component.html',
  styleUrls: ['./activity-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityTableComponent
  extends DestroyableComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  isAlive: boolean = true;

  columnViewOptionLabels = {
    [TableColumnState.TruncateText]: 'Truncate text',
    [TableColumnState.WrapText]: 'Wrap text',
    [TableColumnState.ExpandColumns]: 'Expand to fit text'
  };
  columnViewOptions: Array<HealtheSelectOption<TableColumnState>> = [
    {
      value: TableColumnState.TruncateText,
      label: this.columnViewOptionLabels[TableColumnState.TruncateText]
    },
    {
      value: TableColumnState.WrapText,
      label: this.columnViewOptionLabels[TableColumnState.WrapText]
    },
    {
      value: TableColumnState.ExpandColumns,
      label: this.columnViewOptionLabels[TableColumnState.ExpandColumns]
    }
  ];

  @Input()
  activeTabName: TableTabType;

  @Input()
  tableColumnList: Array<string> = [];
  @Input()
  isLoadingData: boolean;

  @Input()
  dateRange: { fromDate: Date; toDate: Date } = {
    fromDate: moment().subtract(1, 'month').toDate(),
    toDate: moment().toDate()
  };
  @Output()
  refresh: EventEmitter<void> = new EventEmitter();
  @Output()
  columnSortChange: EventEmitter<MatSortable> = new EventEmitter<MatSortable>();
  @Output()
  dateRangeChange: EventEmitter<Range> = new EventEmitter<Range>();
  @Output()
  filterChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  export: EventEmitter<Partial<ExportParameters>> = new EventEmitter<
    Partial<ExportParameters>
  >();
  @Output()
  columnListUpdate: EventEmitter<Array<string>> = new EventEmitter<
    Array<string>
  >();
  @Output()
  columnViewChange: EventEmitter<TableColumnState> = new EventEmitter<TableColumnState>();
  @ViewChild('columnPicker')
  columnFilter: MatSelect;
  @ViewChild(HealtheStaticTableDirective)
  dataTableComponent: HealtheStaticTableDirective;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @ViewChild(NgxMatDrpComponent, { static: true })
  dateRangeComponent: NgxMatDrpComponent;

  @ViewChild('primaryPaginator', { static: true })
  primaryPaginator: MatPaginator;
  @ViewChild('secondaryPaginator', { static: true })
  secondaryPaginator: MatPaginator;

  faCalendarAlt = faCalendarAlt;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  fasSyncAlt = faSyncAlt;
  faThList = faThList;
  isInternetExplorer: boolean;
  columnDropdownList: Array<HealtheSelectOption<string>>;
  datePickerOptions: NgxDrpOptions = CLAIM_VIEW_DATE_PICKER_OPTIONS;
  prescriberOptions: Array<HealtheSelectOption<string>> = [];
  outcomeOptions: Array<HealtheSelectOption<string>> = [];
  activityTypeOptions: Array<HealtheSelectOption<string>> = [];
  itemNameOptions: Array<HealtheSelectOption<string>> = [];
  advancedFiltersSummary: string;

  isEmptyDataSet: boolean;
  tableCondition = TableCondition;

  pagerSizeOptions: number[] = pageSizeOptions;

  claimNumber$ = this.store$.pipe(
    select(getEncodedClaimNumber),
    takeUntil(this.onDestroy$)
  );
  customerId$ = this.store$.pipe(
    select(getEncodedCustomerId),
    takeUntil(this.onDestroy$)
  );

  tableColumns$ = this.store$.pipe(
    select(getActivityTab),
    map((tab) => {
      switch (tab) {
        case 'all':
          return ALL_TAB_COLUMNS;
        case 'pharmacy':
          return PHARMACY_TAB_COLUMNS;
        case 'clinical':
          return CLINICAL_TAB_COLUMNS;
        case 'ancillary':
          return ANCILLARY_TAB_COLUMNS;
        default:
          return ALL_TAB_COLUMNS;
      }
    })
  );

  columnViewMode$ = this.store$.pipe(select(getColumnViewState));

  exportDropdownOptions: Array<HealtheMenuOption> = [
    {
      text: 'PDF',
      action: () => {
        this.tableColumns$.pipe(first()).subscribe((tableColumns) => {
          this.export.emit({
            exportType: DocumentExportDocumentType.PDF,
            tableColumns: this.tableColumnList,
            columnOptions: tableColumns
          } as ExportParameters);
        });
      }
    },
    {
      text: 'Excel',
      action: () => {
        this.tableColumns$.pipe(first()).subscribe((tableColumns) => {
          this.export.emit({
            exportType: DocumentExportDocumentType.EXCEL,
            tableColumns: this.tableColumnList,
            columnOptions: tableColumns
          } as ExportParameters);
        });
      }
    }
  ];
  filterFormGroup: FormGroup = new FormGroup({
    prescriberName: new FormControl([]),
    outcome: new FormControl([]),
    activityType: new FormControl([]),
    itemName: new FormControl([])
  });

  dataSource: HealtheDataSource<AllActivityData> = new HealtheDataSource(
    [],
    this.filterFormGroup.valueChanges,
    this.tableColumns$ as Observable<HealtheSortableColumn[]>
  );

  @Input()
  public filterPredicates: FilterPredicates;
  exportMenuIcon = faChevronDown;

  constructor(
    public breakpointObserver: BreakpointObserver,
    public columnService: ClaimActivityTableColumnSettingsService,
    public verbiageService: VerbiageService,
    public store$: Store<ClaimViewState>,
    public dialog: MatDialog,
    private pageTitleService: PageTitleService,
    private featureFlagService: FeatureFlagService,
    protected router: Router
  ) {
    super();
    /**
     * This is where all filter changes are tracked
     */
    this.filterFormGroup.valueChanges.subscribe(
      (filterFormGroup: FilterPredicates) => {
        this.advancedFiltersSummary =
          this.refreshFilterPlaceholders(filterFormGroup);

        this.isEmptyDataSet = this.dataSource.filteredData.length === 0;
        this.filterChange.emit(filterFormGroup);
      }
    );

    this.store$
      .pipe(
        select(getActivityTab),
        takeWhile(() => this.isAlive)
      )
      .subscribe((tab) => {
        switch (tab) {
          case 'all':
            this.columnDropdownList = this.colsToOptions(ALL_TAB_COLUMNS);
            this.pageTitleService.setTitleWithClaimNumber(
              'Claim View',
              'All Activity'
            );
            break;
          case 'pharmacy':
            this.columnDropdownList = this.colsToOptions(PHARMACY_TAB_COLUMNS);
            this.pageTitleService.setTitleWithClaimNumber(
              'Claim View',
              'Pharmacy Activity'
            );
            break;
          case 'clinical':
            this.columnDropdownList = this.colsToOptions(CLINICAL_TAB_COLUMNS);
            this.pageTitleService.setTitleWithClaimNumber(
              'Claim View',
              this.featureFlagService.labelChange(
                'Clinical',
                'clinicalActivityTab'
              ) + ' Activity'
            );
            break;
          case 'ancillary':
            this.columnDropdownList = this.colsToOptions(ANCILLARY_TAB_COLUMNS);
            this.pageTitleService.setTitleWithClaimNumber(
              'Claim View',
              'Ancillary Activity'
            );
            break;
        }

        this.columnViewMode$.pipe(first()).subscribe((columnViewMode) => {
          this.applyColumnViewPreference(columnViewMode);
        });
      });

    this.initializeColumns();
  }

  private _activeColumnView: TableColumnState;

  get activeColumnView(): TableColumnState {
    return this._activeColumnView;
  }

  @Input()
  set activeColumnView(value: TableColumnState) {
    this._activeColumnView = value;
  }

  /**
   * Unfiltered data from http service.
   */
  private _activityDataSource: Array<AllActivityData>;

  get activityDataSource() {
    return this._activityDataSource;
  }

  @Input('activityDataSource')
  set activityDataSource(inputData: Array<AllActivityData>) {
    if (!inputData) {
      inputData = [];
    }
    this._activityDataSource = inputData;

    this.dataSource.data = inputData;
    this.generateDropdownData(inputData);

    combineLatest(
      this.store$.pipe(select(getActivityTab)),
      this.store$.pipe(select(getPagers))
    )
      .pipe(first())
      .subscribe(([activeTab, pagers]) => {
        // There has to be a short delay after the table updates before
        // the pager logic fires.  Also setting the pageIndex via the input property doesn't seem to work
        // after the component is initialized.
        setTimeout(() => {
          this.primaryPaginator.pageSize = pagers[activeTab].pageSize;
          this.primaryPaginator.pageIndex = pagers[activeTab].currentPage;
          this.secondaryPaginator.pageSize = pagers[activeTab].pageSize;
          this.secondaryPaginator.pageIndex = pagers[activeTab].currentPage;
        }, 10);
      });
  }

  ngOnInit() {
    this.isAlive = true;
    this.isInternetExplorer = this.breakpointObserver.isMatched([
      '(-ms-high-contrast: none) ',
      '(-ms-high-contrast: active) '
    ]);
    this.initializeTableSort();
    this.filterFormGroup.patchValue(this.filterPredicates);
  }

  // TODO: Fix this. Use OnChanges instead
  ngAfterViewInit() {
    this.dataSource.sort = this.matSort;
    if (this.primaryPaginator) {
      this.dataSource.primaryPaginator = this.primaryPaginator;
    }
    if (this.secondaryPaginator) {
      this.dataSource.secondaryPaginator = this.secondaryPaginator;
    }
  }

  pageEvent(event: PageEvent) {
    this.store$.pipe(select(getActivityTab), first()).subscribe((activeTab) => {
      this.store$.dispatch(
        new SetActivityViewPager({
          [activeTab]: {
            currentPage: event.pageIndex,
            pageSize: event.pageSize
          }
        })
      );
    });
  }

  navigateToColumnPreferences() {
    this.store$.pipe(select(getActivityTab), first()).subscribe((tab) => {
      this.store$.dispatch(new SetClaimTableListPreferencesTab(tab));
      this.store$.dispatch(new UpdateClaimViewListsCardExpanded(true));
    });
  }

  saveDefaultColumnPreferences() {
    this.store$
      .pipe(
        select(getActivityTab),
        mergeMap((tab) =>
          this.store$.pipe(
            select(getPreferenceByQuery, {
              screenName: 'global',
              componentGroupName: 'global',
              componentName: this.columnService.getComponentNameFromTab(tab),
              preferenceTypeName: PreferenceType.ColumnList
            })
          )
        ),
        first()
      )
      .subscribe((columnListPref) => {
        const patch = { ...columnListPref, value: this.tableColumnList };
        this.store$.dispatch(new SavePreferences([patch]));
      });
  }

  updateTableColumnList(pickedColumns: Array<string>) {
    if (this.isInternetExplorer) {
      this.isLoadingData = true;
    }
    if (pickedColumns && this.tableColumnList.length > pickedColumns.length) {
      let valuesToRemove = _.difference(this.tableColumnList, pickedColumns);
      _.pullAll(this.tableColumnList, valuesToRemove);
    } else if (
      pickedColumns &&
      this.tableColumnList.length < pickedColumns.length
    ) {
      let valuesToAdd = _.difference(pickedColumns, this.tableColumnList);
      this.tableColumnList = this.tableColumnList.concat(valuesToAdd);
    }
    if (this.isInternetExplorer) {
      setTimeout(() => {
        this.isLoadingData = false;
      }, 1000);
    }
    this.columnListUpdate.emit(this.tableColumnList);
  }

  applyColumnViewPreference(columnViewSelection: TableColumnState) {
    if (columnViewSelection) {
      this.tableColumns$.pipe(first()).subscribe((columns) => {
        this.activeColumnView = columnViewSelection;
        switch (columnViewSelection) {
          case TableColumnState.WrapText:
            columns.map((obj) => {
              obj.classes.push('activityView-table-wrapText');

              let index = obj.classes.indexOf(
                'activityView-table-truncateText'
              );
              if (index > -1) {
                obj.classes.splice(index, 1);
              }
            });
            break;
          case TableColumnState.TruncateText:
            columns.map((obj) => {
              obj.classes.push('activityView-table-truncateText');

              let index = obj.classes.indexOf('activityView-table-wrapText');
              if (index > -1) {
                obj.classes.splice(index, 1);
              }
            });
            break;
          case TableColumnState.ExpandColumns:
            columns.map((obj) => {
              let index = obj.classes.indexOf('activityView-table-wrapText');
              if (index > -1) {
                obj.classes.splice(index, 1);
              }

              index = obj.classes.indexOf('activityView-table-truncateText');
              if (index > -1) {
                obj.classes.splice(index, 1);
              }
            });
        }

        this.columnViewChange.emit(columnViewSelection);
      });
    }
  }

  colsToOptions(
    cols: Partial<HealtheTableColumnDef>[]
  ): Array<HealtheSelectOption<string>> {
    return cols.map((col: HealtheTableColumnDef) => {
      return {
        label: col.label,
        value: col.name,
        isDisabled: false
      };
    });
  }

  getVerbage(verbage: TableCondition) {
    return this.verbiageService.getTableVerbiage(verbage);
  }

  _dateRangeChange(range: Range) {
    this.dateRangeChange.emit(range);
  }

  public generateDropdownData(rows: Array<AllActivityData>) {
    this.generateActivityFilterOptions(
      rows,
      this.filterFormGroup.controls['activityType']
    );
    this.generateOutcomeFilterOptions(
      rows,
      this.filterFormGroup.controls['outcome']
    );
    this.generatePrescriberFilterOptions(
      rows,
      this.filterFormGroup.controls['prescriberName']
    );
    this.generateItemNameFilterOptions(
      rows,
      this.filterFormGroup.controls['itemName']
    );
    this.filterChange.emit(this.filterFormGroup.getRawValue());
  }

  getTypeLabel(activeTabName) {
    switch (activeTabName?.toLowerCase()) {
      case 'pharmacy':
      case 'clinical':
        return 'Activity Type';
      case 'ancillary':
        return 'Service Type';
      default:
        return 'Type';
    }
  }

  getOutcomeLabel(activeTabName) {
    switch (activeTabName?.toLowerCase()) {
      case 'pharmacy':
      case 'clinical':
        return 'Outcome';
      case 'ancillary':
        return 'Status';
      default:
        return 'Outcome / Status';
    }
  }

  refreshFilterPlaceholders(filterGroupValues: FilterPredicates) {
    const prescriberPlaceholder = this.getPlaceholderText(
      filterGroupValues.prescriberName.length,
      this.prescriberOptions.length,
      'Prescribers'
    );
    let typeLabel, outcomeLabel;
    switch (this.activeTabName?.toLowerCase()) {
      case 'all':
        typeLabel = 'Types';
        outcomeLabel = 'Outcomes / Statuses';
        break;
      case 'pharmacy':
      case 'clinical':
        typeLabel = 'Activity Types';
        outcomeLabel = 'Outcomes';
        break;

      case 'ancillary':
        typeLabel = 'Service Types';
        outcomeLabel = 'Statuses';
        break;
      default:
        typeLabel = 'Types';
        outcomeLabel = 'Outcomes / Statuses';
    }
    const activityPlaceholder: FilterPlaceholder = this.getPlaceholderText(
      filterGroupValues.activityType.length,
      this.activityTypeOptions.length,
      typeLabel
    );

    const outcomePlaceholder: FilterPlaceholder = this.getPlaceholderText(
      filterGroupValues.outcome.length,
      this.outcomeOptions.length,
      outcomeLabel
    );

    const itemNamePlaceholder: FilterPlaceholder = this.getPlaceholderText(
      filterGroupValues.itemName.length,
      this.itemNameOptions.length,
      'Item Names'
    );

    return (
      prescriberPlaceholder.summaryText +
      ', ' +
      outcomePlaceholder.summaryText +
      ', ' +
      activityPlaceholder.summaryText +
      ', ' +
      itemNamePlaceholder.summaryText
    );
  }

  getPlaceholderText(
    appliedOptionsLength: number,
    totalOptionsLength: number,
    filterName: string
  ) {
    const placeholder: FilterPlaceholder = new FilterPlaceholder();
    placeholder.summaryText =
      filterName +
      ' (' +
      appliedOptionsLength +
      ' of ' +
      totalOptionsLength +
      ')';
    return placeholder;
  }

  clearFilters(): void {
    const optionsToValue = (arr) =>
      arr
        .map((option) => option.value)
        .filter((option) => option !== undefined);
    this.filterFormGroup.setValue({
      prescriberName: optionsToValue(this.prescriberOptions),
      outcome: optionsToValue(this.outcomeOptions),
      activityType: optionsToValue(this.activityTypeOptions),
      itemName: optionsToValue(this.itemNameOptions)
    });
    this.filterChange.emit(this.filterFormGroup.getRawValue());
  }

  setOpenUntilClose(exportMenu: MatMenu) {
    this.exportMenuIcon = faChevronUp;
    exportMenu.closed.subscribe(() => {
      this.exportMenuIcon = faChevronDown;
    });
  }

  getItemNameTriggerText() {
    let text;
    const controlValue = this.filterFormGroup.controls['itemName'].value;
    if (controlValue.length === this.itemNameOptions.length) {
      text = 'All item names';
    } else {
      text =
        'Showing ' + controlValue.length + ' of ' + this.itemNameOptions.length;
    }
    return text;
  }

  getActivityTypeTriggerText() {
    let text;
    const controlValue = this.filterFormGroup.controls['activityType'].value;
    if (controlValue.length === this.activityTypeOptions.length) {
      switch (this.activeTabName?.toLowerCase()) {
        case 'pharmacy':
        case 'clinical':
          text = 'All activity types';
          break;

        case 'ancillary':
          text = 'All service types';
          break;

        default:
          text = 'All types';
      }
    } else {
      text =
        'Showing ' +
        controlValue.length +
        ' of ' +
        this.activityTypeOptions.length;
    }
    return text;
  }

  getOutcomeTriggerText() {
    let text;
    const controlValue = this.filterFormGroup.controls['outcome'].value;
    if (controlValue.length === this.outcomeOptions.length) {
      switch (this.activeTabName?.toLowerCase()) {
        case 'pharmacy':
        case 'clinical':
          text = 'All outcomes';
          break;
        case 'ancillary':
          text = 'All statuses';
          break;
        default:
          text = 'All outcomes / statuses';
      }
    } else {
      text =
        'Showing ' + controlValue.length + ' of ' + this.outcomeOptions.length;
    }
    return text;
  }

  getPrescriberTriggerText() {
    let text;
    const controlValue = this.filterFormGroup.controls['prescriberName'].value;
    if (controlValue.length === this.prescriberOptions.length) {
      text = 'All prescribers';
    } else {
      text =
        'Showing ' +
        controlValue.length +
        ' of ' +
        this.prescriberOptions.length;
    }
    return text;
  }

  linkable(column: Partial<HealtheTableColumnDef>, data: any) {
    return (
      column.name === 'activityType' &&
      [
        'POS (ePAQ)',
        'Mail Order Referral',
        'Paper Bill Roster',
        'DME - Referral',
        'DME - Request',
        'Home Health - Referral',
        'Home Health - Request',
        'Transportation - Referral',
        'Transportation - Request',
        'Language - Referral',
        'Language - Request',
        'Clinical - Referral',
        'Clinical - Request',
        'Physical Medicine - Referral',
        'Physical Medicine - Request',
        'Implants - Referral',
        'Implants - Request',
        'Diagnostics - Referral',
        'Diagnostics - Request'
      ].indexOf(data.activityType) > -1 // shit check since we like hard-coding
    );
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  /**
   * Table Methods
   */
  private initializeTableSort() {
    // Fetches column sort value from NGRX initial state (via first) and sorts the table appropriately
    this.store$.pipe(first(), select(getColumnSort)).subscribe((sortable) => {
      this.matSort.sort(sortable);
    });

    this.matSort.sortChange.subscribe((value: Sort) => {
      this.columnSortChange.emit({
        id: value.active,
        start: value.direction as any,
        disableClear: false
      });
    });
  }

  private initializeColumns() {
    this.tableColumns$.pipe(first()).subscribe((tableColumns) => {
      this.columnDropdownList = this.colsToOptions(tableColumns);

      this.tableColumnList = this.columnDropdownList
        .map((column) => {
          if (!column.isDisabled && column.value) {
            return column.value;
          }
        })
        .filter((column) => column);
    });
  }

  private generateActivityFilterOptions(
    rows: Array<AllActivityData>,
    control: AbstractControl
  ) {
    from(rows)
      .pipe(
        distinct((event) => {
          return event.activityType;
        }),
        map((event: AllActivityData) => {
          return {
            value: event.activityType,
            label: event.activityType,
            isSelected: true,
            isDisabled: false
          };
        }),
        toArray()
      )
      .subscribe((options) => {
        this.activityTypeOptions = _.sortBy(options, ['label']);
        control.setValue(options.map((option) => option.value));
      });
  }

  private generateOutcomeFilterOptions(
    rows: Array<AllActivityData>,
    control: AbstractControl
  ) {
    from(rows)
      .pipe(
        distinct((event) => event.outcome),
        map((event: AllActivityData) => {
          if (event) {
            return {
              value: event.outcome,
              label: event.outcome,
              isSelected: true,
              isDisabled: false
            };
          }
        }),
        toArray()
      )
      .subscribe((options) => {
        this.outcomeOptions = _.sortBy(options, ['label']);
        control.setValue(options.map((option) => option.value));
      });
  }

  private generatePrescriberFilterOptions(
    rows: Array<AllActivityData>,
    control: AbstractControl
  ) {
    from(rows)
      .pipe(
        distinct((event) => event.prescriberName),
        map((event: AllActivityData) => {
          if (event) {
            if (
              event.prescriberName == null ||
              event.prescriberName.trim().length === 0
            ) {
              return {
                value: event.prescriberName,
                label: 'No Prescriber',
                isSelected: true,
                isDisabled: false
              };
            } else {
              return {
                value: event.prescriberName,
                label: event.prescriberName,
                isSelected: true,
                isDisabled: false
              };
            }
          }
        }),
        toArray()
      )
      .subscribe((options) => {
        this.prescriberOptions = _.sortBy(options, ['label']);
        control.setValue(options.map((option) => option.value));
      });
  }

  private generateItemNameFilterOptions(
    rows: Array<AllActivityData>,
    control: AbstractControl
  ) {
    from(rows)
      .pipe(
        distinct((event) => {
          return event.itemName;
        }),
        map((event: AllActivityData) => {
          if (event.itemName == null || event.itemName.trim().length === 0) {
            return {
              value: event.itemName,
              label: 'No Item Name',
              isSelected: true,
              isDisabled: false
            };
          } else {
            return {
              value: event.itemName,
              label: event.itemName,
              isSelected: true,
              isDisabled: false
            };
          }
        }),
        toArray()
      )
      .subscribe((options) => {
        this.itemNameOptions = _.sortBy(options, ['label']);
        control.setValue(options.map((option) => option.value));
      });
  }

  private filterNonHeaderClasses(classes: string[]): string[] {
    return classes.filter((value) => !value.includes('activityView-table-'));
  }

  private openActivityLink(activity: AllActivityData) {
    if (activity.isVertice30Link && activity.activityId) {
      if (activity.productType === 'Ancillary') {
        this.zipPipeFirstClaimNumberAndCustomerId().subscribe(
          ([claimNumber, customerId]) => {
            customerId = hexDecode(customerId);
            claimNumber = hexDecode(claimNumber);

            window.open(
              generate3_0ABMReferralActivityTabUrl(
                customerId,
                claimNumber,
                activity.activityId,
                activity.serviceCode,
                activity.isLegacy
              ),
              '_blank'
            );
          }
        );
      } else if (activity.activityType === 'POS (ePAQ)') {
        this.zipPipeFirstClaimNumberAndCustomerId().subscribe(
          ([claimNumber, customerId]) => {
            customerId = hexDecode(customerId);
            claimNumber = hexDecode(claimNumber);

            // All claim view links are currently planned to open as external
            // links as in there is no view filtering the lines displayed for that authorization
            window.open(
              generateExternal3_0PBMAuthorizationTabUrl(
                customerId,
                claimNumber,
                activity.activityId,
                'pos'
              ),
              '_blank'
            );
          }
        );
      }
    } else {
      openCenteredNewWindowDefaultSize(activity.vertice25Link);
    }
  }

  zipPipeFirstClaimNumberAndCustomerId(): Observable<[string, string]> {
    return zip(this.claimNumber$, this.customerId$).pipe(first());
  }
}

export interface FilterOptions {
  prescriberName: Array<HealtheSelectOption<string>>;
  outcome: Array<HealtheSelectOption<string>>;
  activityType: Array<HealtheSelectOption<string>>;
  itemName: Array<HealtheSelectOption<string>>;
}
