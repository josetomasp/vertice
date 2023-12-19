import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faDownload } from '@fortawesome/pro-regular-svg-icons';
import { FusionClinicalAlert } from '../../store/models/fusion-authorizations.models';

@Component({
  selector: 'healthe-alert-info-modal',
  templateUrl: './alert-info-modal.component.html',
  styleUrls: ['./alert-info-modal.component.scss']
})
export class AlertInfoModalComponent implements OnInit {
  downloadIcon = faDownload;

  constructor(
    public matDialogRef: MatDialogRef<AlertInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { alertInfo: FusionClinicalAlert }
  ) {}

  ngOnInit() {}

  openPositionPaper() {
    window.open(this.data.alertInfo.attachmentUrl, '_blank');
  }
}
