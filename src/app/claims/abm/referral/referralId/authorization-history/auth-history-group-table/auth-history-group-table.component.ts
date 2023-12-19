import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { faClipboardList } from '@fortawesome/pro-light-svg-icons';
import { HealtheTableColumnDef } from '@shared';
import {
  AuthorizationHistoryGroup,
  VerticeAuthHistoryItem
} from '../../../store/models/authorization-history.models';

@Component({
  selector: 'healthe-auth-history-group-table',
  templateUrl: './auth-history-group-table.component.html',
  styleUrls: ['./auth-history-group-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthHistoryGroupTableComponent implements OnChanges {
  @ViewChild(MatExpansionPanel, { static: true })
  expansionPanel: MatExpansionPanel;

  @Input()
  historyGroup: AuthorizationHistoryGroup<VerticeAuthHistoryItem>;

  @Input()
  columnDefinitions: HealtheTableColumnDef[];

  @Output()
  viewReasonsClick: EventEmitter<string[]> = new EventEmitter<string[]>();

  displayedColumns: string[];
  faClipboardList = faClipboardList;
  constructor() {}

  ngOnChanges(simpleChanges) {
    if (
      simpleChanges['columnDefinitions'] &&
      simpleChanges['columnDefinitions'].firstChange
    ) {
      this.displayedColumns = this.columnDefinitions.map((def) => def.name);
    }
  }

  viewReasons(reasons: string[]) {
    this.viewReasonsClick.emit(reasons);
  }
}
