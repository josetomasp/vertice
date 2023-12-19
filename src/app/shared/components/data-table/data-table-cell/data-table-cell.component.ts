import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { HealtheTableColumnDef } from '@shared';

@Component({
  selector: 'healthe-data-table-cell',
  templateUrl: './data-table-cell.component.html',
  styleUrls: ['./data-table-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableCellComponent implements OnInit {
  @Input()
  resultsColumnsConfig: HealtheTableColumnDef;
  @Input()
  rowData: any;
  label: string;
  cellClasses: string[] = [];

  @Input()
  rowIndex: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.label = this.resultsColumnsConfig.staticLabel
      ? this.resultsColumnsConfig.staticLabel
      : this.rowData[this.resultsColumnsConfig.name];

    if (null != this.resultsColumnsConfig.cellClasses) {
      this.cellClasses = this.cellClasses.concat(
        this.resultsColumnsConfig.cellClasses
      );
    }

    if (null != this.resultsColumnsConfig.dynamicCellClasses) {
      this.cellClasses = this.cellClasses.concat(
        this.resultsColumnsConfig.dynamicCellClasses(this.label)
      );
    }
  }

  generateHtmlId(rowData: {}): string {
    return (
      'dataTableCell-' + this.resultsColumnsConfig.name + '-' + this.rowIndex
    );
  }

  handleClick() {
    if (!this.rowData[this.resultsColumnsConfig.linkProp]) {
      this.resultsColumnsConfig.clickEvent.next(this.rowData);
    }
    return true;
  }
}
