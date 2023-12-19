import { Injectable } from '@angular/core';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationModalData } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {
  constructor(private dialog: MatDialog) {}

  displayModal(
    modalData: ConfirmationModalData,
    modalHeight: string = 'auto',
    modalWidth: string = '750px'
  ): MatDialogRef<any> {
    return this.dialog.open(ConfirmationModalComponent, {
      data: modalData,
      autoFocus: false,
      width: modalWidth,
      height: modalHeight,
      minHeight: '220px',
      disableClose: true
    });
  }
}
