import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PayeeInfoData } from '../../store/models/payee-info.data';

@Component({
  selector: 'healthe-payee-info-modal',
  templateUrl: './payee-info-modal.component.html',
  styleUrls: ['./payee-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayeeInfoModalComponent implements OnInit {
  constructor(
    public matDialogRef: MatDialogRef<PayeeInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: PayeeInfoData
  ) {}

  ngOnInit() {}
}
