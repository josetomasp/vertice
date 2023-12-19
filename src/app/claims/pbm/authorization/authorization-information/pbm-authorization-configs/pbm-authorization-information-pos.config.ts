import {
  ActionCardConfig,
  AuthorizationDetails,
  AuthorizationDetailsHeader,
  PbmAuthFooterConfig,
  PbmAuthFormMode,
  PbmAuthNotesConfig,
  PbmPharmacyInformationForm,
  PbmReassignNewClaim,
  PbmAuthSubmitSuccessModalConfig
} from '../../store/models/pbm-authorization-information.model';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';
import { PbmAuthorizationInformationBaseConfig } from './pbm-authorization-information-base.config';
import { Injector } from '@angular/core';
import { CscAdministrationService } from 'src/app/csc-administration/csc-administration.service';
import { first } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { BehaviorSubject, Observable } from 'rxjs';
import { getPOSAuthorizationCopyToClipboard } from './copy-to-clipboard-configs/pbm-authorization-information-pos-copy-to-clipboard.config';
import { CopyToClipboardService } from '@shared/service/copy-to-clipboard.service';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  PBM_AUTH_FOOTER_DEFAULT_CONFIG,
  PBM_AUTH_NOTES_DEFAULT_STATE,
  PBM_AUTH_POS_FOOTER_DEFAULT_CONFIG
} from '../../store/models/pbm-authorization.models';
import { PbmStatus } from '@shared/models/pbmStatus';
import {
  DEFAULT_GRID_COMPONENT_CONTAINER_CONFIG,
  HealtheComponentConfig,
  HealtheGridButtonType,
  HealtheGridConfigService,
  PbmPharmacyModalOpenerData
} from '@modules/healthe-grid';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import {
  generatePBMAuthTimeOptionFromDate,
  getPhoneNumberString
} from '@shared';
import { adjusterCallbackDateNullOrTodayOrLaterValidator } from '../authorization-information.validators';
import { getPbmAuthStatusView } from '../../../../../store/selectors/router.selectors';
import {
  submitRxAuthClaimReassignment,
  unlockRxAuthorization
} from '../../store/actions/pbm-authorization-information.actions';
import { DatePipe } from '@angular/common';
import { AuthorizationLineItem } from '../../store/models/pbm-authorization-information/authorization-line-item.models';
import { PbmAuthorizationServiceType } from '../../store/models/pbm-authorization-service-type.models';
import { PbmAuthorizationService } from '../../pbm-authorization.service';
const moment = _moment;

const injector = Injector.create({
  providers: [
    { provide: Store, deps: [] },
    { provide: HealtheGridConfigService, deps: [] }
  ]
});

export class PbmAuthorizationInformationPosConfig extends PbmAuthorizationInformationBaseConfig {
  private gCS: HealtheGridConfigService;

  private pharmacyOpData: PbmPharmacyModalOpenerData;

  constructor(
    public store$: Store<RootState>,
    private cscAdministrationService: CscAdministrationService,
    private copyToClipboardService: CopyToClipboardService,
    private pbmAuthorizationService: PbmAuthorizationService,
    private router: Router,
    public datePipe: DatePipe
  ) {
    super();

    this.gCS = injector.get<HealtheGridConfigService>(HealtheGridConfigService);
  }

  getAuthorizationLevelAccessMode(
    authorizationDetails: AuthorizationDetails,
    userIsInternal: boolean
  ): PbmAuthFormMode {
    if (authorizationDetails && authorizationDetails.authorizationLineItems) {
      const overallStatus =
        authorizationDetails.authorizationDetailsHeader.status;
      if (
        userIsInternal &&
        overallStatus !== 'SUBMITTED' &&
        overallStatus !== 'COMPLETE'
      ) {
        return PbmAuthFormMode.ReadWrite;
      } else if (overallStatus === 'AWAITING_DECISION') {
        return PbmAuthFormMode.ReadWrite;
      }
    }
    return PbmAuthFormMode.ReadOnly;
  }

  getAuthSectionTitle(mode: PbmAuthFormMode) {
    return mode === PbmAuthFormMode.ReadOnly
      ? 'Authorization Submitted'
      : 'Authorization Details';
  }

  getServiceName(): string {
    return 'POS';
  }

  getAuthDetailInsetCardConfig(
    { creationDate, status }: AuthorizationDetailsHeader,
    { callerNumber, callerName, pharmacy }: PbmPharmacyInformationForm,
    { adjuster, supervisor, caseManagers }: ClaimV3,
    callerFormGroup?: FormGroup,
    userIsInternal?: boolean,
    patientWaiting?: boolean
  ): HealtheComponentConfig {
    this.pharmacyOpData = pharmacy;
    callerNumber = callerNumber ? callerNumber.replace(/[\s\(\)-]/g, '') : null;
    this.store$
      .pipe(select(getPbmAuthStatusView), first())
      .subscribe((urlStatus) => {
        if (null == urlStatus) {
          if (status) {
            status = PbmStatus[status.toUpperCase()];
          }
        } else {
          // These are the statuses passed in for filtering in the URL in the top for POS Auth
          switch (urlStatus) {
            default:
              status = 'UNIMPLEMENTED';
              break;

            case 'AWAITING_DECISION_PT':
              status = 'Auth Required - Patient Waiting';
              break;

            case 'AWAITING_DECISION':
              if (!patientWaiting) {
                status = 'Auth Required';
              } else {
                status = 'Auth Required - Patient Waiting';
              }
              break;
            case 'AWAITING_CALL':
              status = 'Ready For Call - Approved';
              break;

            case 'AWAITING_CALL_DENY':
              status = 'Ready For Call - Denied';
              break;

            case 'COMPLETE':
              status = 'Completed';
              break;
          }
        }
      });

    return this.gCS
      .configureGrid()
      .form(callerFormGroup)
      .flex({ gap: '4%' })
      .row((rowBuilder) => {
        rowBuilder
          .text(status, 'STATUS', '10')
          .text(creationDate, 'CREATE DATE', '8')
          .pharmacy(pharmacy);
        if (userIsInternal) {
          rowBuilder
            .phoneNumber(
              {
                value: callerNumber,
                type: '',
                isRequired: true,
                formControlName: 'phoneNumber',
                id: 'auth-info-phoneNumber-input',
                validators: [Validators.required],

                errorMessages: new Map([
                  [
                    'mask',
                    'Please enter a valid phone number: Ex. (xxx) xxx-xxxx'
                  ],
                  ['required', 'Caller phone is required']
                ])
              },
              'Caller Phone'
            )
            .input(
              {
                value: callerName,
                type: 'text',
                formControlName: 'callerName',
                isRequired: true,
                id: 'auth-info-callerName-input',
                validators: [Validators.required],
                errorMessages: new Map([
                  ['required', 'Caller name is required']
                ]),
                placeHolder: 'Please Enter Caller Name'
              },
              'Caller Name'
            );
        }
      })
      .row((rowBuilder) => {
        rowBuilder.html('<div class="spacersmall"></div>');
      })
      .row((rowBuilder) => {
        const adjusterComunication =
          adjuster && adjuster.communications
            ? adjuster.communications.find((communication) =>
                communication.type.equalsIgnoreCase('WORK')
              )
            : undefined;

        const supervisorComunication =
          supervisor && supervisor.communications
            ? supervisor.communications.find((communication) =>
                communication.type.equalsIgnoreCase('WORK')
              )
            : undefined;

        const caseManager = caseManagers
          ? caseManagers.find((cM) =>
              cM.caseManagerRoleCode.equalsIgnoreCase('U')
            )
          : undefined;

        const caseManagerComunication =
          caseManager && caseManager.communications
            ? caseManager.communications.find((communication) =>
                communication.type.equalsIgnoreCase('WORK')
              )
            : undefined;

        rowBuilder
          .text(
            adjuster && adjuster.fullName ? adjuster.fullName : 'Not Available',
            'Assigned Adjuster',
            '10'
          )
          .text(
            adjusterComunication
              ? this.phoneNumberFormat(adjusterComunication.communicationValue)
              : 'Not Available',
            'Adjuster Phone',
            '8'
          )
          .text(
            supervisor && supervisor.fullName
              ? supervisor.fullName
              : 'Not Available',
            'Supervisor',
            '10'
          )
          .text(
            supervisorComunication
              ? this.phoneNumberFormat(
                  supervisorComunication.communicationValue
                )
              : 'Not Available',
            'Supervisor Phone',
            '10'
          )
          .text(
            caseManager ? caseManager.fullName : 'Not Available',
            'Nurse Case Manager',
            '10'
          )
          .text(
            caseManagerComunication
              ? this.phoneNumberFormat(
                  caseManagerComunication.communicationValue
                )
              : 'Not Available',
            'Nurse Case Manager Phone'
          );
      })
      .build();
  }

  getAuthDetailHeaderActions(
    mode: PbmAuthFormMode,
    showReassignModalRef$: BehaviorSubject<boolean>,
    showViewLogModalRef$: BehaviorSubject<boolean>,
    decodedClaimNumber: string,
    claimInfo: ClaimV3,
    authorizationDetails: AuthorizationDetails,
    formArray: FormArray,
    userIsInternal?: boolean
  ) {
    const showViewLogButton = userIsInternal;

    const showReAssignToClaimButton =
      authorizationDetails.authorizationDetailsHeader.status ===
      'AWAITING_DECISION';

    return this.gCS
      .configureGrid()
      .flex({ justifyContent: 'end', gap: '4%' })
      .row((builder) => {
        if (showViewLogButton) {
          builder.button(
            {
              text: 'View Log',
              buttonType: HealtheGridButtonType.Secondary,
              // Use arrow function for class level scope
              action: () => {
                showViewLogModalRef$.next(true);
              }
            },
            null,
            '20'
          );
        }

        if (mode === PbmAuthFormMode.ReadOnly && !userIsInternal) {
          builder.button(
            {
              text: 'Return to Authorization Queue',
              buttonType: HealtheGridButtonType.Primary,
              action: () => {
                this.router.navigate(['/search-nav/epaq-authorizations']);
              }
            },
            null
          );
        }

        builder.button(
          {
            text: 'Send Email',
            buttonType: HealtheGridButtonType.Secondary,
            // use direct function assignment to limit scope to the button
            action: () => {
              openCenteredNewWindowDefaultSize(
                '/HesDashboard/popup.jsp?header=stripeonly&popup=epaqEmail&authKey='
                  .concat(authorizationDetails.authorizationId.toString())
                  .concat('&claimNum=')
                  .concat(decodedClaimNumber)
                  .concat('#POPUP')
              );
            }
          },
          null
        );
        if (mode === PbmAuthFormMode.ReadWrite) {
          if (showReAssignToClaimButton) {
            builder.button(
              {
                text: 'Reassign to another claim',
                buttonType: HealtheGridButtonType.Secondary,
                // Use arrow function for class level scope
                action: () => {
                  showReassignModalRef$.next(true);
                }
              },
              null
            );
          }

          builder.button(
            {
              text: 'Copy to Clipboard',
              buttonType: HealtheGridButtonType.Secondary,
              action: () => {
                this.copyToClipboardPBMAuth(
                  authorizationDetails,
                  decodedClaimNumber,
                  claimInfo,
                  formArray,
                  authorizationDetails.pharmacyInformationForm.pharmacy.nabp
                );
              }
            },
            null
          );
        } else {
          builder.button(
            {
              text: 'Copy Authorization to Clipboard',
              buttonType: HealtheGridButtonType.Primary,
              action: () => {
                this.copyToClipboardPBMAuth(
                  authorizationDetails,
                  decodedClaimNumber,
                  claimInfo,
                  formArray,
                  authorizationDetails.pharmacyInformationForm.pharmacy.nabp
                );
              }
            },
            null
          );
        }
        return builder;
      })
      .build();
  }

  getLineItemsActionCards(
    authorizationDetails: AuthorizationDetails,
    displayedLineItems: AuthorizationLineItem[],
    formArray: FormArray = null,
    userIsInternal: boolean = false
  ): ActionCardConfig[] {
    return displayedLineItems.map((li) => {
      let actionCardConfig: ActionCardConfig = {
        actionFormConfig: {
          status: li.currentStateName as PbmStatus,
          reviewLevelValue: li.slrDrugName,
          lomnActionDate: li.lomnActionDate,
          lomnAction: li.lomnAction,
          effectiveDateTo: new Date().toDateString(),
          maxDate:  moment(new Date().toDateString()).add(Math.max(...li.datePickerPresets.map(preset => preset.numberOfDays)), 'days').toDate(), // Max date
          compoundModalData: {
            dispenseFees: li.dispensingFee,
            ingredients: li.ingredients.map((ing) => {
              return {
                ndc: ing.ndc,
                drugName: ing.name,
                quantity: ing.quantity,
                rejectCode: ing.rejectCode,
                createdDate: li.dateFilled,
                rejectReason:
                  li.reasons && li.reasons.length > 0
                    ? li.reasons[0]
                    : { description: '', ncpdpRejectCode: '' },
                canItOpenLookupModal: this.canIngredientLabelOpenLookupModal(ing.name, ing.ndc) && ing.validNdc
              };
            })
          },
          lomnSupported:
            authorizationDetails.authorizationDetailsHeader.lomnSupported,
          currentUsersDecisionIsPreliminary:
            li.currentUsersDecisionIsPreliminary,
          claimMme: authorizationDetails.claimMme,
          permissibleActionsForCurrentUser: li.permissibleActionsForCurrentUser,
          showOneTimeOnlyMessage: true,
          lastDesicionNarrative: this.lineItemLastDecisionNarrative(li, true),
          drugDisplayName: {
            label: li.compound ? 'Compound' : li.drugItemName,
            class: li.compound ? 'compound-link' : 'drug-link',
            isCompound: li.compound,
            canItOpenLookupModal: this.canMedicationLabelOpenLookupModal(li.compound, li.drugGPI)
          },
          slrMessage: li.slrDrugName &&
          !userIsInternal &&
          li.twoLevelApproval
            ? li.slrDrugName
            : '',
          specialWorkflowMessage: !li.twoLevelApproval &&
            (li.workflowTransactionPattern || li.workflowGpi)
            ? li.slrWorkflowName
            : '',
          approveButtons: {
            displayInitial: li.currentUsersDecisionIsPreliminary,
            displayFinal: !li.currentUsersDecisionIsPreliminary
          }
        },
        prescriberFormConfig: this.getPbmComponentConfigForPrescriberInfo(li),
        authorizationId: authorizationDetails.authorizationId,
        authorizationType: authorizationDetails.authorizationType,
        mode: this.lineItemMode(li)
      };
      return actionCardConfig;
    });
  }

  getPbmComponentConfigForPrescriberInfo(lineItem: AuthorizationLineItem) {
    return this.gCS
      .configureGrid({
        ...DEFAULT_GRID_COMPONENT_CONTAINER_CONFIG,
        noAvailableValueTag: true
      })
      .row((rowBuilder) => {
        rowBuilder
          .prescriber(
            {
              prescriberId: (!lineItem.prescriber || 'unknown'.equalsIgnoreCase(lineItem.prescriber.prescriberType))
                ? ''
                : lineItem.prescriber.prescriberId,
              displayText: this.getAuthorizationPrescriberName(
                lineItem.prescriber
              )
            },
            'PRESCRIBER',
            '0'
          )
          .text(getPhoneNumberString(lineItem.prescriberPhone), 'PRESCRIBER PHONE', '0')
          .text(lineItem.dateFilled, 'SERVICE DATE', '0')
          .text(lineItem.quantity, 'QTY', '0')
          .text(lineItem.daysSupply, 'DAYS SUPPLY', '0')
          .money(lineItem.totalAwp, 'TOTAL AWP', '0');
      })
      .row((rowBuilder) => {
        rowBuilder.html('<div class="spacersmall"></div>');
      })
      .row((rowBuilder) => {
        if (lineItem.compound || lineItem.drugGPI?.toLowerCase().includes('unknown') === false) {
          rowBuilder
            .drugOrCompound(
              {
                ndc: lineItem.ndc,
                quantity: lineItem.quantity,
                createdDate: lineItem.dateFilled,
                displayText: lineItem.compound
                  ? 'Compound'
                  : lineItem.drugDisplayName,
                compound: lineItem.compound,
                compoundModalData: {
                  dispenseFees: lineItem.dispensingFee,
                  ingredients: lineItem.ingredients.map((ing) => {
                    return {
                      ndc: ing.ndc,
                      drugName: ing.name,
                      quantity: ing.quantity,
                      createdDate: lineItem.dateFilled,
                      rejectReason:
                        lineItem.reasons && lineItem.reasons.length > 0
                          ? lineItem.reasons[0]
                          : { description: '', ncpdpRejectCode: '' },
                      canItOpenLookupModal: this.canIngredientLabelOpenLookupModal(ing.name, ing.ndc) &&  ing.validNdc
                    };
                  })
                }
              },
              'MEDICATION DETAIL',
              '0'
            );
        } else {
          rowBuilder.text(lineItem.drugDisplayName, 'MEDICATION DETAIL', '0');
        }

        rowBuilder.text(lineItem.brand, 'BRAND/GENERIC', '0', {
            position: 'label',
            tooltipMessage:
              'Authorized generics or single-source generics may show “No generic available” because there are no alternate generics available on the market.'
          })
          .text(lineItem.inFormulary ? 'Yes' : 'No', 'IN FORMULARY', '0', {
            position: 'label',
            tooltipMessage:
              'Drugs that are not in formulary will require review. For active claims, drugs that are in formulary may also require review if certain criteria are exceeded, such as days’ supply limits or quantity limits.'
          })
          .text(lineItem.deaClass, 'Federal DEA Class', '0')
          .text('  ', '  ', '0')
          .text('  ', '  ', '0');
      })
      .row((rowBuilder) => {
        rowBuilder.html('<div class="spacersmall"></div>');
      })
      .row((rowBuilder) => {
        rowBuilder
          .text(lineItem.previousDecision, 'PREVIOUS DECISION', '0', {
            position: 'label',
            tooltipMessage:
              'The Previous Decision Date represents the last actioned date. For formulary approved medications that do not require review, this is the last date processed through Healthesystems. For drugs requiring review, this is the last date that a determination was made by the reviewer. Additional transactions may have occurred following that decision within the designated approval/denial timeframe.'
          })
          .text(lineItem.previousDecisionDate, 'PREV. DECISION DATE', '0')
          .text(lineItem.mostRecentQuantity, 'PREV. REQUEST QTY.', '0')
          .text(
            lineItem.mostRecentDaysSupply,
            'PREV. REQUESTED DAYS SUPPLY',
            '0'
          )
          .text(
            lineItem.estimatedDaysSupplyOnHand,
            'EST. DAYS SUPPLY ON HAND',
            '0',
            {
              position: 'label',
              tooltipMessage:
                'Days’ Supply on Hand is an estimation of current possession based on dispensed medication (not including this Rx) and may not represent actual on-hand supply in some scenarios (e.g., taking more or less than prescribed, lost prescriptions).'
            }
          )
          .text('', '', '0'); // Added to match the first row so it will align the columns
      })
      .build();
  }

  getAuthNotesConfig(
    mode: PbmAuthFormMode,
    authorizationDetails?: AuthorizationDetails,
    authorizationNotesFormControl?: FormControl
  ): PbmAuthNotesConfig {
    return {
      ...PBM_AUTH_NOTES_DEFAULT_STATE,
      mode: mode
    };
  }

  getAuthFooterConfig(
    mode: PbmAuthFormMode,
    showRequestedCallbackFields: boolean,
    callerFormGroup?: FormGroup,
    authorizationDetails?: AuthorizationDetails,
    authFormGroup?: FormGroup
  ): PbmAuthFooterConfig {
    if (showRequestedCallbackFields) {
      (
        authFormGroup.get('adjusterRequestCallbackFormGroup') as FormGroup
      ).addControl(
        'date',
        new FormControl(undefined, [
          adjusterCallbackDateNullOrTodayOrLaterValidator
        ])
      );
      (
        authFormGroup.get('adjusterRequestCallbackFormGroup') as FormGroup
      ).addControl('time', new FormControl(undefined, []));
    }
    return {
      ...PBM_AUTH_FOOTER_DEFAULT_CONFIG,
      footerConfig: {
        ...PBM_AUTH_POS_FOOTER_DEFAULT_CONFIG,
        showRequestedCallbackFields: showRequestedCallbackFields,
        callerFormGroup: callerFormGroup
      },
      authorizationType: PbmAuthorizationServiceType.POS,
      pbmAuthformGroup: authFormGroup,
      authorizationDetails: authorizationDetails,
      mode: mode
    } as PbmAuthFooterConfig;
  }

  getAuthSuccessSubmitModalConfig():PbmAuthSubmitSuccessModalConfig{
    const authSuccessSubmitModalConfig:PbmAuthSubmitSuccessModalConfig={
      title: 'Submitted Successfully',
      bodyText: 'POS Authorization has been submitted successfully',
      buttonClass: ['success-button'],
      returnToURL: '/search-nav/epaq-authorizations',
      returnToLabel: 'Return to Authorization Queue',
      remainLabel: 'Remain On This Authorization',
      copyToClipboardLabel: 'Copy to Clipboard',
    }
    return authSuccessSubmitModalConfig;
  };

  copyToClipboardPBMAuth(
    detail: AuthorizationDetails,
    decodedClaimNumber: string,
    claimInfo: ClaimV3,
    formArray: FormArray,
    pharmacyNabp: string
  ) {
    this.cscAdministrationService
      .getPharmacyData(pharmacyNabp)
      .pipe(first())
      .subscribe((pharmacy) =>
        this.copyToClipboardService.copy(
          getPOSAuthorizationCopyToClipboard(
            pharmacy.responseBody,
            detail,
            decodedClaimNumber,
            claimInfo,
            formArray
          ),
          document
        )
      );
  }

  reassignClaim(authorizationId: number, reassign: PbmReassignNewClaim) {
    this.store$.dispatch(
      submitRxAuthClaimReassignment({
        fromAuthorizationId: authorizationId,
        toPhiMemberId: reassign.phiMemberKey
      })
    );
  }

  canMedicationLabelOpenLookupModal(isCompound: boolean, drugGPI: string): boolean {
    if (isCompound || drugGPI?.toLowerCase().includes('unknown') === false) {
      return true;
    } else if (drugGPI?.toLowerCase().includes('unknown') === true) {
      return false;
    }
  }

  canIngredientLabelOpenLookupModal(ingredientName: string, ingredientNdc: string): boolean {
    if (ingredientNdc !== null && ingredientName.toLowerCase().includes('unknown') === false) {
      return true;
    } else if (ingredientNdc === null || ingredientName.toLowerCase().includes('unknown')) {
      return false;
    }
  }

  unlockAuthorization$(authorizationId: string): void{
    this.store$.dispatch(
      unlockRxAuthorization({ authorizationId: authorizationId })
    );

  }
}
