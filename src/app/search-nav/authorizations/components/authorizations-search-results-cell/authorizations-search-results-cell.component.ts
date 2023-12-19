import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { HealtheTableColumnDef } from '@shared';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'healthe-authorizations-search-results-cell',
  templateUrl: './authorizations-search-results-cell.component.html',
  styleUrls: ['./authorizations-search-results-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationsSearchResultsCellComponent implements OnInit {
  @Input() // Configures columns
  resultsColumnsConfig: HealtheTableColumnDef;
  @Input()
  rowData: {};
  label: string;
  faExclamationCircle = faExclamationCircle;

  constructor() {}

  ngOnInit(): void {
    this.label = this.resultsColumnsConfig.staticLabel
      ? this.resultsColumnsConfig.staticLabel
      : this.rowData[this.resultsColumnsConfig.name];
  }

  auxClick($event: MouseEvent) {
    $event.preventDefault();
    this.resultsColumnsConfig?.auxClickEvent?.next(this.rowData);
  }
}
