import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirstFillLineItemDetails } from '../../store/assign-first-fill-to-claim.reducer';

@Component({
  selector: 'healthe-assign-first-fill-medication-history-table',
  templateUrl: './assign-first-fill-medication-history-table.component.html',
  styleUrls: ['./assign-first-fill-medication-history-table.component.scss']
})
export class AssignFirstFillMedicationHistoryTableComponent implements OnInit {
  @Input()
  isLoadingFirstFillLinesToAssign$: Observable<boolean>;
  @Input()
  lineItemDetailsList$: Observable<FirstFillLineItemDetails[]>;

  tableColumns = [
    'firstFillTempId',
    'customer',
    'claimantName',
    'employerName',
    'dateOfInjury',
    'rxName',
    'submittedDate'
  ];

  constructor() {}

  ngOnInit() {}
}
