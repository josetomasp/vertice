import { ComponentStore } from '@ngrx/component-store';
import {
  AttorneyContactInformationFormState,
  ClaimantContactInformationFormState,
  TaAuthorizationInformationViewModel,
  TaAuthorizationParentViewModel
} from './ta-authorization.ui-models';
import { Injectable } from '@angular/core';
import { RootState } from '../../../store/models/root.models';
import { createSelector, select, Store } from '@ngrx/store';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getRouterParams
} from '../../../store/selectors/router.selectors';
import {
  catchError,
  filter,
  first,
  map,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { TaAuthorizationService } from './ta-authorization.service';
import { Observable, of } from 'rxjs';
import { getPhoneNumberString, HealtheSelectOption, hexDecode } from '@shared';
import { RequestClaimV2 } from '@shared/store/actions/claim.actions';
import {
  getAbmClaimStatus,
  getClaimV3,
  getPbmClaimStatus
} from '@shared/store/selectors/claim.selectors';
import { ClaimSearchRequest, getClaimSearchResults } from '../../store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  StatusDescription,
  TaPrescribingPhysician,
  TaPrescription,
  TherapeuticAlertAuthorization
} from './ta-authorization.external-models';
import {
  getSearchStateOfVenueOptions
} from '../../../search-nav/store/selectors';
import {
  takeWhileRouteActive
} from '@shared/lib/operators/takeWhileRouteActive';
import {
  FormValidationExtractorService
} from '@modules/form-validation-extractor';
import { Attorney, Claimant } from '@shared/store/models/claim.models';
import {
  searchPhonesAndEmailInCommunicationList
} from '../authorization/lomn-wizard/searchPhonesAndEmailInCommunicationList';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {
  VerticeMediatedResponse
} from '@shared/models/vertice-mediated-response.model';
import { tapBffResponse } from '@shared/lib/store/tapBffResponse';

export const TA_AUTH_BASE_INITIAL_STATE = {
  decodedClaimNumber: '',
  decodedTaAuthorizationId: '',
  claimViewLink: [],
  pbmClaimStatus: '',
  abmClaimStatus: '',
  riskLevel: null,
  riskLevelNumber: null,
  showFooter: true
};
export const TA_AUTH_INFO_INITIAL_STATE: TaAuthorizationInformationViewModel = {
  showErrorCard: false,
  showFormValidationErrors: false,
  showServerErrors: false,
  showDenialReasons: false,
  showMiscellaneousReason: false,
  showAttorneyInformationForm: false,
  showContactForms: false,

  hasClickedSubmit: false,

  exParteMessage: null,
  miscellaneousReasonCharactersLeft: 1000,
  transactionHistory: [],
  denialReasons: [],
  stateOptions: [],
  pharmacies: [],
  prescribingPhysicians: [],
  taLetterFormState: {
    actionForm: {
      letterType: 'N/A',
      action: null,
      denialReason: null
    },
    attorneyInformationForm: {
      attorneyName: 'N/A',
      phone: 'N/A',
      fax: 'N/A',
      email: 'N/A',
      addressLine1: 'N/A',
      addressLine2: 'N/A',
      city: 'N/A',
      state: 'N/A',
      zipCode: null
    },
    claimantContactInformationForm: {
      addressLine1: 'N/A',
      addressLine2: 'N/A',
      city: 'N/A',
      state: 'N/A',
      zipCode: 'N/A',
      claimantName: 'N/A',
      phone: 'N/A'
    },
    attorneyInvolvement: false
  },
  isTaAuthorizationLoading: true,
  isExParteMessageLoading: false,
  areDenialReasonsLoading: false,
  serverErrors: [],
  formValidationErrors: []
};

const getTaAuthorizationId = createSelector(
  getRouterParams,
  ({ taAuthorizationId }) => taAuthorizationId
);

export const getTaSubRoute = createSelector(
  getRouterParams,
  ({ subRoute }) => subRoute
);

export const getTaAuthorizationQuery = createSelector(
  getEncodedCustomerId,
  getEncodedClaimNumber,
  getTaAuthorizationId,
  (customerId, claimNumber, taAuthorizationId) => ({
    customerId,
    claimNumber,
    taAuthorizationId
  })
);
const getTaLetterPostInitData = createSelector(
  getPbmClaimStatus,
  getAbmClaimStatus,
  getClaimSearchResults,
  (pbmClaimStatus, abmClaimStatus, searchResults) => {
    let riskLevel = null;
    let riskLevelNumber = null;
    if (Array.isArray(searchResults) && searchResults.length > 0) {
      riskLevel = searchResults[0].riskLevel;
      riskLevelNumber = searchResults[0].riskLevelNumber;
    }
    return {
      pbmClaimStatus,
      abmClaimStatus,
      riskLevel,
      riskLevelNumber
    };
  }
);

interface TaAuthorizationQuery {
  customerId: string;
  claimNumber: string;
  taAuthorizationId: string;
}

function formatAddress(
  line1: string,
  line2: string,
  city: string,
  state: string,
  zip: number | string
): string {
  return `${line1}${line2 ? ' ' + line2 : ''}, ${city}, ${state} ${zip}`;
}

@Injectable({ providedIn: 'any', deps: [FormValidationExtractorService] })
export class TaAuthorizationStore extends ComponentStore<
  TaAuthorizationInformationViewModel & TaAuthorizationParentViewModel
> {
  readonly setExParteMessage = this.updater(
    (state, exParteMessage: string) => ({
      ...state,
      exParteMessage
    })
  );
  readonly setDenialReasons = this.updater(
    (state, denialReasons: HealtheSelectOption<string>[]) => ({
      ...state,
      denialReasons
    })
  );
  readonly setIsExParteMessageLoading = this.updater(
    (state, isExParteMessageLoading: boolean) => ({
      ...state,
      isExParteMessageLoading
    })
  );
  readonly loadExParteMessage = this.effect(
    (taAuthorizationId$: Observable<string>) =>
      taAuthorizationId$.pipe(
        tap(() => {
          this.setIsExParteMessageLoading(true);
        }),
        switchMap((id) =>
          this.taLetterService.getExParteMessage(id).pipe(
            tapBffResponse(
              (message) => {
                this.setExParteMessage(message);
                this.setIsExParteMessageLoading(false);
              },
              (response, isMediated) => {
                if (isMediated) {
                  const body = response as VerticeMediatedResponse;
                  this.patchState({
                    serverErrors: body.failedBackendCalls[0].explanations,
                    showServerErrors: true
                  });
                } else {
                  this.patchState({
                    serverErrors: [(response as HttpErrorResponse).message],
                    showServerErrors: true
                  });
                }
                this.setIsExParteMessageLoading(false);
              }
            )
          )
        )
      )
  );
  readonly setAreDenialReasonsLoading = this.updater(
    (state, areDenialReasonsLoading: boolean) => ({
      ...state,
      areDenialReasonsLoading
    })
  );
  readonly loadDenialReasons = this.effect((void$: Observable<void>) =>
    void$.pipe(
      tap(() => {
        this.setAreDenialReasonsLoading(true);
      }),
      switchMap(() =>
        this.taLetterService.getDenialReasons().pipe(
          tapBffResponse(
            (denialReasons) => {
              this.setAreDenialReasonsLoading(false);
              this.setDenialReasons(
                denialReasons.map((value) => ({ value, label: value }))
              );
            },
            (response, isMediated) => {
              if (isMediated) {
                const body: VerticeMediatedResponse =
                  response as VerticeMediatedResponse;
                this.patchState({
                  serverErrors: body.failedBackendCalls[0].explanations,
                  showServerErrors: true
                });
                this.setAreDenialReasonsLoading(false);
              } else {
                this.patchState({
                  serverErrors: [(response as HttpErrorResponse).message],
                  showServerErrors: true
                });
              }
            }
          )
        )
      )
    )
  );
  readonly setIsTaAuthorizationLoading = this.updater(
    (state, isTaAuthorizationLoading: boolean) => ({
      ...state,
      isTaAuthorizationLoading
    })
  );
  readonly loadTaAuthorization = this.effect(
    (taQuery: Observable<TaAuthorizationQuery>) =>
      taQuery.pipe(
        tap(() => {
          this.setIsTaAuthorizationLoading(true);
        }),
        switchMap(({ taAuthorizationId, claimNumber }) => {
          return this.taLetterService
            .getTaAuthorization(taAuthorizationId)
            .pipe(
              filter((response: HttpResponse<any>) => {
                if (response.status === 206) {
                  const body: VerticeMediatedResponse = response.body;
                  this.patchState({
                    serverErrors: body.failedBackendCalls[0].explanations,
                    showServerErrors: true
                  });
                  this.setIsTaAuthorizationLoading(false);
                }
                return response.status === 200;
              }),
              map((response: HttpResponse<TherapeuticAlertAuthorization>) => {
                return response.body;
              }),
              withLatestFrom(this.store$.pipe(select(getClaimV3), first())),
              tap(
                ([
                  {
                    status,
                    letterType,
                    exParteJurisdiction,
                    physicians,
                    pharmacies,
                    attorneyDeliveryInformation,
                    claimantDeliveryInformation
                  },
                  claim
                ]) => {
                  this.patchState({
                    serverErrors: [],
                    showServerErrors: false
                  });
                  let claimantContactInformationForm, attorneyInformationForm;
                  // Load contact info from claim if auth required
                  if (
                    status.description ===
                    StatusDescription.WAITING_FOR_AUTHORIZATION
                  ) {
                    this.loadDenialReasons();
                    attorneyInformationForm =
                      this.transformAttorneyDeliveryInformationFromClaimAttorney(
                        claim.attorney
                      );
                    claimantContactInformationForm =
                      this.transformClaimantContactInformationFromClaimClaimant(
                        claim.claimant
                      );
                  } else {
                    if (
                      claimantDeliveryInformation &&
                      attorneyDeliveryInformation
                    ) {
                      claimantContactInformationForm = {
                        claimantName: claimantDeliveryInformation.contactName,
                        addressLine1:
                          claimantDeliveryInformation.address.address1,
                        addressLine2:
                          claimantDeliveryInformation.address.address2,
                        city: claimantDeliveryInformation.address.city,
                        state: claimantDeliveryInformation.address.state,
                        zipCode: claimantDeliveryInformation.address.zipCode,
                        phone: getPhoneNumberString(
                          claimantDeliveryInformation.phone
                        )
                      };
                      attorneyInformationForm = {
                        attorneyName: attorneyDeliveryInformation.contactName,
                        addressLine1:
                          attorneyDeliveryInformation.address.address1,
                        addressLine2:
                          attorneyDeliveryInformation.address.address2,
                        city: attorneyDeliveryInformation.address.city,
                        state: attorneyDeliveryInformation.address.state,
                        zipCode: attorneyDeliveryInformation.address.zipCode,
                        phone: getPhoneNumberString(
                          attorneyDeliveryInformation.phone
                        ),
                        fax: getPhoneNumberString(
                          attorneyDeliveryInformation.fax
                        ),
                        email: attorneyDeliveryInformation.email
                      };
                    }
                  }
                  this.patchState({
                    showContactForms: exParteJurisdiction,
                    prescribingPhysicians: physicians?.map(
                      this.transformPrescribingPhysician
                    ),
                    taLetterFormState: {
                      ...TA_AUTH_INFO_INITIAL_STATE.taLetterFormState,
                      actionForm: {
                        ...TA_AUTH_INFO_INITIAL_STATE.taLetterFormState
                          .actionForm,
                        letterType: letterType.description
                      },
                      claimantContactInformationForm,
                      attorneyInformationForm
                    },
                    pharmacies: pharmacies?.map(this.transformPharmacy)
                  });
                  if (exParteJurisdiction) {
                    this.loadExParteMessage(taAuthorizationId);
                  }
                  this.setIsTaAuthorizationLoading(false);
                }
              ),
              catchError((err: Error, caught) => {
                this.setIsTaAuthorizationLoading(false);
                this.patchState({
                  serverErrors: [err.message],
                  showServerErrors: true
                });
                return of(err);
              })
            );
        })
      )
  );
  readonly taAuthorizationQuery$ = this.store$.pipe(
    takeWhileRouteActive('ta/authorizationInformation'),
    select(getTaAuthorizationQuery)
  );
  readonly setHasClickedSubmit = this.updater(
    (state, hasClickedSubmit: boolean) => ({ ...state, hasClickedSubmit })
  );
  readonly submit = this.effect((none: Observable<void>) =>
    none.pipe(
      tap(() => {
        this.setHasClickedSubmit(true);
      })
    )
  );
  readonly setShowDenialReasons = this.updater(
    (state, showDenialReasons: boolean) => ({
      ...state,
      showDenialReasons
    })
  );
  readonly setShowMiscellaneousReason = this.updater(
    (state, showMiscellaneousReason: boolean) => ({
      ...state,
      showMiscellaneousReason
    })
  );
  readonly setShowAttorneyInformationForm = this.updater(
    (state, showAttorneyInformationForm: boolean) => ({
      ...state,
      showAttorneyInformationForm
    })
  );
  readonly setMiscellaneousReasonCharactersLeft = this.updater(
    (state, charactersLeft: number) => ({
      ...state,
      miscellaneousReasonCharactersLeft: charactersLeft
    })
  );
  constructor(
    public store$: Store<RootState>,
    public taLetterService: TaAuthorizationService,
    public router: Router,
    public route: ActivatedRoute,
    public fve: FormValidationExtractorService,
    public datePipe: DatePipe
  ) {
    super({
      ...TA_AUTH_BASE_INITIAL_STATE,
      ...TA_AUTH_INFO_INITIAL_STATE
    });
  }

  public async init() {
    this.fve.errorMessages$.subscribe((messages) => {
      this.patchState({
        formValidationErrors: messages,
        showFormValidationErrors: messages?.length > 0
      });
    });

    this.store$.pipe(select(getTaSubRoute)).subscribe((subRoute) => {
      this.patchState({
        showFooter: subRoute === 'authorizationInformation',
        selectedTabIndex: this.getSelectedTabIndexFromRoute(subRoute)
      });
    });
    this.taAuthorizationQuery$
      .pipe(
        filter(
          ({ customerId, claimNumber, taAuthorizationId }) =>
            customerId && claimNumber && taAuthorizationId
        ),
        tap(({ customerId, claimNumber, taAuthorizationId }) => {
          this.store$.dispatch(
            new RequestClaimV2({
              customerId,
              claimNumber
            })
          );
          let decodedClaimNumber = hexDecode(claimNumber);
          this.store$.dispatch(
            new ClaimSearchRequest({
              claimNumber: decodedClaimNumber,
              claimantLastName: '',
              claimantFirstName: '',
              assignedAdjuster: 'All',
              dateOfInjury: null,
              riskLevel: 'All',
              riskCategory: 'All',
              stateOfVenue: 'All'
            })
          );
          this.patchState({
            decodedClaimNumber,
            decodedTaAuthorizationId: hexDecode(taAuthorizationId),
            claimViewLink: [`/claimview/${customerId}/${claimNumber}`]
          });
        })
      )
      .subscribe((query) => {
        this.loadTaAuthorization(query);
        this.postInit();
      });
    //TODO: replace this with a new call to the ngVerticeService to grab just these options
    this.store$
      .pipe(
        select(getSearchStateOfVenueOptions),
        filter((v) => v.valuesByScreen['ALL']?.values),
        map((v) => v.valuesByScreen['ALL']?.values),
        tap((stateOptions: any[]) => stateOptions?.splice(0, 1))
      )
      .subscribe((stateOptions) => {
        this.patchState({ stateOptions } as any);
      });
  }
  public updateSelectedTab({ index }: MatTabChangeEvent) {
    this.router.navigate([`../${this.getRouteFromSelectedTabIndex(index)}`], {
      relativeTo: this.route
    });
  }

  public transformPrescribingPhysician({
    first,
    middle,
    last,
    cred,
    primaryPhone
  }: TaPrescribingPhysician) {
    return {
      physicianName: `${last}, ${middle ? middle + ' ' : ''}${first}${
        cred ? ' ' + cred : ''
      }`,
      //TODO: Figure out which id/ids to use
      prescriberId: '',
      phoneNumber: getPhoneNumberString(primaryPhone)
    };
  }

  public transformPharmacy({
    name,
    nabp,
    address1,
    address2,
    city,
    state,
    zip,
    phoneNumber
  }) {
    return {
      pharmacyName: name,
      ncpdp: nabp,
      pharmacyAddress: formatAddress(address1, address2, city, state, zip),
      pharmacyPhone: getPhoneNumberString(phoneNumber)
    };
  }

  private postInit() {
    this.store$
      .pipe(select(getTaLetterPostInitData))
      .subscribe((data) => this.patchState(data));
  }

  private getSelectedTabIndexFromRoute(subRoute: string): number {
    switch (subRoute) {
      case 'authorizationInformation':
        return 0;
      case 'prescriptionHistory':
        return 1;
      case 'clinicalHistory':
        return 2;
      case 'documents':
        return 3;
      default:
        return null;
    }
  }

  private getRouteFromSelectedTabIndex(subRoute: number): string {
    switch (subRoute) {
      case 0:
        return 'authorizationInformation';
      case 1:
        return 'prescriptionHistory';
      case 2:
        return 'clinicalHistory';
      case 3:
        return 'documents';
      default:
        return null;
    }
  }

  private transformAttorneyDeliveryInformationFromClaimAttorney(
    attorneyDeliveryInformation: Attorney
  ): AttorneyContactInformationFormState {
    if (attorneyDeliveryInformation) {
      const defaultVal = null;

      let address1 = defaultVal;
      let address2 = defaultVal;
      let city = defaultVal;
      let state = defaultVal;
      let zip = defaultVal;
      const { fullName, communications } = attorneyDeliveryInformation;
      const { phone, email, fax } =
        searchPhonesAndEmailInCommunicationList(communications);
      if (attorneyDeliveryInformation.address) {
        address1 = attorneyDeliveryInformation.address.address1;
        address2 = attorneyDeliveryInformation.address.address2;
        city = attorneyDeliveryInformation.address.city;
        state = attorneyDeliveryInformation.address.state;
        zip = attorneyDeliveryInformation.address.zip;
      }
      return {
        attorneyName: fullName || defaultVal,
        addressLine1: address1 || defaultVal,
        addressLine2: address2 || defaultVal,
        city: city || defaultVal,
        state: state || defaultVal,
        zipCode: zip || defaultVal,
        phone: getPhoneNumberString(phone) || defaultVal,
        fax: getPhoneNumberString(fax) || defaultVal,
        email: email || defaultVal
      };
    }
  }

  private transformClaimantContactInformationFromClaimClaimant(
    claimant: Claimant
  ): ClaimantContactInformationFormState {
    if (claimant) {
      const defaultVal = null;
      let address1 = defaultVal;
      let address2 = defaultVal;
      let city = defaultVal;
      let state = defaultVal;
      let zip = defaultVal;
      const { fullName, communications } = claimant;
      const { phone } = searchPhonesAndEmailInCommunicationList(communications);
      if (claimant.address) {
        address1 = claimant.address.address1;
        address2 = claimant.address.address2;
        city = claimant.address.city;
        state = claimant.address.state;
        zip = claimant.address.zip;
      }
      return {
        claimantName: fullName || defaultVal,
        addressLine1: address1 || defaultVal,
        addressLine2: address2 || defaultVal,
        city: city || defaultVal,
        state: state || defaultVal,
        zipCode: zip || defaultVal,
        phone: getPhoneNumberString(phone) || defaultVal
      };
    }
  }

  transformTransaction({
    itemName,
    ndc,
    rxNumber,
    dateFilled
  }: TaPrescription) {
    return {
      itemName,
      ndc,
      rxNumber,
      dateFilled: this.datePipe.transform(dateFilled, 'MM/dd/y')
    };
  }
}
