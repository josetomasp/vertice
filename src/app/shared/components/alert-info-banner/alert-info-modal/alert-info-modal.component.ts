import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { FusionClinicalAlert } from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { faDownload } from '@fortawesome/pro-regular-svg-icons';

@Component({
  selector: 'healthe-alert-info-modal',
  templateUrl: './alert-info-modal.component.html',
  styleUrls: ['./alert-info-modal.component.scss']
})
export class AlertInfoModalComponent extends DestroyableComponent
  implements OnInit {
  downloadIcon = faDownload;

  constructor(
    public matDialogRef: MatDialogRef<AlertInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { alertInfo: FusionClinicalAlert }
  ) {
    super();
  }

  ngOnInit() {}

  openPositionPaper() {
    window.open(this.data.alertInfo.attachmentUrl, '_blank');
  }
}
