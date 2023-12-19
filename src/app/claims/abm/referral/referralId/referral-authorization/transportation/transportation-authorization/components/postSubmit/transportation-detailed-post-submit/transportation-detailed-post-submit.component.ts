import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faCheck } from '@fortawesome/pro-light-svg-icons';
import { ReferralAuthorizationTypeCode } from '../../../../../referral-authorization.models';
import { FeatureFlagService } from '../../../../../../../../../../customer-configs/feature-flag.service';
import { MakeAReferralService } from '../../../../../../../make-a-referral/make-a-referral.service';
import { FormControl } from '@angular/forms';
import { DocumentPickerModalMode } from '../../../../../../../components/document-picker-modal/document-picker-modal.component';

@Component({
  selector: 'healthe-transportation-detailed-post-submit',
  templateUrl: './transportation-detailed-post-submit.component.html',
  styleUrls: ['./transportation-detailed-post-submit.component.scss']
})
export class TransportationDetailedPostSubmitComponent implements OnInit {
  @Input()
  formValues: any;

  REFERRAL_AUTH_REVIEW_SECTION_ID = 'referral-auth-review-section-copy-section';
  ReferralAuthorizationTypeCode = ReferralAuthorizationTypeCode;
  faCheck = faCheck;

  constructor(
    public snackbar: MatSnackBar,
    private featureFlagService: FeatureFlagService,
    private makeAReferralService: MakeAReferralService
  ) {}

  ngOnInit() {}

  copyToClipboard() {
    let reviewScreenText = document.getElementById(
      this.REFERRAL_AUTH_REVIEW_SECTION_ID
    ).innerText;

    this.copyText(reviewScreenText);

    this.snackbar.open('Copied to Clipboard!', null, {
      duration: 1500,
      panelClass: ['success', 'snackbar']
    });
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  viewDocuments() {
    this.makeAReferralService.displayAddDocumentsModal(
      new FormControl(this.formValues.documents),
      DocumentPickerModalMode.VIEW
    );
  }
}
