import { Component, OnInit } from '@angular/core';
import { faCheck } from '@fortawesome/pro-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { getClaimV3 } from '@shared/store/selectors/claim.selectors';
import { isEqual } from 'lodash';
import { Observable, zip } from 'rxjs';
import { distinctUntilChanged, first, map } from 'rxjs/operators';
import { RootState } from '../../../../../../../store/models/root.models';
import {
  getAuthorizationArchetype,
  getDecodedClaimNumber,
  getDecodedReferralId
} from '../../../../../../../store/selectors/router.selectors';
import {
  AuthorizationChangeSummary,
  AuthorizationUnderReview,
  FusionAuthorization,
  NoteList
} from '../../../../store/models/fusion/fusion-authorizations.models';
import {
  getFusionSubmittedAuthorizationState,
  getFusionSubmittedNoteList,
  isFusionAuthorizationRush
} from '../../../../store/selectors/fusion/fusion-authorization.selectors';
import {
  ReferralAuthorizationArchetype
} from '../../referral-authorization.models';
import { FusionAuthorizationService } from '../fusion-authorization.service';
import {
  CopyToClipboardService
} from '@shared/service/copy-to-clipboard.service';
import { Router } from '@angular/router';

function getApprovedAmount(
  authorizationUnderReview: AuthorizationUnderReview,
  authorizationChangeSummary: AuthorizationChangeSummary[]
): number {
  return authorizationChangeSummary.reduce<number>((accum, currentValue) => {
    if (currentValue.changeType === 'OPEN_AUTHORIZATION_DATE_CHANGE') {
      return currentValue.previousQuantityApproved;
    } else if (
      currentValue.changeType === 'OPEN_AUTHORIZATION_QUANTITY_CHANGE'
    ) {
      return currentValue.newTotalQuantityApproved;
    } else if (currentValue.changeType === 'NEW_OPEN_AUTHORIZATION') {
      return authorizationUnderReview.quantity;
    }

    return accum;
  }, null);
}

function getQuantityUsed(
  authorizationUnderReview: AuthorizationUnderReview,
  authorizationChangeSummary: AuthorizationChangeSummary[]
) {
  let quantityUsed = 0;
  for (let i = 0; i < authorizationChangeSummary.length; i++) {
    const changeSummary = authorizationChangeSummary[i];
    if (changeSummary.changeType === 'OPEN_AUTHORIZATION_QUANTITY_CHANGE') {
      quantityUsed = changeSummary.quantityCompleted;
      break;
    } else if (changeSummary.changeType === 'OPEN_AUTHORIZATION_DATE_CHANGE') {
      quantityUsed = changeSummary.quantityCompleted;
      break;
    } else if (changeSummary.changeType === 'NEW_OPEN_AUTHORIZATION') {
      quantityUsed = 0;
    }
  }
  return quantityUsed;
}

@Component({
  selector: 'healthe-submitted-authorization',
  templateUrl: './authorization-post-submit.component.html',
  styleUrls: ['./authorization-post-submit.component.scss']
})
export class AuthorizationPostSubmitComponent implements OnInit {
  referralAuthorizationArchetype = ReferralAuthorizationArchetype;
  referralArchetype$ = this.store$.pipe(select(getAuthorizationArchetype));
  archetypeTitle$ = this.referralArchetype$.pipe(
    map((type) => {
      switch (type) {
        case this.referralAuthorizationArchetype.Language:
          return 'Language';
        case this.referralAuthorizationArchetype.Diagnostics:
          return 'Diagnostics';
        case this.referralAuthorizationArchetype.PhysicalMedicine:
          return 'Physical Medicine';
        case this.referralAuthorizationArchetype.HomeHealth:
          return 'Home Health';
        case this.referralAuthorizationArchetype.Dme:
          return 'DME';
      }
    })
  );
  faCheck = faCheck;
  fusionSubmittedReferralAuthorizations$: Observable<
    FusionAuthorization[]
  > = this.store$.pipe(
    select(getFusionSubmittedAuthorizationState),
    distinctUntilChanged(isEqual)
  );
  fusionSubmittedAuthTableRows$: Observable<
    string[]
  > = this.fusionSubmittedReferralAuthorizations$.pipe(
    first(),
    map((authorizationData) => {
      return authorizationData.map(
        ({
          authorizationUnderReview,
          authorizationChangeSummary,
          action,
          reasonsReviewNeeded,
          narrativeTextList
        }) => {
          let newTotalApproved = getApprovedAmount(
            authorizationUnderReview,
            authorizationChangeSummary
          );
          let quantityUsed = getQuantityUsed(
            authorizationUnderReview,
            authorizationChangeSummary
          );

          return `<tr><td>${
            authorizationUnderReview.categoryDesc
          }</td><td>${authorizationUnderReview.startDate +
            (authorizationUnderReview.endDate
              ? ' - ' + authorizationUnderReview.endDate
              : '')}</td><td>${action}</td><td>${reasonsReviewNeeded.join(
            ','
          )}</td>
            <td>${narrativeTextList[0].quantityDescriptor}</td>
            <td>${quantityUsed}</td>
            <td>${newTotalApproved}</td>
<td>${authorizationUnderReview.noteList
            .map(
              (note) =>
                `Created By: ${note.createdBy}, Description: ${
                  note.description
                }`
            )
            .join('')}</td></tr>`;
        }
      );
    })
  );
  claimNumber$ = this.store$.pipe(select(getDecodedClaimNumber));
  referralId$ = this.store$.pipe(select(getDecodedReferralId));
  claimantData$ = this.store$.pipe(
    select(getClaimV3),
    map((claimV2) => ({
      claimantName: claimV2.claimant.fullName,
      injuryDate: claimV2.injuryDate
    }))
  );
  isFusionAuthorizationRush$: Observable<boolean> = this.store$.pipe(
    select(isFusionAuthorizationRush)
  );
  fusionAuthorizationNotes$: Observable<NoteList[]> = this.store$.pipe(
    select(getFusionSubmittedNoteList)
  );

  constructor(
    public store$: Store<RootState>,
    public fusionAuthorizationService: FusionAuthorizationService,
    public copyToClipboardService: CopyToClipboardService,
    public router: Router
  ) {}

  ngOnInit() {}

  openDocumentsModal() {
    this.fusionAuthorizationService.displayViewDocumentsModal();
  }

  copyAuthData(
    headerData: {
      referralId: string;
      claimNumber: string;
      claimantName: string;
      injuryDate: string;
      service: string;
      notes: string;
    },
    tableRows: string
  ) {
    let selectDiv = document.createElement('div');
    let headerValues = document.createElement('div');

    headerValues.innerHTML = `<b>Claim Number: </b> ${headerData.claimNumber}<br>
<b>Claimant: </b> ${headerData.claimantName}<br>
<b>Injury Date: </b> ${headerData.injuryDate}<br>
<b>Service: </b> ${headerData.service} <br>
<b>Referral ID: </b> ${headerData.referralId} <br>
<b>Notes:</b> <pre>${headerData.notes}</pre>`;
    let table = document.createElement('table');
    table.innerHTML = `<thead><th>Item Description</th> <th>Service Date</th><th>Action</th><th>Reason(s) For Review</th><th>Quantity Descriptor</th><th>Quantity Used</th><th>Total Quantity Approved</th><th>Notes</th></thead>
<tbody>${tableRows}</tbody>`;
    selectDiv.appendChild(headerValues);
    selectDiv.appendChild(table);
    this.copyToClipboardService.copy(selectDiv, document);
  }

  copyToClipboard() {
    zip(
      this.archetypeTitle$,
      this.referralId$,
      this.claimNumber$,
      this.claimantData$,
      this.fusionSubmittedAuthTableRows$,
      this.fusionAuthorizationNotes$
    ).subscribe(
      ([
        service,
        referralId,
        claimNumber,
        { claimantName, injuryDate },
        rows,
        notes
      ]) => {
        this.copyAuthData(
          {
            service,
            referralId,
            claimNumber,
            claimantName,
            injuryDate,
            notes: notes
              .map(
                (note) =>
                  `Created By: ${note.createdBy}, Description: ${
                    note.description
                  }`
              )
              .join('\n')
          },
          rows.join('\n')
        );
      }
    );
  }

  goToAuthorizationQueue() {
    this.router.navigate(['referrals', 'authorizations']);
  }
}
