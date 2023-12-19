import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { PbmAuthorizationInformationBaseConfig } from './pbm-authorization-information-base.config';
import { PbmAuthorizationInformationPosConfig } from './pbm-authorization-information-pos.config';
import { RootState } from 'src/app/store/models/root.models';
import { Observable, Subject } from 'rxjs';
import {
  getDecodedClaimNumber,
  getPbmAuthStatusView,
  getPbmServiceType
} from 'src/app/store/selectors/router.selectors';
import {
  ActionCardConfig,
  ApprovalPeriodType,
  DenialPeriodType,
  PbmAuthFooterConfig,
  PbmAuthFormMode,
  PbmAuthNotesConfig,
  PbmAuthSubmitSuccessModalConfig
} from '../../store/models/pbm-authorization-information.model';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { takeUntil } from 'rxjs/operators';
import { CscAdministrationService } from 'src/app/csc-administration/csc-administration.service';
import { PbmAuthorizationService } from '../../pbm-authorization.service';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { getClaimV3 } from '@shared/store/selectors/claim.selectors';
import { PbmAuthorizationInformationPaperConfig } from './pbm-authorization-information-paper.config';
import { CopyToClipboardService } from '@shared/service/copy-to-clipboard.service';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { HealtheComponentConfig } from '@modules/healthe-grid';
import { getAuthorizationDetails } from '../../store/selectors/pbm-authorization-information.selectors';
import { isUserInternal } from '../../../../../user/store/selectors/user.selectors';
import * as _moment from 'moment';
import { filter, first, map, mergeMap } from 'rxjs/operators';
import { ActionOption } from '../../store/models/action.option';
import { takeWhileRouteActive } from '@shared/lib/operators/takeWhileRouteActive';
import { getPOSAuthorizationCopyToClipboard } from './copy-to-clipboard-configs/pbm-authorization-information-pos-copy-to-clipboard.config';
import { DatePipe } from '@angular/common';
import { AuthorizationLineItem } from '../../store/models/pbm-authorization-information/authorization-line-item.models';
import { PbmAuthorizationServiceType } from '../../store/models/pbm-authorization-service-type.models';

const moment = _moment;

const getReferenceData = createSelector(
  getDecodedClaimNumber,
  getPbmServiceType,
  isUserInternal,
  getClaimV3,
  getAuthorizationDetails,
  getPbmAuthStatusView,
  (
    claimNumber,
    pbmServiceType,
    userIsInternal,
    claim,
    authorizationDetails,
    statusView
  ) => ({
    claimNumber,
    pbmServiceType,
    userIsInternal,
    claim,
    authorizationDetails,
    statusView
  })
);

const getClipboardReferenceData = createSelector(
  getClaimV3,
  getAuthorizationDetails,
  (claim, authDetails) => ({
    claim,
    authDetails
  })
);

export interface PbmAuthorizationConfig {
  /**
   * Reference Data
   *
   *   claimNumber: string;
   *   authorizationDetails: AuthorizationDetails;
   *   pbmServiceType: string
   *   userIsInternal: boolean;
   */

  /**
   * Presentation Data
   */
  pbmServiceType: PbmAuthorizationServiceType;
  authorizationLevelAccessMode: PbmAuthFormMode;
  authorizationTitle: string;
  serviceName: string;
  noActionableUser: boolean;
  authorizationDetailsInsetCardConfig: HealtheComponentConfig;
  authorizationDetailsHeaderActionsConfig: HealtheComponentConfig;
  lineItemConfigs: ActionCardConfig[];
  authorizationLevelNotesConfig: PbmAuthNotesConfig;
  authorizationFooterConfig: PbmAuthFooterConfig;
  displayedLineItems: AuthorizationLineItem[];
}

@Injectable()
export class PbmAuthorizationConfigService extends ComponentStore<PbmAuthorizationConfig> {
  decodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getDecodedClaimNumber)
  );

  /**
   * This is all the data from the global store that we need to stand up the
   * initialized state with populated configs in the constructor.
   * @see constructor
   */
  referenceData$ = this.store$.pipe(
    takeWhileRouteActive('pbm'),
    select(getReferenceData),
    filter(
      ({ authorizationDetails }) =>
        !!authorizationDetails.authorizationActionLabel
    )
  );
  setPbmServiceType = this.updater(
    (state, pbmServiceType: PbmAuthorizationServiceType) => ({
      ...state,
      pbmServiceType
    })
  );
  setAuthorizationTitle = this.updater((state, authorizationTitle: string) => ({
    ...state,
    authorizationTitle
  }));
  setServiceDisplayName = this.updater((state, serviceName: string) => ({
    ...state,
    serviceName
  }));
  setNoActionableUser = this.updater((state, noActionableUser: boolean) => ({
    ...state,
    noActionableUser
  }));
  setAuthorizationLevelAccessMode = this.updater(
    (state, authorizationLevelMode: PbmAuthFormMode) => ({
      ...state,
      authorizationLevelAccessMode: authorizationLevelMode
    })
  );
  setAuthorizationDetailsHeaderActionsConfig = this.updater(
    (
      state,
      authorizationDetailsHeaderActionsConfig: HealtheComponentConfig
    ) => ({
      ...state,
      authorizationDetailsHeaderActionsConfig
    })
  );
  setAuthorizationDetailsInsetCardConfig = this.updater(
    (state, authorizationDetailsInsetCardConfig: HealtheComponentConfig) => ({
      ...state,
      authorizationDetailsInsetCardConfig
    })
  );
  setAuthorizationLevelNotesConfig = this.updater(
    (state, authorizationLevelNotesConfig: PbmAuthNotesConfig) => ({
      ...state,
      authorizationLevelNotesConfig
    })
  );
  setLineItemConfigs = this.updater(
    (state, lineItemConfigs: ActionCardConfig[]) => ({
      ...state,
      lineItemConfigs,
      authorizationFooterConfig: undefined
    })
  );
  setAuthorizationFooterConfig = this.updater(
    (state, authorizationFooterConfig: PbmAuthFooterConfig) => ({
      ...state,
      authorizationFooterConfig
    })
  );
  setDisplayedLineItems = this.updater(
    (state, displayedLineItems: AuthorizationLineItem[]) => ({
      ...state,
      displayedLineItems
    })
  );
  /**
   * The serviceName is the displayed name of the type of authorization
   *
   * for example, POS (ePAQ) or Paper
   */
  serviceName$ = this.select(({ serviceName }) => serviceName);

  /**
   * The noActionableUser is the the flag that let us know if all lineitems are unactionable for this user
   *
   */
  noActionableUser$ = this.select(({ noActionableUser }) => noActionableUser);

  /**
   * What type of authorization this is
   * @see PbmAuthorizationServiceType
   */
  pbmServiceType$ = this.select(({ pbmServiceType }) => pbmServiceType);

  /**
   * This title is generated using the authorization level "mode" which is either, ReadWrite or ReadOnly.
   *
   * ReadWrite: Authorization Details
   *
   * Read: Authorization Submitted
   *
   * @see PbmAuthFormMode
   */
  authorizationTitle$ = this.select(
    ({ authorizationTitle }) => authorizationTitle
  );

  authorizationDetailHeaderActionsConfig$ = this.select(
    ({ authorizationDetailsHeaderActionsConfig }) =>
      authorizationDetailsHeaderActionsConfig
  );

  authorizationDetailHeaderInsetCardConfig$ = this.select(
    ({ authorizationDetailsInsetCardConfig }) =>
      authorizationDetailsInsetCardConfig
  );

  authorizationLevelNotesConfig$ = this.select(
    ({ authorizationLevelNotesConfig }) => authorizationLevelNotesConfig
  );

  /**
   * The authorization level access mode is the overall Read/ReadWrite mode
   * based on the authorization level status.
   */
  authorizationLevelAccessMode$ = this.select(
    ({ authorizationLevelAccessMode }) => authorizationLevelAccessMode
  );
  /**
   * line item configs contain the pbm service specific feature toggles and form
   * configurations
   */
  lineItemConfigs$ = this.select(({ lineItemConfigs }) => lineItemConfigs);
  authorizationFooterConfig$ = this.select(
    ({ authorizationFooterConfig }) => authorizationFooterConfig
  );
  displayedLineItems$ = this.select(
    ({ displayedLineItems }) => displayedLineItems
  );
  showReassignModalRef$: Subject<boolean> = new Subject();
  showViewLogModalRef$: Subject<boolean> = new Subject();
  public authorizationFormGroup: FormGroup = this.fb.group({
    lineItemsFormArray: this.fb.array([]),
    noteFormControl: this.fb.control(null),
    adjusterRequestCallbackFormGroup: this.fb.group({}),
    isPatientWaitingFormControl: this.fb.control(null),
    sendNotificationToAdjuster: this.fb.control(true),
    internalNotes: this.fb.control(null),
    footerActionForm: this.fb.group({}),
    callerFormGroup: this.fb.group({})
  });

  VISIBLE_STATUSES_FOR_VIEW: { [key: string]: string[] } = {
    AWAITING_DECISION: ['AWAITING_DECISION', 'AWAITING_SECOND_DECISION'],
    AWAITING_DECISION_PT: ['AWAITING_DECISION', 'AWAITING_SECOND_DECISION'],
    AWAITING_CALL: [
      'AWAITING_CALL',
      'AWAITING_CALL_DENY',
      'AWAITING_CALL_DENY_ONE_TIME_ONLY',
      'SUBMITTED',
      'COMPLETE'
    ],
    AWAITING_CALL_DENY: [
      'AWAITING_CALL',
      'AWAITING_CALL_DENY',
      'AWAITING_CALL_DENY_ONE_TIME_ONLY',
      'SUBMITTED',
      'COMPLETE'
    ],
    SUBMITTED: ['SUBMITTED', 'COMPLETE'],
    COMPLETE: ['COMPLETE']
  };

  get lineItemFormArray(): FormArray {
    return this.authorizationFormGroup.get('lineItemsFormArray') as FormArray;
  }

  get reassignToNewClaim(): any {
    return this.currentConfig.reassignClaim;
  }

  private currentConfig: PbmAuthorizationInformationBaseConfig;

  public lineItemByIndex$(index: number): Observable<AuthorizationLineItem> {
    return this.displayedLineItems$.pipe(
      map((displayedLines) => displayedLines[index])
    );
  }
  public unlockAuthorization$(authorizationId: string): void{
    return this.currentConfig.unlockAuthorization$(authorizationId);
  }

  constructor(
    private store$: Store<RootState>,
    private fb: FormBuilder,
    private cscAdministrationService: CscAdministrationService,
    private pbmAuthorizationService: PbmAuthorizationService,
    private copyToClipboardService: CopyToClipboardService,
    private router: Router,
    public datePipe: DatePipe
  ) {
    // I really shouldn't default to 'undefined' but in the interest of time, I'm going to avoid figuring out whats needed out of the claim
    // and figure that out later so these methods work how they did originally
    super({
      authorizationDetailsInsetCardConfig: undefined,
      authorizationDetailsHeaderActionsConfig: undefined,
      authorizationLevelNotesConfig: undefined,
      authorizationTitle: '',
      lineItemConfigs: [],
      authorizationLevelAccessMode: PbmAuthFormMode.ReadOnly,
      serviceName: '',
      noActionableUser: false,
      authorizationFooterConfig: undefined,
      pbmServiceType: undefined,
      displayedLineItems: []
    });
    this.referenceData$.subscribe(
      ({
        pbmServiceType,
        userIsInternal,
        authorizationDetails,
        claim,
        statusView
      }) => {
        let displayedLineItems: AuthorizationLineItem[] =
          authorizationDetails.authorizationLineItems;

        // Filter lines out for internal users on POS authorization screens if there was a URL parameter statusView.
        // There is currently no filtering for external or paper authorization screens.
        if (
          pbmServiceType === PbmAuthorizationServiceType.POS &&
          userIsInternal &&
          Object.keys(this.VISIBLE_STATUSES_FOR_VIEW).indexOf(statusView) !== -1
        ) {
          displayedLineItems = displayedLineItems.filter(
            (lineItem) =>
              this.VISIBLE_STATUSES_FOR_VIEW[statusView].indexOf(
                lineItem.currentStateName
              ) !== -1
          );
        }
        this.setDisplayedLineItems(displayedLineItems);

        /**
         * set config service type
         */
        this.setServiceTypeConfiguration(pbmServiceType);
        /**
         * construct configs
         */
        const authorizationLevelAccessMode =
          this.currentConfig.getAuthorizationLevelAccessMode(
            authorizationDetails,
            userIsInternal
          );

        displayedLineItems.forEach((lineItem, index) => {
          this.createLineItemFormGroup(lineItem, index);
        });

        this.setAuthorizationLevelAccessMode(authorizationLevelAccessMode);

        let serviceName = this.currentConfig.getServiceName();
        this.setServiceDisplayName(serviceName);

        let hasNoActionsForCurrentUser = this.hasNoActionsForCurrentUser(
          displayedLineItems,
          userIsInternal
        );
        this.setNoActionableUser(hasNoActionsForCurrentUser);

        const authorizationTitle = this.currentConfig.getAuthSectionTitle(
          authorizationLevelAccessMode
        );

        const lineItemConfigs = this.currentConfig.getLineItemsActionCards(
          authorizationDetails,
          displayedLineItems,
          this.lineItemFormArray,
          userIsInternal
        );

        const actionableLineItems =
          lineItemConfigs.findIndex(
            (config) => config.mode === PbmAuthFormMode.ReadWrite
          ) > -1;
        const authorizationDetailsHeaderActionsConfig =
          this.currentConfig.getAuthDetailHeaderActions(
            actionableLineItems
              ? authorizationLevelAccessMode
              : PbmAuthFormMode.ReadOnly,
            this.showReassignModalRef$,
            this.showViewLogModalRef$,
            claim.header.hesClaimNumber,
            claim,
            authorizationDetails,
            this.lineItemFormArray,
            userIsInternal
          );
        const authorizationDetailsInsetCardConfig =
          this.currentConfig.getAuthDetailInsetCardConfig(
            authorizationDetails.authorizationDetailsHeader,
            authorizationDetails.pharmacyInformationForm,
            claim,
            this.callerFormGroup,
            userIsInternal,
            authorizationDetails.patientWaiting
          );
        // TODO: update when moved showAdjusterCallBack
        // TODO: update footer config builders to handle COMPLETE
        let authorizationFooterConfig = this.currentConfig.getAuthFooterConfig(
          this.getAuthFooterMode(
            hasNoActionsForCurrentUser,
            actionableLineItems,
            authorizationLevelAccessMode,
            userIsInternal
          ),
          'AWAITING_DECISION'.equalsIgnoreCase(
            authorizationDetails.authorizationDetailsHeader.status
          ),
          this.callerFormGroup,
          authorizationDetails,
          this.authorizationFormGroup
        );

        const authorizationLevelNotesConfig =
          this.currentConfig.getAuthNotesConfig(
            authorizationLevelAccessMode,
            authorizationDetails,
            this.authorizationFormGroup.get('noteFormControl') as FormControl
          );
        /**
         * Set hydrated initial state
         */
        this.patchState({
          pbmServiceType,
          authorizationTitle,
          authorizationDetailsHeaderActionsConfig,
          authorizationDetailsInsetCardConfig,
          lineItemConfigs,
          authorizationLevelNotesConfig,
          authorizationFooterConfig
        });
      }
    );
  }

  get callerFormGroup(): FormGroup {
    return this.authorizationFormGroup.get('callerFormGroup') as FormGroup;
  }

  lineItemConfig$(index: number) {
    return this.select(({ lineItemConfigs }) => lineItemConfigs[index]);
  }

  setServiceTypeConfiguration(serviceType: PbmAuthorizationServiceType) {
    switch (serviceType) {
      case PbmAuthorizationServiceType.PAPER:
        this.currentConfig = new PbmAuthorizationInformationPaperConfig(
          this.store$,
          this.router,
          this.cscAdministrationService,
          this.copyToClipboardService,
          this.pbmAuthorizationService,
          this.datePipe
        );
        break;
      default:
      case PbmAuthorizationServiceType.POS:
        this.currentConfig = new PbmAuthorizationInformationPosConfig(
          this.store$,
          this.cscAdministrationService,
          this.copyToClipboardService,
          this.pbmAuthorizationService,
          this.router,
          this.datePipe
        );
        break;
    }
  }

  createLineItemFormGroup(
    {
      posLineItemKey,
      paperLineItemKey,
      lastDenialReason1,
      lastDenialReason2,
      lastDecisionPeriod,
      lastDecisionDateTime,
      lastDecisionAction,
      datePickerPresets,
      dateFilled,
      currentStateName
    }: AuthorizationLineItem,
    index: number
  ): void {
    if (!this.lineItemFormArray.at(index)) {
      const lineItemId = posLineItemKey ? posLineItemKey : paperLineItemKey;
      let approvalPeriodType = null;
      let denyPeriodType = null;
      if (
        (lastDecisionAction === 'APPROVE' ||
          lastDecisionAction === 'RECOMMEND_APPROVAL') &&
        lastDecisionPeriod === 0
      ) {
        approvalPeriodType =
          ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_ONE_TIME;
      } else if (
        (lastDecisionAction === 'APPROVE' ||
          lastDecisionAction === 'RECOMMEND_APPROVAL') &&
        lastDecisionPeriod != null
      ) {
        approvalPeriodType = ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_DATE;
      }
      if (
        lastDecisionAction === 'DENY_INDEFINITELY' &&
        lastDecisionPeriod === 0
      ) {
        denyPeriodType = DenialPeriodType.AUTH_INFO_DENIAL_INDEFINITELY;
      } else if (lastDecisionAction === 'DENY' && lastDecisionPeriod === 0) {
        denyPeriodType = DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_ONE_TIME;
      } else if (lastDecisionAction === 'DENY' && lastDecisionPeriod > 0) {
        denyPeriodType = DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_DATE;
      }
      let actionsFormGroup: FormGroup = new FormGroup({
        lineItemId: new FormControl(lineItemId),
        action: new FormControl(
          lastDecisionAction,
          [Validators.required]
        ),
        approvalPeriodType: new FormControl(approvalPeriodType, [
          Validators.required
        ]),
        primaryDenialReason: new FormControl(
          lastDenialReason1 > 0 ? lastDenialReason1 : null,
          [Validators.required]
        ),
        secondaryDenialReason: new FormControl(
          lastDenialReason2 > 0 ? lastDenialReason2 : null
        ),
        denialPeriodType: new FormControl(denyPeriodType, Validators.required),
        // TODO: Fix action period date not adding the lastDecisionPeriod
        actionPeriodDate: new FormControl(
          lastDecisionPeriod
            ? moment(lastDecisionDateTime).add(
                lastDecisionPeriod ? lastDecisionPeriod : 0,
                'days'
              )
            : lastDecisionPeriod,
          [
            Validators.required,
            (ac: AbstractControl): ValidationErrors => {
              if (ac.value) {
                let minDate = new Date().setHours(0, 0, 0, 0);
                let maxDate = new Date();

                if (datePickerPresets && datePickerPresets.length > 0) {
                  maxDate = moment(maxDate)
                    .add(
                      datePickerPresets[datePickerPresets.length - 1]
                        .numberOfDays,
                      'day'
                    )
                    .toDate();
                } else {
                  maxDate.setFullYear(maxDate.getFullYear() + 1);
                }
                if (ac.value < minDate) {
                  return {
                    dateMustBeInFuture: true
                  };
                } else if (ac.value > maxDate) {
                  return {
                    dateBeyondMaxDate: true
                  };
                }
              }
            }
          ]
        ),
        note: new FormControl(null, [])
      });
      this.lineItemFormArray.push(actionsFormGroup);
    }
  }

  getAuthFooterMode(
    hasNoActionsForCurrentUser: boolean,
    actionableLineItems: boolean,
    authorizationLevelAccessMode: PbmAuthFormMode,
    isUserInternal: boolean
  ): PbmAuthFormMode {
    if (hasNoActionsForCurrentUser) {
      return PbmAuthFormMode.ReadOnly;
    } else {
      if (actionableLineItems) {
        return authorizationLevelAccessMode;
      } else if (isUserInternal && !hasNoActionsForCurrentUser) {
        return PbmAuthFormMode.ReadWrite;
      } else {
        return PbmAuthFormMode.ReadOnly;
      }
    }
  }

  getPbmAuthSubmitSuccessModalConfig(): PbmAuthSubmitSuccessModalConfig{
    return this.currentConfig.getAuthSuccessSubmitModalConfig();
  }

  hasNoActionsForCurrentUser(
    displayedLineItems: AuthorizationLineItem[],
    isInternal: boolean
  ): boolean {
    if (isInternal) {
      return !displayedLineItems.some(
        ({ permissibleActionsForCurrentUser }) =>
          permissibleActionsForCurrentUser.length > 0
      );
    }

    return !displayedLineItems.some((li) => {
      return (
        (li.permissibleActionsForCurrentUser ||
          li.permissibleActionsForCurrentUser.length > 0) &&
        li.permissibleActionsForCurrentUser.some((x) => {
          return (
            ActionOption.approve.equalsIgnoreCase(x) ||
            ActionOption.deny.equalsIgnoreCase(x) ||
            ActionOption.pend.equalsIgnoreCase(x) ||
            ActionOption.recommendApprove.equalsIgnoreCase(x)
          );
        })
      );
    });
  }

  copyToClipboard() {
    this.store$
      .pipe(
        select(getClipboardReferenceData),
        mergeMap((refData) => {
          return this.cscAdministrationService
            .getPharmacyData(
              refData.authDetails.pharmacyInformationForm.pharmacy.nabp
            )
            .pipe(
              first(),
              map((pharmacy) => ({ ...refData, pharmacy }))
            );
        }),
        first()
      )
      .subscribe(({ pharmacy, authDetails, claim }) => {
        this.copyToClipboardService.copy(
          getPOSAuthorizationCopyToClipboard(
            pharmacy.responseBody,
            authDetails,
            claim.header.hesClaimNumber,
            claim,
            this.lineItemFormArray
          ),
          document
        );
      });
  }

}
