import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { ConfirmationModalData } from '../store/models/modal-data';
@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {
  constructor(private dialog: MatDialog) {}

  displayModal(
    modalData: ConfirmationModalData,
    modalHeight: string = 'auto'
  ): MatDialogRef<any> {
    return this.dialog.open(ConfirmationModalComponent, {
      data: modalData,
      autoFocus: false,
      width: '750px',
      height: modalHeight,
      minHeight: '220px',
      disableClose: true
    });
  }
}
