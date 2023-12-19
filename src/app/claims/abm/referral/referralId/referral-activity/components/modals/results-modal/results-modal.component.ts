import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransportationModalType } from '../../../../../store/models';

@Component({
  selector: 'healthe-results-modal',
  templateUrl: './results-modal.component.html',
  styleUrls: ['./results-modal.component.scss']
})
export class ResultsModalComponent implements OnInit {
  TransportationModalType = TransportationModalType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData,
    public dialogRef: MatDialogRef<ResultsModalComponent>
  ) {}

  ngOnInit() {}
}
