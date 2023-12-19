import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { faSyncAlt } from '@fortawesome/pro-solid-svg-icons';
import { faThList } from '@fortawesome/pro-light-svg-icons';
import { alphaNumericComparator, HealtheSelectOption } from '@shared';

import { MatSelect } from '@angular/material/select';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { RealTimeRejectsQueueService } from '../real-time-rejects-queue.service';
import { debounceTime, first, takeUntil } from 'rxjs/operators';
import { PageTitleService } from '@shared/service/page-title.service';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '@shared/models/healthe-data-source';
import { pageSizeOptions } from '@shared/models/pagerOptions';
import { MatPaginator } from '@angular/material/paginator';
import { CreateNewAuthModalService } from '../../authorization-status-queue/create-new-auth-modal/create-new-auth-modal.service';
import { Router } from '@angular/router';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { MatMenu } from '@angular/material/menu';
import { SearchNavService } from '../../../search-nav/search-nav.service';
import {
  GeneralExporterService,
  GeneralExportRequest
} from '@modules/general-exporter';
import { MatSort } from '@angular/material/sort';
import { timeZoneComparator } from '@shared/lib/comparators/time-zone-comparator';
import { FormControl } from '@angular/forms';

export const REAL_TIME_REJECTS_QUEUE = 'Real Time Rejects Queue';

export interface RealTimeRejectsQueueResultPharmacyLineItem {
  pharmacyName: string;
  rejects: string;
  prescriptionName: string;
  dateFilled: string;
  timeAdded: string;
  pharmacyTimeZone: string;
}

export interface RealTimeRejectsQueueResultRow {
  memberId: string;
  authorizationId: string;
  claimNumber: string;
  customerId: string;
  claimant: string;
  claimantLastName: string;
  lockedBy: string;
  stateOfVenue: string;
  pharmacyType: string;
  pharmacyTimeZone: string;
  nabp?: string;
  pharmacyLineItems: RealTimeRejectsQueueResultPharmacyLineItem[];
  rejectCodes: string[];
}

@Component({
  selector: 'healthe-real-time-rejects-queue-root',
  templateUrl: './real-time-rejects-queue-root.component.html',
  styleUrls: ['./real-time-rejects-queue-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealTimeRejectsQueueRootComponent
  extends DestroyableComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('pharmacyFilterSelect')
  pharmacyFilterSelect: MatSelect;

  @ViewChild('rejectCodeFilterSelect')
  rejectCodeFilterSelect: MatSelect;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('topPaginator')
  topPaginator: MatPaginator;
  @ViewChild('bottomPaginator')
  bottomPaginator: MatPaginator;

  @ViewChild('errorBannerSpacer')
  private errorBannerSpacer: ElementRef;

  faSyncAlt = faSyncAlt;
  faThList = faThList;

  resultsData: RealTimeRejectsQueueResultRow[] = [];
  filteredData$ = new BehaviorSubject<RealTimeRejectsQueueResultRow[]>([]);
  isResultLoading: boolean = true;
  exportDropdownOptions = ['PDF', 'EXCEL'];
  exportMenuIcon = faChevronDown;

  searchFilter = new FormControl('');

  rejectCodeFilterOptions: HealtheSelectOption<string>[] = [
    {
      label: 'All',
      value: 'ALL'
    }
  ];

  // Configuration assignments
  pharmacyFilterOptions: Array<HealtheSelectOption<string>> = [
    {
      value: 'ALL',
      label: 'All Pharmacies'
    },
    {
      value: 'POS',
      label: 'POS'
    },
    {
      value: 'MAIL_ORDER',
      label: 'Mail Order'
    }
  ];

  outerTableColumnList: string[] = [];
  pageSize: number = 200;
  pageSizeOptions = [...pageSizeOptions, 200];
  tableDataSource: HealtheDataSource<any>;

  outerColumns: HealtheSortableColumn[] = [
    {
      name: 'memberId',
      comparator: alphaNumericComparator
    },
    {
      name: 'claimantLastName',
      comparator: alphaNumericComparator
    },
    {
      name: 'lockedBy',
      comparator: alphaNumericComparator
    },
    {
      name: 'stateOfVenue',
      comparator: alphaNumericComparator
    },
    {
      name: 'pharmacyTimeZone',
      comparator: timeZoneComparator
    }
  ];

  outerTableColumnDropdownList: HealtheSelectOption<string>[] = [
    { label: 'Member ID', value: 'memberId' },
    { label: 'Claimant', value: 'claimantLastName' },
    { label: 'Locked By', value: 'lockedBy' },
    { label: 'State of Venue', value: 'stateOfVenue' },
    { label: 'Pharmacy Time Zone', value: 'pharmacyTimeZone' },
    { label: 'Prescription Information', value: 'prescriptionInfo' }
  ];

  innerTableColumnList: string[] = [
    'pharmacyName',
    'rejects',
    'prescriptionName',
    'dateFilled',
    'timeAdded'
  ];
  queueResultsErrors: string[];

  // End configuration assignments

  constructor(
    public realTimeRejectsQueueService: RealTimeRejectsQueueService,
    private pageTitleService: PageTitleService,
    private cd: ChangeDetectorRef,
    public createNewAuthModalService: CreateNewAuthModalService,
    protected router: Router,
    protected searchNavService: SearchNavService,
    protected generalExporterService: GeneralExporterService
  ) {
    super();
    this.outerTableColumnDropdownList.forEach((value) =>
      this.outerTableColumnList.push(value.value)
    );

    this.pageTitleService.setTitle(
      'CSC Administration',
      'Real Time Rejects Queue'
    );
  }

  ngOnInit() {
    this.tableDataSource = new HealtheDataSource(
      this.filteredData$,
      null,
      this.outerColumns
    );

    this.tableDataSource.primaryPaginator = this.topPaginator;
    this.tableDataSource.secondaryPaginator = this.bottomPaginator;
    this.searchFilter.valueChanges
      .pipe(takeUntil(this.onDestroy$), debounceTime(250))
      .subscribe(() => this.setFilteredData());
  }

  ngAfterViewInit(): void {
    this.tableDataSource.sort = this.sort;
    this.refreshQueue();
  }

  refreshQueue() {
    this.isResultLoading = true;
    this.resultsData = [];
    this.filteredData$.next([]);
    this.realTimeRejectsQueueService
      .getRealTimeRejectsQueueData()
      .pipe(first())
      .subscribe((realTimeRejectsQueueResults) => {
        this.resultsData = realTimeRejectsQueueResults.responseBody;
        this.prepareRejectCodeFilterData(this.resultsData);
        this.queueResultsErrors = realTimeRejectsQueueResults.errors;
        if (this.queueResultsErrors.length > 0) {
          this.errorBannerSpacer.nativeElement.scrollIntoView({
            block: 'center',
            behavior: 'smooth'
          });
        }

        this.isResultLoading = false;
        this.setFilteredData();
        this.cd.detectChanges();
      });
  }

  setOpenUntilClose(exportMenu: MatMenu) {
    this.exportMenuIcon = faChevronUp;
    exportMenu.closed.pipe(first()).subscribe(() => {
      this.exportMenuIcon = faChevronDown;
    });
  }

  addNewAuth() {
    this.createNewAuthModalService.navigateToCreatePosAuthFromCreateNewAuthModal();
  }

  setFilteredData() {
    if (!this.resultsData) {
      this.filteredData$.next([]);
      return;
    }

    let filteredData: RealTimeRejectsQueueResultRow[] = [];
    filteredData = this.filterPharmacyTypeData(
      this.resultsData,
      this.pharmacyFilterSelect.value
    );

    filteredData = this.filterRejectCodeData(
      filteredData,
      this.rejectCodeFilterSelect.value
    );

    filteredData = this.subStringTableDataFilter(
      filteredData,
      this.searchFilter.value
    );

    this.filteredData$.next(filteredData);
    this.topPaginator.firstPage();
  }

  private filterPharmacyTypeData(
    filteredData: RealTimeRejectsQueueResultRow[],
    filterValue: string
  ) {
    if (filterValue === 'ALL') {
      return filteredData;
    }
    return filteredData.filter((result) => result.pharmacyType === filterValue);
  }

  private filterRejectCodeData(
    filteredData: RealTimeRejectsQueueResultRow[],
    filterValue: string
  ) {
    if (filterValue === 'ALL') {
      return filteredData;
    }

    return filteredData.filter((result) =>
      result.rejectCodes.includes(filterValue)
    );
  }

  private subStringTableDataFilter(
    filteredData: RealTimeRejectsQueueResultRow[],
    filterValue: string
  ) {
    if (null === filterValue || filterValue === '') {
      return filteredData;
    }
    const resultSet: RealTimeRejectsQueueResultRow[] = [];
    filteredData.forEach((row) => {
      if (
        this.realTimeRejectsQueueResultRowMatchesFilter(
          row,
          filterValue.toLowerCase()
        )
      ) {
        resultSet.push(row);
      }
    });

    return resultSet;
  }

  private realTimeRejectsQueueResultRowMatchesFilter(
    row: RealTimeRejectsQueueResultRow,
    filterValue: string
  ) {
    if (this.safeCompareSubstringValue(row.memberId, filterValue)) {
      return true;
    }

    if (this.safeCompareSubstringValue(row.claimant, filterValue)) {
      return true;
    }

    if (this.safeCompareSubstringValue(row.lockedBy, filterValue)) {
      return true;
    }

    if (this.safeCompareSubstringValue(row.stateOfVenue, filterValue)) {
      return true;
    }

    if (this.safeCompareSubstringValue(row.pharmacyTimeZone, filterValue)) {
      return true;
    }
    // Not using a lambda forEach because I want to be able to break out of the loop.
    for (const lineItem of row.pharmacyLineItems) {
      if (this.safeCompareSubstringValue(lineItem.pharmacyName, filterValue)) {
        return true;
      }

      if (this.safeCompareSubstringValue(lineItem.rejects, filterValue)) {
        return true;
      }

      if (
        this.safeCompareSubstringValue(lineItem.prescriptionName, filterValue)
      ) {
        return true;
      }

      if (this.safeCompareSubstringValue(lineItem.dateFilled, filterValue)) {
        return true;
      }

      if (this.safeCompareSubstringValue(lineItem.timeAdded, filterValue)) {
        return true;
      }
    }

    return false;
  }

  safeCompareSubstringValue(primaryValue: string, subString: string): boolean {
    if (null == primaryValue) {
      return false;
    }

    primaryValue = primaryValue + '';
    return primaryValue.toLowerCase().includes(subString);
  }

  doExport(exportOption: string) {
    this.filteredData$.pipe(first()).subscribe((rowData) => {
      const request: GeneralExportRequest = {
        outputFormat: exportOption,
        sheetName: 'RTR Queue Search Results',
        fileName: REAL_TIME_REJECTS_QUEUE,
        displayNameColumnList: [
          'MEMBER ID',
          'CLAIMANT',
          'LOCKED BY',
          'STATE OF VENUE',
          'PHARMACY NAME',
          'REJECTS',
          'PRESCRIPTION NAME',
          'DATE FILLED',
          'TIME ADDED',
          'PHARMACY TIME ZONE'
        ],
        tableData: {}
      };

      // Build tableData stubs
      request.displayNameColumnList.forEach((displayColumn) => {
        const columnData: string[] = [];
        request.tableData[displayColumn] = columnData;
        rowData.forEach((row) => {
          row.pharmacyLineItems.forEach((pharmacyLineItem) => {
            let rowValue = 'UNKNOWN_FIX_EXPORTER_IN_UI';
            switch (displayColumn) {
              case 'MEMBER ID':
                rowValue = row.memberId;
                break;
              case 'CLAIMANT':
                rowValue = row.claimant;
                break;
              case 'LOCKED BY':
                rowValue = row.lockedBy;
                break;
              case 'STATE OF VENUE':
                rowValue = row.stateOfVenue;
                break;
              case 'PHARMACY NAME':
                rowValue = pharmacyLineItem.pharmacyName;
                break;
              case 'REJECTS':
                rowValue = pharmacyLineItem.rejects;
                break;
              case 'PRESCRIPTION NAME':
                rowValue = pharmacyLineItem.prescriptionName;
                break;
              case 'DATE FILLED':
                rowValue = pharmacyLineItem.dateFilled;
                break;
              case 'TIME ADDED':
                rowValue = pharmacyLineItem.timeAdded;
                break;
              case 'PHARMACY TIME ZONE':
                rowValue = pharmacyLineItem.pharmacyTimeZone;
                break;
            }
            columnData.push(rowValue);
          });
        });
      });

      this.generalExporterService.doExport(request);
    });
  }

  private prepareRejectCodeFilterData(
    resultsData: RealTimeRejectsQueueResultRow[]
  ) {
    if (null == resultsData) {
      return;
    }
    const rawCodes: string[] = [];
    resultsData.forEach((row) => {
      rawCodes.push(...row.rejectCodes);
    });

    const uniqueCodes = [...new Set(rawCodes)];
    this.rejectCodeFilterOptions = [{ label: 'All', value: 'ALL' }];
    uniqueCodes.forEach((code) => {
      this.rejectCodeFilterOptions.push({ label: code, value: code });
    });

    this.rejectCodeFilterSelect.value = 'ALL';
  }
}
