import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  ActionType,
  RequestClaimV2Success
} from '@shared/store/actions/claim.actions';
import { ClaimBannerField, ClaimV3 } from '@shared/store/models/claim.models';
import * as _ from 'lodash';
import { from, Observable } from 'rxjs';
import { map, mergeMap, tap, toArray } from 'rxjs/operators';
import { VerbiageService } from '../../../../../verbiage.service';
import { ReferralService } from '../../referral.service';
import { SetClaimOverviewBarFields } from '../actions/referral.actions';

@Injectable()
export class ReferralEffects {
  claimBannerDefaults: Array<ClaimBannerField> = [
    { name: 'claimant.fullName', width: 1, elementName: 'claimantName' },
    { name: 'injuryDate', width: 1, elementName: 'injuryDate' },
    { name: 'injuryDescription', width: 1, elementName: 'injuryDescription' },
    { name: 'employer.name', width: 1, elementName: 'employerName' },
    { name: 'stateOfVenue', width: 1, elementName: 'stateOfVenue' },
    { name: 'claimant.birthDate', width: 1, elementName: 'claimantDOB' },
    { name: 'claimant.ssn', width: 1, elementName: 'claimantSSN' },
    { name: 'claimReopenDate', width: 1, elementName: 'claimReopenDate' },
    { name: 'claimClosedDate', width: 1, elementName: 'claimCloseDate' },
    { name: 'phiMemberId', width: 1, elementName: 'phiMemberId' },
    { name: 'attorney.fullName', width: 1, elementName: 'attorneyRep' },
    {
      name: 'longTermCareFlag',
      width: 1,
      type: 'RADIO',
      elementName: 'longTermCare',
      editable: true
    },
    { name: 'accidentDescription', width: 4, elementName: 'accident' },
    {
      name: 'apportionment',
      width: 6,
      type: 'APPORTIONMENT',
      elementName: 'apportionment',
      editable: true
    },
    { name: 'customer.officeCode', width: 1, elementName: 'officeCode' },
    { name: 'medicalSettlementDate', width: 1, elementName: 'settlementDate' }
  ];

  processClaimantOverviewBar$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_CLAIM_V2_SUCCESS),
      mergeMap(({ payload }: RequestClaimV2Success) =>
        from(this.claimBannerDefaults).pipe(
          tap(
            (field) => (field.value = this.setFieldValue(payload, field.name))
          ),
          tap(
            (field) => (field.label = this.verbiageService.getLabel(field.name))
          ),
          toArray(),
          map((result) => new SetClaimOverviewBarFields(result))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private referralService: ReferralService,
    private verbiageService: VerbiageService
  ) {}

  setFieldValue(claim: ClaimV3, name: string): any {
    if (name === 'apportionment') {
      return {
        apportionmentPercent: _.get(claim, 'apportionmentPercent'),
        claimantPercent: _.get(claim, 'claimantPercent'),
        otherApportionmentPercent: _.get(claim, 'otherApportionmentPercent'),
        otherApportionmentDescription: _.get(
          claim,
          'otherApportionmentDescription'
        ),
        apportionmentFlag: _.get(claim, 'apportionmentFlag')
      };
    }

    return _.get(claim, name);
  }
}
