import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RootState } from '../../../../store/models/root.models';
import { RiskDetail } from '@shared/store/models';
import {
  getRiskTrendingDetails,
  getRiskTrendingModalIsLoading
} from '../../../store/selectors';

@Component({
  selector: 'healthe-risk-table',
  templateUrl: './risk-table.component.html',
  styleUrls: ['./risk-table.component.scss']
})
export class RiskTableComponent implements OnInit {
  tableColumnList: string[] = [
    'riskLevelAndCategory',
    'riskSubcategory',
    'riskIndicator',
    'riskDescription',
    'atRiskOf'
  ];
  isLoadingData$: Observable<boolean> = this.store$.pipe(
    select(getRiskTrendingModalIsLoading)
  );

  tableData$: Observable<RiskDetail[]> = this.store$.pipe(
    select(getRiskTrendingDetails)
  );

  constructor(public store$: Store<RootState>) {}

  ngOnInit() {}

  getTagColor(riskLevelNumber: any) {
    switch (riskLevelNumber) {
      case 5:
        return 'highest-risk';
      case 4:
        return 'high-risk';
      case 3:
        return 'medium-risk';
      case 2:
        return 'low-risk';
      case 1:
        return 'lowest-risk';
      default:
        return '';
    }
  }
}
