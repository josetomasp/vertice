import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { FormControl, Validators } from '@angular/forms';
import { CommunicationService } from '@shared/service/communication.service';

enum SectionStatus {
  NotStarted = 'Section Not Started',
  InProgress = 'Section In Progress',
  Complete = 'Section Complete'
}

@Component({
  selector: 'healthe-rxcard-modal',
  templateUrl: './rxcard-modal.component.html',
  styleUrls: ['./rxcard-modal.component.scss']
})
export class RxcardModalComponent implements OnInit {
  faTimes = faTimes;

  phoneNumberSelected: string;
  phoneNumberControl = new FormControl('', [Validators.required]);

  checkBoxData = [
    { title: 'Claimant Name', value: 'ELIZABETH POLLIS', checked: false },
    {
      title: 'Claimant Address ',
      value: '123 EVERYDAY HEALTH ROAD RICHBORO, PA 18954',
      checked: false
    },
    { title: 'Claimant DOB ', value: '02/28/1967', checked: false },
    { title: 'Claimant SSN', value: '***-**-6789', checked: false }
  ];

  statuses = [
    { text: SectionStatus.NotStarted, class: 'rxCard-not-started' },
    { text: SectionStatus.InProgress, class: 'rxCard-in-progress' },
    { text: SectionStatus.Complete, class: 'rxCard-completed' }
  ];

  phoneNumberValidationStatus = this.statuses.find(
    (x) => x.text === SectionStatus.NotStarted
  );
  sendTextButtonEnabled = false;
  showPhoneInput = false;

  constructor(
    public dialogRef: MatDialogRef<RxcardModalComponent>,
    public snackBar: MatSnackBar,
    private commService: CommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.phoneNumberControl.statusChanges.subscribe((state) => {
      if (state === 'VALID') {
        this.phoneNumberValidationStatus = this.statuses.find(
          (x) => x.text === SectionStatus.Complete
        );
      } else if (state === 'INVALID') {
        this.phoneNumberValidationStatus = this.statuses.find(
          (x) => x.text === SectionStatus.InProgress
        );
      }
      this.evaluateSendTextButton();
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  sendText() {
    if (this.phoneNumberSelected === 'custom') {
      this.commService
        .sendRxCardTextMessage(this.phoneNumberControl.value)
        .subscribe((res) => {
          this.snackBar.open(res, 'OK', { duration: 3000 });
          this.close();
        });
    } else {
      this.snackBar.open('Rx Card Sent!', 'OK', { duration: 3000 });
      this.close(); // No message will be sent to phoneNumberSelected 'o1' or 'o2'
    }
  }

  evaluateSendTextButton() {
    if (this.phoneNumberValidationStatus.text === SectionStatus.Complete) {
      this.sendTextButtonEnabled = true;
    } else {
      this.sendTextButtonEnabled = false;
    }
  }

  radioChange(event) {
    if (event.value === 'o1' || event.value === 'o2') {
      this.showPhoneInput = false;
      this.phoneNumberValidationStatus = this.statuses.find(
        (x) => x.text === SectionStatus.Complete
      );
    } else if (event.value === 'custom') {
      this.showPhoneInput = true;
      if (this.phoneNumberControl.status === 'VALID') {
        this.phoneNumberValidationStatus = this.statuses.find(
          (x) => x.text === SectionStatus.Complete
        );
      } else {
        this.phoneNumberValidationStatus = this.statuses.find(
          (x) => x.text === SectionStatus.InProgress
        );
      }
    }

    this.evaluateSendTextButton();
  }
}
