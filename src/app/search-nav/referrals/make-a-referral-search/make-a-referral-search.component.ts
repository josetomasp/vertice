import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { HealtheSelectOption, pageSizeOptions } from '@shared';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { PageTitleService } from '@shared/service/page-title.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { PreferenceType } from 'src/app/preferences/store/models/preferences.models';
import { RootState } from 'src/app/store/models/root.models';
import { TableCondition, VerbiageService } from 'src/app/verbiage.service';
import { ClaimResult } from '../../../claims/abm/referral/store/models/claimResult.model';
import {
  getDefaultValueByScreenOrAllForSharedLists,
  getSelectByScreenOptions
} from '../../shared/select-options-helpers';
import {
  clearClaimResults,
  loadClaimResults,
  saveSearchForm
} from '../../store/actions/make-a-referral-search.actions';
import { getSearchOptions } from '../../store/selectors';
import {
  getClaimResults,
  getLoading,
  getSavedForm,
  getServerErrors,
  getUserInfoPreferencesConfig
} from '../../store/selectors/make-a-referral-search.selectors';
import {
  ResetMakeAReferral
} from '../../../claims/abm/referral/store/actions/make-a-referral.actions';
import {
  resetFusionMakeAReferral
} from '../../../claims/abm/referral/store/actions/fusion/fusion-make-a-referral.actions';
import {
  resetSharedMakeAReferral
} from '../../../claims/abm/referral/store/actions/shared-make-a-referral.actions';

export interface SearchTableConfig {
  customerID: string;
  noSearchPerformedText: string;
  pagerSizeOptions: number[];
  pageSize: any;
}

@Component({
  selector: 'healthe-make-a-referral-search',
  templateUrl: './make-a-referral-search.component.html',
  styleUrls: ['./make-a-referral-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakeAReferralSearchComponent extends DestroyableComponent
  implements OnInit, OnDestroy {
  isInternal: boolean;
  isInitialized: boolean = false;
  pagerSizeOptions: number[] = pageSizeOptions;
  searchTableConfig: SearchTableConfig;
  searchName: string = 'Make A Referral';
  defaultCustomerCode: string;
  defaultStateOfVenue: string;

  //#region   Observables
  claimsResults$: Observable<ClaimResult[]> = this.store$.pipe(
    select(getClaimResults)
  );
  serverErrors$: Observable<string[]> = this.store$.pipe(
    select(getServerErrors)
  );
  customers$: Observable<HealtheSelectOption<string>[]>;
  isResultsLoading$ = this.store$.pipe(select(getLoading));
  savedForm$: Observable<FormGroup> = this.store$.pipe(
    first(),
    select(getSavedForm)
  );
  stateOfVenue$: Observable<HealtheSelectOption<string>[]>;

  //#endregion

  constructor(
    private store$: Store<RootState>,
    private verbiageService: VerbiageService,
    private pageTitleService: PageTitleService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
    this.pageTitleService.setTitle('Make A Referral - Claim Search');
  }

  ngOnInit(): void {
    this.registeredEvents();
    this.store$.dispatch(new ResetMakeAReferral(null));
    this.store$.dispatch(resetFusionMakeAReferral());
    this.store$.dispatch(resetSharedMakeAReferral());
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store$.dispatch(clearClaimResults());
  }

  search(form: FormGroup): void {
    if (!this.isInternal) {
      form.value.customerCode = this.searchTableConfig.customerID;
    }
    this.store$.dispatch(saveSearchForm({ form }));
    this.store$.dispatch(loadClaimResults({ searchValues: form.value }));
    if (this.isInternal) {
      const { customerCode } = form.value;
      this.searchTableConfig = {
        ...this.searchTableConfig,
        customerID: customerCode
      };
    }
  }

  private registeredEvents(): void {
    combineLatest([
      this.store$.pipe(
        select(getUserInfoPreferencesConfig, {
          screenName: 'global',
          preferenceTypeName: PreferenceType.PageSize
        })
      ),
      this.store$.pipe(
        select(getSearchOptions),
        filter((searchOptions) => !searchOptions.isOptionsLoading)
      )
    ])
      .pipe(first())
      .subscribe(([userInfoPreferences, searchOptions]) => {
        this.isInternal = userInfoPreferences.userInfo.internal;

        this.customers$ = this.store$.pipe(
          select(getSearchOptions),
          filter((searchOptionState) => !searchOptionState.isOptionsLoading),
          map((searchOptionsStateEmission) =>
            getSelectByScreenOptions(
              searchOptionsStateEmission.customerIds,
              this.searchName
            )
          )
        );

        this.stateOfVenue$ = this.store$.pipe(
          select(getSearchOptions),
          filter((searchOptionState) => !searchOptionState.isOptionsLoading),
          map((searchOptionsStateEmission) =>
            getSelectByScreenOptions(
              searchOptionsStateEmission.statesOfVenue,
              this.searchName
            )
          )
        );

        const tableCondition = TableCondition;
        this.searchTableConfig = {
          customerID: userInfoPreferences.userInfo.customerID,
          noSearchPerformedText: this.verbiageService.getTableVerbiage(
            tableCondition.NoSearchPerformed
          ),
          pagerSizeOptions: pageSizeOptions,
          pageSize: userInfoPreferences.preferences.value
        };

        if (this.isInternal) {
          this.defaultCustomerCode = getDefaultValueByScreenOrAllForSharedLists(
            searchOptions.customerIds.valuesByScreen,
            this.searchName
          );
        }

        this.defaultStateOfVenue = getDefaultValueByScreenOrAllForSharedLists(
          searchOptions.statesOfVenue.valuesByScreen,
          this.searchName
        );

        this.isInitialized = true;
        this.changeDetectorRef.detectChanges();
      });
  }
}
