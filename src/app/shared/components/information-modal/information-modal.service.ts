import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalData } from '@shared';
import { InformationModalComponent } from '@shared/components/information-modal/information-modal.component';

@Injectable({
  providedIn: 'root'
})
export class InformationModalService {
  constructor(private dialog: MatDialog) {}

  displayModal(
    modalData: ModalData,
    modalHeight: string = 'auto'
  ): MatDialogRef<any> {
    return this.dialog.open(InformationModalComponent, {
      data: modalData,
      autoFocus: false,
      width: '750px',
      height: modalHeight,
      minHeight: modalData.minHeight ? modalData.minHeight : '225px',
      disableClose: false
    });
  }
}
