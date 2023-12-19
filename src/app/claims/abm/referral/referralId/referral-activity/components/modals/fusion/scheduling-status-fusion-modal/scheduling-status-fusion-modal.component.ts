import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchedulingStatus } from './scheduling-status-fusion-model';
import { Vertice25Service } from '@shared/service/vertice25.service';

@Component({
  selector: 'healthe-scheduling-status-modal',
  templateUrl: './scheduling-status-fusion-modal.component.html',
  styleUrls: ['./scheduling-status-fusion-modal.component.scss']
})
export class SchedulingStatusFusionModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: SchedulingStatus,
    public vertice25Service: Vertice25Service,
    public dialogRef: MatDialogRef<SchedulingStatusFusionModalComponent>
  ) {}

  ngOnInit() {}

  closeModal() {
    this.dialogRef.close();
  }

  createIncidentReport() {
    this.vertice25Service.createIncidentReport();
  }
}
