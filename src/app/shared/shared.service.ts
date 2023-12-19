import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { generateQueryParams, hexEncode } from '@shared/lib';
import { Observable } from 'rxjs';
import { TrendingRiskModalState } from './store/models';
import * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import {
  ClaimTrendingModalComponent,
  TrendingRiskModalClosedResponse
} from './components/claim-trending-modal/claim-trending-modal.component';
import { Store } from '@ngrx/store';
import { RootState } from '../store/models/root.models';
import { SnoozeClaimRiskActionsRequest } from './store/actions/shared.actions';
import { apiUrls } from '../apiUrls';

const moment = _moment;

@Injectable({ providedIn: 'root' })
export class SharedService {
  getTrendingRiskModalData(
    claimNumber: string
  ): Observable<TrendingRiskModalState> {
    const fromDate = moment()
      .add(-6, 'months')
      .format('MM/DD/YYYY');
    const toDate = moment().format('MM/DD/YYYY');
    const params = generateQueryParams({ fromDate, toDate });
    claimNumber = hexEncode(claimNumber);
    return this.http.get<TrendingRiskModalState>(
      `${apiUrls.trendingRiskModalData}/${claimNumber}?${params}`
    );
  }

  openTrendingRiskModal(riskData: TrendingRiskModalState) {
    this.dialog
      .open<
        ClaimTrendingModalComponent,
        TrendingRiskModalState,
        TrendingRiskModalClosedResponse
      >(ClaimTrendingModalComponent, {
        data: riskData,
        autoFocus: false,
        width: '900px'
      })
      .afterClosed()
      .subscribe(
        ({ claimNumber, selectedAction }: TrendingRiskModalClosedResponse) => {
          this.router.navigate([]);
          if (claimNumber && selectedAction && selectedAction.url === null) {
            this.store$.dispatch(
              new SnoozeClaimRiskActionsRequest({ claimNumber })
            );
          }
        }
      );
  }

  constructor(
    public store$: Store<RootState>,
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router
  ) {}
}
