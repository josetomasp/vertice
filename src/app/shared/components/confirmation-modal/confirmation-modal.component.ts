import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationModalData } from '@shared';

@Component({
  selector: 'healthe-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ConfirmationModalData
  ) {
    if (null == modalData.affirmClass) {
      modalData.affirmClass = 'primary-button';
    }
  }
}
