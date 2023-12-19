import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { map, takeUntil, tap } from 'rxjs/operators';
import { SpecificDateFormFieldType } from 'src/app/claims/abm/referral/make-a-referral/components/specific-date-form-array/specific-date-form-config';
import { AddNoteModalComponent } from 'src/app/claims/abm/referral/make-a-referral/transportation/components/add-note-modal/add-note-modal.component';

import { RootState } from '../../../store/models/root.models';
import { UserInfo } from '../../../user/store/models/user.models';
import { SearchNavService } from '../../search-nav.service';
import {
  getDefaultValueByScreenOrAllForCustomerSpecific,
  getSelectOptionsForCustomerSpecific
} from '../../shared/select-options-helpers';
import {
  MAIL_ORDER_AUTHORIZATION_SEARCH_NAME,
  SearchOptions
} from '../../store/models/search-options.model';
import { AuthorizationsSearchBaseComponent } from '../components/authorizations-search-base/authorizations-search-base.component';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';
import { FeatureFlagService } from '../../../customer-configs/feature-flag.service';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { GeneralExporterService } from '@modules/general-exporter';

@Component({
  selector: 'healthe-mail-order-authorizations',
  // Re-using authorization-search-base template/scss as no differences
  //  are expected for each authorization page
  templateUrl:
    '../components/authorizations-search-base/authorizations-search-base.component.html',
  styleUrls: [
    '../components/authorizations-search-base/authorizations-search-base.component.scss'
  ]
})
export class MailOrderAuthorizationsComponent
  extends AuthorizationsSearchBaseComponent
  implements OnInit
{
  referralClicked: Subject<any> = new Subject();
  claimClicked: Subject<any> = new Subject();
  notesClicked: Subject<any> = new Subject();
  enableExport = true;
  generalExportSheetName = 'MailOrder Authorizations Search Results';

  constructor(
    private dialog: MatDialog,
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
    this.searchName = MAIL_ORDER_AUTHORIZATION_SEARCH_NAME;
    this.componentGroupName = 'MailOrderAuthorizationsComponent';
  }

  ngOnInit() {
    super.ngOnInit();
    this.subTitle =
      'Assigned Adjuster will be ignored when searching by Referral ID, Claim Number, or Last Name';
  }

  initializeConfigurations(userInfo: UserInfo, searchOptions: SearchOptions) {
    this.assignedAdjusters$=this.searchOptionsState$.pipe(
      map((searchOptionsStateEmission) =>
        getSelectOptionsForCustomerSpecific(
          userInfo.internal,
          searchOptionsStateEmission.searchOptions
            .assignedAdjustersMailOrderAuthByCustomer
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
          type: SpecificDateFormFieldType.SelectVirtualScroll,
          label: 'Assigned Adjuster',
          formControlName: 'assignedAdjuster',
          // TODO: When we need to support internal users this will need to be updated
          options: this.assignedAdjusters$,
          selectPanelClass: this.assignedAdjusterPanelClass
        },
        {
          type: SpecificDateFormFieldType.Text,
          label: 'Referral ID',
          placeholder: 'Enter Referral ID',
          formControlName: 'referralId'
        },
        {
          type: SpecificDateFormFieldType.Text,
          label: 'Claim Number',
          placeholder: 'Enter Claim',
          formControlName: 'claimNumber'
        },
        {
          type: SpecificDateFormFieldType.Text,
          label: 'Patient Last Name',
          placeholder: 'Enter Last Name',
          formControlName: 'patientLastName'
        }
      ]
    ];

    this.resultsColumnsConfig = [
      {
        label: 'REFERRAL ID',
        name: 'referralId',
        comparator: alphaNumericComparator,
        clickEvent: this.referralClicked
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
        label: 'DENIAL REASON',
        name: 'denialReason',
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
        comparator: alphaNumericComparator
      },
      {
        label: 'MODIFIED BY',
        name: 'modifiedBy',
        comparator: dateComparator
      },
      {
        label: 'LOCKED BY',
        name: 'lockedBy',
        comparator: alphaNumericComparator
      },
      {
        label: 'NOTES',
        name: 'notes',
        staticLabel: 'View',
        comparator: alphaNumericComparator,
        clickEvent: this.notesClicked
      }
    ] as HealtheTableColumnDef[];

    this.resultsDefaultSort = {
      id: 'dateAdded',
      start: 'desc'
    } as MatSortable;

    this.referralClicked.pipe(takeUntil(this.onDestroy$)).subscribe((row) => {
      openCenteredNewWindowDefaultSize(
        '/pbmmailorder-webapp/index.jsp?header=stripeonly#MailOrderDetail;authKey=' +
          row.referralId +
          ';processInd=viewonly'
      );
      this.openRefreshModal();
    });

    this.claimClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((mailOrderReferralAuthorizationRow) =>
        this.router.navigate([
          `/claimview/${hexEncode(userInfo.customerID)}/${hexEncode(
            mailOrderReferralAuthorizationRow.claimNumber
          )}`
        ])
      );

    this.notesClicked.pipe(takeUntil(this.onDestroy$)).subscribe((order) => {
      this.dialog.open(AddNoteModalComponent, {
        width: '50%',
        data: {
          serviceActionType: 'View Note',
          notes: order.notes,
          readOnly: true
        }
      });
    });

    this.defaultSearchFormValues = {
      claimNumber: null,
      referralId: null,
      patientLastName: null,
      assignedAdjuster: getDefaultValueByScreenOrAllForCustomerSpecific(
        userInfo,
        searchOptions.assignedAdjustersAllAuthByCustomer,
        this.searchName
      ),
      posAuthorizationStatusQueue: 'Awaiting authorization'
    };
  }
}
