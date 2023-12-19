import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  alphaNumericComparator,
  dateComparator,
  HealtheSelectOption,
  HealtheTableColumnDef,
  hexEncode
} from '@shared';
import { PageTitleService } from '@shared/service/page-title.service';
import { Observable } from 'rxjs/internal/Observable';
import { AuthorizationsSearchBaseComponent } from 'src/app/search-nav/authorizations/components/authorizations-search-base/authorizations-search-base.component';
import { RootState } from '../../../store/models/root.models';
import { SpecificDateControlConfigBuilder } from '../../../claims/abm/referral/make-a-referral/components/specific-date-form-array/specific-date-form-config';
import { SearchNavService } from '../../search-nav.service';
import { UserInfo } from '../../../user/store/models/user.models';
import {
  POS_AUTHORIZATION_SEARCH_NAME,
  SearchOptions
} from '../../store/models/search-options.model';
import { CscAdministrationService } from '../../../csc-administration/csc-administration.service';
import * as _moment from 'moment';
import {
  HealtheGridButtonType,
  HealtheGridConfigService
} from '@modules/healthe-grid';
import { CreateNewAuthModalService } from '../../../csc-administration/authorization-status-queue/create-new-auth-modal/create-new-auth-modal.service';
import { posAuthorizationStatusOptions$ } from './common-search-options';
import { FeatureFlagService } from '../../../customer-configs/feature-flag.service';
import { ERROR_MESSAGES } from '@shared/constants/form-field-validation-error-messages';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { GeneralExporterService } from '@modules/general-exporter';

const moment = _moment;

@Component({
  selector: 'healthe-pos-authorization-search',
  // Re-using authorization-search-base template/scss as no differences
  //  are expected for each authorization page
  templateUrl:
    '../components/authorizations-search-base/authorizations-search-base.component.html',
  styleUrls: [
    '../components/authorizations-search-base/authorizations-search-base.component.scss'
  ]
})
export class PosAuthorizationSearchComponent
  extends AuthorizationsSearchBaseComponent
  implements OnInit
{
  posAuthorizationStatusQueueOptions$: Observable<
    HealtheSelectOption<string>[]
  > = posAuthorizationStatusOptions$;

  searchBoxValidators = [
    (control) => {
      const memberId = control.get('memberId');
      const originalMemberId = control.get('originalMemberId');
      const claimNumber = control.get('claimNumber');
      const dateRange = control.get('dateRange');
      const { fromDate, toDate } = dateRange.value;
      const isPastAMonth = moment(toDate).diff(moment(fromDate), 'days') >= 32;
      if (null == memberId || null == originalMemberId || null == claimNumber) {
        return null;
      }

      if (
        this.isNullOrBlank(memberId.value) &&
        this.isNullOrBlank(originalMemberId.value) &&
        this.isNullOrBlank(claimNumber.value) &&
        isPastAMonth
      ) {
        return { oneFieldRequired: true };
      }

      return null;
    }
  ];

  formGroupValidationErrorMessages = {
    oneFieldRequired: ERROR_MESSAGES.internalPosSearch_requirements
  };

  enableExport = true;
  generalExportSheetName = 'POS Authorizations Search Results';
  constructor(
    protected store$: Store<RootState>,
    pageTitleService: PageTitleService,
    protected searchNavService: SearchNavService,
    protected router: Router,
    private cscAdministrationService: CscAdministrationService,
    private healtheGridConfigService: HealtheGridConfigService,
    private createNewAuthModalService: CreateNewAuthModalService,
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
    this.searchName = POS_AUTHORIZATION_SEARCH_NAME;
    this.componentGroupName = 'PosAuthorizationSearchComponent';
    this.displaySearchName = false;
  }

  transformRowData(resultRows: {}[]): {}[] {
    return resultRows.map((row: {}) => ({
      ...row,
      memberIdUrl: `claims/${hexEncode(row['customerId'])}/${hexEncode(
        row['claimNumber']
      )}/pbm/${hexEncode(
        row['authorizationId'].toString()
      )}/pos/authorizationInformation?status=${row['rawLineStatus']}`,
      claimNumberIdUrl: `claimview/${hexEncode(row['customerId'])}/${hexEncode(
        row['claimNumber']
      )}`
    }));
  }

  initializeConfigurations(userInfo: UserInfo, searchOptions: SearchOptions) {
    this.simpleSearchFormConfig =
      new SpecificDateControlConfigBuilder().staticRow((controlBuilder) =>
        controlBuilder
          .text('memberId', 'Member Id', 'Enter Member ID')
          .text(
            'originalMemberId',
            'Original Member Id',
            'Enter Original Member ID'
          )
          .text('claimNumber', 'Claim Number', 'Enter Claim #')
          .dateRange('dateRange', 'Date Range', null)
          .select<string>(
            'posAuthorizationStatusQueue',
            'Auth Status Queue',
            this.posAuthorizationStatusQueueOptions$
          )
      ).controls;

    this.resultsColumnsConfig = [
      {
        label: 'MEMBER ID',
        name: 'memberId',
        comparator: alphaNumericComparator,
        linkProp: 'memberIdUrl'
      },
      {
        label: 'ORIGINAL MEMBER ID',
        name: 'originalMemberId',
        comparator: alphaNumericComparator
      },
      {
        label: 'CLAIMANT',
        name: 'claimant',
        comparator: alphaNumericComparator
      },
      {
        label: 'CLAIM NUMBER',
        name: 'claimNumber',
        comparator: alphaNumericComparator,
        linkProp: 'claimNumberIdUrl'
      },
      {
        label: 'STATUS',
        name: 'displayLineStatus',
        comparator: alphaNumericComparator
      },
      {
        label: 'USER',
        name: 'user',
        comparator: alphaNumericComparator
      },
      {
        label: 'MODIFIED BY',
        name: 'modifiedBy',
        comparator: alphaNumericComparator
      },
      {
        label: 'LOCKED BY',
        name: 'lockedBy',
        comparator: alphaNumericComparator
      },
      {
        label: 'TIME ADDED',
        name: 'timeAdded',
        comparator: dateComparator
      },
      {
        label: 'TIME MODIFIED',
        name: 'timeModified',
        comparator: dateComparator
      },
      {
        label: 'PENDING',
        name: 'pending',
        comparator: alphaNumericComparator
      }
    ] as HealtheTableColumnDef[];

    this.defaultSearchFormValues = {
      memberId: null,
      originalMemberId: null,
      claimNumber: null,
      dateRange: {
        fromDate: moment().subtract(3, 'month').toDate(),
        toDate: moment().toDate()
      },
      posAuthorizationStatusQueue: 'AWAITING_DECISION'
    };

    this.resultsActionsConfig = this.healtheGridConfigService
      .configureGrid()
      .row((rowBuilder) =>
        rowBuilder.button({
          text: '+ ADD NEW AUTH',
          buttonType: HealtheGridButtonType.Secondary,
          action: () =>
            this.createNewAuthModalService.navigateToCreatePosAuthFromCreateNewAuthModal()
        })
      )
      .build();
  }
}
