import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { NgxDrpOptions, Range } from '@healthe/vertice-library';
import { select, Store } from '@ngrx/store';
import {
  columnViewOptions,
  HealtheSelectOption,
  pageSizeOptions,
  TableColumnState
} from '@shared';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '@shared/models/healthe-data-source';
import { HealtheTableColumnDef } from '@shared/models/table-column';
import * as _ from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  takeUntil,
} from 'rxjs/operators';
import { SetClaimTableListPreferencesTab } from 'src/app/preferences/store/actions/preferences-screen.actions';
import { SavePreferences } from '../../preferences/store/actions/preferences.actions';
import {
  Preference,
  PreferenceType
} from '../../preferences/store/models/preferences.models';
import { getPreferenceByQuery } from '../../preferences/store/selectors/user-preferences.selectors';
import { RootState } from '../../store/models/root.models';
import {
  getDecodedClaimNumber,
} from '../../store/selectors/router.selectors';

import {
  BillingFilters,
  BillingFilterTriggerText,
  BillingHistory, BillingHistoryItem
} from '../store/models/billing.models';
import { CLAIM_VIEW_DATE_PICKER_OPTIONS } from '../store/models/claim-view.models';
import { LabelValue } from '../store/models/eligibility-tab.models';
import { BillingService } from './billing.service';
import { BILLING_TAB_COLUMNS } from './columns';
import { PageTitleService } from '@shared/service/page-title.service';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import {
  ClaimViewBillingTabStore
} from './claim-view-billing-tab.store';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import {
  GeneralExporterService,
  GeneralExportRequest
} from '@modules/general-exporter';

interface BillingTabViewModel {
  tableColumnState: TableColumnState;
  pageSize: number;
  dateRange: Range;
  tableColumnList: string[];
  billingHistory: BillingHistory;
  billingHistoryTableData: BillingHistoryItem[];
  allBillingFilters: BillingFilters;
  currentBillingFilters: BillingFilters;
  isLoading: boolean;
  errors: string[];
  tableSort:MatSortable;
}

@Component({
  selector: 'healthe-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingComponent
  extends DestroyableComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  readonly viewModel$: Observable<BillingTabViewModel> =
    this.componentStore.select(
      ({
        tableColumnState,
        pageSize,
        dateRange,
        tableColumnList,
        billingHistory,
        billingHistoryTableData,
        allBillingFilters,
        currentBillingFilters,
        isLoading,
        errors,
        tableSort
      }) => ({
        tableColumnState,
        pageSize,
        dateRange,
        tableColumnList,
        billingHistory,
        billingHistoryTableData,
        allBillingFilters,
        currentBillingFilters,
        isLoading,
        errors,
        tableSort
      })
    );

  constructor(
    public store$: Store<RootState>,
    private billingService: BillingService,
    public dialog: MatDialog,
    private pageTitleService: PageTitleService,
    private componentStore: ClaimViewBillingTabStore,
    private generalExporterService: GeneralExporterService,
  ) {
    super();
    this.pageTitleService.setTitleWithClaimNumber('Claim View', 'Billing');
  }

  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild('primaryPaginator')
  primaryPaginator: MatPaginator;

  @ViewChild('secondaryPaginator')
  secondaryPaginator: MatPaginator;

  columnListPreference$: Observable<Preference<string[]>> = this.store$.pipe(
    select(getPreferenceByQuery, {
      screenName: 'global',
      preferenceTypeName: PreferenceType.ColumnList,
      componentName: 'globalBillingActivityTable'
    })
  );

  totalsSummary: Array<LabelValue>;
  exportMenuIcon = faChevronDown;
  exportDropdownOptions = ['PDF', 'Excel'];
  datePickerOptions: NgxDrpOptions = CLAIM_VIEW_DATE_PICKER_OPTIONS;
  isAlive: boolean = true;
  masterColumnList = BILLING_TAB_COLUMNS;
  columnDropdownList: Array<HealtheSelectOption<string>>;
  tableClass: string = '';

  dateRangeFormControl: FormControl = new FormControl();
  billingFilterFormGroup: FormGroup = new FormGroup({
    productType: new FormControl([]),
    prescriberName: new FormControl([]),
    itemName: new FormControl([]),
    status: new FormControl([])
  });

  billingFilterTriggerText = {
    itemName: 'All Item Names',
    product: 'All Products',
    prescriberName: 'All Prescribers',
    status: 'All Statuses'
  };

  advancedFiltersSummary: string = '';
  columnViewOptions = columnViewOptions;
  dataSource = new HealtheDataSource(
    this.viewModel$.pipe(map(vm => vm.billingHistoryTableData)),
    this.billingFilterFormGroup.valueChanges,
    this.masterColumnList as HealtheSortableColumn[]
  );

  pagerSizeOptions: number[] = pageSizeOptions;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort;
    this.dataSource.primaryPaginator = this.primaryPaginator;
    this.dataSource.secondaryPaginator = this.secondaryPaginator;

    this.primaryPaginator.page
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.componentStore.setPageSize(value.pageSize);
      });

    this.billingFilterFormGroup.valueChanges.pipe(takeUntil(this.onDestroy$), debounceTime(500)).subscribe(value => {
      this.componentStore.setCurrentBillingFilters(value);
    });
  }

  ngOnInit() {
    this.componentStore.init();
    this.viewModel$.pipe(first()).subscribe((viewModel) => {
      this.columnDropdownList = this.colsToOptions(this.masterColumnList);
      this.dateRangeFormControl.setValue(viewModel.dateRange);
    });

    this.viewModel$
      .pipe(
        takeUntil(this.onDestroy$),
        map( vm => vm.isLoading),
        distinctUntilChanged()
      )
      .subscribe((isLoading) => {
        if (false === isLoading) {
          this.clearFilters();
        }
      });

    this.viewModel$
      .pipe(takeUntil(this.onDestroy$), map ( vm => vm.billingHistory))
      .subscribe((billingHistory) => {
        if (null == billingHistory) {
          return;
        }

        this.totalsSummary = new Array<LabelValue>();
        this.totalsSummary.push({
          label: 'TOTAL BILLED AMOUNT',
          value: '' + billingHistory.totalBilledAmount
        });
        this.totalsSummary.push({
          label: 'TOTAL PAID AMOUNT',
          value: '' + billingHistory.totalPaidAmount
        });
        this.totalsSummary.push({
          label: 'TOTAL PAID FEE',
          value: '' + billingHistory.totalPaidFee
        });
        this.totalsSummary.push({
          label: 'TOTAL UC/FEE AMOUNT',
          value: '' + billingHistory.totalUcFeeAmount
        });
      });

    // Setup our advanced filter summary and select place holders
    combineLatest([
      this.viewModel$.pipe(map( vm => vm.allBillingFilters)),
      this.billingFilterFormGroup.valueChanges
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        ([allFilters, currentFilters]: [BillingFilters, BillingFilters]) => {
          // Filter Dropdown Placeholder texts
          let triggerTexts: BillingFilterTriggerText = {
            itemName: 'All Item Names',
            product: 'All Products',
            prescriberName: 'All Prescribers',
            status: 'All Statuses'
          };

          triggerTexts.itemName = this.getShowingText(
            currentFilters.itemName,
            allFilters.itemName,
            triggerTexts.itemName
          );

          triggerTexts.prescriberName = this.getShowingText(
            currentFilters.prescriberName,
            allFilters.prescriberName,
            triggerTexts.prescriberName
          );

          triggerTexts.product = this.getShowingText(
            currentFilters.productType,
            allFilters.productType,
            triggerTexts.product
          );

          triggerTexts.status = this.getShowingText(
            currentFilters.status,
            allFilters.status,
            triggerTexts.status
          );

          this.billingFilterTriggerText = triggerTexts;

          // Summary
          this.advancedFiltersSummary = '';
          this.advancedFiltersSummary +=
            'Products (' +
            currentFilters.productType.length +
            ' of ' +
            allFilters.productType.length +
            '), ';

          this.advancedFiltersSummary +=
            'Prescribers (' +
            currentFilters.prescriberName.length +
            ' of ' +
            allFilters.prescriberName.length +
            '), ';

          this.advancedFiltersSummary +=
            'Item Names (' +
            currentFilters.itemName.length +
            ' of ' +
            allFilters.itemName.length +
            '), ';

          this.advancedFiltersSummary +=
            'Statuses (' +
            currentFilters.status.length +
            ' of ' +
            allFilters.status.length +
            ')';
        }
      );

    this.viewModel$
      .pipe(
        map( vm => vm.currentBillingFilters),
        first((filters: BillingFilters) => filters.itemName.length > 0)
      )
      .subscribe((filters: BillingFilters) => {
        this.billingFilterFormGroup.setValue(
          {
            productType: filters.productType,
            prescriberName: filters.prescriberName,
            itemName: filters.itemName,
            status: filters.status
          },
          { emitEvent: true }
        );
      });

    // END ngOnInit
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

  setOpenUntilClose(exportMenu: MatMenu) {
    this.exportMenuIcon = faChevronUp;
    exportMenu.closed.pipe(first()).subscribe(() => {
      this.exportMenuIcon = faChevronDown;
    });
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

  updateTableColumnList(pickedColumns: Array<string>) {
    this.componentStore.setTableColumnList(pickedColumns);
  }

  applyColumnViewPreference(columnViewSelection: TableColumnState) {
    this.componentStore.setTableColumnState(columnViewSelection);
  }

  getColumnClasses(
    column: Partial<HealtheTableColumnDef>
  ): Observable<string[]> {
    return this.viewModel$.pipe(
      map((vm: BillingTabViewModel) => {
        let newClasses = [...column.classes];

        this.tableClass = '';

        switch (vm.tableColumnState) {
          case TableColumnState.WrapText:
            newClasses.push('billing-table-wrapText');
            break;
          case TableColumnState.ExpandColumns:
            this.tableClass = 'billing-table-fitColumnToData';
            break;
          case TableColumnState.TruncateText:
            newClasses.push('billing-table-truncateText');
            break;
        }

        return newClasses;
      })
    );
  }

  saveDefaultColumnPreferences() {
    let tableColumnList: string[];
    this.viewModel$.pipe(first()).subscribe((viewModel) => {
      tableColumnList = viewModel.tableColumnList;
    });

    if (tableColumnList.length === 0) {
      tableColumnList = this.billingService.getDefaultTabColumns();
    }

    this.columnListPreference$
      .pipe(first())
      .subscribe((columnListPreference) => {
        let patch = { ...columnListPreference, value: tableColumnList };
        this.store$.dispatch(new SavePreferences([patch]));
      });
  }

  navigateToColumnPreferences() {
    this.store$.dispatch(new SetClaimTableListPreferencesTab('billing'));
  }

  doExport(exportType: string) {
    combineLatest([this.viewModel$, this.store$.select(getDecodedClaimNumber)]).pipe(first()).subscribe(([vm, claimNumber]) => {

      let workingTableData: BillingHistoryItem[] = vm.billingHistoryTableData;

      // The key should match the BillingFilter AND the BillingHistoryItem
      Object.keys(vm.currentBillingFilters).forEach(key => {

        const filteredTableData: BillingHistoryItem[] = [];
        workingTableData.forEach(row => {
          vm.currentBillingFilters[key].forEach(filter => {
            if (row[key].equalsIgnoreCase(filter)) {
              filteredTableData.push(row);
            }
          });
        });
        workingTableData = filteredTableData;

      });

      // Now we should have all our 'filtered' rows
      let columns: HealtheTableColumnDef[] = BILLING_TAB_COLUMNS.filter(
        (col) => {
          return !(col.name === 'imagePath' || col.name === 'eobPath');
        }
      );

      columns = columns.filter(col => vm.tableColumnList.includes(col.name));
      const request: GeneralExportRequest = this.generalExporterService.buildTableData(columns, workingTableData);
      request.outputFormat = exportType.toUpperCase();
      request.sheetName = claimNumber + ' Billing';
      request.fileName = 'BillingHistory_' + claimNumber + '_';
      request.displayDisclaimer = true;
      request.headerTitle = 'Billing History';
      request.extraDocumentHeaders = [{
        label: 'Claim Number:',
        value: claimNumber
      }];
      this.generalExporterService.doExport(request);
    });
  }

  clearFilters() {
    this.viewModel$
      .pipe(first(), map(vm => vm.allBillingFilters))
      .subscribe((filters: BillingFilters) => {
        this.billingFilterFormGroup.reset({
          productType: filters.productType,
          prescriberName: filters.prescriberName,
          itemName: filters.itemName,
          status: filters.status
        });
      });
  }

  ngOnDestroy() {
    this.componentStore.setTableSort({
      id: this.matSort.active,
      start: this.matSort.direction === 'desc' ? 'desc' : 'asc',
      disableClear: false
    });
  }

  dateRangeChange() {
    const dateRange = this.dateRangeFormControl.value;
    this.componentStore.setDateRange(dateRange);
    this.componentStore.fetchBillingData();
  }
}
