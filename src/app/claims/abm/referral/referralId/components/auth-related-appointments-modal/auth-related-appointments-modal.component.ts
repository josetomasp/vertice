import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AuthRelatedAppointmentsModalData } from '../../../store/models/authRelatedAppointmentsModalData';

@Component({
  selector: 'healthe-auth-related-appointments-modal',
  templateUrl: './auth-related-appointments-modal.component.html',
  styleUrls: ['./auth-related-appointments-modal.component.scss']
})
export class AuthRelatedAppointmentsModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AuthRelatedAppointmentsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public modalData: AuthRelatedAppointmentsModalData[]
  ) {}

  ngOnInit() {}
}
