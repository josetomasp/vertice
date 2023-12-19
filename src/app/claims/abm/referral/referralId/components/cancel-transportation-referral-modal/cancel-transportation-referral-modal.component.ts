import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  TransportationAuthorizationOpenSedanFormData
} from '../../referral-authorization/referral-authorization.models';
import {
  CancelRecord,
  CancelTransportationReferralModalData,
  CancelTransportationReferralModalModelActionResultType
} from './cancel-transportation-referral-modal.model';
import {
  AbstractControl,
  FormArray,
  FormControl,
  ValidationErrors,
  Validators
} from '@angular/forms';

interface CancelRow {
  cancelCheckbox: FormControl;
  trips: number;
  startDate: string;
  endDate: string;
  cancelReason: FormControl;
  authorizationId: number;
}

function isCheckedValidator(ac: AbstractControl): ValidationErrors {
  if (null == ac.value || ac.value === false) {
    return { noChecked: true };
  }
  return;
}

@Component({
  selector: 'healthe-cancel-transportation-referral-modal',
  templateUrl: './cancel-transportation-referral-modal.component.html',
  styleUrls: ['./cancel-transportation-referral-modal.component.scss']
})
export class CancelTransportationReferralModalComponent implements OnInit {
  formArray: FormArray = new FormArray([]);
  cancelReasons: string[] = ['Reason 1', 'Reason 2'];
  cancelRows: CancelRow[] = [];
  displayedColumns: string[] = [
    'cancelCheckbox',
    'trips',
    'startDate',
    'endDate',
    'cancelReason'
  ];

  constructor(
    public dialogRef: MatDialogRef<CancelTransportationReferralModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public modalData: CancelTransportationReferralModalData
  ) {
    this.buildCancelRows();
  }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close({
      actionResult:
      CancelTransportationReferralModalModelActionResultType.Cancel,
      cancelReasons: []
    });
  }

  private buildCancelRows() {
    this.modalData.authData.forEach((authItem) => {
      const authFormData: TransportationAuthorizationOpenSedanFormData = authItem.authData as TransportationAuthorizationOpenSedanFormData;
      const cancelRow: CancelRow = {
        cancelCheckbox: new FormControl(null, isCheckedValidator),
        trips: authFormData.tripsAuthorized,
        startDate: authFormData.startDate,
        endDate: authFormData.endDate,
        authorizationId: authFormData.authorizationId,
        cancelReason: new FormControl(null, Validators.required)
      };

      this.cancelRows.push(cancelRow);

      // The purpose of this form array is to simply to make it convent to see if any
      // formControl has an error anywhere.
      this.formArray.push(cancelRow.cancelCheckbox);
      this.formArray.push(cancelRow.cancelReason);
    });
  }

  cancelReferral() {
    if (this.formArray.invalid) {
      this.formArray.markAllAsTouched();
      this.formArray.updateValueAndValidity();
    } else {
      const cancelRecords: CancelRecord[] = [];
      this.cancelRows.forEach((row) => {
        cancelRecords.push({
          authorizationId: row.authorizationId,
          cancelReason: row.cancelReason.value
        });
      });

      this.dialogRef.close({
        actionResult:
        CancelTransportationReferralModalModelActionResultType.Submit,
        cancelRecords
      });
    }
  }
}
