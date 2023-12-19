import * as _moment from 'moment';
import { Pharmacy } from '@shared/models/pharmacy';
import {
  AuthorizationDetails
} from '../../../store/models/pbm-authorization-information.model';
import { FormArray, FormGroup } from '@angular/forms';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { ActionOption } from '../../../store/models/action.option';
import { AuthorizationLineItem } from '../../../store/models/pbm-authorization-information/authorization-line-item.models';

const moment = _moment;

export function getPaperAuthorizationCopyToClipboard(
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

  // Status
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Status: '
      .concat(detail.authorizationDetailsHeader.status)
      .concat('</span><br>')
  );

  // Today's date
  wrapperDivHtml = wrapperDivHtml.concat(
    // tslint:disable-next-line: quotemark
    '<span>Today\'s date: '
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

  if (detail.authorizationDetailsHeader.dateLoaded) {
    // Date Loaded
    wrapperDivHtml = wrapperDivHtml.concat(
      // tslint:disable-next-line: quotemark
      '<span>Date loaded: '
        .concat(
          moment(detail.authorizationDetailsHeader.dateLoaded).format(
            'MM/DD/YYYY'
          )
        )
        .concat('</span><br>')
    );
  }

  // Date Modified
  if (detail.authorizationDetailsHeader.dateModified) {
    wrapperDivHtml = wrapperDivHtml.concat(
      // tslint:disable-next-line: quotemark
      '<span>Date modified: '
        .concat(
          moment(detail.authorizationDetailsHeader.dateModified).format(
            'MM/DD/YYYY'
          )
        )
        .concat('</span><br>')
    );
  }
  // Reconsideration
  wrapperDivHtml = wrapperDivHtml
    .concat(
      // tslint:disable-next-line: quotemark
      '<span>Reconsideration: '.concat(
        detail.authorizationDetailsHeader.reconsideration ? 'Yes' : 'No'
      )
    )
    .concat('</span><br>');

  // Attanchments
  wrapperDivHtml = wrapperDivHtml
    .concat(
      // tslint:disable-next-line: quotemark
      '<span>Attanchments: '.concat(
        detail.authorizationDetailsHeader.attachments ? 'Yes' : 'No'
      )
    )
    .concat('</span><br>');

  // Bill Level Rejection Reason
  wrapperDivHtml = wrapperDivHtml
    .concat(
      // tslint:disable-next-line: quotemark
      '<span>Bill Level Rejection Reason: '.concat(
        detail.authorizationDetailsHeader.billLevelRejectionReason
      )
    )
    .concat('</span><br>');

  // Bill Imagen Number
  wrapperDivHtml = wrapperDivHtml
    .concat(
      // tslint:disable-next-line: quotemark
      '<span>Bill Imagen Number: '.concat(
        detail.authorizationDetailsHeader.imageNumber
      )
    )
    .concat('</span><br>');

  // Payee Name
  wrapperDivHtml = wrapperDivHtml
    .concat(
      // tslint:disable-next-line: quotemark
      '<span>Payee Name: '.concat(
        detail.authorizationDetailsHeader.payee
          ? detail.authorizationDetailsHeader.payee.name
          : ''
      )
    )
    .concat('</span><br>');

  // Invoice Total
  wrapperDivHtml = wrapperDivHtml
    .concat(
      // tslint:disable-next-line: quotemark
      '<span>Invoice Total: '.concat(
        detail.authorizationDetailsHeader.invoiceTotal
      )
    )
    .concat('</span><br>');

  wrapperDivHtml = wrapperDivHtml.concat('<br /><span>Prescriptions</span>');

  detail.authorizationLineItems.forEach((li, index) => {
    wrapperDivHtml = wrapperDivHtml.concat('<br />');
    wrapperDivHtml = copyToClipboardLineItem(wrapperDivHtml, li, formArray.at(
      index
    ) as FormGroup);
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

  // NDC
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>NDC: '.concat(li.ndc).concat('</span><br>')
  );

  // NCPDP
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>NCPDP: '.concat(li.nabp).concat('</span><br>')
  );

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

  // Amount
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Amount: '
      .concat(li.totalAmount !== null ? li.totalAmount.toString() : '')
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
    switch (cardFormGroup.get('action').value) {
      case ActionOption.approve: {
        actionLbl = 'Authorized';
      }
        break;
      case ActionOption.deny: {
        actionLbl = 'Denied';
      }
        break;
      case ActionOption.pend: {
        actionLbl = 'Pended';
      }
        break;
      default: {
        actionLbl = 'Unknown';
      }
        break;
    }
    wrapperDivHtml = wrapperDivHtml.concat(
      '<span>Action: '.concat(actionLbl).concat('</span><br>')
    );
  }

  // Second Level Review Drug Name (if available)
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Second Level Review Drug Name: '
      .concat(li.slrDrugName)
      .concat('</span><br>')
  );

  // Second Level Review Status
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Second Level Review Status: '
      .concat(li.slrIndicator)
      .concat('</span><br>')
  );

  // Brand/Generic
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Brand/Generic: '.concat(li.brand).concat('</span><br>')
  );

  // Medication Detail
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Medication Detail: '.concat(li.drugDisplayName).concat('</span><br>')
  );

  // In Formulary
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>In Formulary: '
      .concat(li.inFormulary ? 'Yes' : 'No')
      .concat('</span><br>')
  );

  // Previous Decision
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Previous Decision: '
      .concat(li.previousDecision)
      .concat('</span><br>')
  );

  // Prev. Decision Date
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Previous Decision Date: '
      .concat(li.previousDecisionDate)
      .concat('</span><br>')
  );

  // Prev. Decision Message
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Previous Decision Message: '
      .concat(li.previousDecisionMessage)
      .concat('</span><br>')
  );

  // Prev. Decision Primary Reason Code
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Previous Decision Primary Reason Code: '
      .concat(li.previousDecisionPrimaryReasonCode)
      .concat('</span><br>')
  );

  // Prev. Decision Primary Reason Description
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Previous Decision Primary Reason Description: '
      .concat(li.previousDecisionPrimaryReasonDescription)
      .concat('</span><br>')
  );

  // Prev. Decision Secondary Reason Code
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Previous Decision Secondary Reason Code: '
      .concat(li.previousDecisionSecondaryReasonCode)
      .concat('</span><br>')
  );

  // Prev. Decision Secondary Reason Description
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Previous Decision Secondary Reason Description: '
      .concat(li.previousDecisionSecondaryReasonDescription)
      .concat('</span><br>')
  );
  // Prev. Request Qty.
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Prev. Request Qty.: '
      .concat(
        li.mostRecentQuantity !== null ? li.mostRecentQuantity.toString() : ''
      )
      .concat('</span><br>')
  );

  // Prev. Requested Days Supply
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Prev. Requested Days Supply: '
      .concat(
        li.mostRecentDaysSupply !== null
          ? li.mostRecentDaysSupply.toString()
          : ''
      )
      .concat('</span><br>')
  );

  // Est. Days Supply on Hand
  wrapperDivHtml = wrapperDivHtml.concat(
    '<span>Est. Days Supply on Hand: '
      .concat(
        li.estimatedDaysSupplyOnHand !== null
          ? li.estimatedDaysSupplyOnHand.toString()
          : ''
      )
      .concat('</span><br>')
  );

  // Alerts
  if (li.alerts && li.alerts.length > 0) {
    wrapperDivHtml = wrapperDivHtml.concat('<br><span>Alerts:</span><br>');
    li.alerts.forEach((alert) => {
      wrapperDivHtml = wrapperDivHtml.concat(
        '<span>'.concat(alert.name).concat('</span><br>')
      );
    });
  }

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
    li.notes.forEach((notes) => {
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
