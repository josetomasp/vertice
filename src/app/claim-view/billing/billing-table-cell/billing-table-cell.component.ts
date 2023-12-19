import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { HealtheTableColumnDef } from '../../../shared/models/table-column';

@Component({
  selector: 'billing-table-cell',
  templateUrl: './billing-table-cell.component.html',
  styleUrls: ['./billing-table-cell.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingTableCellComponent implements OnInit {
  @Input()
  cellData: string;

  @Input()
  column: HealtheTableColumnDef;

  formattedCellData: string;
  fontAwesomeClass = null;
  iconLink = null;

  constructor() {}

  ngOnInit() {
    switch (this.column.name) {
      case 'imagePath':
        this.fontAwesomeClass = 'fal fa-file-invoice-dollar';
        this.iconLink = this.cellData;
        break;

      case 'eobPath':
        this.fontAwesomeClass = 'fal fa-file-alt';
        this.iconLink = this.cellData;
        break;

      default:
        this.formattedCellData = this.cellData;
    }
  }
}
