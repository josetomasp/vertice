import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PbmAuthorizationService } from '../../pbm-authorization.service';
import * as _moment from 'moment';
import {
  PbmAuthSubmitMessage,
  PbmAuthSubmitMessageLineItem
} from '../../store/models/pbm-authorization-information.model';
import { first } from 'rxjs/operators';

const moment = _moment;

export interface LoadSamaritanDoseModalData {
  authorizationId: number;
  lineItemId: number;
}

@Component({
  selector: 'healthe-load-samaritan-dose-modal',
  templateUrl: './load-samaritan-dose-modal.component.html',
  styleUrls: ['./load-samaritan-dose-modal.component.scss']
})
export class LoadSamaritanDoseModalComponent implements OnInit {
  isLoadingDose = true;
  loadSuccess = false;
  errorMessage = null;
  title = 'Loading Sam Dose Prior Auth into PHI, Please Wait';
  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: LoadSamaritanDoseModalData,
    public dialogRef: MatDialogRef<LoadSamaritanDoseModalComponent>,
    public authorizationService: PbmAuthorizationService
  ) {}

  ngOnInit() {
    const lineItem: PbmAuthSubmitMessageLineItem = {
      lineItemId: this.modalData.lineItemId,
      action: 'SAMARITAN_DOSE',
      actionPeriodDate: moment(new Date()).format('YYYY-MM-DD')
    };
    const submitMessage: PbmAuthSubmitMessage = {
      authorizationId: this.modalData.authorizationId,
      authorizationLineItems: [lineItem]
    };

    this.authorizationService
      .submitRxAuthorization(submitMessage)
      .pipe(first())
      .subscribe(
        (result) => {
          this.isLoadingDose = false;
          if (result.successful) {
            this.title = 'Samaritan dose was successful!';
            this.loadSuccess = true;
          } else {
            this.title = 'Samaritan dose Failed!';
            if (result.errors && result.errors.length > 0) {
              this.errorMessage = result.errors[0];
            }
          }
        },
        (error) => {
          this.title = 'Samaritan dose Failed!';
          this.isLoadingDose = false;
        }
      );
  }
}
