import { Component, OnInit } from '@angular/core';
import { MatSortable } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  alphaNumericComparator,
  dateComparator,
  HealtheTableColumnDef,
  hexEncode
} from '@shared';
import { PageTitleService } from '@shared/service/page-title.service';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SpecificDateFormFieldType } from '../../../claims/abm/referral/make-a-referral/components/specific-date-form-array/specific-date-form-config';
import { RootState } from '../../../store/models/root.models';
import { UserInfo } from '../../../user/store/models/user.models';
import { SearchNavService } from '../../search-nav.service';
import {
  getDefaultValueByScreenOrAllForCustomerSpecific,
  getDefaultValueByScreenOrAllForSharedLists,
  getSelectByScreenOptions,
  getSelectOptionsForCustomerSpecific
} from '../../shared/select-options-helpers';
import {
  CLAIM_RESOLUTION_AUTHORIZATION_SEARCH_NAME,
  SearchOptions
} from '../../store/models/search-options.model';
import { AuthorizationsSearchBaseComponent } from '../components/authorizations-search-base/authorizations-search-base.component';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';
import { FeatureFlagService } from '../../../customer-configs/feature-flag.service';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { GeneralExporterService } from '@modules/general-exporter';
import { clone } from 'lodash';

@Component({
  selector: 'healthe-epaq-authorizations',
  // Re-using authorization-search-base template/scss as no differences
  //  are expected for each authorization page
  templateUrl:
    '../components/authorizations-search-base/authorizations-search-base.component.html',
  styleUrls: [
    '../components/authorizations-search-base/authorizations-search-base.component.scss'
  ]
})
export class ClaimResolutionAuthorizationsComponent
  extends AuthorizationsSearchBaseComponent
  implements OnInit
{
  authorizationLinkClicked: Subject<any> = new Subject();
  claimClicked: Subject<any> = new Subject();
  subTitle = ``;
  enableExport = true;
  generalExportSheetName = 'Claim Resolution Search Results';

  searchBoxValidators = [
    (control) => {
      const status = control.get('status');
      const imageNumber = control.get('imageNumber');
      const claimNumber = control.get('claimNumber');
      const lastName = control.get('claimantLastName');
      const dateOfService = control.get('dateOfService');
      const dateBillReceived = control.get('dateBillReceived');

      if (
        null == status ||
        null == imageNumber ||
        null == claimNumber ||
        null == lastName ||
        null == dateOfService ||
        null == dateBillReceived
      ) {
        return null;
      }

      if (
        'Claim Resolution' !== status.value &&
        'Ready For Processing' !== status.value &&
        this.isNullOrBlank(imageNumber.value) &&
        this.isNullOrBlank(claimNumber.value) &&
        this.isNullOrBlank(lastName.value)
      ) {
        return { seeRules: true };
      }

      const isGreaterThanAYear =
        this.isTheDateNullAndIfNotIsThatDateGreaterThanAYear(dateOfService) &&
        this.isTheDateNullAndIfNotIsThatDateGreaterThanAYear(dateBillReceived);

      if (
        'Claim Resolution' !== status.value &&
        'Ready for Resolution' !== status.value &&
        this.isNullOrBlank(imageNumber.value) &&
        false === this.isNullOrBlank(claimNumber.value) &&
        isGreaterThanAYear
      ) {
        return { claimNumber: true };
      }

      if (
        'Claim Resolution' !== status.value &&
        'Ready for Resolution' !== status.value &&
        this.isNullOrBlank(imageNumber.value) &&
        false === this.isNullOrBlank(lastName.value) &&
        isGreaterThanAYear
      ) {
        return { lastName: true };
      }

      return null;
    }
  ];

  formGroupValidationErrorMessages = {
    seeRules:
      'When searching for a status other than "Claim Resolution" or "Ready for Processing" you must enter at least one of the following:\n\tImage Number\n\tClaim Number or Claimant Last Name, and the Date of Service or Date Bill Received with a date range no greater than 1 year.',
    claimNumber:
      'If searching by claim number you also must also enter a date range of no greater than 1 year (date of service or date bill received)',
    lastName:
      'If searching by last name you also must also enter a date range of no greater than 1 year (date of service or date bill received)'
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
    this.searchName = CLAIM_RESOLUTION_AUTHORIZATION_SEARCH_NAME;
    this.componentGroupName = 'ClaimResolutionAuthorizationsComponent';
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected getExportColumns(): HealtheTableColumnDef[] {
    return [{
      label: 'POS ID',
      name: 'epaqId'
    }, ...this.resultsColumnsConfig];
  }

  initializeConfigurations(
    userInfo: UserInfo,
    searchOptions: SearchOptions
  ): void {
    this.simpleSearchFormConfig = [
      [
        {
          type: SpecificDateFormFieldType.Select,
          label: 'Filter By',
          formControlName: 'status',
          width: 240,
          options: this.searchOptionsState$.pipe(
            map((searchOptionsStateEmission) =>
              getSelectOptionsForCustomerSpecific(
                userInfo.internal,
                searchOptionsStateEmission.searchOptions
                  .claimResolutionStatusQueuesByCustomer,
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
          type: SpecificDateFormFieldType.Text,
          label: 'Image Number',
          placeholder: 'Enter Image Number',
          formControlName: 'imageNumber'
        },
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
          type: SpecificDateFormFieldType.DateRange,
          label: 'Date of Service',
          placeholder: 'Enter Date of Service',
          formControlName: 'dateOfService'
        },
        {
          type: SpecificDateFormFieldType.DateRange,
          label: 'Date Bill Received',
          placeholder: 'Enter the Date the bill was received',
          formControlName: 'dateBillReceived'
        }
      ],
      [
        {
          type: SpecificDateFormFieldType.Text,
          label: 'Claim Number',
          placeholder: 'Enter Claim',
          formControlName: 'claimNumber'
        },
        {
          type: SpecificDateFormFieldType.Text,
          label: 'Claimant Last Name',
          placeholder: 'Enter Last Name',
          formControlName: 'claimantLastName'
        }
      ]
    ];

    this.resultsColumnsConfig = [
      {
        label: 'VIEW',
        name: 'epaqId',
        comparator: alphaNumericComparator,
        clickEvent: this.authorizationLinkClicked
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
        cellStyles: { 'text-align': 'center' }
      },
      {
        label: 'ASSIGNED ADJUSTER',
        name: 'assignedAdjuster',
        comparator: alphaNumericComparator
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
        cellStyles: { 'padding-right': '5px' }
      },
      {
        label: 'STATUS',
        name: 'status',
        comparator: alphaNumericComparator
      },
      {
        label: 'LOCKED',
        name: 'locked',
        comparator: alphaNumericComparator,
        cellStyles: { 'text-align': 'center' }
      },
      {
        label: 'DATE OF SERVICE',
        name: 'dateofService',
        comparator: dateComparator,
        cellStyles: { 'padding-right': '10px' }
      },
      {
        label: 'PROVIDER NAME',
        name: 'providerName',
        comparator: alphaNumericComparator,
        cellStyles: { 'padding-right': '10px' }
      },
      {
        label: 'DATE BILL RECEIVED',
        name: 'dateBillReceived',
        comparator: dateComparator,
        cellStyles: { 'padding-right': '10px' }
      },
      {
        label: 'ACTION BY DATE',
        name: 'actionByDate',
        comparator: alphaNumericComparator
      }
    ] as HealtheTableColumnDef[];

    this.resultsDefaultSort = {
      id: 'dateAdded',
      start: 'desc'
    } as MatSortable;

    this.authorizationLinkClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((row) => {
        openCenteredNewWindowDefaultSize(
          '/PbmPaper/pbmpaper.jsp?header=stripeonly#IndivBill;b='
            .concat(row['epaqId'])
            .concat(';fw=ClaimRes;fs=Claim%20Resolution;fu=')
            .concat(userInfo.username)
            .concat(
              ';fst=simple;fin=;fcn=;fnb=;fni=;fdf=null;fdt=null;fssn=;fdqrs=All;fdrecon=All;'
            )
        );
        this.openRefreshModal();
      });

    this.claimClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((claimResolutionAuthorizationRow) =>
        this.router.navigate([
          `/claimview/${hexEncode(userInfo.customerID)}/${hexEncode(
            claimResolutionAuthorizationRow.claimNumber
          )}`
        ])
      );

    this.defaultSearchFormValues = {
      status: getDefaultValueByScreenOrAllForCustomerSpecific(
        userInfo,
        searchOptions.claimResolutionStatusQueuesByCustomer,
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
      )
    };
  }
}
