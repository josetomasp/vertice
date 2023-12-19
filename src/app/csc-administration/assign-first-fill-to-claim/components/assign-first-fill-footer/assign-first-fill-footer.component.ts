import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirstFillSelectedClaimAndCustomer } from '../../store/assign-first-fill-to-claim.reducer';

@Component({
  selector: 'healthe-assign-first-fill-footer',
  templateUrl: './assign-first-fill-footer.component.html',
  styleUrls: ['./assign-first-fill-footer.component.scss']
})
export class AssignFirstFillFooterComponent implements OnInit {
  @Input()
  selectedClaimAndCustomerFromSearch: FirstFillSelectedClaimAndCustomer;

  @Output()
  assignToClaimClick = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
