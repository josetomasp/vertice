import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { faSyncAlt } from '@fortawesome/pro-solid-svg-icons';
import { faThList } from '@fortawesome/pro-light-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { AuthorizationStatusQueueService } from '../authorization-status-queue.service';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { debounceTime, first, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  alphaNumericComparator,
  dateComparator,
  HealtheSelectOption,
  HealtheTableColumnDef
} from '@shared';

import * as _moment from 'moment';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

import { PageTitleService } from '@shared/service/page-title.service';
import { CreateNewAuthModalService } from '../create-new-auth-modal/create-new-auth-modal.service';
import { Store } from '@ngrx/store';
import { AuthStatusQueueState } from '../../store/reducers/authStatusQueue.reducers';
import { saveAuthStatusQueueUserState } from '../../store/actions/authStatusQueue.actions';
import { selectAuthStatusQueueUserState } from '../../store/selectors/authStatusQueue.selectors';
import { MatSortable } from '@angular/material/sort';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { MatMenu } from '@angular/material/menu';
import { DataResolverPipe } from './data-resolver.pipe';
import { SearchNavService } from '../../../search-nav/search-nav.service';
import {
  GeneralExporterService,
  GeneralExportRequest
} from '@modules/general-exporter';

export interface AuthorizationStatusQueueRow {
  rxAuthorizationId: number;
  callStatus: string;
  rawLineStatus: string;
  memberId: string;
  claimant: string;
  claimNumber: string;
  customerId: string;
  user: string;
  isPend: string;
  isMedicalOnly: string;
  dateAdded: string;
  dateModified: string;
  modifiedBy: string;
  lockedBy: string;
  stateOfVenue: string;
  pharmacyTimeZone: string;
  adjusterTimeZone: string;
  is24hrPharmacy: string;
  isPatientWaiting: string;
  isCreatedViaRTR: string;
  callPharmacy: string;

  // These three fields are not currently displayed in the table, but still used for pharmacy type filtering in the UI
  pharmacyName: string;
  mailOrder: boolean;
  pharmacyNabp: number;
}

export interface AuthorizationStatusQueueData {
  authRequiredPatientWaiting: AuthorizationStatusQueueRow[];
  authRequired: AuthorizationStatusQueueRow[];
  readyForCallApproved: AuthorizationStatusQueueRow[];
  readyForCallDenied: AuthorizationStatusQueueRow[];
  completed: AuthorizationStatusQueueRow[];
}

export const AUTHORIZATION_STATUS_QUEUE = 'Authorization Status Queue';

const moment = _moment;

@Component({
  selector: 'healthe-authorization-status-queue-root',
  templateUrl: './authorization-status-queue-root.component.html',
  styleUrls: ['./authorization-status-queue-root.component.scss'],
  providers: [DataResolverPipe]
})
export class AuthorizationStatusQueueRootComponent extends DestroyableComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('columnSelect')
  columnSelect: MatSelect;

  @ViewChild('authStatusTabGroup')
  tabGroup: MatTabGroup;

  faSyncAlt = faSyncAlt;
  faThList = faThList;
  exportMenuIcon = faChevronDown;
  exportDropdownOptions = ['PDF', 'EXCEL'];

  authStatusData: AuthorizationStatusQueueData = {
    authRequiredPatientWaiting: [],
    authRequired: [],
    readyForCallApproved: [],
    readyForCallDenied: [],
    completed: []
  };

  resultsDefaultSort: MatSortable = {} as MatSortable;

  isResultLoading: boolean = true;
  tableTitle = 'Auth Required - Patient Waiting';
  PHARMACY_OPTION_ALL = 'All Pharmacies';
  PHARMACY_OPTION_POS = 'POS';
  PHARMACY_OPTION_WELLDYNE = 'Welldyne';
  PHARMACY_OPTION_WALGREENS = 'Walgreens';
  pharmacyTypeOptions: string[] = [
    this.PHARMACY_OPTION_ALL,
    this.PHARMACY_OPTION_POS,
    this.PHARMACY_OPTION_WELLDYNE,
    this.PHARMACY_OPTION_WALGREENS
  ];
  pharmacyTypeOptionsFC: FormControl = new FormControl();
  tableColumnList: string[] = [];
  selectedTabPharmacyTypeIndex: number[];
  retrievalErrors: string[] = [];
  columnDropdownList: HealtheSelectOption<string>[];
  selectedTabIndex: number = null;
  pageSize: number = null;

  masterColumnConfig: HealtheTableColumnDef[] = [
    {
      label: 'PATIENT WAITING',
      name: 'isPatientWaiting',
      comparator: alphaNumericComparator,
      dynamicCellClasses: this.isPatientWaitingCellClass,
      cellStyles: { 'padding-left': '15px' },
      headerStyles: { width: '75px', 'padding-right': '10px' }
    },
    {
      label: 'CALL STATUS',
      name: 'callStatus',
      dynamicCellClasses: this.isCallStatusDoNotCallCellClass,
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-right': '10px', 'white-space': 'break-spaces' }
    },
    {
      label: 'MEMBER ID',
      name: 'memberId',
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-right': '10px' },
      linkProp: 'memberIdUrl'
    },
    {
      label: 'CLAIMANT',
      name: 'claimant',
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-right': '10px' }
    },
    {
      label: 'CLAIM #',
      name: 'claimNumber',
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-right': '10px' },
      linkProp: 'claimNumberUrl'
    },
    {
      label: 'USER',
      name: 'user',
      comparator: alphaNumericComparator,
      dynamicCellClasses: this.isUserNoUserNameCellClass,
      cellStyles: { 'padding-right': '10px' }
    },
    {
      label: 'PEND',
      name: 'isPend',
      headerStyles: { width: '75px' },
      comparator: alphaNumericComparator
    },
    {
      label: 'MEDICAL ONLY',
      name: 'isMedicalOnly',
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-left': '15px' }
    },
    {
      label: 'DATE ADDED',
      name: 'dateAdded',
      comparator: dateComparator,
      dynamicCellClasses: this.isDatedAddedMoreThan14DaysCellClass,
      cellStyles: {
        'padding-right': '10px',
        'white-space': 'break-spaces',
        'margin-top': '5px',
        'margin-bottom': '5px',
        overflow: 'initial',
        width: '90px'
      }
    },
    {
      label: 'DATE MODIFIED',
      name: 'dateModified',
      comparator: dateComparator,
      cellStyles: {
        'padding-right': '10px',
        'white-space': 'break-spaces',
        'margin-top': '5px',
        'margin-bottom': '5px',
        overflow: 'initial',
        width: '90px'
      }
    },
    {
      label: 'MODIFIED BY',
      name: 'modifiedBy',
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-right': '10px' }
    },
    {
      label: 'LOCKED BY',
      name: 'lockedBy',
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-right': '10px' }
    },
    {
      label: 'STATE OF VENUE',
      name: 'stateOfVenue',
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-left': '15px' }
    },
    {
      label: '24 HR PHARM?',
      name: 'is24hrPharmacy',
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-left': '15px' }
    },
    {
      label: 'PHARMACY TIME ZONE',
      name: 'pharmacyTimeZone',
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-left': '12px' }
    },
    {
      label: 'ADJUSTER TIME ZONE',
      name: 'adjusterTimeZone',
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-left': '10px' }
    },
    {
      label: 'CALL PHARMACY',
      name: 'callPharmacy',
      comparator: alphaNumericComparator,
      cellStyles: { 'padding-left': '12px' }
    }
  ];

  constructor(
    public authorizationStatusQueueService: AuthorizationStatusQueueService,
    protected router: Router,
    public createNewAuthModalService: CreateNewAuthModalService,
    public dialog: MatDialog,
    private pageTitleService: PageTitleService,
    private activatedRoute: ActivatedRoute,
    private store$: Store<AuthStatusQueueState>,
    private dataResolverPipe: DataResolverPipe,
    protected searchNavService: SearchNavService,
    protected generalExporterService: GeneralExporterService
  ) {
    super();
    this.refreshQueue();
    this.columnDropdownList = this.colsToOptions(this.masterColumnConfig);
    this.pageTitleService.setTitle(
      'CSC Administration',
      'Authorization Status Queue'
    );

    this.store$
      .select(selectAuthStatusQueueUserState)
      .pipe(first())
      .subscribe((userState) => {
        this.pageSize = userState.pageSize;
        this.selectedTabIndex = userState.selectedTabIndex;
        this.selectedTabPharmacyTypeIndex =
          userState.selectedTabPharmacyTypeIndex;
      });

    // Overide the ngrx store choice if the selectedTab is being sent in the url param.
    this.activatedRoute.queryParams.pipe(first()).subscribe((params) => {
      if (null != params['selectedTab']) {
        this.selectedTabIndex = parseInt(params['selectedTab'], 10);
      }
    });
  }

  ngOnInit() {
    this.pharmacyTypeOptionsFC.setValue(
      this.pharmacyTypeOptions[
        this.selectedTabPharmacyTypeIndex[this.selectedTabIndex]
      ]
    );

    this.pharmacyTypeOptionsFC.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.selectedTabPharmacyTypeIndex[
          this.selectedTabIndex
        ] = this.pharmacyTypeOptions.indexOf(value);
      });
  }

  ngAfterViewInit(): void {
    this.columnSelect.valueChange
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(200)
      )
      .subscribe((values) => {
        this.tableColumnList = values;
      });

    if (null == this.selectedTabIndex) {
      this.tabGroup.selectedIndex = 1;
    } else {
      this.tabGroup.selectedIndex = this.selectedTabIndex;
      // If the index is 0, then the change tab event does NOT fire, so we need to do this manually.
      if (0 === this.selectedTabIndex) {
        this.setTab(this.selectedTabIndex);
      }
    }
  }

  isPatientWaitingCellClass(value: string): string[] {
    if ('Yes'.equalsIgnoreCase(value)) {
      return ['tableDangerText'];
    }
    return [];
  }

  isDatedAddedMoreThan14DaysCellClass(value: string): string[] {
    if (moment().diff(moment(value, 'MM/DD/YYYY'), 'days') > 14) {
      return ['tableDangerText'];
    }
    return [];
  }

  isCallStatusDoNotCallCellClass(value: string): string[] {
    if ('Do Not Call' === value) {
      return ['tableDangerText'];
    } else if ('PT Waiting' === value) {
      return ['tableSuccessText'];
    }
    return [];
  }

  isUserNoUserNameCellClass(value: string): string[] {
    if ('No Username' === value) {
      return ['tableDangerText'];
    }
    return [];
  }

  refreshQueue() {
    this.isResultLoading = true;
    this.authorizationStatusQueueService
      .getAuthorizationStatusQueueData()
      .pipe(first())
      .subscribe(
        (data) => {
          this.isResultLoading = false;
          if (data.responseBody) {
            this.authStatusData = data.responseBody;
          }
          if (data.errors && data.errors.length > 0) {
            this.retrievalErrors = data.errors;
          }
        },
        (error) => {
          this.retrievalErrors.push(
            'Failed loading authorization status queue data'
          );
          console.error(
            'Failed loading authorization status queue data',
            error
          );
          this.isResultLoading = false;
        }
      );
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

  addNewAuth() {
    this.createNewAuthModalService.navigateToCreatePosAuthFromCreateNewAuthModal();
  }

  goToPosAuthSearch() {
    this.router.navigateByUrl('/csc-administration/pos-authorization-search');
  }

  goToRealtimeRejectsQueue() {
    this.router.navigateByUrl('/csc-administration/real-time-rejects-queue');
  }

  goToAddFirstFill() {
    this.router.navigateByUrl('/csc-administration/add-first-fill');
  }

  changeTab($event: MatTabChangeEvent) {
    this.setTab($event.index);
  }

  setTab(index: number) {
    this.selectedTabIndex = index;
    this.pharmacyTypeOptionsFC.setValue(
      this.pharmacyTypeOptions[
        this.selectedTabPharmacyTypeIndex[this.selectedTabIndex]
      ]
    );
    switch (index) {
      default:
      case 0:
        this.tableTitle = 'Auth Required - Patient Waiting';
        this.tableColumnList = [
          'memberId',
          'claimant',
          'claimNumber',
          'user',
          'dateAdded',
          'dateModified',
          'modifiedBy',
          'lockedBy',
          'stateOfVenue',
          'is24hrPharmacy',
          'pharmacyTimeZone',
          'adjusterTimeZone'
        ];
        break;
      case 1:
        this.tableTitle = 'Authorization Required';
        this.tableColumnList = [
          'callStatus',
          'memberId',
          'claimant',
          'claimNumber',
          'user',
          'isPend',
          'dateAdded',
          'dateModified',
          'modifiedBy',
          'lockedBy',
          'stateOfVenue',
          'pharmacyTimeZone',
          'adjusterTimeZone'
        ];
        break;
      case 2:
        this.tableTitle = 'Ready for Call - Approved';
        this.tableColumnList = [
          'isPatientWaiting',
          'memberId',
          'claimant',
          'claimNumber',
          'user',
          'dateAdded',
          'dateModified',
          'modifiedBy',
          'lockedBy',
          'stateOfVenue',
          'is24hrPharmacy',
          'pharmacyTimeZone',
          'adjusterTimeZone'
        ];

        break;
      case 3:
        this.tableTitle = 'Ready for Call - Denied';
        this.tableColumnList = [
          'isPatientWaiting',
          'memberId',
          'claimant',
          'claimNumber',
          'user',
          'dateAdded',
          'dateModified',
          'modifiedBy',
          'lockedBy',
          'stateOfVenue',
          'is24hrPharmacy',
          'pharmacyTimeZone',
          'callPharmacy'
        ];

        break;
      case 4:
        this.tableTitle = 'Completed';
        this.tableColumnList = [
          'memberId',
          'claimant',
          'claimNumber',
          'user',
          'dateAdded',
          'dateModified',
          'modifiedBy',
          'lockedBy',
          'stateOfVenue',
          'is24hrPharmacy',
          'pharmacyTimeZone',
          'adjusterTimeZone'
        ];
        break;
    }
  }

  pageSizeChanges(pageSize: number) {
    this.pageSize = pageSize;
  }

  setOpenUntilClose(exportMenu: MatMenu) {
    this.exportMenuIcon = faChevronUp;
    exportMenu.closed.pipe(first()).subscribe(() => {
      this.exportMenuIcon = faChevronDown;
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.store$.dispatch(
      saveAuthStatusQueueUserState({
        pageSize: this.pageSize,
        selectedTabIndex: this.selectedTabIndex,
        selectedTabPharmacyTypeIndex: this.selectedTabPharmacyTypeIndex
      })
    );
  }

  doExport(exportOption: string) {
    const rows = this.dataResolverPipe.transform(
      this.authStatusData,
      this.selectedTabIndex,
      this.pharmacyTypeOptionsFC.value
    );

    const columns: HealtheTableColumnDef[] = [];
    this.tableColumnList.forEach(columnName => {
      columns.push(this.masterColumnConfig.find(column => columnName === column.name));
    });

    const request: GeneralExportRequest =
      this.generalExporterService.buildTableData(
        columns,
        rows
      );
    request.outputFormat = exportOption;
    request.sheetName = 'CSC Auth Status Queue';
    request.fileName = AUTHORIZATION_STATUS_QUEUE;
    this.generalExporterService.doExport(request);

  }
}
