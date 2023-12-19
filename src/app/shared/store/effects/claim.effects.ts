import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { firstArrayElement } from '@shared/lib';
import { ClaimV3Service } from '@shared/service/claim-v3.service';
import {
  ActionType,
  RequestClaimV2,
  RequestClaimV2Fail,
  RequestClaimV2Success,
  SetClaimBannerFields
} from '@shared/store/actions/claim.actions';
import {
  ClaimBannerField,
  claimV2InitialState,
  ClaimV3
} from '@shared/store/models/claim.models';
import * as _ from 'lodash';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { VerbiageService } from '../../../verbiage.service';

@Injectable({ providedIn: 'root' })
export class ClaimEffects {
  requestClaimV2$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_CLAIM_V2),
      mergeMap(({ payload }: RequestClaimV2) =>
        this.claimV2Service.getClaimV3(payload).pipe(
          catchError((err) => of(new RequestClaimV2Fail(err))),
          firstArrayElement(),
          map((claim: ClaimV3) => new RequestClaimV2Success(claim))
        )
      )
    )
  );

  resetClaimantOverviewBar$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_CLAIM_V2),
      mergeMap(({ payload }: RequestClaimV2) =>
        this.transformClaimToBannerFileds(
          new RequestClaimV2Success(claimV2InitialState as ClaimV3),
          true
        )
      )
    )
  );

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

  constructor(
    public actions$: Actions,
    public claimV2Service: ClaimV3Service,
    public verbiageService: VerbiageService
  ) {}

  processClaimantOverviewBar$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_CLAIM_V2_SUCCESS),
      mergeMap(({ payload }: RequestClaimV2Success) =>
        this.transformClaimToBannerFileds(
          {
            payload
          } as RequestClaimV2Success,
          false
        )
      )
    )
  );

  transformClaimToBannerFileds(
    { payload }: RequestClaimV2Success,
    loadingBanner: boolean
  ) {
    return of(this.claimBannerDefaults).pipe(
      map((fields) =>
        fields.map((field) => ({
          ...field,
          value: this.setFieldValue(payload, field.name),
          label: this.verbiageService.getLabel(field.name)
        }))
      ),
      map((result) => new SetClaimBannerFields(result, loadingBanner))
    );
  }

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
