import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RequestClaimV2 } from '@shared/store/actions/claim.actions';
import { Observable, zip } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { RootState } from '../../../../store/models/root.models';
import {
  getDecodedClaimNumber,
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getPbmServiceType
} from '../../../../store/selectors/router.selectors';
import { getClaimSearchResults } from '../../../store';
import { PBM_SERVICE_TYPE_DISPLAY_MAP } from '../store/models/pbm-authorization-service-type.models';

@Component({
  selector: 'healthe-pbm-header-bar',
  templateUrl: './pbm-header-bar.component.html',
  styleUrls: ['./pbm-header-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PbmHeaderBarComponent implements OnInit {
  decodedClaimNumber$ = this.store$.pipe(first(), select(getDecodedClaimNumber));
  private encodedClaimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  private customerId$ = this.store$.pipe(select(getEncodedCustomerId));
  claimViewLink$: Observable<string[]> = zip(
    this.encodedClaimNumber$,
    this.customerId$
  ).pipe(
    tap(([eClaimNumber, eCustomerId]: [string, string]) => {
      this.store$.dispatch(
        new RequestClaimV2({
          claimNumber: eClaimNumber,
          customerId: eCustomerId
        })
      );
    }),
    map(([eClaimNumber, eCustomerId]: [string, string]) => {
      return [`/claimview/${eCustomerId}/${eClaimNumber}`];
    })
  );
  riskClaim$ = this.store$.pipe(
    select(getClaimSearchResults),
    filter((res) => res.length > 0),
    map((res) => res[0])
  );
  riskLevelNumber$ = this.riskClaim$.pipe(
    map((claim) => claim.riskLevelNumber)
  );
  riskLevel$ = this.riskClaim$.pipe(map((claim) => claim.riskLevel));
  serviceType$ = this.store$.pipe(
    select(getPbmServiceType),
    map((serviceType) => PBM_SERVICE_TYPE_DISPLAY_MAP[serviceType])
  );

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {}
}
