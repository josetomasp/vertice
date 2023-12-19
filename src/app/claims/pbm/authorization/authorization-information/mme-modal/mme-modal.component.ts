import { Component, Inject, OnInit } from '@angular/core';
import { faSyringe } from '@fortawesome/pro-solid-svg-icons';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface MMEModalData {
  claimMme: number;
  prescription: MMEPrescriptionData;
  isRetroAuthorization: boolean;
}

export interface MMEPrescriptionData {
  displayName: string;
  transactionalMme: number;
  claimMmeWithPrescription: number;
}

@Component({
  selector: 'healthe-mme-modal',
  templateUrl: './mme-modal.component.html',
  styleUrls: ['./mme-modal.component.scss']
})
export class MmeModalComponent implements OnInit {
  syringeIcon = faSyringe;

  constructor(
    public matDialogRef: MatDialogRef<MmeModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: MMEModalData
  ) {}

  ngOnInit() {}
}
