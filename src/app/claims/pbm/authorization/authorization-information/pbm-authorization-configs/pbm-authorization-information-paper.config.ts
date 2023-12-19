import {
  ActionCardConfig,
  AuthorizationDetails,
  AuthorizationDetailsHeader,
  PbmAuthFooterConfig,
  PbmAuthFormMode,
  PbmAuthNotesConfig, PbmPharmacyInformationForm,
  PbmReassignNewClaim,
  PbmAuthSubmitSuccessModalConfig
} from '../../store/models/pbm-authorization-information.model';
import { Injector } from '@angular/core';
import { CscAdministrationService } from 'src/app/csc-administration/csc-administration.service';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { getPaperAuthorizationCopyToClipboard } from './copy-to-clipboard-configs/pbm-authorization-information-paper-copy-to-clipboard.config';
import { CopyToClipboardService } from '@shared/service/copy-to-clipboard.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PbmAuthorizationInformationBaseConfig } from './pbm-authorization-information-base.config';
import { PbmStatus } from '@shared/models/pbmStatus';
import { ClaimV3 } from '@shared/store/models/claim.models';
import {
  DEFAULT_GRID_COMPONENT_CONTAINER_CONFIG,
  HealtheComponentConfig,
  HealtheGridButtonType,
  HealtheGridConfigService,
  PbmPharmacyModalOpenerData
} from '@modules/healthe-grid';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';
import { Router } from '@angular/router';
import { PBM_AUTH_NOTES_DEFAULT_STATE } from '../../store/models/pbm-auth-notes-default-state';
import { PBM_AUTH_FOOTER_DEFAULT_CONFIG } from '../../store/models/pbm-auth-footer-initial-state';
import {
  submitPaperAuthClaimReassignment,
  unlockPaperRxAuthorization
} from '../../store/actions/pbm-authorization-information.actions';
import { DatePipe } from '@angular/common';
import {
  maxBilledAmountValidation,
  noPendActionToSubmitPaper
} from '../authorization-information.validators';
import { getPhoneNumberString } from '@shared';
import * as moment from 'moment';
import { PbmAuthorizationService } from '../../pbm-authorization.service';
import { AuthorizationLineItem } from '../../store/models/pbm-authorization-information/authorization-line-item.models';
import { PbmAuthorizationServiceType } from '../../store/models/pbm-authorization-service-type.models';

// TODO: WE NEED TO UPDATE THIS ENUM WITH THE ACTUAL PAPER STATUSES AT THE MOMENT WE HAVE THE ENDPOINT AND ITS MODEL
enum PAPER_AUTH_STATUSES {
  AUTHORIZATION_REQUIRED = 'INITIAL',
  AUTHORIZAITON_PENDING = 'AWAITING_DECISION',
  COMPLETE = 'COMPLETE'
}

const injector = Injector.create({
  providers: [
    { provide: Store, deps: [] },
    { provide: HealtheGridConfigService, deps: [] }
  ]
});

export class PbmAuthorizationInformationPaperConfig extends PbmAuthorizationInformationBaseConfig {
  private gCS: HealtheGridConfigService;

  private pharmacyOpData: PbmPharmacyModalOpenerData;

  constructor(
    public store$: Store<RootState>,
    private router: Router,
    private cscAdministrationService: CscAdministrationService,
    private copyToClipboardService: CopyToClipboardService,
    private pbmAuthorizationService: PbmAuthorizationService,
    public datePipe: DatePipe
  ) {
    super();

    this.gCS = injector.get<HealtheGridConfigService>(HealtheGridConfigService);
  }

  getAuthorizationLevelAccessMode(
    authorizationDetails: AuthorizationDetails,
    userIsInternal: boolean
  ): PbmAuthFormMode {
    if (
      authorizationDetails &&
      authorizationDetails.authorizationLineItems &&
      ['Auth Required', 'Auth Pending'].includes(
        authorizationDetails.authorizationDetailsHeader.status
      )
    ) {
      return PbmAuthFormMode.ReadWrite;
    }
    return PbmAuthFormMode.ReadOnly;
  }

  getAuthSectionTitle(mode: PbmAuthFormMode) {
    return mode === PbmAuthFormMode.ReadOnly
      ? 'Authorization Submitted'
      : 'Authorization Detail';
  }

  getServiceName(): string {
    return 'Retro (Paper) Bill';
  }
  getAuthDetailInsetCardConfig(
    {
      status,
      dateLoaded,
      dateBillReceived,
      dateModified,
      reconsideration,
      attachments,
      billLevelRejectionReason,
      imageNumber,
      imageNumberURL,
      pharmacy,
      payee,
      invoiceTotal,
      pharmacyNetworkProvider
    }: AuthorizationDetailsHeader,
    { callerNumber, callerName }: PbmPharmacyInformationForm,
    { adjuster, supervisor, caseManagers }: ClaimV3
  ): HealtheComponentConfig {
    this.pharmacyOpData = pharmacy;
    return this.gCS
      .configureGrid()
      .flex({ justifyContent: 'space-between', gap: '30' })
      .row((rowBuilder) => {
        rowBuilder
          .text(status, 'STATUS', '15')
          .text(dateBillReceived, "CLIENT REC'D DATE", '15')
          .text(dateLoaded, 'DATE LOADED', '15')
          .text(dateModified, 'DATE MODIFIED', '15')
          .text(reconsideration ? 'Yes' : 'No', 'RECONSIDERATION?', '15')
          .text(
            attachments ? 'Yes' : 'No',
            'Additional Docs',
            '15',
            attachments
              ? {
                  position: 'label',
                  tooltipMessage:
                    'Additional documents accompanied the bill image. This can include Medical Records, LOMN, or any additional pages.'
                }
              : null
          );
      })
      .row((rowBuilder) => {
        rowBuilder.html('<div class="spacersmall"></div>');
      })
      .row((rowBuilder) => {
        rowBuilder
          .text(
            billLevelRejectionReason ?? 'N/A',
            'BILL LEVEL REJECTION REASON',
            '15'
          )
          .html(
            '<a href="' +
              imageNumberURL +
              '" target="_blank">' +
              imageNumber +
              '</a>',
            'BILL IMAGE',
            '15'
          )
          .pharmacy(pharmacy, 'PHARMACY', '15')
          .text(pharmacyNetworkProvider ? 'Yes' : 'No', 'NETWORK PROVIDER', '15')
          .payee(payee, 'PAYEE NAME', '15')
          .money(invoiceTotal, 'Total Billed Amount', '15');
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
            '15'
          )
          .text(
            adjusterComunication
              ? this.phoneNumberFormat(adjusterComunication.communicationValue)
              : 'Not Available',
            'Adjuster Phone',
            '15'
          )
          .text(
            supervisor && supervisor.fullName
              ? supervisor.fullName
              : 'Not Available',
            'Supervisor',
            '15'
          )
          .text(
            supervisorComunication
              ? this.phoneNumberFormat(
                supervisorComunication.communicationValue
              )
              : 'Not Available',
            'Supervisor Phone',
            '15'
          )
          .text(
            caseManager ? caseManager.fullName : 'Not Available',
            'Nurse Case Manager',
            '15'
          )
          .text(
            caseManagerComunication
              ? this.phoneNumberFormat(
                caseManagerComunication.communicationValue
              )
              : 'Not Available',
            'Nurse Case Manager Phone',
            '15'
          );
      })
      .build();
  }

  getAuthDetailHeaderActions(
    mode: PbmAuthFormMode,
    showReassignModalRef$: BehaviorSubject<boolean>,
    showViewLogModalRef$: BehaviorSubject<boolean>,
    decodedClaimNumber?: string,
    claimInfo?: ClaimV3,
    authorizationDetails?: AuthorizationDetails,
    formArray?: FormArray
  ) {
    return this.gCS
      .configureGrid()
      .flex({ justifyContent: 'end', gap: '4%' })
      .row((builder) => {
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
          if (authorizationDetails.showReassignButton) {
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
        } else {
          builder.button(
            {
              text: 'Return to Authorization Queue',
              buttonType: HealtheGridButtonType.Primary,
              action: () => {
                this.router.navigate(['/search-nav/paper-authorizations']);
              }
            },
            null
          );
          builder.button(
            {
              text: 'Copy Authorization to Clipboard',
              buttonType: HealtheGridButtonType.Primary,
              action: () => {
                this.copyToClipboardPBMAuth(
                  authorizationDetails,
                  decodedClaimNumber,
                  claimInfo,
                  formArray
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
    displayedLineItems?: AuthorizationLineItem[],
    formArray?: FormArray,
    userIsInternal: boolean = false
  ): ActionCardConfig[] {
    // TODO: If there is more than one type of paper authorization, this should be set in ngVerticeService when we have the endpoint
    // following the same POS pattern
    authorizationDetails.authorizationActionLabel = 'Action Paper Auth:';
    return authorizationDetails.authorizationLineItems.map((li, index) => {
      formArray.controls[index].get('action').addValidators(noPendActionToSubmitPaper);
      let actionCardConfig: ActionCardConfig = {
        actionFormConfig: {
          reviewLevelValue: li.slrDrugName,
          lomnActionDate: li.lomnActionDate,
          lomnAction: li.lomnAction,
          effectiveDateTo: li.dateFilled,
          maxDate:  moment(li.dateFilled).add(1, 'year').toDate(), // Max date
          compoundModalData: {
            dispenseFees: li.dispensingFee,
            ingredients: li.ingredients.map((ing) => {
              return {
                ndc: ing.ndc,
                drugName: ing.name,
                quantity: ing.quantity,
                createdDate: li.dateFilled,
                rejectReason:
                  li.reasons && li.reasons.length > 0
                    ? li.reasons[0]
                    : { description: '', ncpdpRejectCode: '' },
                canItOpenLookupModal: ing.validNdc
              };
            })
          },
          lomnSupported:
            authorizationDetails.authorizationDetailsHeader.lomnSupported,
          status: authorizationDetails.authorizationDetailsHeader
            .status as PbmStatus,
          claimMme: authorizationDetails.claimMme,
          permissibleActionsForCurrentUser: li.permissibleActionsForCurrentUser,
          actionMessageReplacement: li.message,
          showOneTimeOnlyMessage: true,
          lastDesicionNarrative: this.lineItemLastDecisionNarrative(li, false),
          drugDisplayName: {
            label: li.compound ? 'Compound' : li.drugItemName,
            class: li.compound ? 'compound-link' : 'drug-link',
            isCompound: li.compound,
            canItOpenLookupModal: li.compound || li.validNdc
          },
          slrMessage: (!userIsInternal && !li.twoLevelApproval && li.slrDrugName)
            ? li.slrDrugName
            : '',
          specialWorkflowMessage: li.twoLevelApproval && li.slrDrugName
            ? li.slrDrugName
            : '',
          approveButtons: {
            displayInitial: li.permissibleActionsForCurrentUser.some(a =>
              a.toLowerCase() === 'recommend'
            ),
            displayFinal: li.permissibleActionsForCurrentUser.some(a =>
              a.toLowerCase() === 'approve'
            )
          }
        },
        prescriberFormConfig: this.getPbmComponentConfigForPrescriberInfo(
          li,
          formArray.controls[index] as FormGroup
        ),
        authorizationId: authorizationDetails.authorizationId,
        authorizationType: authorizationDetails.authorizationType,
        mode: this.lineItemMode(li)
      };
      return actionCardConfig;
    });
  }

  getPbmComponentConfigForPrescriberInfo(
    lineItem: AuthorizationLineItem,
    formGroup?: FormGroup
  ) {
    return this.gCS
      .configureGrid({
        ...DEFAULT_GRID_COMPONENT_CONTAINER_CONFIG,
        noAvailableValueTag: true
      })
      .form(formGroup)
      .row((rowBuilder) => {
        rowBuilder
          .prescriber(
            {
              prescriberId: lineItem.prescriber.prescriberId,
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
          .text(lineItem.daysSupply, 'DAYS SUPPLY', '0');

        let billAmount: number = lineItem.totalAmount;
        if (!formGroup.get('amount')) {
          formGroup.addControl(
            'amount',
            new FormControl(billAmount, [
              Validators.required,
              maxBilledAmountValidation(lineItem.originalTotalAmount),
              Validators.min(0)
            ])
          );
        } else {
          if (formGroup.get('amount').value) {
            billAmount = formGroup.get('amount').value;
          }
        }

        if (lineItem.amountEditable) {
          formGroup.get('action').updateValueAndValidity();
          rowBuilder.input(
            {
              value: billAmount,
              type: 'number',
              formControlName: 'amount',
              id: 'totalAmount-input-' + lineItem.paperLineItemKey,
              validators: [
                Validators.required,
                maxBilledAmountValidation(lineItem.originalTotalAmount),
                Validators.min(0)
              ],
              errorMessages: new Map([
                ['required', 'Amount required'],
                ['min', 'Amount should be 0 or greater']
              ]),
              class: ['number-input-no-arrows']
            },
            'BILLED AMOUNT',
            '0',
            undefined,
            { width: '120px' }
          );
        } else {
          formGroup.get('amount').disable({ emitEvent: false });
          rowBuilder.money(lineItem.totalAmount, 'TOTAL BILLED AMT', '0');
        }
      })
      .row((rowBuilder) => {
        rowBuilder.html('<div class="spacersmall"></div>');
      })
      .row((rowBuilder) => {
        if (lineItem.validNdc) {
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
                      rejectCode: ing.rejectCode,
                      createdDate: lineItem.dateFilled,
                      rejectReason:
                        lineItem.reasons && lineItem.reasons.length > 0
                          ? lineItem.reasons[0]
                          : { description: '', ncpdpRejectCode: '' },
                      canItOpenLookupModal: ing.validNdc
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
          .text(lineItem.inFormulary ? 'Yes' : 'No', 'IN FORMULARY', '0',
            {
              position: 'label',
              tooltipMessage:
                'Drugs that are not in formulary will require review. For active claims, drugs that are in formulary may also require review if certain criteria are exceeded, such as days’ supply limits or quantity limits.'
            })
          .text(lineItem.deaClass, 'FEDERAL DEA CLASS', '0')
          .text('  ', '  ', '0')
          .text('  ', '  ', '0');
      })
      .row((rowBuilder) => {
        rowBuilder.html('<div class="spacersmall"></div>');
      })
      .build();
  }

  getAuthNotesConfig(
    mode: PbmAuthFormMode,
    authorizationDetails?: AuthorizationDetails,
    authorizationNotesFormControl?: FormControl
  ): PbmAuthNotesConfig {
    let notesValues = '';
    const maxCharCount: number = 1000;
    if (authorizationDetails && authorizationNotesFormControl) {
      if (
        authorizationDetails.authorizationNotes &&
        (authorizationDetails.authorizationNotes as any).length > 0
      ) {
        notesValues = authorizationDetails.authorizationNotes[0].comment;
      }
      authorizationNotesFormControl.setValue('' + notesValues);
      authorizationNotesFormControl.markAsTouched();
    }
    return {
      ...PBM_AUTH_NOTES_DEFAULT_STATE,
      noteTitle: 'Paper Bill Notes',
      confirmServiceName: 'Retro (Paper) Bill',
      inLineNotes: false,
      authorizationLevelNotes: true,
      historyNotes: false,
      isAnExpandableSection: false,
      autoExpandOnLoad: true,
      showCharCount: true,
      maxCharNumber: maxCharCount,
      avoidSubmitOriginalValue: true,
      orginalValue: notesValues,
      pendActionCondition: true,
      customErrorMessages: new Map<string, string>([
        [
          'maxlength',
          'Notes should have no more than '
            .concat(maxCharCount.toString())
            .concat(' characters.')
        ]
      ]),
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
    const footerActionForm: FormGroup = authFormGroup.get(
      'footerActionForm'
    ) as FormGroup;
    footerActionForm.addControl('action', new FormControl());
    footerActionForm.addControl(
      'primaryDenialReason',
      new FormControl(undefined, [Validators.required])
    );
    footerActionForm.addControl('secondaryDenialReason', new FormControl());
    footerActionForm.addControl('approvalPeriodType', new FormControl());
    footerActionForm.addControl('denialPeriodType', new FormControl());
    footerActionForm.addControl('actionPeriodDate', new FormControl());

    return {
      ...PBM_AUTH_FOOTER_DEFAULT_CONFIG,
      showErrors: true,
      pbmAuthformGroup: authFormGroup,
      authorizationType: PbmAuthorizationServiceType.PAPER,
      authorizationDetails: authorizationDetails,
      mode: mode
    } as PbmAuthFooterConfig;
  }

  getAuthSuccessSubmitModalConfig():PbmAuthSubmitSuccessModalConfig{
    const authSuccessSubmitModalConfig: PbmAuthSubmitSuccessModalConfig = {
      title: 'Submitted Successfully',
      bodyText: 'Retro (Paper) Authorization has been submitted successfully',
      buttonClass: ['primary-button'],
      returnToURL: '/search-nav/paper-authorizations',
      returnToLabel: 'RETURN TO ALL AUTHORIZATION QUEUE',
      remainLabel: 'REMAIN ON THE AUTHORIZATION',
      copyToClipboardLabel: 'COPY TO CLIPBOARD'
    };
    return authSuccessSubmitModalConfig;
  };

  copyToClipboardPBMAuth(
    detail: AuthorizationDetails,
    decodedClaimNumber: string,
    claimInfo: ClaimV3,
    formArray: FormArray
  ) {
    this.cscAdministrationService
      .getPharmacyData(this.pharmacyOpData.nabp)
      .pipe(first())
      .subscribe((pharmacy) =>
        this.copyToClipboardService.copy(
          getPaperAuthorizationCopyToClipboard(
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
      submitPaperAuthClaimReassignment({
        fromAuthorizationId: authorizationId,
        claimNumber: reassign.claimNumber
      })
    );
  }

  unlockAuthorization$(authorizationId: string ): void{
    this.store$.dispatch(
      unlockPaperRxAuthorization({ authorizationId: authorizationId })
    );

  }
}
