import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../../store/models/root.models';
import { PageTitleService } from '@shared/service/page-title.service';
import { map, takeUntil, tap } from 'rxjs/operators';
import { SpecificDateFormFieldType } from '../../../claims/abm/referral/make-a-referral/components/specific-date-form-array/specific-date-form-config';
import { AuthorizationsSearchBaseComponent } from '../components/authorizations-search-base/authorizations-search-base.component';
import { SearchNavService } from '../../search-nav.service';
import {
  PAPER_AUTHORIZATION_SEARCH_NAME,
  SearchOptions
} from '../../store/models/search-options.model';
import { Subject } from 'rxjs';
import {
  alphaNumericComparator,
  dateComparator,
  HealtheTableColumnDef,
  hexEncode
} from '@shared';
import { Router } from '@angular/router';
import { UserInfo } from '../../../user/store/models/user.models';
import { MatSortable } from '@angular/material/sort';
import {
  getDefaultValueByScreenOrAllForCustomerSpecific,
  getDefaultValueByScreenOrAllForSharedLists,
  getSelectByScreenOptions,
  getSelectOptionsForCustomerSpecific
} from '../../shared/select-options-helpers';

import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';
import { FeatureFlagService } from '../../../customer-configs/feature-flag.service';
import * as _moment from 'moment';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { GeneralExporterService } from '@modules/general-exporter';
import { clone } from 'lodash';

const moment = _moment;

@Component({
  selector: 'healthe-pbr-authorizations',
  // Re-using authorization-search-base template/scss as no differences
  //  are expected for each authorization page
  templateUrl:
    '../components/authorizations-search-base/authorizations-search-base.component.html',
  styleUrls: [
    '../components/authorizations-search-base/authorizations-search-base.component.scss'
  ]
})
export class PaperBillRosterAuthorizationsComponent
  extends AuthorizationsSearchBaseComponent
  implements OnInit
{
  viewBillLinkClicked: Subject<any> = new Subject();
  viewBill25LinkClicked: Subject<any> = new Subject();
  claimClicked: Subject<any> = new Subject();
  documentsLinkClicked: Subject<any> = new Subject();
  subTitle = ``;
  subTitleListItems = [];

  searchBoxValidators = [
    (control) => {
      const status = control.get('status');
      const imageNumber = control.get('imageNumber');
      const claimNumber = control.get('claimNumber');
      const ssn = control.get('ssn');
      const dateOfService = control.get('dateOfService');
      const dateBillReceived = control.get('dateReceived');
      const assignedAdjuster = control.get('assignedAdjuster');
      const reconsideration = control.get('reconsideration');

      if (
        null == status ||
        null == imageNumber ||
        null == claimNumber ||
        null == ssn ||
        null == dateOfService ||
        null == dateBillReceived ||
        null == assignedAdjuster ||
        null == reconsideration
      ) {
        return null;
      }

      if (false === this.isNullOrBlank(imageNumber.value)) {
        return null;
      }
      if ('Authorization Required' !== status.value || 'All' !== reconsideration.value ) {
        const hasADateThatIsLessThanAYear =
          this.isTheDateNullAndIfNotIsThatDateGreaterThanAYear(dateOfService) &&
          this.isTheDateNullAndIfNotIsThatDateGreaterThanAYear(
            dateBillReceived
          );

        if (
          false === this.isNullOrBlank(claimNumber.value) &&
          true === hasADateThatIsLessThanAYear
        ) {
          return { claimNumber: true };
        }

        if (
          false === this.isNullOrBlank(ssn.value) &&
          true === hasADateThatIsLessThanAYear
        ) {
          return { ssn: true };
        }

        if (
          this.isNullOrBlank(claimNumber.value) &&
          this.isNullOrBlank(ssn.value)
        ) {
          return { seeRules: true };
        }
      }

      return null;
    }
  ];

  formGroupValidationErrorMessages = {
    seeRules:
      'When searching for a Status not equal to "Auth Required" or Reconsideration not equal to "All", you must enter at least one of the following:\r\n\tImage Number\r\n\tClaim Number or SSN with either the Date of Service or Date Bill Received with a date range no greater than 1 year.',
    claimNumber:
      ' If searching by Claim Number you also must enter a date range of no greater than 1 year (date of service or bill received)',
    ssn: 'If searching by SSN you also must enter a date range of no greater than 1 year (date of service or bill received)'
  };
  private viewBillLinkAuxClicked: Subject<any> = new Subject<any>();

  enableExport = true;
  generalExportSheetName = 'Paper Authorizations Search Results';

  constructor(
    protected store$: Store<RootState>,
    pageTitleService: PageTitleService,
    protected searchNavService: SearchNavService,
    protected router: Router,
    protected featureFlagService: FeatureFlagService,
    confirmationModalService: ConfirmationModalService,
    protected generalExporterService: GeneralExporterService
  ) {
    super(
      store$,
      pageTitleService,
      searchNavService,
      router,
      featureFlagService,
      confirmationModalService,
      generalExporterService
    );
    this.searchName = PAPER_AUTHORIZATION_SEARCH_NAME;
    this.componentGroupName = 'PaperBillRosterAuthorizationsComponent';
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected getExportColumns(): HealtheTableColumnDef[] {
    return [{
      label: 'PAPER BILL ID',
      name: 'paperBillId'
    }, ...this.resultsColumnsConfig].map(columnDef => {
      if (columnDef.label === 'R') {
        columnDef= clone(columnDef);
        columnDef.label = 'RECONSIDERATION';
      }
      return columnDef;
    });
  }

  initializeConfigurations(userInfo: UserInfo, searchOptions: SearchOptions) {
    this.assignedAdjusters$=this.searchOptionsState$.pipe(
      map((searchOptionsStateEmission) =>
        getSelectOptionsForCustomerSpecific(
          userInfo.internal,
          searchOptionsStateEmission.searchOptions
            .assignedAdjustersPaperBillByCustomer,
          this.searchName
        )
      ),
      tap(adjusters => {
        if (adjusters.length > 12 && this.simpleSearchFormConfig && this.simpleSearchFormConfig[0]) {
          this.simpleSearchFormConfig[0].find(config => config.formControlName.equalsIgnoreCase('assignedAdjuster')).selectPanelClass = this.assignedAdjusterPanelClass + ' assignedAdjuster-field--large-select-panel';
        }
      })
    );
    this.simpleSearchFormConfig = [
      [
        {
          type: SpecificDateFormFieldType.Select,
          label: 'Status',
          formControlName: 'status',
          width: 205,
          options: this.searchOptionsState$.pipe(
            map((searchOptionsStateEmission) =>
              getSelectOptionsForCustomerSpecific(
                userInfo.internal,
                searchOptionsStateEmission.searchOptions
                  .paperBillStatusQueuesByCustomer,
                this.searchName
              )
            )
          )
        },
        {
          type: SpecificDateFormFieldType.SelectVirtualScroll,
          label: 'Assigned Adjuster',
          formControlName: 'assignedAdjuster',
          // TODO: When we need to support internal users this will need to be updated
          options: this.assignedAdjusters$,
          selectPanelClass: this.assignedAdjusterPanelClass
        },
        {
          type: SpecificDateFormFieldType.Text,
          label: 'Claim Number',
          placeholder: 'Enter Claim',
          formControlName: 'claimNumber'
        },
        {
          type: SpecificDateFormFieldType.Text,
          label: 'SSN',
          placeholder: 'Enter SSN',
          formControlName: 'ssn'
        }
      ]
    ];

    this.advancedSearchFormConfig = [
      [
        {
          type: SpecificDateFormFieldType.Select,
          label: 'Reconsideration',
          formControlName: 'reconsideration',
          options: this.searchOptionsState$.pipe(
            map((searchOptionsStateEmission) =>
              getSelectByScreenOptions(
                searchOptionsStateEmission.searchOptions.pbmReconsiderations,
                this.searchName
              )
            )
          )
        },
        {
          type: SpecificDateFormFieldType.Text,
          label: 'Image Number',
          placeholder: 'Enter Image Number',
          formControlName: 'imageNumber'
        },
        {
          type: SpecificDateFormFieldType.DateRange,
          label: 'Date of Service',
          placeholder: 'Enter Date of Service',
          formControlName: 'dateOfService'
        },
        {
          type: SpecificDateFormFieldType.DateRange,
          label: 'Date Bill Received',
          placeholder: 'Enter the Date the bill was received',
          formControlName: 'dateReceived'
        }
      ]
    ];

    this.resultsColumnsConfig = [
      {
        label: 'VIEW',
        name: 'paperBillId',
        comparator: alphaNumericComparator,
        clickEvent: this.viewBillLinkClicked,
        auxClickEvent: this.viewBillLinkAuxClicked
      },
      {
        label: 'VIEW',
        name: 'link25',
        staticLabel: 'View',
        comparator: alphaNumericComparator,
        clickEvent: this.viewBill25LinkClicked
      },
      {
        label: 'SLR',
        name: 'isSLR',
        comparator: alphaNumericComparator,
        headerStyles: { width: '60px' },
        headerToolTip: 'Second Level Review',
        informationIcon: (row) =>
          row.isSLR === 'Yes'
            ? {
              tooltipMessage: row.slrText,
              position: 'label'
            }
            : null
      },
      {
        label: 'CLAIM #',
        name: 'claimNumber',
        comparator: alphaNumericComparator,
        clickEvent: this.claimClicked
      },
      {
        label: 'CLAIMANT NAME',
        name: 'claimantName',
        comparator: alphaNumericComparator
      },
      {
        label: 'STATE OF VENUE',
        name: 'stateOfVenue',
        comparator: alphaNumericComparator
      },
      {
        label: 'ASSIGNED ADJUSTER',
        name: 'assignedAdjuster',
        comparator: alphaNumericComparator
      },
      {
        label: 'DATE ADDED',
        name: 'dateAdded',
        comparator: dateComparator
      },
      {
        label: 'DATE MODIFIED',
        name: 'dateModified',
        comparator: dateComparator
      },
      {
        label: 'MODIFIED BY',
        name: 'modifiedBy',
        comparator: alphaNumericComparator
      },
      {
        label: 'STATUS',
        name: 'status',
        comparator: alphaNumericComparator
      },
      {
        label: 'LOCKED',
        name: 'locked',
        comparator: alphaNumericComparator
      },
      {
        label: 'DATE OF SERVICE',
        name: 'dateOfService',
        comparator: dateComparator
      },
      {
        label: 'PROVIDER NAME',
        name: 'providerName',
        comparator: alphaNumericComparator
      },
      {
        label: 'DATE BILL RECEIVED',
        name: 'dateBillReceived',
        comparator: dateComparator
      },
      {
        label: 'ACTION BY DATE',
        name: 'dateActionBy',
        comparator: dateComparator
      },
      {
        label: 'R',
        name: 'reconsideration',
        comparator: alphaNumericComparator
      },
      {
        label: 'DOCS',
        name: 'hasDocuments',
        comparator: alphaNumericComparator,
        clickEvent: this.documentsLinkClicked,
        headerStyles: { width: '75px' },
        align: 'center'
      }
    ] as HealtheTableColumnDef[];

    this.resultsDefaultSort = {
      id: 'dateBillReceived',
      start: 'asc'
    } as MatSortable;

    this.viewBillLinkAuxClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((paperBillAuthorizationRow) => {
        window.open(
          `/claims/${hexEncode(userInfo.customerID)}/${hexEncode(
            paperBillAuthorizationRow.claimNumber
          )}/pbm/${hexEncode(
            paperBillAuthorizationRow.paperBillId
          )}/paper/authorizationInformation`,
          '_blank'
        );
      });

    this.viewBillLinkClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((paperBillAuthorizationRow) =>
        this.router.navigate([
          `/claims/${hexEncode(userInfo.customerID)}/${hexEncode(
            paperBillAuthorizationRow.claimNumber
          )}/pbm/${hexEncode(
            paperBillAuthorizationRow.paperBillId
          )}/paper/authorizationInformation`
        ])
      );

    this.viewBill25LinkClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((row) => {
        openCenteredNewWindowDefaultSize(row['link25']);
        this.openRefreshModal();
      });

    this.claimClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((paperBillAuthorizationRow) =>
        this.router.navigate([
          `/claimview/${hexEncode(userInfo.customerID)}/${hexEncode(
            paperBillAuthorizationRow.claimNumber
          )}`
        ])
      );

    this.defaultSearchFormValues = {
      claimNumber: null,
      status: getDefaultValueByScreenOrAllForCustomerSpecific(
        userInfo,
        searchOptions.paperBillStatusQueuesByCustomer,
        this.searchName
      ),
      assignedAdjuster: getDefaultValueByScreenOrAllForCustomerSpecific(
        userInfo,
        searchOptions.assignedAdjustersAllAuthByCustomer,
        this.searchName
      ),
      reconsideration: getDefaultValueByScreenOrAllForSharedLists(
        searchOptions.pbmReconsiderations.valuesByScreen,
        this.searchName
      ),
      ssn: null,
      dateReceived: {
        fromDate: moment().subtract(6, 'month').toDate(),
        toDate: moment().toDate()
      }
    };

    this.documentsLinkClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((row) => {
        if (null != row.documentURL) {
          openCenteredNewWindowDefaultSize(row.documentURL);
        }
      });
  }
}
