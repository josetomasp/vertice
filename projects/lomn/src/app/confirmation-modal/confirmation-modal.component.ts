import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationModalData } from '../store/models/modal-data';

@Component({
  selector: 'healthe-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: ConfirmationModalData
  ) {
    if (null == modalData.affirmClass) {
      modalData.affirmClass = 'primary-button';
    }
  }

  ngOnInit() {}
}
