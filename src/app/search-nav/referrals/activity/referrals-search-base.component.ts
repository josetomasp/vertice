import { Directive, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { HealtheSelectOption, pageSizeOptions } from '@shared';
import { combineLatest, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  takeUntil,
  tap
} from 'rxjs/operators';
import { PreferenceType } from 'src/app/preferences/store/models/preferences.models';
import { RootState } from 'src/app/store/models/root.models';
import { TableCondition, VerbiageService } from 'src/app/verbiage.service';
import { NAV_DATE_LAST_THREE_MONTHS_RANGE } from './components/referral-search-box/referral-search-box.config';
import {
  getNavSearchState,
  getSearchABMServicesOptions,
  getSearchOptions,
  getSearchReferralStatusQueuesOptions
} from '../../store/selectors';
import { NavSearchTableConfig } from '../../search-nav-table.config';
import { getUserInfoPreferencesConfig } from '../../store/selectors/make-a-referral-search.selectors';
import {
  getDefaultValueByScreenOrAllForCustomerSpecific,
  getDefaultValueByScreenOrAllForSharedLists,
  getSelectByScreenOptions,
  getSelectOptionsForCustomerSpecific
} from '../../shared/select-options-helpers';
import { NavReferral } from '../../store/models/nav-referral.model';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { getInternalUserCustomer } from '../../../user/store/selectors/user.selectors';

@Directive()
export abstract class ReferralsSearchBaseComponent extends DestroyableComponent
  implements OnInit {
  isLoadingResults$: Observable<boolean>;
  serviceTypes$: Observable<HealtheSelectOption<string>[]>;
  results$: Observable<NavReferral[]>;
  statuses$: Observable<HealtheSelectOption<string>[]>;

  users$: Observable<HealtheSelectOption<string>[]>;
  customers$: Observable<HealtheSelectOption<string>[]>;

  internalUserCustomer$: Observable<string> = this.store$.pipe(
    select(getInternalUserCustomer),
    filter((value) => !!value)
  );

  abmServiceOptions$: Observable<any> = this.store$.pipe(
    select(getSearchABMServicesOptions)
  );

  referralStatusQueues$: Observable<any> = this.store$.select(
    getSearchReferralStatusQueuesOptions
  );

  username: string;
  isInternal: boolean = false;
  defaultStatus: string;
  defaultServiceType: string;
  defaultAssignedAdjuster: string;
  lastThreeMonthsRange: {
    fromDate: Date;
    toDate: Date;
  } = NAV_DATE_LAST_THREE_MONTHS_RANGE;
  pagerSizeOptions: number[] = pageSizeOptions;
  // Make sure to set searchFormName in extending Component
  searchFormName: string;
  searchformGroup: FormGroup;
  searchTableConfig: NavSearchTableConfig;

  constructor(
    protected fb: FormBuilder,
    protected store$: Store<RootState>,
    protected verbiageService: VerbiageService
  ) {
    super();
    this.searchformGroup = this.fb.group({
      referralId: null,
      claimNumber: null,
      claimantLastName: null,
      claimantFirstName: null,
      doiStartDate: null,
      doiEndDate: null,
      assignedTo: null,
      status: null,
      serviceType: null
    });
  }

  ngOnInit(): void {
    this.store$
      .pipe(
        first(),
        select(getUserInfoPreferencesConfig, {
          screenName: 'global',
          preferenceTypeName: PreferenceType.PageSize
        })
      )
      .subscribe((data) => {
        if (false === data.userInfo.internal) {
          this.serviceTypes$ = this.store$.pipe(
            takeUntil(this.onDestroy$),
            select(getNavSearchState),
            filter(
              (navSearchState) => !navSearchState.searchOptions.isOptionsLoading
            ),
            distinctUntilChanged(
              (navSearchState1, navSearchState2) =>
                navSearchState1.searchOptions.abmServiceTypesByCustomer
                  .length ===
                navSearchState2.searchOptions.abmServiceTypesByCustomer.length
            ),
            tap((navSearchState) => {
              this.defaultServiceType = getDefaultValueByScreenOrAllForCustomerSpecific(
                data.userInfo,
                navSearchState.searchOptions.abmServiceTypesByCustomer,
                this.searchFormName
              );
              this.searchformGroup
                .get('serviceType')
                .setValue(this.defaultServiceType);
            }),
            map((navSearchState) =>
              getSelectOptionsForCustomerSpecific(
                data.userInfo.internal,
                navSearchState.searchOptions.abmServiceTypesByCustomer,
                this.searchFormName
              )
            )
          );

          this.statuses$ = this.store$.pipe(
            takeUntil(this.onDestroy$),
            select(getNavSearchState),
            filter(
              (navSearchState) => !navSearchState.searchOptions.isOptionsLoading
            ),
            distinctUntilChanged(
              (navSearchState1, navSearchState2) =>
                navSearchState1.searchOptions.referralStatusQueuesByCustomer
                  .length ===
                navSearchState2.searchOptions.referralStatusQueuesByCustomer
                  .length
            ),
            tap((navSearchState) => {
              this.defaultStatus = getDefaultValueByScreenOrAllForCustomerSpecific(
                data.userInfo,
                navSearchState.searchOptions.referralStatusQueuesByCustomer,
                this.searchFormName
              );
              this.searchformGroup.get('status').setValue(this.defaultStatus);
            }),
            map((navSearchState) =>
              getSelectOptionsForCustomerSpecific(
                data.userInfo.internal,
                navSearchState.searchOptions.referralStatusQueuesByCustomer,
                this.searchFormName
              )
            )
          );
        } else {
          // Internal user
          this.statuses$ = combineLatest([
            this.internalUserCustomer$,
            this.referralStatusQueues$
          ]).pipe(
            takeUntil(this.onDestroy$),
            map(([customerId, statusOptions]) => {
              if (null != statusOptions[customerId]) {
                this.defaultStatus = getDefaultValueByScreenOrAllForSharedLists(
                  statusOptions[customerId].valuesByScreen,
                  this.searchFormName
                );
                const selectOptions = getSelectByScreenOptions(
                  statusOptions[customerId],
                  this.searchFormName
                );
                const currentStatusValue = this.searchformGroup.get('status')
                  .value;

                // The purpose of this is so that when you are restoring form values, or changing customers
                // We can find a match for the same status type selection and set it.
                // Oddly, the value of the control is the label value, but to set it we need the value part.
                selectOptions.forEach((item) => {
                  if (item.label === currentStatusValue) {
                    this.defaultStatus = item.value;
                  }
                });

                this.searchformGroup.get('status').setValue(this.defaultStatus);

                return getSelectByScreenOptions(
                  statusOptions[customerId],
                  this.searchFormName
                );
              }
              return [];
            })
          );

          this.serviceTypes$ = combineLatest([
            this.internalUserCustomer$,
            this.abmServiceOptions$
          ]).pipe(
            takeUntil(this.onDestroy$),
            map(([customerId, serviceOptions]) => {
              if (null != serviceOptions[customerId]) {
                this.defaultServiceType = getDefaultValueByScreenOrAllForSharedLists(
                  serviceOptions[customerId].valuesByScreen,
                  this.searchFormName
                );
                const selectOptions = getSelectByScreenOptions(
                  serviceOptions[customerId],
                  this.searchFormName
                );
                const currentServiceValue = this.searchformGroup.get(
                  'serviceType'
                ).value;

                // The purpose of this is so that when you are restoring form values, or changing customers
                // We can find a match for the same service type selection and set it.
                // Oddly, the value of the control is the label value, but to set it we need the value part.
                selectOptions.forEach((item) => {
                  if (item.label === currentServiceValue) {
                    this.defaultServiceType = item.value;
                  }
                });

                this.searchformGroup
                  .get('serviceType')
                  .setValue(this.defaultServiceType);

                return selectOptions;
              }
              return [];
            })
          );
        }

        const tableCondition = TableCondition;
        this.searchTableConfig = {
          customerID: data.userInfo.customerID,
          username: data.userInfo.username,
          noSearchPerformedText: this.verbiageService.getTableVerbiage(
            tableCondition.NoSearchPerformed
          ),
          noDataForQuery: this.verbiageService.getTableVerbiage(
            tableCondition.NoDataForQuery
          ),
          pagerSizeOptions: pageSizeOptions,
          pageSize: data.preferences.value
        };
        this.isInternal = data.userInfo.internal;

        if (data.userInfo.internal) {
          this.customers$ = this.store$.pipe(
            select(getSearchOptions),
            filter((searchOptionState) => !searchOptionState.isOptionsLoading),
            map((searchOptionsStateEmission) =>
              getSelectByScreenOptions(
                searchOptionsStateEmission.customerIds,
                this.searchFormName
              )
            )
          );
        }
      });
  }

  protected setThreeMonthsRange(): void {
    this.searchformGroup
      .get('doiStartDate')
      .setValue(this.lastThreeMonthsRange.fromDate.toString());
    this.searchformGroup
      .get('doiEndDate')
      .setValue(this.lastThreeMonthsRange.toDate.toString());
  }

  abstract search(form: FormGroup): void;

  protected abstract registeredEvents(): void;
}
