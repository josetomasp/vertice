import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  alphaNumericComparator,
  dateComparator,
  HealtheSelectOption,
  HealtheTableColumnDef,
  hexEncode
} from '@shared';
import { PageTitleService } from '@shared/service/page-title.service';
import { of, Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { first, map, takeUntil, tap } from 'rxjs/operators';
import {
  SpecificDateControlConfigBuilder, SpecificDateFormFieldType
} from '../../../claims/abm/referral/make-a-referral/components/specific-date-form-array/specific-date-form-config';
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
  REFERRAL_AUTHORIZATION_SEARCH_NAME,
  SearchOptions
} from '../../store/models/search-options.model';

import {
  AuthorizationsSearchBaseComponent
} from '../components/authorizations-search-base/authorizations-search-base.component';
import * as _moment from 'moment';
import {
  generate3_0ABMReferralActivityTabUrl,
  generate3_0ABMReferralAuthorizationTabUrl
} from '@shared/lib/links';
import {
  getAncilliaryServiceCodeFromServiceName
} from 'src/app/claims/abm/referral/make-a-referral/make-a-referral-shared';
import {
  UserInfoSetInternalUserCustomer
} from '../../../user/store/actions/user.actions';
import { FormControl } from '@angular/forms';
import { SearchNavFormField } from '../../shared/SearchNavTypes';
import {
  FeatureFlagService
} from '../../../customer-configs/feature-flag.service';
import {
  ConfirmationModalService
} from '@shared/components/confirmation-modal/confirmation-modal.service';
import {
  getAssignedAdjusters,
  getNeedToLoadAssignedAdjusters
} from '../../store/selectors';
import { loadAssignedAdjustersRequest } from '../../store/actions';
import { GeneralExporterService } from '@modules/general-exporter';

const moment = _moment;

@Component({
  selector: 'healthe-referral-authorizations',
  // Re-using authorization-search-base template/scss as no differences
  //  are expected for each authorization page
  templateUrl:
    '../components/authorizations-search-base/authorizations-search-base.component.html',
  styleUrls: [
    '../components/authorizations-search-base/authorizations-search-base.component.scss'
  ]
})
export class ReferralAuthorizationsComponent
  extends AuthorizationsSearchBaseComponent
  implements OnInit
{
  referralClicked: Subject<any> = new Subject();
  referralAuthStatusOptions$: Observable<HealtheSelectOption<string>[]>;
  referralAuthAssignedAdjustersOptions$: Observable<
    HealtheSelectOption<string>[]
  >;
  referralAuthStateOfVenueOptions$: Observable<HealtheSelectOption<string>[]>;
  referralAuthServiceTypeOptions$: Observable<HealtheSelectOption<string>[]>;
  assignedAdjusters$ = this.store$.pipe(
    select(getAssignedAdjusters),
    takeUntil(this.onDestroy$),
    tap(adjusters => {
      if (adjusters.length > 12 && this.simpleSearchFormConfig && this.simpleSearchFormConfig[0]) {
        this.simpleSearchFormConfig[0].find(config => config.formControlName.equalsIgnoreCase('assignedAdjuster')).selectPanelClass = this.assignedAdjusterPanelClass + ' assignedAdjuster-field--large-select-panel';
      }
    })
  );

  searchBoxValidators = [
    /**
     * Validator that takes care of the performance validations that are required on the backed so it doesn't time out
     * @param control
     */
    (control) => {
      if (
        (control.get('referralId') && control.get('referralId').value) ||
        (control.get('claimNumber') && control.get('claimNumber').value) ||
        (control.get('stateFundTrackingNumber') &&
          control.get('stateFundTrackingNumber').value) ||
        (control.get('healtheTrackingNumber') &&
          control.get('healtheTrackingNumber').value) ||
        (control.get('urReferenceNumber') &&
          control.get('urReferenceNumber').value)
      ) {
        return null;
      }
      const statusControl = control.get('referralStatus');
      const serviceType = control.get('abmServiceType');
      const dateReceived = control.get('dateReceived');
      // Has a service type that isn't Auth Required or Unauthorized
      const statusUnsafe =
        statusControl &&
        statusControl.value !== 'Unauthorized' &&
        statusControl.value !== 'Auth Required';
      // Hasn't selected a specific serviceType
      const serviceTypeUnsafe =
        serviceType && (!serviceType.value || serviceType.value === 'All');
      // Hasn't selected a date range or has a date range at or over 1 year
      const dateRecievedUnsafe =
        dateReceived &&
        (!dateReceived.value ||
          moment(dateReceived.value.toDate).diff(
            dateReceived.value.fromDate,
            'days'
          ) >= 367);
      if (statusUnsafe && (serviceTypeUnsafe || dateRecievedUnsafe)) {
        return { invalidSearchParameters: true };
      }

      return null;
    }
  ];

  formGroupValidationErrorMessages = {
    invalidSearchParameters:
      'When searching for a status other than "Unauthorized", you must enter at least one of the following: Referral ID; Claim #; or a Service Type and Date Received not greater than one year.'
  };

  enableExport = true;
  generalExportSheetName = 'Referral Authorizations Search Results';

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
    this.searchName = REFERRAL_AUTHORIZATION_SEARCH_NAME;
    this.componentGroupName = 'ReferralAuthorizationsComponent';
  }

  transformRowData(resultRows: any[]): {}[] {
    const customerId = this.isInternalUser
      ? this.internalUserCustomerId
      : this.userInfo.customerID;

    return resultRows.map(row => ({
      ...row,
      claimIdUrl: `claimview/${hexEncode(customerId)}/${hexEncode(
        row.claimNumber
      )}`
    }));
  }

  postInitFormControls() {
    const serviceTypeFormField: SearchNavFormField =
      this.getFormConfigByFormControlName('abmServiceType');
    const adjusterFormField: SearchNavFormField =
      this.getFormConfigByFormControlName('assignedAdjuster');
    const statusFormField: SearchNavFormField =
      this.getFormConfigByFormControlName('referralStatus');
    if (this.isInternalUser) {
      // This will be our customer control if we have an internal user
      const customerControl: FormControl =
        this.getFormConfigByFormControlName('customerId').formState;

      customerControl.valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((customerIdValue) => {
          this.store$.dispatch(
            new UserInfoSetInternalUserCustomer(customerIdValue)
          );
          this.internalUserCustomerId = customerIdValue;

          const status: SearchNavFormField =
            this.getFormConfigByFormControlName('referralStatus');

          status.options = this.referralStatusQueuesOption$.pipe(
            map((options) => {
              return getSelectByScreenOptions(
                options[customerIdValue],
                this.searchName
              );
            })
          );

          status.formState.setValue('all');

          adjusterFormField.formState.setValue('all');

          serviceTypeFormField.options = this.servicesOption$.pipe(
            map((options) => {
              return getSelectByScreenOptions(
                options[customerIdValue],
                this.searchName
              );
            })
          );
          serviceTypeFormField.formState.setValue('All');
        });

      // This may seem to be a bit odd, but what we really want to do is if the control has a real value
      // To run the above onChanges logic.  The mechanism that restores the form state doesn't run the above changes method.
      // So this setValue will emit the changes event causing the onChanges to run.
      if (customerControl.value) {
        customerControl.setValue(customerControl.value);
      }
    }
  }

  initializeConfigurations(userInfo: UserInfo, searchOptions: SearchOptions) {
    this.initializeOptions(userInfo);
    const simpleSearchConfigBuilder = new SpecificDateControlConfigBuilder();

    if (userInfo.internal) {
      simpleSearchConfigBuilder.staticRow((controlBuilder) =>
        controlBuilder.select<string>(
          'customerId',
          'Customer',
          this.customers$,
          'Choose a Customer',
          true,
          { required: 'Must select a Customer' }
        )
      );
    }

    simpleSearchConfigBuilder.staticRow((controlBuilder) => {
        controlBuilder
          .select<string>(
            'referralStatus',
            'Status',
            this.referralAuthStatusOptions$
          )
          .control({
            type: SpecificDateFormFieldType.SelectVirtualScroll,
            label: 'Assigned Adjuster',
            placeholder:'Assigned Adjuster',
            formControlName: 'assignedAdjuster',
            options: this.assignedAdjusters$,
            selectPanelClass: this.assignedAdjusterPanelClass
          })
          .text('referralId', 'Referral ID', 'Enter Referral ID')
          .text('claimNumber', 'Enter Claim', 'Claim Number')
      }
    );

    this.simpleSearchFormConfig = simpleSearchConfigBuilder.controls;

    const advancedSearchFormConfigBuilder =
      new SpecificDateControlConfigBuilder().staticRow((controlBuilder) =>
        controlBuilder
          .dateRange('dateReceived', 'Date Received')
          .select<string>(
            'abmServiceType',
            'Service Type',
            this.referralAuthServiceTypeOptions$
          )
      );
    if (userInfo.customerID === '6000SCIF') {
      this.formGroupValidationErrorMessages.invalidSearchParameters =
        'When searching for a status other than "Unauthorized", you must enter at least one of the following: Referral ID; Claim #; State Fund Tracking #; Healthe Tracking ID; or a Service Type and Date Received not greater than one year.';
      advancedSearchFormConfigBuilder.staticRow((controlBuilder) =>
        controlBuilder
          .text(
            'stateFundTrackingNumber',
            'State Fund Tracking #',
            'Enter State Fund Tracking Number'
          )
          .text(
            'healtheTrackingNumber',
            'Healthe Tracking ID',
            'Enter Healthe Tracking ID'
          )
      );
    } else if (userInfo.customerID === 'TRAVELERS') {
      this.formGroupValidationErrorMessages.invalidSearchParameters =
        'When searching for a status other than "Auth Required", you must enter at least one of the following: Referral ID; Claim #; UR Reference#; or a Service Type and Date Received not greater than one year.';
      advancedSearchFormConfigBuilder.staticRow(
        (controlBuilder) =>
          controlBuilder.text(
            'urReferenceNumber',
            'UR Reference #',
            'Enter UR Reference #'
          ),
        0
      );
    } else if (userInfo.internal) {
      this.formGroupValidationErrorMessages.invalidSearchParameters =
        'When searching for a status other than "Unauthorized" or "Auth Required" (Travelers Only), you must enter at least one of the following: Referral ID; Claim #; or a Service Type and Date Received not greater than one year.';
    }

    this.advancedSearchFormConfig = advancedSearchFormConfigBuilder.controls;

    this.resultsColumnsConfig = [
      {
        label: 'REFERRAL ID',
        name: 'referralId',
        comparator: alphaNumericComparator,
        clickEvent: this.referralClicked
      },
      {
        label: 'RUSH?',
        name: 'rush',
        comparator: alphaNumericComparator,
        headerStyles: { width: '55px' }
      },
      {
        label: 'CLAIM #',
        name: 'claimNumber',
        comparator: alphaNumericComparator,
        linkProp: 'claimIdUrl',
        headerStyles: { width: '175px' }
      },
      {
        label: 'CLAIMANT NAME',
        name: 'claimantName',
        comparator: alphaNumericComparator
      },
      {
        label: 'STATE OF VENUE',
        name: 'state',
        comparator: alphaNumericComparator,
        headerStyles: { width: '100px' }
      },
      {
        label: 'DATE OF INJURY',
        name: 'dateOfInjury',
        comparator: dateComparator
      },
      {
        label: 'ASSIGNED ADJUSTER',
        name: 'adjuster',
        comparator: alphaNumericComparator
      },
      {
        label: 'DATE RECEIVED',
        name: 'receivedDate',
        comparator: dateComparator
      },
      {
        label: 'STATUS',
        name: 'status',
        comparator: alphaNumericComparator
      },
      {
        label: 'SERVICE TYPE',
        name: 'serviceType',
        comparator: alphaNumericComparator
      },
      {
        label: 'VENDOR',
        name: 'vendor',
        comparator: alphaNumericComparator
      }
    ] as HealtheTableColumnDef[];

    this.referralClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        ({ referralId, serviceType, claimNumber, isRFS, isLegacy, status }) => {
          if (isRFS) {
            window.open(
              `/abm/index.jsp?header=stripeonly#RFS;rfsId=${referralId};fromPage=RFSSearch`,
              '_blank',
              'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=w, height=h, top=top, left=left'
            );
          } else {
            let customerId = userInfo.customerID;
            if (this.isInternalUser) {
              customerId = this.internalUserCustomerId;
            }
            if ('Authorized' === status) {
              this.router.navigate([
                generate3_0ABMReferralActivityTabUrl(
                  customerId,
                  claimNumber.trim(),
                  referralId.toString(),
                  getAncilliaryServiceCodeFromServiceName(
                    serviceType ? serviceType.trim() : serviceType
                  ),
                  isLegacy
                )
              ]);
            } else {
              this.router.navigate([
                generate3_0ABMReferralAuthorizationTabUrl(
                  customerId,
                  claimNumber.trim(),
                  referralId.toString(),
                  getAncilliaryServiceCodeFromServiceName(
                    serviceType ? serviceType.trim() : serviceType
                  ),
                  isLegacy
                )
              ]);
            }
          }
        }
      );

    this.defaultSearchFormValues = {
      referralId: null,
      claimNumber: null,
      referralStatus: 'Auth Required',

      assignedAdjuster: getDefaultValueByScreenOrAllForCustomerSpecific(
        userInfo,
        searchOptions.assignedAdjustersAllAuthByCustomer,
        this.searchName
      ),
      claimantLastName: null,
      claimantFirstName: null,
      dateReceived: null,
      stateOfVenue: getDefaultValueByScreenOrAllForSharedLists(
        searchOptions.statesOfVenue.valuesByScreen,
        this.searchName
      ),
      vendor: getDefaultValueByScreenOrAllForCustomerSpecific(
        userInfo,
        searchOptions.vendorsByCustomer,
        this.searchName
      ),
      abmServiceType: getDefaultValueByScreenOrAllForCustomerSpecific(
        userInfo,
        searchOptions.abmServiceTypesByCustomer,
        this.searchName
      ),
      nurse: null,
      urReferenceNumber: null
    };
  }

  initializeOptions(userInfo: UserInfo) {
    if (!userInfo.internal) {
      this.referralAuthStatusOptions$ = this.referralStatusQueuesOption$.pipe(
        map((statusOptions) =>
          getSelectOptionsForCustomerSpecific(
            userInfo.internal,
            statusOptions,
            this.searchName
          )
        )
      );
    } else {
      // Internal user setup
      this.referralAuthStatusOptions$ = of([]);
      this.referralAuthAssignedAdjustersOptions$ = of([]);
    }

    this.store$
      .pipe(select(getNeedToLoadAssignedAdjusters), first())
      .subscribe((needToLoad) => {
        if (needToLoad) {
          this.store$.dispatch(
            loadAssignedAdjustersRequest({
              encodedCustomerId: hexEncode(userInfo.customerID)
            })
          );
        }
      });

    this.referralAuthStateOfVenueOptions$ = this.stateOfVenueOption$.pipe(
      map((stateOfVenueOptions) =>
        getSelectOptionsForCustomerSpecific(
          userInfo.internal,
          stateOfVenueOptions,
          this.searchName
        )
      )
    );
    this.referralAuthServiceTypeOptions$ = this.servicesOption$.pipe(
      map((serviceOptions) =>
        getSelectOptionsForCustomerSpecific(
          userInfo.internal,
          serviceOptions,
          this.searchName
        )
      )
    );
  }

  getServiceArchetypeByServiceColumn(rowElement) {
    const split = rowElement.split(' ');

    if (
      rowElement.includes('Physical Medicine') ||
      rowElement.includes('Home Health')
    ) {
      return `${split[0].toLowerCase()}${split[1]}`;
    } else {
      return split[0].toLowerCase();
    }
  }
}
