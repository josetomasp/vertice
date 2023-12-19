import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../../store/models/root.models';
import { PageTitleService } from '@shared/service/page-title.service';
import { map, takeUntil, tap } from 'rxjs/operators';
import { SpecificDateFormFieldType } from '../../../claims/abm/referral/make-a-referral/components/specific-date-form-array/specific-date-form-config';
import { AuthorizationsSearchBaseComponent } from '../components/authorizations-search-base/authorizations-search-base.component';
import { SearchNavService } from '../../search-nav.service';
import {
  CLINICAL_AUTHORIZATION_SEARCH_NAME,
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
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { GeneralExporterService } from '@modules/general-exporter';

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
export class ClinicalAuthorizationsComponent
  extends AuthorizationsSearchBaseComponent
  implements OnInit
{
  typeLinkClicked: Subject<any> = new Subject();
  viewLinkClicked: Subject<any> = new Subject();
  documentsLinkClicked: Subject<any> = new Subject();
  exParteLinkClicked: Subject<any> = new Subject();
  claimClicked: Subject<any> = new Subject();
  subTitle = ``;
  enableExport = true;
  generalExportSheetName = 'Referral Clinical Services Search Results';

  searchBoxValidators = [
    (control) => {
      const status = control.get('status');
      const dateAdded = control.get('dateAdded');

      if (null == status || null == dateAdded) {
        return null;
      }

      if ('Authorization Required' === status.value) {
        return null;
      } else {
        if (this.isTheDateNullAndIfNotIsThatDateGreaterThanAYear(dateAdded)) {
          return { seeRules: true };
        } else {
          return null;
        }
      }
    }
  ];

  formGroupValidationErrorMessages = {
    seeRules:
      'If searching for any other status other than "Auth Required", you must enter a "Date Added" no greater than 1 year.'
  };

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
    this.searchName = CLINICAL_AUTHORIZATION_SEARCH_NAME;
    this.componentGroupName = 'ClinicalAuthorizationsComponent';
  }

  ngOnInit() {
    super.ngOnInit();
  }

  transformRowData(resultRows: {}[]): {}[] {

    // Create clickable View links, if needed
    resultRows.forEach(row => {
      row['view'] = '';
      const type: string = row['type'];
      if (type && type.includes('Therapeutic Alert')) {
        row['view'] = 'View';
      }
    });

    return resultRows;
  }

  protected getExportColumns(): HealtheTableColumnDef[] {
    return this.resultsColumnsConfig.filter(column => !(column.label.equalsIgnoreCase('EX PARTE COPY') || column.label.equalsIgnoreCase('DOCS')));
  }

  initializeConfigurations(userInfo: UserInfo, searchOptions: SearchOptions) {

    this.assignedAdjusters$=this.searchOptionsState$.pipe(
      map((searchOptionsStateEmission) =>
        getSelectOptionsForCustomerSpecific(
          userInfo.internal,
          searchOptionsStateEmission.searchOptions
            .assignedAdjustersClinicalByCustomer,
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
          width: 230,
          options: this.searchOptionsState$.pipe(
            map((searchOptionsStateEmission) =>
              getSelectOptionsForCustomerSpecific(
                userInfo.internal,
                searchOptionsStateEmission.searchOptions
                  .clinicalServiceStatusQueuesByCustomer,
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
          type: SpecificDateFormFieldType.Select,
          label: 'Type',
          formControlName: 'serviceType',
          options: this.searchOptionsState$.pipe(
            map((searchOptionsStateEmission) =>
              getSelectByScreenOptions(
                searchOptionsStateEmission.searchOptions
                  .pbmClinicalServiceTypes,
                this.searchName
              )
            )
          )
        }
      ]
    ];

    this.advancedSearchFormConfig = [
      [
        {
          type: SpecificDateFormFieldType.DateRange,
          label: 'Date Added',
          placeholder: 'Enter the Date Added',
          formControlName: 'dateAdded'
        },
        {
          type: SpecificDateFormFieldType.Text,
          label: 'Field Office',
          placeholder: 'Enter Field Office',
          formControlName: 'fieldOfficeAFO'
        }
      ]
    ];

    this.resultsColumnsConfig = [
      {
        label: 'TYPE',
        name: 'type',
        comparator: alphaNumericComparator,
        clickEvent: this.typeLinkClicked,
        linkCondition: (rowData) => (rowData['linkUrl'] ? true : false),
        headerStyles: { width: '180px' }
      },
      {
        label: 'VIEW',
        name: 'view',
        comparator: alphaNumericComparator,
        clickEvent: this.viewLinkClicked,
        headerStyles: { width: '50px' }
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
        comparator: alphaNumericComparator,
        cellStyles: { 'padding-left': '10px' }
      },
      {
        label: 'ASSIGNED ADJUSTER',
        name: 'assignedAdjuster',
        comparator: alphaNumericComparator,
        cellStyles: { 'padding-right': '10px' }
      },
      {
        label: 'DATE ADDED',
        name: 'dateAdded',
        comparator: dateComparator,
        cellStyles: { 'padding-right': '10px' }
      },
      {
        label: 'DATE MODIFIED',
        name: 'dateModified',
        comparator: dateComparator,
        cellStyles: { 'padding-right': '10px' }
      },
      {
        label: 'MODIFIED BY',
        name: 'modifiedBy',
        comparator: alphaNumericComparator,
        cellStyles: { 'padding-right': '10px' }
      },
      {
        label: 'STATUS',
        name: 'status',
        comparator: alphaNumericComparator,
        cellStyles: { 'padding-right': '10px' }
      },
      {
        label: 'LOCKED',
        name: 'locked',
        comparator: alphaNumericComparator,
        headerStyles: { width: '75px' }
      },
      {
        label: 'PRESCRIBER',
        name: 'prescriber',
        comparator: alphaNumericComparator,
        cellStyles: { 'padding-right': '10px' }
      },
      {
        label: 'FIELD OFFICE',
        name: 'fieldOffice',
        comparator: alphaNumericComparator,

        headerStyles: { width: '75px' }
      },
      {
        label: 'DOCS',
        name: 'hasDocuments',
        comparator: alphaNumericComparator,
        clickEvent: this.documentsLinkClicked,
        headerStyles: { width: '75px' },
        align: 'center'
      },
      {
        label: 'EX PARTE COPY',
        name: 'exParteCopy',
        comparator: alphaNumericComparator,
        headerStyles: { width: '85px' },
        clickEvent: this.exParteLinkClicked
      }
    ] as HealtheTableColumnDef[];

    this.resultsDefaultSort = {
      id: 'dateAdded',
      start: 'desc'
    } as MatSortable;

    this.typeLinkClicked.pipe(takeUntil(this.onDestroy$)).subscribe((row) => {
      if (row['linkUrl'].includes('.pdf')) {
        window.open(row['linkUrl']);
      } else {
        openCenteredNewWindowDefaultSize(row['linkUrl']);
        this.openRefreshModal();
      }
    });

    this.viewLinkClicked.pipe(takeUntil(this.onDestroy$)).subscribe((row) => {
      const type: string = row['type'];
      if (type && type.includes('Therapeutic Alert')) {
        let clinicalId = this.clipSubString(
          'clinicalId=',
          ';ltrType',
          row['linkUrl']
        );

        let navUrl = `/claims/${hexEncode(userInfo.customerID)}/${hexEncode(
          row.claimNumber
        )}/pbm/${hexEncode(clinicalId)}/ta/authorizationInformation`;

        this.router.navigate([navUrl]);
      }
    });

    this.documentsLinkClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((row) => {
        if (null != row.documentURL) {
          openCenteredNewWindowDefaultSize(row.documentURL);
        }
      });

    this.exParteLinkClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((row) => {
        if (null != row.exParteUrl) {
          openCenteredNewWindowDefaultSize(row.exParteUrl);
        }
      });

    this.claimClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((clinicalAuthorizationRow) =>
        this.router.navigate([
          `/claimview/${hexEncode(userInfo.customerID)}/${hexEncode(
            clinicalAuthorizationRow.claimNumber
          )}`
        ])
      );

    this.defaultSearchFormValues = {
      claimNumber: null,
      status: getDefaultValueByScreenOrAllForCustomerSpecific(
        userInfo,
        searchOptions.clinicalServiceStatusQueuesByCustomer,
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
      serviceType: getDefaultValueByScreenOrAllForSharedLists(
        searchOptions.pbmClinicalServiceTypes.valuesByScreen,
        this.searchName
      )
    };
  }
}
