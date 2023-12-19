import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatMenu } from '@angular/material/menu';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/pro-solid-svg-icons/faChevronUp';
import { HealtheSystemErrorComponent } from '@healthe/vertice-library';
import { select, Store } from '@ngrx/store';
import { HealtheMenuOption } from '@shared';
import { RxcardModalComponent } from '@shared/components/rxcard-modal/rxcard-modal.component';
import { hexDecode, pluckPrefValue } from '@shared/lib';
import * as _ from 'lodash';
import { combineLatest, from, Observable } from 'rxjs';
import {
  filter,
  first,
  map,
  mergeMap,
  takeUntil,
  toArray
} from 'rxjs/operators';
import {
  bannerListQuery,
  expandedPreferenceQuery
} from '../../../preferences/store/models/preferences.models';
import { getPreferenceByQuery } from '../../../preferences/store/selectors/user-preferences.selectors';
import { RootState } from '../../../store/models/root.models';
import {
  Apportionment,
  ClaimBannerField
} from '../../store/models/claim.models';
import {
  getClaimBannerFields,
  isClaimV3BannerLoading,
  isEligibleForClaimantPortal
} from '../../store/selectors/claim.selectors';
import {
  getDecodedClaimNumber,
  getDecodedCustomerId,
  getEncodedClaimNumber,
  getEncodedCustomerId
} from 'src/app/store/selectors/router.selectors';
import { Router } from '@angular/router';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { ActivityProductType } from 'src/app/claim-view/store/models/activity-tab.models';
import { AppConfig } from 'src/app/app.config';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';
import { MobileInviteModalComponent } from '@modules/mobile-invite/mobile-invite-modal/mobile-invite-modal.component';
import { FeatureFlagService } from '../../../customer-configs/feature-flag.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { HealtheSnackBarService } from '@shared/service/snackbar.service';
import { faIdCard } from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'healthe-claim-overview-bar',
  templateUrl: './claim-overview-bar.component.html',
  styleUrls: ['./claim-overview-bar.component.scss']
})
export class ClaimOverviewBarComponent
  extends DestroyableComponent
  implements OnInit
{
  componentGroupName = 'claim-view';
  claimBannerPanelHeaderHeight = '';
  faIdCard = faIdCard;

  public claimOverviewTopPreference$: Observable<Array<string>> =
    this.store$.pipe(
      select(getPreferenceByQuery, bannerListQuery),
      pluckPrefValue
    );
  claimBannerExpanded$: Observable<boolean> = this.store$.pipe(
    select(getPreferenceByQuery, expandedPreferenceQuery),
    pluckPrefValue
  );

  claimBannerFields$ = this.store$.pipe(select(getClaimBannerFields));

  isEligibleForClaimantPortal$ = this.store$.pipe(
    select(isEligibleForClaimantPortal)
  );

  claimBannerBottomFields$ = combineLatest([
    this.claimOverviewTopPreference$,
    this.claimBannerFields$
  ]).pipe(
    map(([preferredFields, allFields]: [string[], ClaimBannerField[]]) =>
      allFields.filter((field) => {
        return !preferredFields.includes(field.name);
      })
    ),
    map((fields) =>
      fields.map((field) => {
        if (field.name === 'phiMemberId') {
          return {
            ...field,
            canCopy: true
          };
        }
        return field;
      })
    )
  );

  claimBannerTopFields$ = combineLatest([
    this.claimOverviewTopPreference$,
    this.claimBannerFields$
  ]).pipe(
    mergeMap(([preferredFields, allFields]: [string[], ClaimBannerField[]]) =>
      from(preferredFields).pipe(
        map((name) => _.find(allFields, { name })),
        // Filter out undefined
        filter((v) => !!v),
        map((field) => {
          if (field.name === 'phiMemberId') {
            return {
              ...field,
              canCopy: true
            };
          }
          return field;
        }),
        toArray()
      )
    )
  );

  isClaimV3BannerLoading$ = this.store$.pipe(
    select(isClaimV3BannerLoading),
    takeUntil(this.onDestroy$)
  );

  encodedClaimNumber$ = this.store$.pipe(
    select(getEncodedClaimNumber),
    first()
  );

  encodedCustomerId$ = this.store$.pipe(select(getEncodedCustomerId), first());

  decodedClaimNumber$ = this.store$.pipe(
    select(getDecodedClaimNumber),
    first()
  );

  decodedCustomerId$ = this.store$.pipe(select(getDecodedCustomerId), first());

  requestMenuIcon = faChevronDown;

  // #2_5-links
  teleconsultIpeUrl: string =
    '/PbmClinical/customer.jsp?header=stripeonly#TeleconsultIpe';
  mailOrderAddUrl: string =
    '/pbmmailorder-webapp/index.jsp?header=stripeonly#MailOrderAdd';
  serviceSelectionTemplate: string =
    '/claims/{encodedCustomerId}/{encodedClaimNumber}/referral/serviceSelection';
  manualIpeUrlTemplate: string =
    '/PbmClinical/customer.jsp?header=stripeonly#ManualIpe;customerId={decodedCustomerId};claimNum={decodedClaimNumber}';
  serviceSelectionUrl: string = '';
  manualIpeUrl: string = '';

  customerServices: ActivityProductType[] = AppConfig.customerConfigs
    .services as ActivityProductType[];

  requestDropdownOptions: Array<HealtheMenuOption> = [
    {
      text: 'Make a Referral',
      elementName: 'makeAReferral',
      action: () => {
        this.router.navigate([this.serviceSelectionUrl]);
      },
      isHidden: !this.customerServices.includes(ActivityProductType.ANCILLARY)
    },
    {
      text: 'Manual IPE',
      elementName: 'requestIpe',
      action: () => {
        openCenteredNewWindowDefaultSize(this.manualIpeUrl);
      },
      isHidden: !this.customerServices.includes(ActivityProductType.CLINICAL)
    },
    {
      text: 'Teleconsult',
      elementName: 'requestTeleconsult',
      action: () => {
        openCenteredNewWindowDefaultSize(this.teleconsultIpeUrl);
      },
      isHidden: !this.customerServices.includes(ActivityProductType.CLINICAL)
    },
    {
      text: 'Mail Order',
      elementName: 'requestMailOrder',
      action: () => {
        openCenteredNewWindowDefaultSize(this.mailOrderAddUrl);
      },
      isHidden: !this.customerServices.includes(ActivityProductType.PHARMACY)
    }
  ];

  constructor(
    public store$: Store<RootState>,
    public dialog: MatDialog,
    public router: Router,
    public featureFlagService: FeatureFlagService,
    private clipboard: Clipboard,
    private snackbar: HealtheSnackBarService
  ) {
    super();
    this.requestDropdownOptions.forEach(
      (option) =>
        (option.text = this.featureFlagService.labelChange(
          option.text,
          option.elementName
        ))
    );
  }

  ngOnInit() {
    combineLatest([this.encodedCustomerId$, this.encodedClaimNumber$])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([encodedCustomerId, encodedClaimNumber]) => {
        this.serviceSelectionUrl = this.serviceSelectionTemplate
          .replace('{encodedCustomerId}', encodedCustomerId)
          .replace('{encodedClaimNumber}', encodedClaimNumber);
        this.manualIpeUrl = this.manualIpeUrlTemplate
          .replace('{decodedCustomerId}', hexDecode(encodedCustomerId))
          .replace('{decodedClaimNumber}', hexDecode(encodedClaimNumber));
      });
  }

  getApportionmentDisplayText(apportionment: Apportionment) {
    if (apportionment.apportionmentPercent == null) {
      return '';
    }

    let apportionmentText: string = '';
    apportionmentText +=
      'Carrier (' + apportionment.apportionmentPercent + '%) + ';
    apportionmentText += 'Claimant (' + apportionment.claimantPercent + '%) + ';
    apportionmentText +=
      'Other (' + apportionment.otherApportionmentPercent + '%) = ';
    let totalPercent: number =
      apportionment.apportionmentPercent +
      apportionment.claimantPercent +
      apportionment.otherApportionmentPercent;
    apportionmentText += 'Total (' + totalPercent + '%)';

    return apportionmentText;
  }

  setOpenUntilClose(requestMenu: MatMenu) {
    this.requestMenuIcon = faChevronUp;
    requestMenu.closed.subscribe(() => {
      this.requestMenuIcon = faChevronDown;
    });
  }

  expandPanel(matExpansionPanel: MatExpansionPanel, $event: MouseEvent) {
    event.stopPropagation(); // Preventing event bubbling
    if (!this._isExpansionIndicator(event.target as HTMLElement)) {
      matExpansionPanel.toggle(); // Here's the magic
    }
  }

  copyPharmacyMemberIdToClipBoard(pharmacyMemberId) {
    const result = this.clipboard.copy(pharmacyMemberId);
    if (result) {
      this.snackbar.showSuccess('Copied to Clipboard!', null, 1500);
    }
  }

  private _isExpansionIndicator(target: HTMLElement): boolean {
    const expansionIndicatorClass = 'mat-expansion-indicator';

    return (
      target.classList && target.classList.contains(expansionIndicatorClass)
    );
  }

  openMobileInviteDialog() {
    this.dialog.open(MobileInviteModalComponent, {
      disableClose: true,
      width: '702px',
      maxHeight: '98vh'
    });
  }
}
