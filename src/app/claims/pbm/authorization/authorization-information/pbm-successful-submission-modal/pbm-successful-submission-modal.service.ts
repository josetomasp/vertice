import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PbmSuccessfulSubmissionModalComponent } from './pbm-successful-submission-modal.component';
import { PbmAuthorizationConfigService } from '../pbm-authorization-configs/pbm-authorization-config.service';

@Injectable({
  providedIn: 'root'
})
export class PbmSuccessfulSubmissionModalService {
  pbmAuthorizationConfigService: PbmAuthorizationConfigService;

  constructor(private dialog: MatDialog) {}

  setConfigService(
    pbmAuthorizationConfigService: PbmAuthorizationConfigService
  ) {
    this.pbmAuthorizationConfigService = pbmAuthorizationConfigService;
  }

  showModal() {
    this.dialog.open(PbmSuccessfulSubmissionModalComponent, {
      data: this.pbmAuthorizationConfigService,
      autoFocus: false,
      disableClose: true,
      width: '750px'
    });
  }
}
