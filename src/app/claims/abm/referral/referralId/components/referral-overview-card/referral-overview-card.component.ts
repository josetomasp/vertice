import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { isEqual } from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import { IcdCodesEditModalComponent } from 'src/app/claims/abm/referral/referralId/components/icd-codes-edit-modal/icd-codes-edit-modal.component';
import { TableCondition, VerbiageService } from 'src/app/verbiage.service';

import { RootState } from '../../../../../../store/models/root.models';
import {
  getAuthorizationArchetype,
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../../store/selectors/router.selectors';
import {
  getDiagnosisCodesAndDescriptions,
  getDisplayReferralLocationsLink,
  getReferralOverviewCardState,
  isReferralOverviewLoading
} from '../../../store/selectors/referral-id.selectors';
import { FusionAuthorization } from '../../../store/models/fusion/fusion-authorizations.models';
import {
  getFusionAuthorizations,
  isFusionAuthorizationLoaded,
  isFusionAuthorizationLoading
} from '../../../store/selectors/fusion/fusion-authorization.selectors';
import {
  ReferralAuthorizationAction,
  ReferralAuthorizationArchetype
} from '../../referral-authorization/referral-authorization.models';
import { AuthorizationInformationService } from '../../referral-authorization/authorization-information.service';
import { ReferralLocationsModalComponent } from '../referral-locations-modal/referral-locations-modal.component';
import {
  LabelValuePairWithModalData,
  ModalConfig,
  ModalType
} from '../../../store/models/referral-id.models';
import { TransportationReferralLocationsModalComponent } from '../transportation-referral-locations-modal/transportation-referral-locations-modal.component';
import { getReferralAuthorizationAction } from '../../../store/selectors/referral-authorization.selectors';

@Component({
  selector: 'healthe-referral-overview-card',
  templateUrl: './referral-overview-card.component.html',
  styleUrls: ['./referral-overview-card.component.scss']
})
export class ReferralOverviewCardComponent implements OnInit {
  @Input() transportationType: string;

  @Input()
  archeType: ReferralAuthorizationArchetype;

  referralOverviewBodyConfig: {
    [overviewCardStateFieldName: string]: LabelValuePairWithModalData;
  } = {
    referralId: {
      label: 'REFERRAL ID',
      hasModalData: false
    },
    status: {
      label: 'STATUS',
      hasModalData: false
    },
    requestorEmail: {
      label: 'REQUESTOR EMAIL',
      hasModalData: false
    },
    requestorPhone: {
      label: 'REQUESTOR PHONE',
      hasModalData: false
    },
    prescriberPhone: {
      label: 'PRESCRIBER PHONE',
      hasModalData: false
    },
    authorizedLocationsModalData: {
      label: 'REFERRAL LOCATIONS',
      shouldDisplay: this.store$.pipe(select(getDisplayReferralLocationsLink)),
      hasModalData: true,
      modalConfig: {
        modalType: ModalType.ReferralLocations,
        linkDisplayText: 'View Referral Locations'
      } as ModalConfig
    }
  };

  referralOverviewHeaderConfig: {
    [overviewCardStateFieldName: string]: LabelValuePairWithModalData;
  } = {
    dateCreated: {
      label: 'RECEIVED DATE',
      hasModalData: false
    },
    requestorRoleAndTitle: {
      label: 'REQUESTOR ROLE/NAME',
      hasModalData: false
    },
    vendorName: {
      label: 'VENDOR',
      hasModalData: false
    },
    prescriberName: {
      label: 'PRESCRIBER',
      hasModalData: false
    }
  };

  panelExpanded = false;
  panelHeaderHeight = '';

  diagnosisCodesAndDescriptions$: Observable<string[]> = this.store$.pipe(
    select(getDiagnosisCodesAndDescriptions)
  );

  hasData$: Observable<boolean> = this.store$.pipe(
    select(getReferralOverviewCardState),
    map((overview) => !_.isEmpty(overview.referralId))
  );

  referralArchetype$ = this.store$.pipe(select(getAuthorizationArchetype));

  tableCondition = TableCondition;

  // This just attempts to go through the configured pairs and add their values
  referralOverviewBodyValuePair$: Observable<
    Array<LabelValuePairWithModalData>
  > = this.store$.pipe(
    select(getReferralOverviewCardState),
    map((overview) => {
      return Object.keys(this.referralOverviewBodyConfig).map((key) => {
        const overViewBodyItem: LabelValuePairWithModalData = {
          ...this.referralOverviewBodyConfig[key]
        };

        if (overViewBodyItem.hasModalData) {
          overViewBodyItem.modalConfig.modalData = overview[key];
        } else {
          overViewBodyItem.value = overview[key];
        }

        return overViewBodyItem;
      });
    })
  );

  isFusionReferralAuthLoaded$ = this.store$.pipe(
    select(isFusionAuthorizationLoaded)
  );

  isFusionReferralAuthLoading$ = this.store$.pipe(
    select(isFusionAuthorizationLoading)
  );

  fusionReferralAuthorizations$: Observable<
    FusionAuthorization[]
  > = this.store$.pipe(
    select(getFusionAuthorizations),
    distinctUntilChanged(isEqual)
  );

  // This just attempts to go through the configured pairs and add their values
  referralOverviewHeaderValuePair$: Observable<
    Array<LabelValuePairWithModalData>
  > = this.store$.pipe(
    select(getReferralOverviewCardState),
    map((overview) => {
      return Object.keys(this.referralOverviewHeaderConfig).map((key) => {
        const overViewHeaderItem: LabelValuePairWithModalData = {
          ...this.referralOverviewHeaderConfig[key]
        };

        if (overViewHeaderItem.hasModalData) {
          overViewHeaderItem.modalConfig.modalData = overview[key];
        } else {
          overViewHeaderItem.value = overview[key];
        }

        return overViewHeaderItem;
      });
    })
  );

  referralAuthorizationAction$: Observable<
    ReferralAuthorizationAction
  > = this.store$.pipe(
    select(getReferralAuthorizationAction),
    filter(
      (authorizationAction) =>
        authorizationAction !== ReferralAuthorizationAction.DEFAULT
    )
  );

  isLoading$: Observable<boolean> = this.store$.pipe(
    select(isReferralOverviewLoading)
  );

  constructor(
    private store$: Store<RootState>,
    private matDialog: MatDialog,
    private verbiageService: VerbiageService,
    private authorizationInformationService: AuthorizationInformationService
  ) {}

  ngOnInit() {
    // We need to load the Auth data for: Cancellations & Body parts history modal
    combineLatest([
      this.isFusionReferralAuthLoaded$,
      this.isFusionReferralAuthLoading$,
      this.store$.pipe(select(getEncodedCustomerId)),
      this.store$.pipe(select(getEncodedReferralId)),
      this.store$.pipe(select(getEncodedClaimNumber)),
      this.referralAuthorizationAction$,
      this.referralArchetype$
    ])
      .pipe(first())
      .subscribe(
        ([
          isLoaded,
          isLoading,
          encodedCustomerId,
          encodedReferralId,
          encodedClaimNumber,
          referralAuthorizationAction,
          referralArchetype
        ]: [
          boolean,
          boolean,
          string,
          string,
          string,
          ReferralAuthorizationAction,
          ReferralAuthorizationArchetype
        ]) => {
          if (
            !isLoaded &&
            !isLoading &&
            referralArchetype !== 'transportation'
          ) {
            this.authorizationInformationService.dispatchGetReferralAuthorization(
              this.archeType,
              encodedReferralId,
              encodedCustomerId,
              encodedClaimNumber,
              referralAuthorizationAction ===
                ReferralAuthorizationAction.AUTHORIZE
            );
          }
        }
      );
  }

  openViewAllModal() {
    this.matDialog.open(IcdCodesEditModalComponent, {
      autoFocus: false,
      width: '702px'
    });
  }

  openReferralLocationsModal() {
    this.store$
      .pipe(
        select(getEncodedReferralId),
        first()
      )
      .subscribe((referralId) => {
        this.matDialog.open(ReferralLocationsModalComponent, {
          autoFocus: false,
          width: '900px',
          data: referralId
        });
      });
  }

  getVerbage(verbage: TableCondition) {
    return this.verbiageService.getTableVerbiage(verbage);
  }

  invokeModal(item: LabelValuePairWithModalData) {
    switch (item.modalConfig.modalType) {
      case ModalType.ReferralLocations:
        this.matDialog.open(TransportationReferralLocationsModalComponent, {
          data: item.modalConfig.modalData,
          width: '750px'
        });
        break;
      default:
        console.error('Not implemented modal type...');
        break;
    }
  }
}
