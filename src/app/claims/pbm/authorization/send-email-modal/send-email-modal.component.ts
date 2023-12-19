import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ERROR_MESSAGES } from '@shared/constants/form-field-validation-error-messages';

export interface Email {
  from: string;
  to: string;
  subject: string;
  body: string;
}

/**
 * TODO: This is only used by pbm, see if we can move ownership over to the pbm module
 */
@Component({
  selector: 'healthe-send-email-modal',
  templateUrl: './send-email-modal.component.html',
  styleUrls: ['./send-email-modal.component.scss']
})
export class SendEmailModalComponent implements OnInit {
  emailErrorMessage = ERROR_MESSAGES.email;

  formGroup = new FormGroup({
    from: new FormControl(),
    to: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required)
  });

  sendEnabled = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Email,
    public dialogRef: MatDialogRef<any>,
    public snackbar: MatSnackBar
  ) {
    this.formGroup.reset(this.data, { emitEvent: false });
    this.formGroup.controls['from'].disable({ emitEvent: false });
  }

  ngOnInit() {}

  sendEmail() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.sendEnabled = false;
      this.formGroup.statusChanges.subscribe(() => {
        this.sendEnabled = this.formGroup.valid;
      });
    } else {
      // TODO:  Implement actual send email logic here
      this.snackbar.open('Email has been sent successfully', null, {
        duration: 1500,
        panelClass: ['success', 'snackbar']
      });
      this.dialogRef.close();
    }
  }
}
