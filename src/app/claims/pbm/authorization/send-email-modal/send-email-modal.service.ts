import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Email,
  SendEmailModalComponent
} from './send-email-modal.component';

@Injectable({
  providedIn: 'root'
})
export class SendEmailModalService {
  constructor(private dialog: MatDialog) {}

  showModal(data: Email) {
    this.dialog.open(SendEmailModalComponent, {
      data: data,
      autoFocus: false,
      disableClose: true,
      width: '750px'
    });
  }
}
