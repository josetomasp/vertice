import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../store/models/root.models';
import { combineLatest, Observable } from 'rxjs';
import {
  getAuthorizationArchetype,
  getDecodedClaimNumber,
  getDecodedCustomerId,
  getDecodedReferralId
} from '../../store/selectors/router.selectors';
import { first, takeUntil } from 'rxjs/operators';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';
import {
  ReferralAuthorizationArchetype
} from 'src/app/claims/abm/referral/referralId/referral-authorization/referral-authorization.models';
import {
  getReferralOverviewCardState
} from 'src/app/claims/abm/referral/store/selectors/referral-id.selectors';
import {
  ReferralOverviewCardState
} from 'src/app/claims/abm/referral/store/models/referral-id.models';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { ProductType } from '@shared/store/models/claim.models';

@Injectable({
  providedIn: 'root'
})
export class Vertice25Service extends DestroyableComponent {
  CREATE_INCIDENTS_URL: string =
    '/abm/index.jsp;?header=stripeonly#IncidentRpt;product={product};service={serviceNum};vendor={vendor};referral={referralId};claim={claimNumber};customerCd={customerId};popup=Y';
  EDIT_INCIDENTS_URL: string =
    '/abm/index.jsp;?header=stripeonly#IncidentRptEdit;incId={incidentId};popup=Y';
  VIEW_INCIDENTS_URL: string =
    '/HesDashboard/popup.jsp?header=stripeonly&popup=incidentreport#POPUP';

  decodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getDecodedCustomerId)
  );

  decodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getDecodedClaimNumber)
  );

  decodedReferralId$: Observable<string> = this.store$.pipe(
    select(getDecodedReferralId)
  );

  archetype$: Observable<ReferralAuthorizationArchetype> = this.store$.pipe(
    select(getAuthorizationArchetype)
  );

  referralOverviewCardState$: Observable<
    ReferralOverviewCardState
  > = this.store$.pipe(select(getReferralOverviewCardState));

  constructor(public store$: Store<RootState>) {
    super();
  }

  createIncidentReport(productType: ProductType = 'ABM') {
    combineLatest([
      this.decodedCustomerId$,
      this.decodedClaimNumber$,
      this.decodedReferralId$,
      this.archetype$,
      this.referralOverviewCardState$
    ])
      .pipe(
        first(),
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        ([
          customerID,
          claimNumber,
          referralId,
          archeType,
          referralOverview
        ]) => {
          let service = null;
          let vendor = null;

          if (archeType) {
            service = this.getServiceTypeIdByArcheType(archeType);
          }
          if (referralOverview && referralOverview.vendorCode) {
            vendor = referralOverview.vendorCode;
          }
          this.createIncidentReportWithParameters(
            customerID,
            claimNumber,
            referralId,
            productType,
            service,
            vendor
          );
        }
      );
  }

  createIncidentReportWithParameters(
    decodedCustomerId,
    decodedClaimNumber,
    decodedReferralId = null,
    product = null,
    serviceNum = null,
    vendor = null
  ) {
    let url = this.CREATE_INCIDENTS_URL.replace(
      '{customerId}',
      decodedCustomerId
    ).replace('{claimNumber}', decodedClaimNumber);

    if (decodedReferralId) {
      url = url.replace('{referralId}', decodedReferralId);
    } else {
      url = url.replace('referral={referralId};', '');
    }

    if (product) {
      url = url.replace('{product}', product);
    } else {
      url = url.replace('product={product};', '');
    }

    if (serviceNum) {
      url = url.replace('{serviceNum}', serviceNum);
    } else {
      url = url.replace('service={serviceNum};', '');
    }

    if (vendor) {
      url = url.replace('{vendor}', vendor);
    } else {
      url = url.replace('vendor={vendor};', '');
    }

    openCenteredNewWindowDefaultSize(url);
  }

  viewIncidentReports() {
    openCenteredNewWindowDefaultSize(this.VIEW_INCIDENTS_URL);
  }

  editIncidentReports(incidentNumber) {
    const url = this.EDIT_INCIDENTS_URL.replace('{incidentId}', incidentNumber);
    openCenteredNewWindowDefaultSize(url);
  }

  /*
  0   Default
  1	  DME	DME
  2	  HH 	Home Health
  3	  TRP	Transportation
  4	  LAN	Language
  5	  CLN	Clinical
  6	  MOR	Mail Order
  7	  RTL	Retail
  8	  OTH	Other
  9	  PM 	Physical Medicine
  10	IMP	Implants
  11	DX 	Diagnostics
  */
  private getServiceTypeIdByArcheType(
    archeType: ReferralAuthorizationArchetype
  ): number {
    switch (archeType) {
      case ReferralAuthorizationArchetype.Dme: {
        return 1;
      }
      case ReferralAuthorizationArchetype.HomeHealth: {
        return 2;
      }
      case ReferralAuthorizationArchetype.LegacyTransportation:
      case ReferralAuthorizationArchetype.Transportation: {
        return 3;
      }
      case ReferralAuthorizationArchetype.Language: {
        return 4;
      }
      case ReferralAuthorizationArchetype.PhysicalMedicine: {
        return 9;
      }
      case ReferralAuthorizationArchetype.Diagnostics: {
        return 11;
      }
      default: {
        return 0;
      }
    }
  }
}
