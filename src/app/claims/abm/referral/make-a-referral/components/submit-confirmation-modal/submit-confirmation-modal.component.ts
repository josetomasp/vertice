import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RootState } from '../../../../../../store/models/root.models';
import { submitReferrals } from '../../../store/actions/shared-make-a-referral.actions';
import {
  REFERRAL_REQUESTOR_INFORMATION,
  ReferralSubmitMessage
} from '../../../store/models/make-a-referral.models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'healthe-submit-confirmation-modal',
  templateUrl: './submit-confirmation-modal.component.html',
  styleUrls: ['./submit-confirmation-modal.component.scss']
})
export class SubmitConfirmationModalComponent implements OnInit {
  constructor(
    public store$: Store<RootState>,
    public matDialogRef: MatDialogRef<SubmitConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public submitData: {
      submitMessage: ReferralSubmitMessage;
      submittingReferral$: Observable<boolean>;
    }
  ) {}

  ngOnInit() {}

  submit() {
    const { submitMessage, submittingReferral$ } = this.submitData;
    this.cleanSubmitMessageFormValues(submitMessage.formValues);
    this.store$.dispatch(submitReferrals({ submitMessage }));
    submittingReferral$.pipe(first((val) => !val)).subscribe(() => {
      this.matDialogRef.close();
    });
  }

  private cleanSubmitMessageFormValues(formValues: {
    [p: string]: { [p: string]: any };
  }) {
    let requestor = formValues[REFERRAL_REQUESTOR_INFORMATION];
    if (requestor) {
      let foundNonEmpty = false;
      Object.keys(requestor).forEach((key) => {
        if (requestor[key]) {
          foundNonEmpty = true;
        }
      });

      if (false === foundNonEmpty) {
        delete formValues[REFERRAL_REQUESTOR_INFORMATION];
      }
    }
  }
}
