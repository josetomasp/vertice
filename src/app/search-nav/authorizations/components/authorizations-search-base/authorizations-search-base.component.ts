import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../../store/models/root.models';
import { PageTitleService } from '@shared/service/page-title.service';
import {
  getNavigationSearchStateByName,
  getNavSearchState,
  getSearchABMServicesOptions,
  getSearchOptions,
  getSearchReferralStatusQueuesOptions,
  getSearchResultIsLoadingByName,
  getSearchStateOfVenueOptions,
  getSearchVendorsOptions
} from '../../../store/selectors';
import { getUserInfo } from '../../../../user/store/selectors/user.selectors';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  takeUntil,
  tap
} from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { UserInfo } from '../../../../user/store/models/user.models';
import {
  executeNavigationSearchRequest,
  initializeSearchState,
  saveSearchFormValues
} from '../../../store/actions';
import { SearchNavService } from '../../../search-nav.service';
import { FormControl, ValidatorFn } from '@angular/forms';
import { HealtheTableColumnDef, pluckPrefValue } from '@shared';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { getPreferenceByQuery } from '../../../../preferences/store/selectors/user-preferences.selectors';
import { PreferenceType } from '../../../../preferences/store/models/preferences.models';
import { Router } from '@angular/router';
import { MatSortable } from '@angular/material/sort';
import { SearchOptions } from '../../../store/models/search-options.model';
import {
  NavigationSearchResults,
  NavigationSearchState,
  NavSearchState
} from '../../../store/reducers/nav-search.reducers';
import * as _moment from 'moment';
import { getSelectByScreenOptions } from '../../../shared/select-options-helpers';
import { SearchNavFormField } from '../../../shared/SearchNavTypes';
import { flatten } from 'lodash';
import { HealtheComponentConfig } from '@modules/healthe-grid';
import { FeatureFlagService } from '../../../../customer-configs/feature-flag.service';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import {
  GeneralExporterService,
  GeneralExportRequest
} from '@modules/general-exporter';

const moment = _moment;

@Component({
  selector: 'healthe-authorizations-search-base',
  templateUrl: './authorizations-search-base.component.html',
  styleUrls: ['./authorizations-search-base.component.scss']
})
export class AuthorizationsSearchBaseComponent
  extends DestroyableComponent
  implements OnInit
{
  @Input() displaySearchName: boolean = true;
  searchName: string = 'DEV - set page title';
  componentGroupName: string = 'SET IN SUBCLASS FOR FEATURE FLAG SERVICE';
  serviceOptionSelected$ = this.store$.pipe(
    select(getNavSearchState),
    takeUntil(this.onDestroy$),
    filter((navSearchState) =>
      navSearchState.navigationSearchesStates[this.searchName] &&
      navSearchState.navigationSearchesStates[this.searchName].searchInputs
        ? !!navSearchState.navigationSearchesStates[this.searchName]
            .searchInputs['abmServiceType']
        : false
    ),
    distinctUntilChanged(
      (navSearchState1, navSearchState2) =>
        navSearchState1.navigationSearchesStates[this.searchName].searchInputs[
          'abmServiceType'
        ] ===
        navSearchState2.navigationSearchesStates[this.searchName].searchInputs[
          'abmServiceType'
        ]
    ),
    map(
      (navSearchState) =>
        navSearchState.navigationSearchesStates[this.searchName].searchInputs[
          'abmServiceType'
        ]
    )
  );

  searchBoxValidators: ValidatorFn[];
  formGroupValidationErrorMessages: { [key: string]: string };
  warningMessage: string = null;

  searchOptionsState$: Observable<NavSearchState> = this.store$.pipe(
    select(getNavSearchState),
    filter((navSearchState) => !navSearchState.searchOptions.isOptionsLoading)
  );

  customers$ = this.store$.pipe(
    select(getSearchOptions),
    filter((searchOptionState) => !searchOptionState.isOptionsLoading),
    map((searchOptionsStateEmission) =>
      getSelectByScreenOptions(
        searchOptionsStateEmission.customerIds,
        this.searchName
      )
    )
  );
  assignedAdjusters$;

  serviceVendorsOption$ = this.store$.pipe(
    select(getSearchVendorsOptions),
    takeUntil(this.onDestroy$),
    distinctUntilChanged(
      (vendorOptions1, vendorOptions2) =>
        vendorOptions1.length === vendorOptions2.length
    )
  );

  servicesOption$ = this.store$.pipe(
    select(getSearchABMServicesOptions),
    takeUntil(this.onDestroy$),
    distinctUntilChanged(
      (servicesOptions1, servicesOptions2) =>
        servicesOptions1.length === servicesOptions2.length
    )
  );

  referralStatusQueuesOption$ = this.store$.pipe(
    select(getSearchReferralStatusQueuesOptions),
    takeUntil(this.onDestroy$),
    distinctUntilChanged(
      (referralStatusQueuesOptions1, referralStatusQueuesOptions2) =>
        referralStatusQueuesOptions1.length ===
        referralStatusQueuesOptions2.length
    )
  );

  stateOfVenueOption$ = this.store$.pipe(
    select(getSearchStateOfVenueOptions),
    takeUntil(this.onDestroy$),
    distinctUntilChanged(
      (stateOfVenueOptions1, stateOfVenueOptions2) =>
        stateOfVenueOptions1.valuesByScreen.length ===
        stateOfVenueOptions2.valuesByScreen.length
    )
  );
  userInfo$: Observable<UserInfo> = this.store$.pipe(
    select(getUserInfo),
    first()
  );
  pageSize$ = this.store$.pipe(
    select(getPreferenceByQuery, {
      screenName: 'global',
      preferenceTypeName: PreferenceType.PageSize
    }),
    pluckPrefValue
  );
  resultsData$: Observable<NavigationSearchResults>;
  errorsMessages$: Observable<string[]>;
  isResultLoading$: Observable<boolean>;
  simpleSearchFormConfig: SearchNavFormField[][] = [];
  advancedSearchFormConfig: SearchNavFormField[][] = [];
  defaultSearchFormValues: { [field: string]: any };
  currentSearchFormValues: { [field: string]: any };
  resultsColumnsConfig: HealtheTableColumnDef[];
  resultsDefaultSort: MatSortable;
  resultsActionsConfig: HealtheComponentConfig;
  searchInitialized: boolean = false;
  subTitle = 'Fill out any combination of fields';
  subTitleListItems = [];
  isInternalUser = false;
  internalUserCustomerId = '';
  enableExport = false;
  generalExportSheetName = 'Sheet 1';
  assignedAdjusterPanelClass: string = 'assignedAdjuster-field--select-panel';

  alwaysShowErrors = false;
  userInfo: UserInfo;

  constructor(
    protected store$: Store<RootState>,
    private pageTitleService: PageTitleService,
    protected searchNavService: SearchNavService,
    protected router: Router,
    protected featureFlagService: FeatureFlagService,
    private confirmationModalService: ConfirmationModalService,
    protected generalExporterService: GeneralExporterService
  ) {
    super();
  }

  transformRowData(resultRows: {}[]): {}[] {
    return resultRows;
  }

  ngOnInit() {
    this.pageTitleService.setTitle(this.searchName);

    combineLatest([
      this.userInfo$,
      this.searchOptionsState$,
      this.store$.pipe(
        select(getNavigationSearchStateByName, {
          searchFormName: this.searchName
        })
      )
    ])
      .pipe(
        filter(
          ([, searchOptionsState]) =>
            !searchOptionsState.searchOptions.isOptionsLoading
        ),
        first()
      )
      .subscribe(([userInfo, searchOptionsState, specificSearchState]) => {
        this.userInfo = userInfo;
        this.isInternalUser = userInfo.internal;

        if (!specificSearchState) {
          this.store$.dispatch(
            initializeSearchState({ searchFormName: this.searchName })
          );
        }

        this.initializeConfigurations(
          userInfo,
          searchOptionsState.searchOptions
        );
        this.initializeFormControls(specificSearchState);
        this.resultsColumnsConfig = this.resultsColumnsConfig.filter(
          (column) =>
            !this.featureFlagService.shouldElementBeRemoved(
              this.componentGroupName,
              column.name + 'Column'
            )
        );

        this.searchInitialized = true;
      });

    this.resultsData$ = this.store$.pipe(
      select(getNavigationSearchStateByName, {
        searchFormName: this.searchName
      }),
      map((searchState) => searchState?.searchResults),
      map((searchResults) => {
        if (searchResults?.resultRows) {
          searchResults.resultRows = this.transformRowData(
            searchResults.resultRows
          );
        } else {
          if (searchResults) {
            searchResults.resultRows = [];
          }
        }

        return searchResults;
      })
    );

    this.errorsMessages$ = this.store$.pipe(
      select(getNavigationSearchStateByName, {
        searchFormName: this.searchName
      }),
      map((searchState) => (searchState ? searchState.requestErrors : null))
    );

    this.isResultLoading$ = this.store$.pipe(
      select(getSearchResultIsLoadingByName, {
        searchFormName: this.searchName
      }),
      distinctUntilChanged()
    );
  }

  initializeConfigurations(userInfo: UserInfo, searchOptions: SearchOptions) {
    // As of now, the configurations that are supported are:
    //  1. Simple search form fields
    //  2. (Optional) Advanced search form fields
    //  3. Default search form values
    //  4. Results table columns/styles
    //  5. Default column for sorting results (to come in next feature PR)
    //  6. (Optional) Column click event actions (subscription logic)
    console.error(
      'DEV - You should create a child implementation of this function'
    );
  }

  searchClicked() {
    this.executeSearch(this.currentSearchFormValues);
  }

  saveFormValues(searchParameters: { [parameter: string]: any }) {
    this.store$.dispatch(
      saveSearchFormValues({
        searchFormName: this.searchName,
        searchFormValues: searchParameters
      })
    );

    this.currentSearchFormValues = searchParameters;
  }

  executeSearch(searchParameters: { [parameter: string]: any }) {
    this.store$.dispatch(
      executeNavigationSearchRequest({
        searchFormName: this.searchName,
        searchFormValues: searchParameters
      })
    );
  }

  doExport(exportType: string) {
    this.resultsData$.pipe(first()).subscribe((results) => {
      const request: GeneralExportRequest =
        this.generalExporterService.buildTableData(
          this.removeViewColumnsFromExport(this.getExportColumns()),
          results.resultRows
        );
      request.outputFormat = exportType;
      request.sheetName = this.generalExportSheetName;
      request.fileName = this.searchName;
      this.generalExporterService.doExport(request);
    });
  }

  initializeFormControls(searchState: NavigationSearchState) {
    // Creates controls with previous user values if state exists for the given search,
    //  default values found in select:defaultValue map, or null if no default set
    this.simpleSearchFormConfig.forEach((searchFormFieldConfigRow) =>
      searchFormFieldConfigRow.forEach((searchFormFieldConfig) => {
        // This is being abused. formState is the initial value in the formcontrol.
        // @see FormControl.constructor =>  constructor(formState?: any, validatorOrOpts?: ValidatorFn |...
        searchFormFieldConfig.formState = new FormControl(
          searchState
            ? searchState.searchInputs[searchFormFieldConfig.formControlName]
            : this.defaultSearchFormValues[
                searchFormFieldConfig.formControlName
              ],
          searchFormFieldConfig.validatorOrOpts
        );
      })
    );

    if (this.advancedSearchFormConfig.length > 0) {
      this.advancedSearchFormConfig.forEach((searchFormFieldConfigRow) =>
        searchFormFieldConfigRow.forEach(
          (searchFormFieldConfig) =>
            (searchFormFieldConfig.formState = new FormControl(
              searchState
                ? searchState.searchInputs[
                    searchFormFieldConfig.formControlName
                  ]
                : this.defaultSearchFormValues[
                    searchFormFieldConfig.formControlName
                  ],
              searchFormFieldConfig.validatorOrOpts
            ))
        )
      );
    }

    // Set currentFormValues (for when navigating between Referrals-Authorizations and Authorizations-Referrals)
    if (searchState) {
      this.currentSearchFormValues = searchState.searchInputs;
    }

    this.postInitFormControls();
  }

  isNullOrBlank(value: string): boolean {
    if (null == value) {
      return true;
    }
    return '' === value.trim();
  }

  isTheDateNullAndIfNotIsThatDateGreaterThanAYear(uiDateObject): boolean {
    return (
      uiDateObject &&
      (!uiDateObject.value ||
        moment(uiDateObject.value.toDate).diff(
          uiDateObject.value.fromDate,
          'days'
        ) >= 367)
    );
  }

  // To be used by sub classes if needed.
  postInitFormControls() {}

  getFormConfigByFormControlName(formControlName: string): SearchNavFormField {
    const flattenedConfig = flatten([
      ...this.simpleSearchFormConfig,
      ...this.advancedSearchFormConfig
    ]);
    for (let i = 0; i < flattenedConfig.length; i++) {
      const field = flattenedConfig[i];
      if (field.formControlName === formControlName) {
        return field;
      }
    }
  }

  openRefreshModal() {
    this.confirmationModalService
      .displayModal(
        {
          titleString: 'Return to Authorization',
          bodyHtml: '',
          affirmString: 'Return',
          affirmClass: 'primary-button centerConfimationAffirmButton'
        },
        '200px',
        '475px'
      )
      .afterClosed()
      .subscribe(() => {
        this.executeSearch(this.currentSearchFormValues);
      });
  }

  clipSubString(start: string, end: string, searchString: string): string {
    if (null == searchString) {
      return searchString;
    }

    let startIX = 0;
    if (start != null) {
      startIX = searchString.indexOf(start);
      if (-1 === startIX) {
        return searchString;
      } else {
        startIX += start.length;
      }
    }

    let endIX = searchString.length - 1;
    if (null != end) {
      endIX = searchString.indexOf(end);
      if (-1 === endIX) {
        return searchString;
      }
    }

    return searchString.substring(startIX, endIX);
  }

  // I am going to assume we never want a VIEW column in the exported documents.  This logic may need to change if we want that.
  private removeViewColumnsFromExport( columnDef: HealtheTableColumnDef[]): HealtheTableColumnDef[] {
    return columnDef.filter( column => !'VIEW'.equalsIgnoreCase(column.label));
  }
  // May be overridden in a subclass if they wish to eliminate or add special columns from the exported spreadsheet.
  protected getExportColumns(): HealtheTableColumnDef[] {
    return this.resultsColumnsConfig;
  }
}
