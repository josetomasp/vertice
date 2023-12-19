import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthRelatedAppointmentsModalData } from '../../../store/models/authRelatedAppointmentsModalData';
import { AuthRelatedAppointmentsModalComponent } from './auth-related-appointments-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AuthRelatedAppointmentsModalService {
  constructor(private dialog: MatDialog) {}

  public showModal(data: any) {
    this.displayModal(data);
  }

  private displayModal(
    relatedAppointments: AuthRelatedAppointmentsModalData[]
  ) {
    this.dialog.open(AuthRelatedAppointmentsModalComponent, {
      data: relatedAppointments,
      autoFocus: false,
      width: '750px'
    });
  }
}
