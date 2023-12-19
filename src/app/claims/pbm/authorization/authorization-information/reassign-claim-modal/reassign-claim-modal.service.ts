import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReassignClaimModalComponent } from './reassign-claim-modal.component';
import { Observable } from 'rxjs';

@Injectable()
export class ReassignClaimModalService {
  constructor(private dialog: MatDialog) {}

  showModal(): Observable<any> {
    return this.dialog
      .open(ReassignClaimModalComponent, {
        height: '730px',
        width: '1200px'
      })
      .afterClosed();
  }
}
