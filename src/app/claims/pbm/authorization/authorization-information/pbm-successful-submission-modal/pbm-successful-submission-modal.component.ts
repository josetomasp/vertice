import { Component, Inject } from '@angular/core';
import { PbmAuthorizationConfigService } from '../pbm-authorization-configs/pbm-authorization-config.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PbmAuthSubmitSuccessModalConfig } from '../../store/models/pbm-authorization-information.model';

@Component({
  selector: 'healthe-pbm-successful-submission-modal',
  templateUrl: './pbm-successful-submission-modal.component.html',
  styleUrls: ['./pbm-successful-submission-modal.component.scss']
})
export class PbmSuccessfulSubmissionModalComponent {

  modalConfig: PbmAuthSubmitSuccessModalConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public pbmAuthorizationConfigService: PbmAuthorizationConfigService,
    public dialogRef: MatDialogRef<PbmSuccessfulSubmissionModalComponent>,
    private router: Router
  ) {
    this.modalConfig = pbmAuthorizationConfigService.getPbmAuthSubmitSuccessModalConfig();
  }

  remainOnAuth() {
    this.dialogRef.close();
  }

  returnToQueue() {
    this.dialogRef.close();
    this.router.navigate([this.modalConfig.returnToURL]);
  }

  CopyToClipboard() {
    this.pbmAuthorizationConfigService.copyToClipboard();
  }
}
