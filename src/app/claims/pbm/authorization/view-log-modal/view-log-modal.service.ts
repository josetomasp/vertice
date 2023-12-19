import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewLogModalComponent } from './view-log-modal.component';

@Injectable()
export class ViewLogModalService {
  constructor(private dialog: MatDialog) {}

  viewLogData(authorizationId: string) {
    this.dialog.open(ViewLogModalComponent, {
      data: authorizationId,
      autoFocus: false,
      width: '1200px',
      height: '611px',
      minHeight: '220px',
      disableClose: false
    });
  }
}
