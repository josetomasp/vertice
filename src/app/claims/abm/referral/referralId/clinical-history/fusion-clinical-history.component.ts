import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { first, map } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { RootState } from '../../../../../store/models/root.models';
import {
  getAuthorizationArchetype,
  getDecodedReferralId,
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../store/selectors/router.selectors';
import { PHYSICALMEDICINE_STEP_DEFINITIONS } from '../../make-a-referral/physical-medicine/physical-medicine-step-definitions';
import { loadFusionClinicalHistory } from '../../store/actions/fusion/fusion-clinical-history.actions';
import {
  ClinicalHistoryDetail,
  ClinicalHistoryExport
} from '../../store/models/fusion/fusion-clinical-history.models';
import {
  getFusionClinicalHistory,
  getFusionClinicalHistoryErrors,
  isFusionClinicalHistoryLoading
} from '../../store/selectors/fusion/fusion-clinical-history.selector';
import * as _moment from 'moment';
import { HealtheMenuOption } from '@shared';
import { MatMenu } from '@angular/material/menu';
import { combineLatest } from 'rxjs';
import { getClaimV3 } from '@shared/store/selectors/claim.selectors';
import { FusionClinicalHistoryService } from './fusion-clinical-history.service';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';

const moment = _moment;

@Component({
  selector: 'healthe-clinical-history',
  templateUrl: './fusion-clinical-history.component.html',
  styleUrls: ['./fusion-clinical-history.component.scss']
})
export class FusionClinicalHistoryComponent implements OnInit {
  referralId$: Observable<string> = this.store$.pipe(
    select(getDecodedReferralId)
  );
  encodedReferralId$: Observable<string> = this.store$.pipe(
    select(getEncodedReferralId)
  );
  encodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getEncodedClaimNumber)
  );
  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );
  isLoading$: Observable<boolean> = this.store$.pipe(
    select(isFusionClinicalHistoryLoading)
  );
  clinicalHistory$: Observable<ClinicalHistoryDetail[]> = this.store$.pipe(
    select(getFusionClinicalHistory)
  );
  hasErrors$: Observable<boolean> = this.store$.pipe(
    select(getFusionClinicalHistoryErrors),
    map((errors) => errors.length > 0)
  );
  claimantName$: Observable<string> = this.store$.pipe(
    select(getClaimV3),
    map((claimV2Data) => {
      if (claimV2Data.claimant && claimV2Data.claimant.fullName) {
        return claimV2Data.claimant.fullName;
      }
      return 'N/A';
    })
  );
  stepDefinitions = [];
  stepDefinitions$ = this.store$.pipe(
    select(getAuthorizationArchetype),
    map((archetype) => {
      switch (archetype) {
        case 'physicalMedicine':
          return PHYSICALMEDICINE_STEP_DEFINITIONS;
        default:
          return [];
      }
    })
  );
  exportDropdownOptions: Array<HealtheMenuOption> = [
    {
      text: 'PDF',
      action: (index: number) => {
        this.exportClinicalHistory('PDF', index);
      }
    },
    {
      text: 'Excel',
      action: (index: number) => {
        this.exportClinicalHistory('EXCEL', index);
      }
    }
  ];
  peerReviewDisplayColumns = ['peerReviewDate', 'reviewer', 'decision'];
  exportMenuIcon = faChevronDown;

  constructor(
    public store$: Store<RootState>,
    public clinicalHistoryService: FusionClinicalHistoryService
  ) {}

  getDetailIcon(detailName: string) {
    return this.stepDefinitions.find((step) => step.label);
  }

  ngOnInit() {
    this.referralId$.pipe(first()).subscribe((referralId) => {
      this.store$.dispatch(loadFusionClinicalHistory({ referralId }));
    });
    this.stepDefinitions$
      .pipe(first())
      .subscribe((stepDefinitions) => (this.stepDefinitions = stepDefinitions));
  }

  setOpenUntilClose(exportMenu: MatMenu) {
    this.exportMenuIcon = faChevronUp;
    exportMenu.closed.subscribe(() => {
      this.exportMenuIcon = faChevronDown;
    });
  }

  getDisplayColumns(columns) {
    return columns.map((column) => column.columnName);
  }

  sortColumns(columns: any[]) {
    const columnsCopy = [...columns];
    const evaluationDescriptionColumnIndex = columns.findIndex(
      (col) => col.columnName === 'evaluationDescription'
    );

    const evaluationDescriptionColumn = columnsCopy.splice(
      evaluationDescriptionColumnIndex,
      1
    )[0];
    const sortedColumns = columnsCopy
      .map(({ columnName, columnLabel }) => ({
        columnName,
        columnLabel: new Date(columnLabel)
      }))
      // @ts-ignore
      .sort((a, b) => b.columnLabel - a.columnLabel)
      .map(({ columnName, columnLabel }) => ({
        columnName,
        columnLabel: moment(columnLabel).format(environment.dateFormat)
      }));
    const initialColumn = sortedColumns.splice(sortedColumns.length - 1, 1)[0];
    return [evaluationDescriptionColumn, initialColumn, ...sortedColumns];
  }

  exportClinicalHistory(type, index: number) {
    combineLatest([
      this.encodedReferralId$,
      this.encodedCustomerId$,
      this.encodedClaimNumber$,
      this.claimantName$
    ])
      .pipe(first())
      .subscribe(
        ([
          encodedReferralId,
          encodedCustomerId,
          encodedClaimNumber,
          claimantName
        ]) => {
          const exportRequest: ClinicalHistoryExport = {
            exportType: type,
            encodedClaimNumber,
            claimantName,
            encodedCustomerId,
            encodedReferralId,
            indexNumber: index
          };
          this.clinicalHistoryService.exportClinicalHistory(exportRequest);
        }
      );
  }
}
