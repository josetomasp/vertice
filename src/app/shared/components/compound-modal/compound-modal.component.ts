import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompoundModalData } from '@shared';

@Component({
  selector: 'healthe-compound-modal',
  templateUrl: './compound-modal.component.html',
  styleUrls: ['./compound-modal.component.scss']
})
export class CompoundModalComponent implements OnInit {
  tableColumns = ['drugName', 'quantity', 'rejectCode', 'rejectrReason'];

  constructor(
    public matDialogRef: MatDialogRef<CompoundModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: CompoundModalData
  ) {}

  ngOnInit() {}

  displayFees() {
    if (this.data.dispenseFees != null) {
      return '$'.concat(this.data.dispenseFees.toFixed(2).toString());
    }
    return '';
  }
}
