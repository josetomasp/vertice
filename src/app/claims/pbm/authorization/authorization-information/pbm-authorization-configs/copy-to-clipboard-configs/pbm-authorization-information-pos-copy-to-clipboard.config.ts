import * as _moment from 'moment';
import { Pharmacy } from '@shared/models/pharmacy';
import {
  ApprovalPeriodType,
  AuthorizationDetails,
  DenialPeriodType
} from '../../../store/models/pbm-authorization-information.model';
import { FormArray, FormGroup } from '@angular/forms';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { ActionOption } from '../../../store/models/action.option';
import { AuthorizationLineItem } from '../../../store/models/pbm-authorization-information/authorization-line-item.models';

const moment = _moment;

export function getPOSAuthorizationCopyToClipboard(
  pharmacy: Pharmacy,
  detail: AuthorizationDetails,
  decodedClaimNumber: string,
  claimInfo: ClaimV3,
  formArray: FormArray
): HTMLDivElement {
  let wrapperDiv: HTMLDivElement = document.createElement('div');
  let wrapperDivHtml: string = '';

  // Claim Number
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Claim Number: '.concat(decodedClaimNumber).concat('</span><br>')
  );

  // Today's date
  wrapperDivHtml = wrapperDivHtml.concat(
    // tslint:disable-next-line: quotemark
    "<span>Today's date: "
      .concat(moment(new Date()).format('MM/DD/YYYY'))
      .concat('</span><br>')
  );

  // Member ID - pharmacy member id
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Pharmacy Member Id: '
      .concat(claimInfo.phiMemberId)
      .concat('</span><br>')
  );

  // Orig. Member ID - being added by EASy
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Orig. Member ID: '
      .concat(detail.authorizationReassignedIndicator.phiMemberId)
      .concat('</span><br>')
  );

  // Pharmacy Name
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Pharmacy Name: '.concat(pharmacy.name).concat('</span><br>')
  );

  // Pharmacy Phone
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Pharmacy Phone: '.concat(pharmacy.phoneNumber).concat('</span><br>')
  );

  // Claimant Name
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Claimant Name: '
      .concat(claimInfo.claimant.fullName)
      .concat('</span><br>')
  );

  // Benefit State
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Benefit State: '.concat(claimInfo.stateOfVenue).concat('</span><br>')
  );

  // Date of Injury
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Date of Injury: '.concat(claimInfo.injuryDate).concat('</span><br>')
  );

  // Caller Name
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Caller Name: '
      .concat(
        detail.pharmacyInformationForm.callerName
          ? detail.pharmacyInformationForm.callerName
          : ''
      )
      .concat('</span><br>')
  );

  wrapperDivHtml = wrapperDivHtml.concat('<br /><span>Prescriptions</span>');

  detail.authorizationLineItems.forEach((li, index) => {
    wrapperDivHtml = wrapperDivHtml.concat('<br />');
    wrapperDivHtml = copyToClipboardLineItem(
      wrapperDivHtml,
      li,
      formArray.at(index) as FormGroup
    );
  });

  wrapperDiv.innerHTML = wrapperDivHtml;
  return wrapperDiv;
}

function copyToClipboardLineItem(
  wrapperDivHtml: string,
  li: AuthorizationLineItem,
  cardFormGroup: FormGroup
): string {
  wrapperDivHtml = wrapperDivHtml.concat('<br>');


  // Date of Service
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Date of Service: '.concat(li.dateFilled).concat('</span><br>')
  );

  // DEA License
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>DEA License: '.concat(li.prescriber.deaLicense).concat('</span><br>')
  );

  // Drug Name
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Drug Name: '.concat(li.drugItemName).concat('</span><br>')
  );

  // DEA Drug Class
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>DEA Drug Class: '.concat(li.deaClass).concat('</span><br>')
  );

  // Quantity
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Quantity: '
      .concat(li.quantity !== null ? li.quantity.toString() : '')
      .concat('</span><br>')
  );

  // Prescriber Name
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Prescriber Name: '
      .concat(li.prescriber.name.concat(' ').concat(li.prescriber.lastName))
      .concat('</span><br>')
  );

  // Total AWP
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Total AWP: '
      .concat(li.totalAwp !== null ? li.totalAwp.toString() : '')
      .concat('</span><br>')
  );

  // Days Supply
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Days Supply: '
      .concat(li.daysSupply !== null ? li.daysSupply.toString() : '')
      .concat('</span><br>')
  );

  // Prescriber Phone
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Prescriber Phone: '
      .concat(li.prescriber.primaryPhone)
      .concat('</span><br>')
  );

  // Effective To
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Effective To: '
      .concat(
        cardFormGroup.get('actionPeriodDate') &&
          cardFormGroup.get('actionPeriodDate').value
          ? moment(cardFormGroup.get('actionPeriodDate').value).format(
              'MM/DD/YYYY'
            )
          : ''
      )
      .concat('</span><br>')
  );

  // TODO: Mapping
  // Rejected Reason

  // Action
  if (cardFormGroup.get('action')) {
    let actionLbl = '';
    let actionPostFix = '';
    let lastDecisionDate = li.lastDecisionDateTime
      ? li.lastDecisionDateTime
      : moment(new Date()).format('MM/DD/YYYY');

    switch (cardFormGroup.get('action').value) {
      case ActionOption.approve:
        actionLbl = 'Approved';
      // tslint:disable-next-line:no-switch-case-fall-through
      case ActionOption.recommendApprove:
        {
          if (''.equalsIgnoreCase(actionLbl)) {
            actionLbl = 'Recommend Approve';
          }
          switch (cardFormGroup.get('approvalPeriodType').value) {
            default:
              break;

            case ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_DATE:
              actionPostFix =
                ' on ' +
                lastDecisionDate +
                ' until ' +
                moment(cardFormGroup.get('actionPeriodDate').value).format(
                  'MM/DD/YYYY'
                );
              break;

            case ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_ONE_TIME:
              actionPostFix = ' on ' + lastDecisionDate + ' for One-Time';
              break;
          }
        }
        break;
      case ActionOption.deny:
      case ActionOption.denyIndefinitely:
        {
          actionLbl = 'Denied';
          switch (cardFormGroup.get('denialPeriodType').value) {
            default:
              break;
            case DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_DATE:
              actionPostFix =
                '  on ' +
                lastDecisionDate +
                ' until ' +
                moment(cardFormGroup.get('actionPeriodDate').value).format(
                  'MM/DD/YYYY'
                );
              break;
            case DenialPeriodType.AUTH_INFO_DENIAL_INDEFINITELY:
              actionPostFix = ' indefinitely on ' + lastDecisionDate;
              break;
            case DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_ONE_TIME:
              actionPostFix = ' on ' + lastDecisionDate + ' for One-Time';
              break;
          }
        }
        break;
      case ActionOption.pend:
        {
          actionLbl = 'Pended';
        }
        break;
    }

    wrapperDivHtml = wrapperDivHtml.concat(
      '<span>Action: '.concat(actionLbl + actionPostFix).concat('</span><br>')
    );
  }


  // Brand/Generic
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Brand/Generic: '.concat(li.brand).concat('</span><br>')
  );


  // Reasons for Review
  if (li.reasons && li.reasons.length > 0) {
    wrapperDivHtml = wrapperDivHtml.concat(
      '<br><span>Reasons for Review:</span><br>'
    );
    li.reasons.forEach((reason) => {
      wrapperDivHtml = wrapperDivHtml.concat(
        '<span>'.concat(reason.description).concat('</span><br>')
      );
    });
  }

  // Comments
  if (li.notes && li.notes.length > 0) {
    wrapperDivHtml = wrapperDivHtml.concat('<br><span>Comments:</span><br>');
    li.notes.filter(x =>x.userRole != 'HES'  && x.userRole != 'SYSTEM').forEach((notes) => {
      wrapperDivHtml = wrapperDivHtml.concat(
        '<br><span>'
          .concat(notes.userId)
          .concat(' - ')
          .concat(notes.dateTimeCreated)
          .concat('</span><br>')
      );
      if (notes.comment) {
        wrapperDivHtml = wrapperDivHtml.concat(
          '<span>'.concat(notes.comment).concat('</span><br>')
        );
      }
    });
  }

  return wrapperDivHtml;
}
