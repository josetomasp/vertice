import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgxDrpOptions, Range } from '@healthe/vertice-library';
import { DATE_PICKER_BASE_OPTIONS } from '../../../claim-view/activity/activity-table/date-picker-options';
import { FormControl, FormGroup } from '@angular/forms';

import { combineLatest, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../store/selectors/router.selectors';
import { distinctUntilChanged, first, map, takeWhile } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.dev-remote';
import { RootState } from '../../../store/models/root.models';
import { BreakpointObserver } from '@angular/cdk/layout';

import { HealtheSelectOption } from '../../models/select-option.interface';

import {
  columnViewOptions,
  TableColumnState
} from '../../models/table-column-state';

import * as _ from 'lodash';
import { SavePreferences } from '../../../preferences/store/actions/preferences.actions';
import {
  Preference,
  PreferenceType
} from '../../../preferences/store/models/preferences.models';
import { getPreferenceByQuery } from '../../../preferences/store/selectors/user-preferences.selectors';
import { MatMenu } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';

import * as _moment from 'moment';
import { PHARMACY_TAB_COLUMNS } from '../../../claim-view/activity/activity-table/columns';
import {
  getClinicalHistory,
  getClinicalHistoryAllFilters,
  getClinicalHistoryCurrentFilters,
  getClinicalHistoryDateRange,
  getClinicalHistoryIsLoading,
  getClinicalHistoryTableColumns,
  getClinicalHistoryTableColumnState,
  getClinicalHistoryTableSort
} from '@shared/store/selectors/clinicalHistory.selectors';

import { HealtheTableColumnDef } from '@shared/models/table-column';
import { pluckPrefValue } from '@shared/lib/store/pluckPrefValue';
import {
  SetClaimTableListPreferencesTab,
  UpdateClaimViewListsCardExpanded
} from '../../../preferences/store/actions/preferences-screen.actions';
import { AllActivityData } from '@shared/models/claim-activity-data';
import { faSyncAlt } from '@fortawesome/pro-solid-svg-icons';
import {
  SharedClaimHistoryExportParameters,
  SharedClaimHistoryFilters,
  SharedClaimHistoryFiltersTriggerText
} from '@shared/store/models/sharedClaimHistory.models';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '@shared/models/healthe-data-source';
import { pageSizeOptions } from '@shared/models/pagerOptions';
import { TableCondition, VerbiageService } from '../../../verbiage.service';
import {
  exportClinicalHistory,
  loadClinicalHistory,
  setClinicalHistoryCurrentFilters,
  setClinicalHistoryDateRange,
  setClinicalHistoryTableColumns,
  setClinicalHistoryTableColumnState
} from '@shared/store/actions/clinicalHistory.actions';
import { PageTitleService } from '@shared/service/page-title.service';

const moment = _moment;

/**
 * Looks like this is only used in the pbm-auth-clinical-history component.
 * See if we can move ownership from this shared module to the pbm module
 */
@Component({
  selector: 'healthe-clinical-history',
  templateUrl: './clinical-history.component.html',
  styleUrls: ['./clinical-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicalHistoryComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  primarySectionTitle: string;

  datePickerOptions: NgxDrpOptions = DATE_PICKER_BASE_OPTIONS;
  dateRangeFormControl: FormControl = new FormControl();

  dateRange$: Observable<Range> = this.store$.pipe(
    select(getClinicalHistoryDateRange)
  );

  exportMenuIcon = ['far', 'fa-chevron-down'];
  exportDropdownOptions = ['PDF', 'Excel'];

  masterColumnList = PHARMACY_TAB_COLUMNS;
  columnViewOptions = columnViewOptions;
  selectedColumnList$: Observable<Array<string>> = this.store$.pipe(
    select(getClinicalHistoryTableColumns)
  );
  tableColumnState$: Observable<TableColumnState> = this.store$.pipe(
    select(getClinicalHistoryTableColumnState)
  );
  columnListQuery = {
    screenName: 'global',
    preferenceTypeName: PreferenceType.ColumnList,
    componentName: 'globalPharmacyActivityTable'
  };
  columnListPreference$: Observable<Preference<string[]>> = this.store$.pipe(
    select(getPreferenceByQuery, this.columnListQuery)
  );

  clinicalHistory$: Observable<AllActivityData[]> = this.store$.pipe(
    select(getClinicalHistory)
  );

  allClinicalHistoryFilters$: Observable<
    SharedClaimHistoryFilters
  > = this.store$.pipe(select(getClinicalHistoryAllFilters));

  currentSort$: Observable<MatSortable> = this.store$.pipe(
    select(getClinicalHistoryTableSort)
  );

  isLoading$: Observable<boolean> = this.store$.pipe(
    select(getClinicalHistoryIsLoading)
  );

  pageSize$ = this.store$.pipe(
    select(getPreferenceByQuery, {
      screenName: 'global',
      preferenceTypeName: PreferenceType.PageSize
    }),
    pluckPrefValue
  );

  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild('primaryPaginator', { static: true })
  primaryPaginator: MatPaginator;
  @ViewChild('secondaryPaginator', { static: true })
  secondaryPaginator: MatPaginator;

  clinicalHistoryFilterFormGroup: FormGroup = new FormGroup({
    prescriberName: new FormControl([]),
    outcome: new FormControl([]),
    activityType: new FormControl([]),
    itemName: new FormControl([])
  });

  clinicalHistoryFilterTriggerText: SharedClaimHistoryFiltersTriggerText = {
    prescriberName: 'All prescribers',
    outcome: 'All outcomes',
    activityType: 'All activity types',
    itemName: 'All item names'
  };

  advancedFiltersSummary: string = '';
  tableColumnList: Array<string> = [];
  columnDropdownList: Array<HealtheSelectOption<string>>;
  isInternetExplorer: boolean;
  ieColumnResetHackDisplay: boolean = true;
  isAlive: boolean = true;
  faSyncAlt = faSyncAlt;
  tableClass: string = '';
  pagerSizeOptions: number[] = pageSizeOptions;
  additionalColumnClasses: string = '';
  tableCondition = TableCondition;

  dataSource = new HealtheDataSource(
    this.clinicalHistory$,
    this.clinicalHistoryFilterFormGroup.valueChanges,
    this.masterColumnList as HealtheSortableColumn[]
  );

  constructor(
    public store$: Store<RootState>,
    public breakpointObserver: BreakpointObserver,
    public verbiageService: VerbiageService,
    private pageTitleService: PageTitleService
  ) {}

  ngOnInit() {
    if (this.primarySectionTitle) {
      this.pageTitleService.setTitleWithClaimNumber(
        this.primarySectionTitle,
        'Clinical History'
      );
    }

    this.dateRange$.pipe(first()).subscribe((dateRange) => {
      this.dateRangeFormControl.setValue(dateRange);
    });
    this.isInternetExplorer = this.breakpointObserver.isMatched([
      '(-ms-high-contrast: none) ',
      '(-ms-high-contrast: active) '
    ]);

    combineLatest([
      this.selectedColumnList$,
      this.columnListPreference$.pipe(pluckPrefValue)
    ])
      .pipe(first())
      .subscribe(([componentColumns, prefsColumns]: [string[], string[]]) => {
        this.initializeColumns();
        if (componentColumns.length === 0) {
          this.tableColumnList = prefsColumns;
          this.store$.dispatch(
            setClinicalHistoryTableColumns({ tableColumns: prefsColumns })
          );
        } else {
          this.tableColumnList = componentColumns;
        }
      });

    // additional subscription to preference columns so that if they load slower we'll still use them
    this.columnListPreference$
      .pipe(
        takeWhile(() => this.isAlive),
        pluckPrefValue
      )
      .subscribe(
        (prefsColumns: string[]) => (this.tableColumnList = prefsColumns)
      );

    this.isLoading$
      .pipe(
        takeWhile(() => this.isAlive),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        if (false === value) {
          this.clearFilters();
        }
      });

    this.clinicalHistory$
      .pipe(first())
      .subscribe((historyData: AllActivityData[]) => {
        if (historyData.length === 0) {
          this.refreshData();
        }
      });

    // Setup our advanced filter summary and select place holders
    combineLatest([
      this.allClinicalHistoryFilters$,
      this.clinicalHistoryFilterFormGroup.valueChanges
    ])
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(
        ([allFilters, currentFilters]: [
          SharedClaimHistoryFilters,
          SharedClaimHistoryFilters
        ]) => {
          // Filter Dropdown Placeholder texts
          let triggerTexts: SharedClaimHistoryFiltersTriggerText = {
            prescriberName: 'All prescribers',
            outcome: 'All outcomes',
            activityType: 'All activity types',
            itemName: 'All item names'
          };

          triggerTexts.itemName = this.getShowingText(
            currentFilters.itemName,
            allFilters.itemName,
            triggerTexts.itemName
          );

          triggerTexts.activityType = this.getShowingText(
            currentFilters.activityType,
            allFilters.activityType,
            triggerTexts.activityType
          );

          triggerTexts.outcome = this.getShowingText(
            currentFilters.outcome,
            allFilters.outcome,
            triggerTexts.outcome
          );

          triggerTexts.prescriberName = this.getShowingText(
            currentFilters.prescriberName,
            allFilters.prescriberName,
            triggerTexts.prescriberName
          );

          this.clinicalHistoryFilterTriggerText = triggerTexts;

          // Summary
          this.advancedFiltersSummary = '';
          this.advancedFiltersSummary +=
            'Prescribers (' +
            currentFilters.prescriberName.length +
            ' of ' +
            allFilters.prescriberName.length +
            '), ';

          this.advancedFiltersSummary +=
            'Outcomes (' +
            currentFilters.outcome.length +
            ' of ' +
            allFilters.outcome.length +
            '), ';

          this.advancedFiltersSummary +=
            'Activity Types (' +
            currentFilters.activityType.length +
            ' of ' +
            allFilters.activityType.length +
            '), ';

          this.advancedFiltersSummary +=
            'Item Names (' +
            currentFilters.itemName.length +
            ' of ' +
            allFilters.itemName.length +
            ')';
        }
      );

    this.store$
      .pipe(
        select(getClinicalHistoryCurrentFilters),
        first(
          (filters: SharedClaimHistoryFilters) => filters.itemName.length > 0
        )
      )
      .subscribe((value: SharedClaimHistoryFilters) => {
        this.clinicalHistoryFilterFormGroup.setValue(value, {
          emitEvent: true
        });
      });

    this.tableColumnState$
      .pipe(
        takeWhile(() => this.isAlive),
        distinctUntilChanged()
      )
      .subscribe((state) => {
        this.tableClass = '';

        switch (state) {
          case TableColumnState.WrapText:
            this.additionalColumnClasses = 'sharedHistory-table-wrapText';
            break;
          case TableColumnState.ExpandColumns:
            this.tableClass = 'sharedHistory-table-fitColumnToData';
            break;
          case TableColumnState.TruncateText:
            this.additionalColumnClasses = 'sharedHistory-table-truncateText';
            break;
        }
      });
    // End ngOnInit
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort;
    this.dataSource.primaryPaginator = this.primaryPaginator;
    this.dataSource.secondaryPaginator = this.secondaryPaginator;
  }

  getVerbage(verbage: TableCondition) {
    return this.verbiageService.getTableVerbiage(verbage);
  }

  private getShowingText(
    filtersSelected: Array<string>,
    totalPossible: Array<string>,
    allSelectedText: string
  ): string {
    if (filtersSelected.length !== totalPossible.length) {
      return (
        'Showing ' + filtersSelected.length + ' of ' + totalPossible.length
      );
    }
    return allSelectedText;
  }

  updateTableColumnList(pickedColumns: Array<string>) {
    // IE will mess up column widths when unhiding columns.  The following flag is used
    // to hide the table and display the isloading html until the new columns are displayed.
    // This effect of hiding the table and showing it again gets around the css problem on IE.
    // Also IE is ungodly slow and it gives the user something to look at while IE is taking its
    // sweet, sweet time hiding or unhiding columns.
    if (this.isInternetExplorer) {
      this.ieColumnResetHackDisplay = false;
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
        this.ieColumnResetHackDisplay = true;
      }, 1000);
    }
    if (pickedColumns) {
      this.store$.dispatch(
        setClinicalHistoryTableColumns({ tableColumns: pickedColumns })
      );
    }
  }

  navigateToColumnPreferences() {
    this.store$.dispatch(new SetClaimTableListPreferencesTab('pharmacy'));
    this.store$.dispatch(new UpdateClaimViewListsCardExpanded(true));
  }

  applyColumnViewPreference(columnViewSelection: TableColumnState) {
    this.store$.dispatch(
      setClinicalHistoryTableColumnState({
        tableColumnState: columnViewSelection
      })
    );
  }

  public getDefaultTabColumns(): string[] {
    return PHARMACY_TAB_COLUMNS.filter((col) => col.defaultColumn).map(
      (col) => col.name
    );
  }

  saveDefaultColumnPreferences() {
    if (this.tableColumnList.length === 0) {
      this.tableColumnList = this.getDefaultTabColumns();
    }
    this.columnListPreference$
      .pipe(first())
      .subscribe((columnListPreference) => {
        let patch = { ...columnListPreference, value: this.tableColumnList };
        this.store$.dispatch(new SavePreferences([patch]));
      });
  }

  refreshData() {
    this.dateRange$.pipe(first()).subscribe((dateRange) => {
      this.dateRangeFormControl.setValue(dateRange);
      this.store$.dispatch(loadClinicalHistory({ range: dateRange }));
    });
  }

  dateRangeChange(range: Range) {
    this.store$.dispatch(setClinicalHistoryDateRange({ range }));
    this.refreshData();
  }
  submit() {
    const dateRange = this.dateRangeFormControl.value;
    this.dateRangeChange(dateRange);
  }

  setOpenUntilClose(exportMenu: MatMenu) {
    this.exportMenuIcon = ['far', 'fa-chevron-up'];
    exportMenu.closed.pipe(first()).subscribe(() => {
      this.exportMenuIcon = ['far', 'fa-chevron-down'];
    });
  }

  doExport(exportType: string) {
    combineLatest([
      this.store$.pipe(select(getEncodedClaimNumber)),
      this.store$.pipe(select(getEncodedCustomerId)),
      this.selectedColumnList$,
      this.dateRange$
    ])
      .pipe(
        first(),
        map(([claimNumber, customerId, columnList, dateRange]) => {
          const options: SharedClaimHistoryExportParameters = new SharedClaimHistoryExportParameters();
          options.claimNumber = claimNumber;
          options.customerId = customerId;
          options.exportType = exportType.toUpperCase();
          options.fromDate = moment(dateRange.fromDate).format(
            environment.dateFormat
          );
          options.toDate = moment(dateRange.toDate).format(
            environment.dateFormat
          );

          options.prescriberName = this.clinicalHistoryFilterFormGroup.get(
            'prescriberName'
          ).value;
          options.outcome = this.clinicalHistoryFilterFormGroup.get(
            'outcome'
          ).value;
          options.activityType = this.clinicalHistoryFilterFormGroup.get(
            'activityType'
          ).value;
          options.itemName = this.clinicalHistoryFilterFormGroup.get(
            'itemName'
          ).value;

          options.columns = this.masterColumnList
            .filter((columnDef) => columnList.includes(columnDef.name))
            .map((col) => {
              return { columnTitle: col.label, columnPropertyName: col.name };
            });
          return exportClinicalHistory({ exportParams: options });
        })
      )
      .subscribe((action) => this.store$.dispatch(action));
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

  private initializeColumns() {
    this.columnDropdownList = this.colsToOptions(this.masterColumnList);
    this.tableColumnList = this.columnDropdownList
      .map((column) => {
        if (!column.isDisabled && column.value) {
          return column.value;
        }
      })
      .filter((column) => column);
  }

  linkable(column: Partial<HealtheTableColumnDef>, data: any) {
    return (
      column.name === 'activityType' &&
      [
        'EPAQ',
        'EPAQ - Yellow',
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

  ngOnDestroy() {
    this.isAlive = false;
    this.store$.dispatch(
      setClinicalHistoryCurrentFilters({
        currentTableFilters: this.clinicalHistoryFilterFormGroup.value
      })
    );
  }

  clearFilters() {
    this.allClinicalHistoryFilters$.pipe(first()).subscribe((value) => {
      this.clinicalHistoryFilterFormGroup.reset(value);
    });
  }
}
