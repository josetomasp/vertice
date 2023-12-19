import {
  ActionCardConfig,
  AuthorizationDetails,
  AuthorizationDetailsHeader,
  PbmAuthFooterConfig,
  PbmAuthFormMode,
  PbmAuthNotesConfig,
  PbmPharmacyInformationForm,
  PbmReassignNewClaim,
  ApprovalPeriodType,
  DenialPeriodType,
  PbmAuthSubmitSuccessModalConfig
} from '../../store/models/pbm-authorization-information.model';
import { Observable, Subject } from 'rxjs';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { HealtheComponentConfig } from '@modules/healthe-grid';
import { Store } from '@ngrx/store';
import { RootState } from '../../../../../store/models/root.models';
import { ActionOption } from '../../store/models/action.option';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import {
  AuthorizationLineItem,
  AuthorizationLineItemPrescriber
} from '../../store/models/pbm-authorization-information/authorization-line-item.models';
const moment = _moment;

export abstract class PbmAuthorizationInformationBaseConfig {
  public store$: Store<RootState>;
  public datePipe: DatePipe;

  abstract getAuthorizationLevelAccessMode(
    authorizationDetails: AuthorizationDetails,
    userIsInternal: boolean
  ): PbmAuthFormMode;

  abstract getAuthSectionTitle(mode: PbmAuthFormMode);

  abstract getServiceName(): string;

  abstract getAuthDetailInsetCardConfig(
    authorizationDetailsHeader: AuthorizationDetailsHeader,
    pharmacyInformation?: PbmPharmacyInformationForm,
    claim?: ClaimV3,
    formGroup?: FormGroup,
    userIsInternal?: boolean,
    patientWaiting?: boolean
  ): HealtheComponentConfig;

  abstract getAuthDetailHeaderActions(
    mode: PbmAuthFormMode,
    showReassignModalRef$: Subject<boolean>,
    showViewLogModalRef$: Subject<boolean>,
    decodedClaimNumber?: string,
    claimInfo?: ClaimV3,
    authorizationDetails?: AuthorizationDetails,
    formArray?: FormArray,
    userIsInternal?: boolean
  ): HealtheComponentConfig;

  abstract getLineItemsActionCards(
    authorizationDetails: AuthorizationDetails,
    displayedLineItems?: AuthorizationLineItem[],
    formArray?: FormArray,
    userIsInternal?: boolean
  ): ActionCardConfig[];

  abstract getPbmComponentConfigForPrescriberInfo(
    lineItem: AuthorizationLineItem,
    formGroup?: FormGroup
  ): HealtheComponentConfig;

  abstract getAuthNotesConfig(
    mode: PbmAuthFormMode,
    authorizationDetails?: AuthorizationDetails,
    authorizationNotesFormControl?: FormControl
  ): PbmAuthNotesConfig;

  abstract getAuthFooterConfig(
    mode: PbmAuthFormMode,
    showRequestedCallbackFields: boolean,
    callerFormGroup?: FormGroup,
    authorizationDetails?: AuthorizationDetails,
    authFormGroup?: FormGroup
  ): PbmAuthFooterConfig;

  abstract copyToClipboardPBMAuth(
    detail: AuthorizationDetails,
    decodedClaimNumber: string,
    claimInfo: ClaimV3,
    formArray: FormArray,
    pharmacyNabp: string
  ): void;

  abstract reassignClaim(
    authorizationId: number,
    reassign: PbmReassignNewClaim
  ): void;

  abstract getAuthSuccessSubmitModalConfig():PbmAuthSubmitSuccessModalConfig;

  abstract unlockAuthorization$(authorizationId: string): void;

  getAuthorizationPrescriberName(
    prescriber: AuthorizationLineItemPrescriber
  ): string {
    let prescriberName = '';
    if (prescriber) {
      if (prescriber.name) {
        prescriberName += prescriber.name + ' ';
      }
      if (prescriber.lastName) {
        prescriberName += prescriber.lastName;
      }
      if (prescriber.credential) {
        prescriberName = prescriberName.trim() + ', ' + prescriber.credential;
      }
    }
    return prescriberName.trim();
  }

  lineItemMode(lineItem: AuthorizationLineItem): PbmAuthFormMode {
    // return PbmAuthFormMode.ReadOnly;
    let mode;
    if (lineItem && lineItem.permissibleActionsForCurrentUser) {
      const actions = [...lineItem.permissibleActionsForCurrentUser];
      const completeIndex = actions.indexOf('COMPLETE');
      if (completeIndex > -1) {
        actions.splice(completeIndex, 1);
      }
      mode =
        actions.length > 0
          ? PbmAuthFormMode.ReadWrite
          : PbmAuthFormMode.ReadOnly;
    } else {
      mode = PbmAuthFormMode.ReadOnly;
    }
    return mode;
  }

  lineItemLastDecisionNarrative(lineItem: AuthorizationLineItem, needsPeriodTime:boolean): string {
    let lastDecisionNarrative = '';
    let periodType;
    // Defining action and period Type
    if (
      lineItem.lastDecisionAction &&
      lineItem.lastDecisionAction !== ActionOption.pend
    ) {
      if (
        lineItem.lastDecisionAction === ActionOption.approve ||
        lineItem.lastDecisionAction === ActionOption.recommendApprove
      ) {
        lastDecisionNarrative = `${
          lineItem.lastDecisionAction === ActionOption.approve
            ? 'Approved'
            : 'Approval Recommended'
        }`;
        if (lineItem.lastDecisionPeriod === 0) {
          periodType = ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_ONE_TIME;
        } else if (lineItem.lastDecisionPeriod != null) {
          periodType = ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_DATE;
        }
      } else if (lineItem.lastDecisionAction === ActionOption.deny || lineItem.lastDecisionAction === ActionOption.denyOneTime) {
        lastDecisionNarrative = `Denied`;
        if (lineItem.lastDecisionPeriod === 0) {
          periodType = DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_ONE_TIME;
        } else if (lineItem.lastDecisionPeriod > 0) {
          periodType = DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_DATE;
        }
      } else if (
        lineItem.lastDecisionAction === ActionOption.denyIndefinitely
      ) {
        lastDecisionNarrative = `Denied <b>indefinitely</b>`;

        periodType = DenialPeriodType.AUTH_INFO_DENIAL_INDEFINITELY;
      }
      // Specify when the action was made
      lastDecisionNarrative += ` on <b>${
        lineItem.lastDecisionDateTime
          ? lineItem.lastDecisionDateTime
          : this.datePipe.transform(new Date(), 'MM/dd/yyyy')
      }</b>`;

      // Specify the period type and dates
      if(needsPeriodTime){
        if (
          periodType === ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_ONE_TIME ||
          periodType === DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_ONE_TIME
        ) {
          lastDecisionNarrative += ` for <b>One-Time</b>`;
        } else if (
          periodType === ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_DATE ||
          periodType === DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_DATE
        ) {
          let actionPeriod = lineItem.lastDecisionPeriod
            ? moment(lineItem.lastDecisionDateTime)
                .add(
                  lineItem.lastDecisionPeriod ? lineItem.lastDecisionPeriod : 0,
                  'days'
                )
                .toString()
            : lineItem.lastDecisionPeriod;
          lastDecisionNarrative += ` until
          <b>${
            actionPeriod
              ? this.datePipe.transform(actionPeriod, 'MM/dd/yyyy')
              : ''
          }</b>`;
        }
      }
      // Specify who made the action
      if (lineItem.lastDecisionUser) {
        lastDecisionNarrative += ` by <b>${lineItem.lastDecisionUser}</b>`;
      }
    }
    return lastDecisionNarrative;
  }

  phoneNumberFormat(phone: string): string {
    phone = phone ? phone.replace(/\D/g, '') : phone;
    let formattedNumber: string = '';
    if (phone) {
      formattedNumber =
        ('(' + phone).slice(0, 4) +
        ') ' +
        phone.slice(3, 6) +
        '-' +
        phone.slice(6);
    }
    return formattedNumber;
  }


}
