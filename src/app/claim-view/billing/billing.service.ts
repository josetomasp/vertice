import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  generateQueryParams,
  getApiUrl,
  VerticeResponse
} from '@shared';
import { Observable } from 'rxjs';
import {
  BillingHistory,
  BillingRequestParams
} from '../store/models/billing.models';
import { ClaimViewState } from '../store/models/claim-view.models';
import { BILLING_TAB_COLUMNS } from './columns';

@Injectable({ providedIn: 'root' })
export class BillingService {
  constructor(
    private store$: Store<ClaimViewState>,
    private http: HttpClient,
  ) {}

  getBillingHistoryData(
    params: BillingRequestParams
  ): Observable<VerticeResponse<BillingHistory>> {
    return this.http.get<VerticeResponse<BillingHistory>>(
      getApiUrl('billingHistoryData', generateQueryParams(params))
    );
  }
  public getDefaultTabColumns(): string[] {
    return BILLING_TAB_COLUMNS.filter((col) => col.defaultColumn).map(
      (col) => col.name
    );
  }
}
