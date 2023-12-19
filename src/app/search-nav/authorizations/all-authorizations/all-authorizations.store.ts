import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { HealtheSelectOption, hexEncode, pluckPrefValue } from '@shared';
import { Observable, of } from 'rxjs';
import {
  filter,
  first,
  map,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../store/models/root.models';
import { getUserInfo } from '../../../user/store/selectors/user.selectors';
import {
  getPreferenceByQuery
} from '../../../preferences/store/selectors/user-preferences.selectors';
import {
  PreferenceType
} from '../../../preferences/store/models/preferences.models';
import {
  AuthorizationSearchFormField,
  AuthorizationSearchFormFieldType,
  DownloadExportResultsParameters
} from '../authorizations-models';
import {
  AllAuthorizations,
  AuthInfo,
  AuthorizationTypes,
  DashboardAdjusterResponseMessage,
  DashboardDataRequestMessage
} from '../../../backend-for-frontend/fusion-abm-referral-management/fusion-abm-referral-management-models';
import {
  FusionAbmReferralManagementService
} from '../../../backend-for-frontend/fusion-abm-referral-management/fusion-abm-referral-management.service';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import {
  ConfirmationModalService
} from '@shared/components/confirmation-modal/confirmation-modal.service';
import { generateExternal3_0PBMAuthorizationTabUrl } from '@shared/lib/links';
import { UserInfo } from '../../../user/store/models/user.models';
import { MatDialog } from '@angular/material/dialog';
import {
  ServerErrorModalComponent
} from '@shared/components/error-modal/server-error-modal.component';
import {
  GeneralExporterService,
  GeneralExportRequest
} from '@modules/general-exporter';
import { tapBffResponse } from '@shared/lib/store/tapBffResponse';
import {
  VerticeMediatedResponse
} from '@shared/models/vertice-mediated-response.model';
import { arrayMove } from '@shared/lib/arrays';

export interface AllAuthorizationTableRow {
  authorizationType: string;
  authorizationUrl: string;
  rush: string;
  isSLR: string;
  claimNumber: string;
  claimantName: string;
  stateOfVenue: string;
  dateOfInjury: string;
  assignedAdjuster: string;
  officeCode: string;
  dateReceived: string;
  status: string;
  vendor: string;
  claimIdUrl: string;
  secondaryPaperNotificationRule?: string;
  workflowGpi?: string;
}

export interface AllAuthorizationSearchFormValues {
  authorizationType: string;
  assignedAdjuster: string;
  claimNumber: string;
  claimantLastName: string;
  claimantFirstName: string;
}

export interface AllAuthorizationsViewModel {
  isAuthorizationTypeOptionsLoading: boolean;
  authorizationTypeOptionsErrors: string[];

  isAssignedAdjusterOptionsLoading: boolean;
  assignedAdjusterOptionsErrors: string[];

  searchFormValues: AllAuthorizationSearchFormValues;
  simpleSearchFormConfig: AuthorizationSearchFormField<any, any>[][];

  searchResultRows: AllAuthorizationTableRow[];
  totalNumberOfResults: number;
  searchIsRecordCountLimited: boolean;
  isSearchLoading: boolean;
  pageSizePreference: number;
}

export const AUTHORIZATION_TYPE_FORM_CONTROL_NAME: string = 'authorizationType';
export const ASSIGNED_ADJUSTER_FORM_CONTROL_NAME: string = 'assignedAdjuster';
const NO_RESULTS: { searchResultRows: AllAuthorizationTableRow[], totalNumberOfResults: number } = {
  searchResultRows: [],
  totalNumberOfResults: 0
};

export const ALL_AUTHORIZATIONS_COMPONENT_INITIAL_STATE: AllAuthorizationsViewModel = {
  isAuthorizationTypeOptionsLoading: true,
  authorizationTypeOptionsErrors: [],
  isAssignedAdjusterOptionsLoading: true,
  assignedAdjusterOptionsErrors: [],
  searchFormValues: {
    authorizationType: '',
    assignedAdjuster: '',
    claimNumber: '',
    claimantLastName: '',
    claimantFirstName: ''
  },
  simpleSearchFormConfig: [
    [
      {
        type: AuthorizationSearchFormFieldType.Select,
        label: 'Authorization Type',
        formControlName: AUTHORIZATION_TYPE_FORM_CONTROL_NAME,
        options: []
      },
      {
        type: AuthorizationSearchFormFieldType.Select,
        label: 'Assigned Adjuster',
        formControlName: ASSIGNED_ADJUSTER_FORM_CONTROL_NAME,
        options: []
      }
    ],
    [
      {
        type: AuthorizationSearchFormFieldType.Text,
        label: 'Claim Number',
        placeholder: 'Enter Claim',
        formControlName: 'claimNumber'
      },
      {
        type: AuthorizationSearchFormFieldType.Text,
        label: 'Claimant Last Name',
        placeholder: 'Enter Last Name',
        formControlName: 'claimantLastName'
      },
      {
        type: AuthorizationSearchFormFieldType.Text,
        label: 'Claimant First Name',
        placeholder: 'Enter First Name',
        formControlName: 'claimantFirstName'
      }
    ]
  ],
  searchResultRows: [],
  totalNumberOfResults: 0,
  searchIsRecordCountLimited: true,
  isSearchLoading: false,
  pageSizePreference: 25
};

@Injectable()
export class AllAuthorizationsStore extends ComponentStore<AllAuthorizationsViewModel> {
  isStoreInitialized: boolean = false;
  // ****** Selectors //
  public readonly isAnyOptionLoading$ = this.select(
    ({
       isAuthorizationTypeOptionsLoading,
       isAssignedAdjusterOptionsLoading
     }): boolean => isAuthorizationTypeOptionsLoading ||
      isAssignedAdjusterOptionsLoading);

  public readonly searchOptionsErrors$ = this.select(
    ({
       authorizationTypeOptionsErrors,
       assignedAdjusterOptionsErrors
     }): string[] => authorizationTypeOptionsErrors.concat(assignedAdjusterOptionsErrors));

  /** Effects
   * Some of these steps may not always be done if we don't store response data or errors or if there is no
   * mapping to be done. All HTTP related effects should toggle isLoading flags.
   *
   * HTTP related effects for loading data should do these steps:
   * 1. Set isLoading to true
   * 2. Restore response data to initial state (clear existing data)
   * 3. Restore request errors to initial state (clear existing errors)
   * 4. Take UI parameters and map to raw request parameters
   * 4a. Use withLatestFrom to get any data from other observables that will be used in the HTTP request
   * 5. Pass raw request parameters to and receive raw response models from service
   * 6. Use tapMediatedResponse's success and failure callbacks to return success of failure effects to handle things unrelated to the mediated response
   * 6a. Failure callbacks should use the isMediated boolean to determine what kind of error message(s) should be passed to the failure effect
   *
   * HTTP related success and failure effects should do these steps:
   * 1. Use withLatestFrom to get any data from other observables that didn't come from the HTTP response
   * 2. Map raw domain specific response models to state models
   * 3. Use updaters or patchState to modify the values in the state
   * 3a. Success effects should update any necessary values and set isLoading to false
   * 3b. Failure effects should update the error messages and set isLoading to false
   */
  private readonly loadAuthorizationTypeOptions = this.effect(
    (noParam$: Observable<void>) =>
      noParam$.pipe(tap(() => {
          this.setAuthorizationTypeOptionsLoading(true);
          this.setAuthorizationTypeOptions({ authorizationTypesOptions: [] });
          this.patchState((state: AllAuthorizationsViewModel) => {
            state.searchFormValues.authorizationType = '';
            return state;
          });
          this.setAuthorizationTypeOptionsErrors([]);
        }),
        switchMap(() =>
          this.allAuthorizationsService.getAuthorizationTypes().pipe(
            tapBffResponse(
              (authorizationTypes: AuthorizationTypes) =>
                this.loadAuthorizationTypeOptionsSuccess(authorizationTypes),
              (error, isMediated) =>
                this.loadAuthorizationTypeOptionsFailure(isMediated
                  ? (error as VerticeMediatedResponse).failedBackendCalls[0].explanations
                  : ['Unknown error: getAuthorizationTypes'])
            ))
        )
      ));

  private readonly loadAuthorizationTypeOptionsSuccess = this.effect(
    (authorizationTypes$: Observable<AuthorizationTypes>) =>
      authorizationTypes$.pipe(tap((successData: AuthorizationTypes) => {
        let mappedAuthorizationTypes: HealtheSelectOption<string>[] = successData.authorizationTypes.map(rawType => ({
          label: rawType.description,
          value: rawType.type
        } as HealtheSelectOption<string>));
        // The API returns an 'All' value in a position other than the first index so it must be moved
        arrayMove(mappedAuthorizationTypes, mappedAuthorizationTypes.findIndex(authorizationType => 'All' === authorizationType.label), 0);
        this.setAuthorizationTypeOptions({
          authorizationTypesOptions: mappedAuthorizationTypes,
          defaultOption: 'All'
        });
        this.patchState((state: AllAuthorizationsViewModel) => {
          state.searchFormValues.authorizationType = 'All';
          return state;
        });
        this.setAuthorizationTypeOptionsLoading(false);
      }))
  );

  private readonly loadAuthorizationTypeOptionsFailure = this.effect(
    (errorMessage$: Observable<string[]>) =>
      errorMessage$.pipe(tap((failureData: string[]) => {
        this.setAuthorizationTypeOptionsErrors(failureData);
        this.setAuthorizationTypeOptionsLoading(false);
      }))
  );

  private readonly loadAssignedAdjusterOptions = this.effect(
    (noParam$: Observable<void>) =>
      noParam$.pipe(tap(() => {
          this.setAssignedAdjusterOptionsLoading(true);
          this.setAssignedAdjusterOptionsErrors([]);
        }),
        switchMap(() =>
          this.allAuthorizationsService.getAdjusters().pipe(
            tapBffResponse(
              (adjustersDTO: DashboardAdjusterResponseMessage) =>
                this.loadAssignedAdjusterOptionsSuccess(adjustersDTO),
              (error, isMediated) =>
                this.loadAssignedAdjusterOptionsFailure(isMediated
                  ? (error as VerticeMediatedResponse).failedBackendCalls[0].explanations
                  : ['Unknown error: getAdjusters'])
            )
          )
        )
      ));

  private readonly loadAssignedAdjusterOptionsSuccess = this.effect(
    (adjustersDTO$: Observable<DashboardAdjusterResponseMessage>) =>
      adjustersDTO$.pipe(
        withLatestFrom(this.store$.pipe(select(getUserInfo))),
        tap(([adjustersDTO, userInfo]: [DashboardAdjusterResponseMessage, UserInfo]) => {
          this.setAssignedAdjusterOptions(this.transformAssignedAdjusterOptions(adjustersDTO, userInfo.username));
          this.patchState((state: AllAuthorizationsViewModel) => {
            state.searchFormValues.assignedAdjuster = userInfo.username;
            return state;
          });
          this.setAssignedAdjusterOptionsLoading(false);
        }))
  );

  private readonly loadAssignedAdjusterOptionsFailure = this.effect(
    (errorMessages$: Observable<string[]>) =>
      errorMessages$.pipe(tap((errorMessages: string[]) => {
        this.setAssignedAdjusterOptionsErrors(errorMessages);
        this.setAssignedAdjusterOptionsLoading(false);
      }))
  );

  readonly loadSearchResults = this.effect((noParam$: Observable<void>) =>
    noParam$.pipe(
      withLatestFrom(this.select(({ searchFormValues }): AllAuthorizationSearchFormValues => searchFormValues)),
      tap(() => {
        this.setSearchResultsLoading(true);
        this.setSearchResults(NO_RESULTS);
      }),
      map(([, searchFormValues]: [void, AllAuthorizationSearchFormValues]): DashboardDataRequestMessage => ({
        assignedAdjuster: searchFormValues.assignedAdjuster,
        authorizationType: searchFormValues.authorizationType,
        claimNumber: searchFormValues.claimNumber,
        claimantLastName: searchFormValues.claimantLastName,
        claimantFirstName: searchFormValues.claimantFirstName,
        displayLimit: 200
      } as DashboardDataRequestMessage)),
      switchMap((requestParameters: DashboardDataRequestMessage) => this.allAuthorizationsService.getAuthorizationsAwaitingAction(requestParameters).pipe(
          tapBffResponse(
            (allAuthorizationSearchResults: AllAuthorizations) => this.loadSearchResultsSuccess(allAuthorizationSearchResults),
            (error, isMediated) => this.loadSearchResultsFailure(isMediated
              ? (error as VerticeMediatedResponse).failedBackendCalls[0].explanations
              : ['Unknown error: getAuthorizationsAwaitingAction']))
        )
      )
    ));

  private readonly loadSearchResultsSuccess = this.effect(
    (allAuthorizationSearchResults$: Observable<AllAuthorizations>) =>
      allAuthorizationSearchResults$.pipe(tap((successData: AllAuthorizations) => {
        this.setSearchResults({
          searchResultRows: successData.dashboardClaims.map(rawResult => {
            rawResult.type = rawResult.type?.trim();
            rawResult.claimNumber = rawResult.claimNumber?.trim();
            rawResult.customerId = rawResult.customerId?.trim();
            return rawResult;
          })
            .map(rawResult =>
            (this.transformRawResults(rawResult))),
          totalNumberOfResults: successData.totalRecordCount
        });
        this.setSearchResultsLoading(false);
      }))
  );

  private readonly loadSearchResultsFailure = this.effect(
    (errorMessage$: Observable<string[]>) =>
      errorMessage$.pipe(tap((failureData: string[]) => {
        this.displayErrorModal(failureData);
        this.setSearchResults(NO_RESULTS);
        this.setSearchResultsLoading(false);
      }))
  );

  // Displays a modal which when closed will reload the search results
  public readonly displayRefreshModal = this.effect((noParam$: Observable<void>) =>
    noParam$.pipe(switchMap(() => {
      return this.confirmationModalService
        .displayModal(
          {
            titleString: 'Return to Authorization',
            bodyHtml: '',
            affirmString: 'Return',
            affirmClass: 'primary-button centerConfimationAffirmButton'
          },
          '40vh',
          '30vw'
        )
        .afterClosed().pipe(map(() => of(this.loadSearchResults())));
    }))
  );

  // Displays an error modal which must be dismissed
  public readonly displayErrorModal = this.effect((errorMessages$: Observable<string[] | void>) =>
    errorMessages$.pipe(tap((errorMessages: string[]) =>
      this.dialog.open(ServerErrorModalComponent, {
        data: errorMessages,
        autoFocus: false,
        width: '45vw',
        height: '65vh'
      })
    ))
  );

  // Uses the GeneralExporterService to send data to the backend to create an export file for the user
  public readonly downloadExportResults = this.effect((parameters$: Observable<DownloadExportResultsParameters>) =>
    parameters$.pipe(
      withLatestFrom(this.select(({ searchResultRows }): AllAuthorizationTableRow[] => searchResultRows)),
      tap(([exportParameters, searchResults]: [DownloadExportResultsParameters, AllAuthorizationTableRow[]]) => {

        const request: GeneralExportRequest =
          this.generalExporterService.buildTableData(
            exportParameters.columns.filter(column => !'VIEW'.equalsIgnoreCase(column.label)),
            searchResults
          );
        request.outputFormat = exportParameters.exportFormatOption;
        request.sheetName = 'All Referral Authorizations Search Results';
        request.fileName = exportParameters.filename;
        this.generalExporterService.doExport(request);
      }))
  );

  // ****** Updaters //
  private readonly setAuthorizationTypeOptions = this.updater(
    (state, values: { authorizationTypesOptions: HealtheSelectOption<string>[], defaultOption?: string }) => {
      let authorizationTypeConfig: AuthorizationSearchFormField<any, any> = _.flatten(state.simpleSearchFormConfig).find((configItem: AuthorizationSearchFormField<any, any>) => AUTHORIZATION_TYPE_FORM_CONTROL_NAME.equalsIgnoreCase(configItem.formControlName));
      authorizationTypeConfig.options = values.authorizationTypesOptions;
      authorizationTypeConfig.defaultValue = values.defaultOption;
      return { ...state };
    }
  );

  private readonly setAuthorizationTypeOptionsLoading = this.updater(
    (state, isAuthorizationTypeOptionsLoading: boolean) => ({
      ...state,
      isAuthorizationTypeOptionsLoading
    })
  );

  private readonly setAuthorizationTypeOptionsErrors = this.updater(
    (state, authorizationTypeOptionsErrors: string[]) => ({
      ...state,
      authorizationTypeOptionsErrors
    })
  );

  private readonly setAssignedAdjusterOptions = this.updater(
    (state, values: { assignedAdjusterOptions: HealtheSelectOption<string>[], defaultOption?: string }) => {
      let assignedAdjusterConfig: AuthorizationSearchFormField<any, any> = _.flatten(state.simpleSearchFormConfig).find((configItem: AuthorizationSearchFormField<any, any>) => ASSIGNED_ADJUSTER_FORM_CONTROL_NAME.equalsIgnoreCase(configItem.formControlName));
      assignedAdjusterConfig.options = values.assignedAdjusterOptions;
      assignedAdjusterConfig.defaultValue = values.defaultOption;
      return { ...state };
    }
  );

  private readonly setAssignedAdjusterOptionsLoading = this.updater(
    (state, isAssignedAdjusterOptionsLoading: boolean) => ({
      ...state,
      isAssignedAdjusterOptionsLoading
    })
  );

  private readonly setAssignedAdjusterOptionsErrors = this.updater(
    (state, assignedAdjusterOptionsErrors: string[]) => ({
      ...state,
      assignedAdjusterOptionsErrors
    })
  );

  private readonly setSearchResults = this.updater(
    (state, values: { searchResultRows: AllAuthorizationTableRow[], totalNumberOfResults: number }) => ({
      ...state,
      searchResultRows: values.searchResultRows,
      totalNumberOfResults: values.totalNumberOfResults
    })
  );

  private readonly setSearchResultsLoading = this.updater(
    (state, isSearchLoading: boolean) => ({
      ...state,
      isSearchLoading
    })
  );

  public readonly setSearchFormValues = this.updater(
    (state, searchFormValues: AllAuthorizationSearchFormValues) => ({
      ...state,
      searchFormValues
    })
  );

  private readonly setPageSizePreference = this.updater(
    (state, pageSizePreference: number) => ({
      ...state,
      pageSizePreference
    }));

  constructor(private store$: Store<RootState>,
              private datePipe: DatePipe,
              private dialog: MatDialog,
              private allAuthorizationsService: FusionAbmReferralManagementService,
              private confirmationModalService: ConfirmationModalService,
              private generalExporterService: GeneralExporterService) {
    super();
  }

  public loadAllOptions() {
    this.loadAuthorizationTypeOptions();
    this.loadAssignedAdjusterOptions();
  }

  public init() {
    if (!this.isStoreInitialized) {
      this.setState(ALL_AUTHORIZATIONS_COMPONENT_INITIAL_STATE);
      this.store$.pipe(
        select(getPreferenceByQuery, {
          screenName: 'global',
          preferenceTypeName: PreferenceType.PageSize
        }),
        pluckPrefValue
      ).pipe(first()).subscribe((pageSizePreference: number) => this.setPageSizePreference(pageSizePreference));
      this.loadAllOptions();
      this.isStoreInitialized = true;

      // Once all options have returned without errors, execute a search with default parameters
      this.isAnyOptionLoading$.pipe(
        filter(isLoading => !isLoading),
        withLatestFrom(this.searchOptionsErrors$),
        filter(([, searchOptionsErrors]: [boolean, string[]]) => searchOptionsErrors.length === 0),
        first()).subscribe(() => this.loadSearchResults());
    } else {
      // Potentially temporary 'always execute a search if you return to the screen' statement. It was
      // discussed that we would only do this when returning from taking action on something you navigated
      // to via this search screen, but to match current production functionality the search will also be
      // executed any time the user just switches tabs from All authorizations to say Retro (Paper) authorizations
      this.loadSearchResults();
    }
  }

  private transformAssignedAdjusterOptions(rawAdjusters: DashboardAdjusterResponseMessage, currentlyLoggedInUserValue: string): { assignedAdjusterOptions: HealtheSelectOption<string>[], defaultOption: string } {
    let assignedAdjusterOptions: HealtheSelectOption<string>[] = rawAdjusters.adjusters.map(adjuster => ({
      label: adjuster,
      value: adjuster
    }));
    assignedAdjusterOptions.sort((option1, option2) => option1.label.localeCompare(option2.label));
    assignedAdjusterOptions.unshift({
      label: 'All',
      value: 'All'
    } as HealtheSelectOption<string>);
    let currentlyLoggedInUserIndex = assignedAdjusterOptions.findIndex(option => option.label.equalsIgnoreCase(currentlyLoggedInUserValue));
    let currentlyLoggedInUserOption = {
      label: currentlyLoggedInUserValue,
      value: currentlyLoggedInUserValue
    } as HealtheSelectOption<string>;
    if (-1 === currentlyLoggedInUserIndex) {
      assignedAdjusterOptions.unshift(currentlyLoggedInUserOption);
    } else {
      assignedAdjusterOptions.splice(currentlyLoggedInUserIndex, 1);
      assignedAdjusterOptions.unshift(currentlyLoggedInUserOption);
    }

    return {
      assignedAdjusterOptions,
      defaultOption: currentlyLoggedInUserOption.value
    };
  }

  // date of injury starts as yyyy-MM-dd
  // date received starts as yyyy-MM-dd OR MM/dd/yyyy
  // dates should become MM/dd/yyyy
  private transformRawResults(rawResult: AuthInfo): AllAuthorizationTableRow {
    return {
      authorizationType: this.translateRawAuthorizationType(rawResult?.type.trim()),
      authorizationUrl: this.createAuthorizationUrl(rawResult),
      rush: 'Y'.equalsIgnoreCase(rawResult?.rush) ? 'Y' : 'N',
      isSLR: rawResult?.slr ? 'Yes' : 'No',
      claimNumber: rawResult.claimNumber,
      claimantName: rawResult?.patientName,
      stateOfVenue: rawResult?.state,
      dateOfInjury: this.datePipe.transform(rawResult?.dateOfInjury, 'MM/dd/yyyy') ?? null,
      assignedAdjuster: rawResult?.adjuster,
      officeCode: rawResult?.afo,
      dateReceived: this.datePipe.transform(rawResult?.dateReceived, 'MM/dd/yyyy') ?? null,
      status: rawResult?.expiring ? 'Auth Expiring' : rawResult?.status,
      vendor: rawResult?.vendorName,
      claimIdUrl: '/vertice-ui/vertice/claimview/' + hexEncode(rawResult.customerId) + '/' + hexEncode(rawResult.claimNumber),
      secondaryPaperNotificationRule: rawResult.secondaryPaperNotificationRule,
      workflowGpi: rawResult.workflowGpi
    } as AllAuthorizationTableRow;
  }

  private translateRawAuthorizationType(authorizationType: string): string {
    switch (authorizationType) {
      case 'ABM-TRP':
        return 'Transportation';
      case 'ABM-DME':
        return 'DME';
      case 'ABM-DX':
        return 'Diagnostics';
      case 'ABM-PM':
        return 'Physical Medicine';
      case 'ABM-LAN':
        return 'Language';
      case 'ABM-HH':
        return 'Home Health';
      case 'ABM-CLN':
        return 'Clinical';
      case 'ABM-MOR':
        return 'Mail Order';
      case 'ABM-RTL':
        return 'Retail';
      case 'ABM-OTH':
        return 'Other';
      case 'ABM-IMP':
        return 'Implants';
      case 'EPAQ':
        return 'POS (ePAQ)';
      case 'IPE':
        return 'IPE+';
      case 'PAPER':
        return 'Retro (Paper)';
      case 'MAIL ORDER':
        return 'Mail Order';
      case 'TA':
        return 'Therapeutic Alert';
      default:
        return authorizationType;
    }
  }

  private createAuthorizationUrl(rawResult: AuthInfo): string {
    const ABM_BASE_URL = ['/claims',
      hexEncode(rawResult.customerId),
      hexEncode(rawResult.claimNumber),
      'referral',
      hexEncode(rawResult.referenceKey)].join('/');

    switch (rawResult.type) {
      case 'ABM-TRP':
        if (rawResult.legacyReferral) {
          return ABM_BASE_URL + '/legacyTransportation/authorization';
        } else {
          return ABM_BASE_URL + '/transportation/authorization';
        }
      case 'ABM-DME':
        return ABM_BASE_URL + '/dme/authorization';
      case 'ABM-DX':
        return ABM_BASE_URL + '/diagnostics/authorization';
      case 'ABM-PM':
        return ABM_BASE_URL + '/physicalMedicine/authorization';
      case 'ABM-LAN':
        return ABM_BASE_URL + '/language/authorization';
      case 'ABM-HH':
        return ABM_BASE_URL + '/homeHealth/authorization';
      case 'EPAQ':
        return generateExternal3_0PBMAuthorizationTabUrl(
          rawResult.customerId,
          rawResult.claimNumber,
          rawResult.referenceKey,
          'pos'
        );
      case 'IPE':
      case 'IPE+':
        return '/PbmClinical/customer.jsp?header=stripeonly#IPE;key=' + rawResult.referenceKey + ';cust=' + rawResult.customerId;
      case 'Paper':
        return '/PbmPaper/pbmpaper.jsp?header=stripeonly#IndivBill;b=' + rawResult.billKey + ';fw=PaperBill';
      case 'Mail Order':
        return '/pbmmailorder-webapp/index.jsp?header=stripeonly#MailOrderDetail;authKey=' + rawResult.referenceKey + ';processInd=viewonly';
      case 'TA':
        if ('Denied'.equalsIgnoreCase(rawResult.status)) {
          return '/PbmClinical/customer.jsp?header=stripeonly#TA;ak=' + rawResult.claimNumber + ';status=Denied;cust=' + rawResult.customerId + ';clinicalId=' + rawResult.referenceKey + ';ltrType=' + rawResult.letterType;
        } else {
          return '/PbmClinical/customer.jsp?header=stripeonly#TA;ak=' + rawResult.claimNumber + ';cust=' + rawResult.customerId + ';clinicalId=' + rawResult.referenceKey + ';ltrType=' + rawResult.letterType;
        }
    }
  }
}
