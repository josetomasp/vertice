import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../../store/models/root.models';
import { PageTitleService } from '@shared/service/page-title.service';
import { takeUntil } from 'rxjs/operators';
import { SpecificDateFormFieldType } from '../../../claims/abm/referral/make-a-referral/components/specific-date-form-array/specific-date-form-config';
import { NavigationLinkingService } from '../../navigation-linking.service';
import { AuthorizationsSearchBaseComponent } from '../components/authorizations-search-base/authorizations-search-base.component';
import { SearchNavService } from '../../search-nav.service';
import {
  DRAFT_REFERRALS_SEARCH_NAME,
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
import { FeatureFlagService } from '../../../customer-configs/feature-flag.service';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { GeneralExporterService } from '@modules/general-exporter';

@Component({
  selector: 'healthe-draft-referrals',
  // Re-using authorization-search-base template/scss as no differences
  //  are expected for each authorization page
  templateUrl:
    '../components/authorizations-search-base/authorizations-search-base.component.html',
  styleUrls: [
    '../components/authorizations-search-base/authorizations-search-base.component.scss'
  ]
})
export class DraftReferralsComponent extends AuthorizationsSearchBaseComponent
  implements OnInit {
  completeDraftLinkClicked: Subject<any> = new Subject();
  claimClicked: Subject<any> = new Subject();

  constructor(
    protected store$: Store<RootState>,
    pageTitleService: PageTitleService,
    protected searchNavService: SearchNavService,
    protected navigationLinkingService: NavigationLinkingService,
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
    this.searchName = DRAFT_REFERRALS_SEARCH_NAME;
    this.componentGroupName = 'DraftReferralsComponent';
    this.subTitle =
      'You are viewing only those draft referrals that are assigned to the currently logged in user.';
  }

  ngOnInit() {
    super.ngOnInit();
  }

  initializeConfigurations(userInfo: UserInfo, searchOptions: SearchOptions) {
    this.simpleSearchFormConfig = [
      [
        {
          type: SpecificDateFormFieldType.Text,
          label: 'Claim Number',
          placeholder: 'Enter Claim',
          formControlName: 'claimNumber'
        }
      ]
    ];

    this.resultsColumnsConfig = [
      {
        label: 'COMPLETE DRAFT',
        name: 'draftId',
        comparator: alphaNumericComparator,
        clickEvent: this.completeDraftLinkClicked,
        staticLabel: 'Complete Draft'
      },
      {
        label: 'CLAIM #',
        name: 'claimNumber',
        comparator: alphaNumericComparator,
        clickEvent: this.claimClicked
      },
      {
        label: 'ADJUSTER',
        name: 'adjuster',
        comparator: alphaNumericComparator
      },
      {
        label: 'SAVE DATE',
        name: 'saveDate',
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
      }
    ] as HealtheTableColumnDef[];

    this.resultsDefaultSort = {
      id: 'saveDate',
      start: 'asc'
    } as MatSortable;

    this.completeDraftLinkClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(({ serviceType, draftId: referralId }) => {
        this.navigationLinkingService.gotoDraft(serviceType, referralId);
      });

    this.claimClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((referralAuthorizationRow) =>
        this.router.navigate([
          `/claimview/${hexEncode(userInfo.customerID)}/${hexEncode(
            referralAuthorizationRow.claimNumber
          )}`
        ])
      );

    this.defaultSearchFormValues = {
      claimNumber: null
    };
  }
}
