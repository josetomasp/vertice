import { Injectable } from '@angular/core';
import { pluckPrefValue, TableColumnState, VerticeResponse } from '@shared';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../store/models/root.models';
import { combineLatest, Observable } from 'rxjs';
import { getPreferenceByQuery } from '../../preferences/store/selectors/user-preferences.selectors';
import {
  Preference,
  PreferenceType
} from '../../preferences/store/models/preferences.models';
import { first, map, switchMap } from 'rxjs/operators';
import { Range } from '@healthe/vertice-library/src/app/lib/daterange/ngx-mat-drp/model/model';
import * as moment from 'moment';
import {
  BillingFilters,
  BillingHistory,
  BillingHistoryItem,
  BillingRequestParams
} from '../store/models/billing.models';
import * as _ from 'lodash';
import { BillingService } from './billing.service';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../store/selectors/router.selectors';
import { environment } from '../../../environments/environment.dev-remote';
import { MatSortable } from '@angular/material/sort';

export interface ClaimViewBillingTabStoreState {
  tableColumnState: TableColumnState;
  pageSize: number;
  isInitialized: boolean;
  dateRange: Range;
  tableColumnList: string[];
  allBillingFilters: BillingFilters;
  currentBillingFilters: BillingFilters;
  isLoading: boolean;
  isLoaded: boolean;
  errors: string[];
  billingHistory: BillingHistory;
  billingHistoryTableData: BillingHistoryItem[];
  tableSort: MatSortable;
}

const defaultState: ClaimViewBillingTabStoreState = {
  tableColumnState: TableColumnState.TruncateText,
  pageSize: 50,
  isInitialized: false,
  isLoading: false,
  isLoaded: false,
  errors: [],
  billingHistory: null,
  billingHistoryTableData: [],
  tableSort: {
    id: 'paidDate',
    start: 'desc',
    disableClear: false
  },
  dateRange: {
    fromDate: moment().subtract(3, 'month').toDate(),
    toDate: moment().toDate()
  },
  tableColumnList: [],
  allBillingFilters: {
    productType: [],
    prescriberName: [],
    itemName: [],
    status: []
  },
  currentBillingFilters: {
    productType: [],
    prescriberName: [],
    itemName: [],
    status: []
  }
};

@Injectable()
export class ClaimViewBillingTabStore extends ComponentStore<ClaimViewBillingTabStoreState> {
  pageSizeFromPreferences$: Observable<number> = this.store$.pipe(
    select(getPreferenceByQuery, {
      screenName: 'global',
      preferenceTypeName: PreferenceType.PageSize
    }),
    pluckPrefValue
  );

  columnListPreference$: Observable<Preference<string[]>> = this.store$.pipe(
    select(getPreferenceByQuery, {
      screenName: 'global',
      preferenceTypeName: PreferenceType.ColumnList,
      componentName: 'globalBillingActivityTable'
    })
  );

  // Selectors
  readonly isInitialized$ = this.select((state) => state.isInitialized);
  readonly pageSize$ = this.select((state) => state.pageSize);
  readonly dateRange$ = this.select((state) => state.dateRange);

  // Updaters
  readonly setIsInitialized = this.updater((state, isInitialized: boolean) => ({
    ...state,
    isInitialized
  }));

  readonly setPageSize = this.updater((state, pageSize: number) => ({
    ...state,
    pageSize
  }));

  readonly setTableColumnState = this.updater(
    (state, tableColumnState: TableColumnState) => ({
      ...state,
      tableColumnState
    })
  );

  readonly setDateRange = this.updater((state, dateRange: Range) => ({
    ...state,
    dateRange
  }));

  readonly setTableColumnList = this.updater(
    (state, tableColumnList: string[]) => ({
      ...state,
      tableColumnList
    })
  );

  readonly setAllBillingFilters = this.updater(
    (state, allBillingFilters: BillingFilters) => ({
      ...state,
      allBillingFilters
    })
  );

  readonly setCurrentBillingFilters = this.updater(
    (state, currentBillingFilters: BillingFilters) => ({
      ...state,
      currentBillingFilters
    })
  );

  readonly setIsLoading = this.updater((state, isLoading: boolean) => ({
    ...state,
    isLoading
  }));

  readonly setIsLoaded = this.updater((state, isLoaded: boolean) => ({
    ...state,
    isLoaded
  }));

  readonly setErrors = this.updater((state, errors: string[]) => ({
    ...state,
    errors
  }));

  readonly setBillingHistory = this.updater(
    (state, billingHistory: BillingHistory) => ({
      ...state,
      billingHistory
    })
  );

  readonly setBillingHistoryTableData = this.updater(
    (state, billingHistoryTableData: BillingHistoryItem[]) => ({
      ...state,
      billingHistoryTableData
    })
  );

  readonly setTableSort = this.updater(
    (state, tableSort: MatSortable) => ({
      ...state,
      tableSort
    })
  );

  // Effects
  readonly getBillingDataEffect = this.effect(
    (billingQuery$: Observable<BillingRequestParams>) => {
      return billingQuery$.pipe(
        switchMap((query) => {
          this.setIsLoading(true);
          this.setBillingHistoryTableData([]);
          return this.billingService.getBillingHistoryData(query).pipe(
            tapResponse(
              (response: VerticeResponse<BillingHistory>) => {
                if (response.httpStatusCode >= 300) {
                  this.setErrors(response.errors);
                  this.setBillingHistory(null);
                  const billingFilters: BillingFilters =
                    this.makeAllBillingFilters([]);
                  this.setAllBillingFilters(billingFilters);
                  this.setCurrentBillingFilters(billingFilters);
                } else {
                  this.setIsLoaded(true);
                  this.setErrors([]);
                  this.setBillingHistory(response.responseBody);
                  this.setBillingHistoryTableData(response.responseBody.billHistory);

                  const billingFilters: BillingFilters =
                    this.makeAllBillingFilters(
                      response.responseBody.billHistory
                    );
                  this.setAllBillingFilters(billingFilters);
                  this.setCurrentBillingFilters(billingFilters);
                }
                // Needs to be last
                this.setIsLoading(false);

              },
              (error) => {
                console.error(error);
                this.setBillingHistory(null);
                const billingFilters: BillingFilters =
                  this.makeAllBillingFilters([]);
                this.setAllBillingFilters(billingFilters);
                this.setCurrentBillingFilters(billingFilters);
                this.setErrors([
                  'General API Error.  Please contact HealtheSystems for support.'
                ]);
                this.setIsLoading(false);
              }
            )
          );
        })
      );
    }
  );

  constructor(
    public store$: Store<RootState>,
    public billingService: BillingService
  ) {
    super(defaultState);
  }

  init(): void {
    combineLatest([
      this.isInitialized$,
      this.pageSizeFromPreferences$,
      this.columnListPreference$
    ])
      .pipe(first())
      .subscribe(([isInitialized, pageSize, columnListPreference]) => {
        if (false === isInitialized) {
          this.setIsInitialized(true);
          this.setPageSize(pageSize);
          this.setTableColumnList(columnListPreference.value);
          this.fetchBillingData();
        }
      });
  }

  fetchBillingData() {
    this.getBillingDataEffect(
      combineLatest([
        this.store$.pipe(select(getEncodedClaimNumber)),
        this.store$.pipe(select(getEncodedCustomerId)),
        this.dateRange$
      ]).pipe(
        first(),
        map(([claimNumber, customerId, dateRange]) => ({
          claimNumber,
          customerId,
          productType: 'ALL',
          serviceFromDate: moment(dateRange.fromDate).format(
            environment.dateFormat
          ),
          serviceToDate: moment(dateRange.toDate).format(environment.dateFormat)
        }))
      )
    );
  }

  makeAllBillingFilters(
    billingHistoryItem: BillingHistoryItem[]
  ): BillingFilters {
    let filters: BillingFilters = {} as BillingFilters;

    filters.itemName = _.sortBy(
      _.union(
        _.clone(billingHistoryItem).map(
          (histItem: BillingHistoryItem) => histItem.itemName
        )
      )
    );

    filters.productType = _.sortBy(
      _.union(
        _.clone(billingHistoryItem).map(
          (histItem: BillingHistoryItem) => histItem.productType
        )
      )
    );

    filters.prescriberName = _.sortBy(
      _.union(
        _.clone(billingHistoryItem).map((histItem: BillingHistoryItem) => {
          return histItem.prescriberName;
        })
      )
    );

    filters.status = _.sortBy(
      _.union(
        _.clone(billingHistoryItem).map(
          (histItem: BillingHistoryItem) => histItem.status
        )
      )
    );

    return filters;
  }
}
