import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FusionBodyPartHistory } from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';

@Component({
  selector: 'healthe-body-parts-history-modal',
  templateUrl: './body-parts-history-modal.component.html',
  styleUrls: ['./body-parts-history-modal.component.scss']
})
export class BodyPartsHistoryModalComponent implements OnInit {
  bodyPartHistoryArray: FusionBodyPartHistory[] = [];

  displayedColumns: string[] = ['description', 'lastActionDate', 'status'];

  constructor(
    public dialogRef: MatDialogRef<BodyPartsHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.bodyPartHistoryArray) {
      this.bodyPartHistoryArray = data.bodyPartHistoryArray;
    }
  }

  ngOnInit() {}
}
