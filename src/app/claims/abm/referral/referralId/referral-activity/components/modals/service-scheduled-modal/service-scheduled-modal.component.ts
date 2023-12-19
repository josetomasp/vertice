import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransportationModalType } from '../../../../../store/models';

@Component({
  selector: 'healthe-service-scheduled-modal',
  templateUrl: './service-scheduled-modal.component.html',
  styleUrls: ['./service-scheduled-modal.component.scss']
})
export class ServiceScheduledModalComponent implements OnInit {
  TransportationModalType = TransportationModalType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData,
    public dialogRef: MatDialogRef<ServiceScheduledModalComponent>
  ) {}

  ngOnInit() {}
}
