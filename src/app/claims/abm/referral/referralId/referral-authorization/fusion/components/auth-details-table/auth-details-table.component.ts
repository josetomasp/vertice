import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { HealtheTableColumnDef } from '@shared';
import { FusionDetailsTableType } from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';

@Component({
  selector: 'healthe-auth-details-table',
  templateUrl: './auth-details-table.component.html',
  styleUrls: ['./auth-details-table.component.scss']
})
export class AuthDetailsTableComponent implements OnInit, OnChanges {
  @Input()
  tableDataSoruce: FusionDetailsTableType[];

  @Input()
  columnDefinitions: HealtheTableColumnDef[];

  displayedColumns: string[];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(simpleChanges) {
    if (
      simpleChanges['columnDefinitions'] &&
      simpleChanges['columnDefinitions'].firstChange
    ) {
      this.displayedColumns = this.columnDefinitions.map((def) => def.name);
    }
  }
}
