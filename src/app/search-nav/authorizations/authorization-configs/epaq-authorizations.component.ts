import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../../store/models/root.models';
import { PageTitleService } from '@shared/service/page-title.service';
import { map, tap } from 'rxjs/operators';
import { SpecificDateFormFieldType } from '../../../claims/abm/referral/make-a-referral/components/specific-date-form-array/specific-date-form-config';
import { AuthorizationsSearchBaseComponent } from '../components/authorizations-search-base/authorizations-search-base.component';
import { SearchNavService } from '../../search-nav.service';
import {
  EPAQ_AUTHORIZATION_SEARCH_NAME,
  SearchOptions
} from '../../store/models/search-options.model';
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
  getSelectOptionsForCustomerSpecific
} from '../../shared/select-options-helpers';
import { generateExternal3_0PBMAuthorizationTabUrl } from '@shared/lib/links';
import { ValidatorFn } from '@angular/forms';

import * as _moment from 'moment';
import { posAuthorizationStatusOptions$ } from './common-search-options';
import { FeatureFlagService } from '../../../customer-configs/feature-flag.service';
import { ERROR_MESSAGES } from '@shared/constants/form-field-validation-error-messages';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { GeneralExporterService } from '@modules/general-exporter';

const moment = _moment;

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
export class EpaqAuthorizationsComponent
  extends AuthorizationsSearchBaseComponent
  implements OnInit
{
  subTitle = '';

  enableExport = true;
  generalExportSheetName = 'POS(Epaq) Authorizations Search Results';

  formGroupValidationErrorMessages = {
    requiredFields: ERROR_MESSAGES.externalPosSearch_requirements
  };

  requiredFieldsValidator: ValidatorFn = (control) => {
    const dateAdded = control.get('dateAdded');
    const claimNumber = control.get('claimNumber');
    const memberId = control.get('memberId');
    const assignedAdjuster = control.get('assignedAdjuster');
    const epaqStatus = control.get('epaqStatus');

    if (
      null == dateAdded ||
      null == claimNumber ||
      null == memberId ||
      null == assignedAdjuster
    ) {
      return null;
    }

    const isAllUsers: boolean = 'ALL' === assignedAdjuster.value;
    const isClaimNumberBlank: boolean = this.isNullOrBlank(claimNumber.value);
    const isMemberIdBlank: boolean = this.isNullOrBlank(memberId.value);
    const isAuthRequiredStatus: boolean =
      'AWAITING_DECISION' === epaqStatus.value;
    const hasADateThatIsLessThanAYear: boolean =
      !this.isTheDateNullAndIfNotIsThatDateGreaterThanAYear(dateAdded);
    const isAllUsersWithNoClaimNumberOrMemberId: boolean =
      isAllUsers && isClaimNumberBlank && isMemberIdBlank;
    const isAllUsersWithAuthRequiredAndNoDateRange: boolean =
      isAllUsers && isAuthRequiredStatus && hasADateThatIsLessThanAYear;

    if (
      (isAllUsersWithNoClaimNumberOrMemberId || !hasADateThatIsLessThanAYear) &&
      !isAllUsersWithAuthRequiredAndNoDateRange
    ) {
      return { requiredFields: true };
    }

    return null;
  };

  constructor(
    protected store$: Store<RootState>,
    pageTitleService: PageTitleService,
    protected searchNavService: SearchNavService,
    protected router: Router,
    protected featureFlagService: FeatureFlagService,
    confirmationModalService: ConfirmationModalService,
    protected generalExporterService: GeneralExporterService,
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
    this.searchName = EPAQ_AUTHORIZATION_SEARCH_NAME;
    this.componentGroupName = 'EpaqAuthorizationsComponent';

    this.searchBoxValidators = [this.requiredFieldsValidator];

    this.alwaysShowErrors = true;
  }

  transformRowData(resultRows: {}[]): {}[] {
    return resultRows.map((row: any) => ({
      ...row,
      epaqUrl: generateExternal3_0PBMAuthorizationTabUrl(
        row['customerId'],
        row['claimNumber'],
        row['epaqId'],
        'pos'
      ),
      claimIdUrl: `claimview/${hexEncode(this.userInfo.customerID)}/${hexEncode(
        row.claimNumber
      )}`
    }));
  }

  initializeConfigurations(userInfo: UserInfo, searchOptions: SearchOptions) {
    this.assignedAdjusters$=this.searchOptionsState$.pipe(
      map((searchOptionsStateEmission) =>
        getSelectOptionsForCustomerSpecific(
          userInfo.internal,
          searchOptionsStateEmission.searchOptions
            .assignedAdjustersPOSAuthByCustomer,
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
          formControlName: 'epaqStatus',
          width: 225,
          options: posAuthorizationStatusOptions$
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
          label: 'Member ID',
          placeholder: 'Enter Member ID',
          formControlName: 'memberId'
        },
        {
          type: SpecificDateFormFieldType.DateRange,
          label: 'Date Added',
          placeholder: 'Enter Date Added',
          formControlName: 'dateAdded'
        }
      ]
    ];

    this.resultsColumnsConfig = [
      {
        label: 'PATIENT WAITING',
        name: 'patientWaiting',
        comparator: alphaNumericComparator,
        cellStyles: { 'padding-left': '15px' },
        headerStyles: {
          width: '80px',
          'padding-right': '10px'
        }
      },
      {
        label: 'VIEW',
        name: 'epaqId',
        comparator: alphaNumericComparator,
        linkProp: 'epaqUrl'
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
                tooltipMessage: row.slrWorkflowName,
                position: 'label'
              }
            : null
      },
      {
        label: 'CLAIM #',
        name: 'claimNumber',
        comparator: alphaNumericComparator,
        linkProp: 'claimIdUrl'
      },
      {
        label: 'CLAIMANT NAME',
        name: 'claimantName',
        comparator: alphaNumericComparator,
        cellStyles: {
          'padding-right': '10px'
        }
      },
      {
        label: 'STATE OF VENUE',
        name: 'stateOfVenue',
        headerStyles: { width: '80px', 'padding-right': '15px' },
        cellStyles: { 'padding-left': '10px' },
        comparator: alphaNumericComparator
      },
      {
        label: 'ASSIGNED ADJUSTER',
        name: 'assignedAdjuster',
        comparator: alphaNumericComparator
      },
      {
        label: 'OFFICE CODE',
        name: 'afo',
        cellStyles: {
          'padding-right': '10px'
        },
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
        comparator: alphaNumericComparator,
        cellStyles: {
          'padding-right': '10px'
        }
      },
      {
        label: 'STATUS',
        name: 'displayLineStatus',
        comparator: alphaNumericComparator
      },
      {
        label: 'PENDING',
        name: 'pending',
        comparator: alphaNumericComparator,
        headerStyles: { width: '60px' },
        cellStyles: { 'text-align': 'center' }
      }
    ] as HealtheTableColumnDef[];

    this.resultsDefaultSort = {
      id: 'patientWaiting',
      start: 'desc'
    } as MatSortable;

    this.defaultSearchFormValues = {
      claimNumber: null,
      memberId: null,
      epaqStatus: getDefaultValueByScreenOrAllForCustomerSpecific(
        userInfo,
        searchOptions.epaqStatusQueuesByCustomer,
        this.searchName
      ),
      assignedAdjuster: getDefaultValueByScreenOrAllForCustomerSpecific(
        userInfo,
        searchOptions.assignedAdjustersAllAuthByCustomer,
        this.searchName
      ),
      dateAdded: {
        fromDate: moment().subtract(1, 'year').toDate(),
        toDate: moment().toDate()
      }
    };
  }
}
