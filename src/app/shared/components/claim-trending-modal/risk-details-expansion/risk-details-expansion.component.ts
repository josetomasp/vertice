import { Component, OnInit } from '@angular/core';
import { ClaimantInformation } from '@shared/store/models';
import {
  getRiskTrendingClaimantInformation,
  getRiskTrendingModalIsLoading
} from '@shared/store/selectors';
import { select, Store } from '@ngrx/store';
import { Observable, pairs } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { RootState } from '../../../../store/models/root.models';

@Component({
  selector: 'healthe-risk-details-expansion',
  templateUrl: './risk-details-expansion.component.html',
  styleUrls: ['./risk-details-expansion.component.scss']
})
export class RiskDetailsExpansionComponent implements OnInit {
  topFieldsLabelMap = {
    riskFactors: 'RISK FACTORS',
    riskLevel: 'RISK TREND',
    claimantName: 'CLAIMANT NAME',
    claimMME: 'CLAIM MME'
  };

  bottomFieldsLabelMap = {
    claimantAge: 'CLAIMANT AGE',
    dateOfBirth: 'DATE OF BIRTH',
    claimantSSN: 'SSN',
    address: 'ADDRESS',
    employerName: 'EMPLOYER'
  };

  isLoading$ = this.store$.pipe(select(getRiskTrendingModalIsLoading));

  claimantInformation$ = this.store$.pipe(
    select(getRiskTrendingClaimantInformation)
  );

  claimantInformationTopFields$: Observable<
    {
      label: string;
      value: any;
      key: string;
    }[]
  > = this.claimantInformation$.pipe(
    mergeMap((claimantInformation: ClaimantInformation) => {
      return pairs(this.topFieldsLabelMap).pipe(
        map(([key, label]: [string, any]) => {
          return { label, value: claimantInformation[key], key };
        }),
        toArray()
      );
    })
  );

  claimantInformationBottomFields$: Observable<
    {
      label: string;
      value: any;
      key: string;
    }[]
  > = this.claimantInformation$.pipe(
    mergeMap((claimantInformation: ClaimantInformation) => {
      return pairs(this.bottomFieldsLabelMap).pipe(
        map(([key, label]: [string, any]) => {
          return { label, value: claimantInformation[key], key };
        }),
        toArray()
      );
    })
  );

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {}
}
