import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  ActionType,
  RequestClaimV2Success
} from '@shared/store/actions/claim.actions';
import { ClaimIdentifier } from '@shared/store/models/claim.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetEligibilityInfo } from '../actions/eligibility-tab.actions';
import {
  EligibilityTabState,
  LabelValue
} from '../models/eligibility-tab.models';

@Injectable()
export class EligibilityTabEffects {
  processClaimV2ForEligibility: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_CLAIM_V2_SUCCESS),
      map(({ payload }: RequestClaimV2Success) => {
        const claimV2Data = payload;
        const eti: EligibilityTabState = {
          abmDates: [],
          pbmDates: [],
          claimDates: [],
          claimInfo: [],
          idInfo: []
        };

        // Claim Dates
        eti.claimDates.push({
          label: 'Date of injury',
          value: claimV2Data.injuryDate,
          elementName: 'dateOfInjury'
        });
        eti.claimDates.push({
          label: 'claim date reopen',
          value: claimV2Data.claimReopenDate,
          elementName: 'claimReopenDate'
        });
        eti.claimDates.push({
          label: 'date modified',
          value: claimV2Data.modifiedDateTime,
          elementName: 'claimDateModified'
        });
        eti.claimDates.push({
          label: 'date loaded',
          value: claimV2Data.createdDateTime,
          elementName: 'claimDateLoaded'
        });
        eti.claimDates.push({
          label: 'claim date close',
          value: claimV2Data.claimClosedDate,
          elementName: 'claimCloseDate'
        });
        eti.claimDates.push({
          label: 'Med Benefit Term',
          value: claimV2Data.medicalBenefitTerminationDate,
          elementName: 'medBenefitTermDate'
        });
        eti.claimDates.push({
          label: 'Policy Coverage Termed',
          value: claimV2Data.policyCoverageTerminationDate,
          elementName: 'policyCoverageTermDate'
        });
        eti.claimDates.push({
          label: 'Policy Effective Date',
          value: claimV2Data.policyCoverageEffectiveDate,
          elementName: 'policyCoverageEffectiveDate'
        });
        eti.claimDates.push({
          label: 'Settlement Date',
          value: claimV2Data.medicalSettlementDate,
          elementName: 'medSettlementDate'
        });
        eti.claimDates.push({
          label: 'Settlement Reason',
          value: claimV2Data.medicalSettlementType,
          elementName: 'medSettlementType'
        });
        eti.claimDates.push({
          label: 'Date of Death',
          value: claimV2Data.claimant.deathDate,
          elementName: 'claimantDOD'
        });

        let pbmClaimStatus = claimV2Data.claimStatuses.find(function(element) {
          return element.productType === 'PBM';
        });
        if (pbmClaimStatus) {
          eti.pbmDates.push({
            label: 'effective date',
            value: pbmClaimStatus.productTypeEffectiveDate
              ? pbmClaimStatus.productTypeEffectiveDate
              : '',
            elementName: 'pbmEffectiveDate'
          });
          eti.pbmDates.push({
            label: 'Terminated Date',
            value: pbmClaimStatus.productTypeTerminationDate,
            elementName: 'pbmTerminatedDate',
            editable: true
          });
          eti.pbmDates.push({
            label: 'Inactive Date',
            value: pbmClaimStatus.productTypeHesInactiveDate,
            elementName: 'pbmInactiveDate'
          });
        }

        let abmClaimStatus = claimV2Data.claimStatuses.find(function(element) {
          return element.productType === 'ABM';
        });
        if (abmClaimStatus) {
          eti.abmDates.push({
            label: 'effective date',
            value: abmClaimStatus.productTypeEffectiveDate
              ? abmClaimStatus.productTypeEffectiveDate
              : '',
            elementName: 'abmEffectiveDate'
          });
          eti.abmDates.push({
            label: 'Terminated Date',
            value: abmClaimStatus.productTypeTerminationDate,
            elementName: 'abmTerminatedDate',
            editable: true
          });
          eti.abmDates.push({
            label: 'Inactive Date',
            value: abmClaimStatus.productTypeHesInactiveDate,
            elementName: 'abmInactiveDate'
          });
        }

        // Claim ID
        this.putAltClaimIdentifierValue(
          eti.idInfo,
          'Agency claim no',
          'agencyClaimNo',
          claimV2Data.altClaimIdentifiers,
          'AGENCY_CLAIM_NUMBER'
        );
        eti.idInfo.push({
          label: 'HES Member id',
          value: claimV2Data.phiMemberId,
          elementName: 'phiMemberId'
        });
        eti.idInfo.push({
          label: 'office code',
          value: claimV2Data.customer.officeCode,
          elementName: 'officeCode'
        });
        this.putAltClaimIdentifierValue(
          eti.idInfo,
          'acquisitions claim no',
          'acquisitionClaimNo',
          claimV2Data.altClaimIdentifiers,
          'ACQUISITION_CLAIM_NUMBER'
        );
        eti.idInfo.push({
          label: 'account id',
          value: claimV2Data.customer.accountCode,
          elementName: 'accountID'
        });
        eti.idInfo.push({
          label: 'Group ID',
          value: claimV2Data.customer.groupCode,
          elementName: 'groupID'
        });
        eti.idInfo.push({
          label: 'Insurer Code',
          value: claimV2Data.insurer.insurerCode,
          elementName: 'insurerCode'
        });
        eti.idInfo.push({
          label: 'Insurer FEIN',
          value: claimV2Data.insurer.orgFEIN,
          elementName: 'insurerFEIN'
        });
        eti.idInfo.push({
          label: 'Policy Number Identifier',
          value: claimV2Data.policyNumberIdentifier,
          elementName: 'policyNumberID'
        });
        eti.idInfo.push({
          label: 'TPA CODE',
          value: claimV2Data.tpa.tpaCode,
          elementName: 'tpaCode'
        });
        eti.idInfo.push({
          label: 'TPA FEIN',
          value: claimV2Data.tpa.orgFEIN,
          elementName: 'tpaFEIN'
        });

        // Claim Info
        eti.claimInfo.push({
          label: 'Long term care',
          value: this.booleanToString(claimV2Data.longTermCareFlag),
          elementName: 'longTermCare'
        });
        eti.claimInfo.push({
          label: 'Locked Claim',
          value: this.booleanYTest(claimV2Data.lockedClaimIndicator),
          elementName: 'lockedClaim'
        });
        eti.claimInfo.push({
          label: 'Coverage',
          value: this.booleanYTest(claimV2Data.coverageIndicator),
          elementName: 'paymentCoverageIndicator'
        });
        eti.claimInfo.push({
          label: 'Controverted',
          value: this.booleanYTest(claimV2Data.controvertedClaimIndicator),
          elementName: 'controverted'
        });
        eti.claimInfo.push({
          label: 'Payment Coverage',
          value: claimV2Data.coveragePaymentType,
          elementName: 'paymentCoverage'
        });
        eti.claimInfo.push({
          label: 'Maintenance only',
          value: this.booleanYTest(claimV2Data.maintenanceOnlyIndicator),
          elementName: 'maintenanceOnly'
        });
        eti.claimInfo.push({
          label: 'File Status',
          value: claimV2Data.customerProvidedFileStatus,
          elementName: 'fileStatus'
        });
        eti.claimInfo.push({
          label: 'Loss Designator',
          value: claimV2Data.claimLossDesignation,
          elementName: 'lossDesignator'
        });
        return new SetEligibilityInfo(eti);
      })
    )
  );

  constructor(public actions$: Actions) {}

  putAltClaimIdentifierValue(
    dataArray: LabelValue[],
    lbl: string,
    elementName: string,
    identList: ClaimIdentifier[],
    idType: string
  ) {
    identList.forEach((item) => {
      if (item.identifierType === idType) {
        dataArray.push({
          label: lbl,
          value: item.identifierValue,
          elementName: elementName
        });
      }
    });
  }

  booleanYTest(value: string) {
    if (null == value) {
      return this.booleanToString(null);
    } else {
      return this.booleanToString(value === 'Y');
    }
  }

  booleanToString(value: boolean): string {
    if (null == value) {
      return '';
    }

    if (true === value) {
      return 'Yes';
    }

    return 'No';
  }
}
