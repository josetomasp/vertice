import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PhoneNumberPipe } from '@shared/pipes/phone-number.pipe';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../store/models/root.models';
import { combineLatest, Observable } from 'rxjs';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { getClaimV3 } from '@shared/store/selectors/claim.selectors';
import { distinctUntilChanged, first, takeUntil } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { getDecodedClaimNumber } from '../../../store/selectors/router.selectors';
import { is10DigitPhoneNumberValidator } from '@shared';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  ClaimantInviteRequest,
  MobileInvitationHistory,
  MobileInviteService
} from '@modules/mobile-invite/mobile-invite-modal/mobile-invite.service';

// All the history table stuff is temporary.  Even what the table may end up looking like has not
// been finalized yet.

@Component({
  selector: 'healthe-mobile-invite-modal',
  templateUrl: './mobile-invite-modal.component.html',
  styleUrls: ['./mobile-invite-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PhoneNumberPipe]
})
export class MobileInviteModalComponent
  extends DestroyableComponent
  implements OnInit, AfterViewInit
{
  claimV3$: Observable<ClaimV3> = this.store$.pipe(
    select(getClaimV3),
    takeUntil(this.onDestroy$)
  );

  decodedClaimNumber$ = this.store$.pipe(
    select(getDecodedClaimNumber),
    first()
  );

  @ViewChild('confirmCheckbox')
  confirmCheckbox: MatCheckbox;

  faTimes = faTimes;
  defaultRadioButton = 'phoneNumber';

  title: string;
  isSubmitting: boolean = false;
  submitResultMessages: string[];
  submitResultClass: string;
  phiMemberId: string;
  customerCode: string;
  historyTableErrorMessage: string = '';

  // All the history table stuff is temporary.  Even what the table may end up looking like has not
  // been finalized yet.
  invitationHistoryTableData: MobileInvitationHistory[] = null;

  invitationHistoryTableDisplayColumns: string[] = [
    'eventDateTime',
    'sentTo',
    'sentBy',
    'description'
  ];

  constructor(
    public store$: Store<RootState>,
    public mobileInviteService: MobileInviteService,
    public changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  claimantVerificationForm: FormGroup = new FormGroup({
    defaultRadioButton: new FormControl(this.defaultRadioButton),
    phoneNumber: new FormControl('', [
      Validators.required,
      is10DigitPhoneNumberValidator
    ]),
    email: new FormControl('', [Validators.email, Validators.required])
  });

  ngOnInit() {
    combineLatest([this.claimV3$, this.decodedClaimNumber$])
      .pipe(first())
      .subscribe(([claimV3, decodedClaimNumber]) => {
        this.title =
          'Mobile App Invite - ' +
          claimV3.claimant.fullName +
          ' - Claim #' +
          decodedClaimNumber;

        this.phiMemberId = claimV3.phiMemberId;
        this.getMobileInvitationHistory();
        this.customerCode = claimV3?.header.customerCode;

        claimV3?.claimant?.communications.forEach((communication) => {
          switch (communication.type) {
            default:
              break;

            case 'EMAIL':
              this.claimantVerificationForm
                .get('email')
                .setValue(communication.communicationValue);
              break;

            case 'HOME':
              // Do not overwrite the cell phone if its already been added.
              if (!this.claimantVerificationForm.get('phoneNumber').value) {
                this.claimantVerificationForm
                  .get('phoneNumber')
                  .setValue(
                    this.cleanPhoneNumber(communication.communicationValue)
                  );
              }
              break;

            case 'CELL':
              this.claimantVerificationForm
                .get('phoneNumber')
                .setValue(
                  this.cleanPhoneNumber(communication.communicationValue)
                );
              break;
          }
        });
      });

    this.claimantVerificationForm
      .get('defaultRadioButton')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.toggleContactMethods(value);
      });

    this.toggleContactMethods(this.defaultRadioButton);
  }

  ngAfterViewInit() {
    this.updateCheckboxStatus(this.claimantVerificationForm.status);
    this.claimantVerificationForm.statusChanges
      .pipe(takeUntil(this.onDestroy$), distinctUntilChanged())
      .subscribe((status) => {
        this.updateCheckboxStatus(status);
      });
  }

  updateCheckboxStatus(status: string) {
    switch (status) {
      case 'VALID':
        this.confirmCheckbox.setDisabledState(false);
        break;
      default:
        this.confirmCheckbox.writeValue(false);
        this.confirmCheckbox.setDisabledState(true);
        break;
    }
  }

  toggleContactMethods(method: string) {
    switch (method) {
      case 'phoneNumber':
        this.claimantVerificationForm.get('phoneNumber').enable();
        this.claimantVerificationForm.get('email').disable();
        break;
      case 'email':
        this.claimantVerificationForm.get('email').enable();
        this.claimantVerificationForm.get('phoneNumber').disable();
        break;
    }
  }

  // Remove all non numeric digits.
  cleanPhoneNumber(phoneNumber: string): string {
    if (null != phoneNumber) {
      return phoneNumber.replace(/\D/g, '');
    }
    return phoneNumber;
  }

  sendInvite() {
    this.submitResultMessages = null;
    this.isSubmitting = true;
    this.submitResultClass = null;
    this.changeDetector.detectChanges();

    let request: ClaimantInviteRequest = {
      email: null,
      phoneNumber: null,
      phiMemberId: this.phiMemberId,
      customerCode: this.customerCode
    };

    // Supply either value, but not both.
    if (this.claimantVerificationForm.get('phoneNumber').enabled) {
      request.phoneNumber =
        this.claimantVerificationForm.get('phoneNumber').value;
    } else {
      request.email = this.claimantVerificationForm.get('email').value;
    }

    this.mobileInviteService.submitMobileInviteRequest(request).subscribe(
      (response) => {
        if (response.errors && response.errors.length > 0) {
          this.submitResultClass = 'failed-send';
          this.submitResultMessages = response.errors;
        } else {
          this.submitResultMessages = ['Successfully sent!'];
          this.submitResultClass = 'successful-send';
        }

        this.isSubmitting = false;
        this.changeDetector.detectChanges();
      },
      (error) => {
        console.error(error);
        this.submitResultClass = 'failed-send';
        this.submitResultMessages = [
          'Something went wrong submitting the request.'
        ];

        this.isSubmitting = false;
        this.changeDetector.detectChanges();
      }
    );
  }

  private getMobileInvitationHistory() {
    this.mobileInviteService
      .getMobileInvitationHistory(this.phiMemberId)
      .subscribe(
        (history) => {
          if (history.responseBody && history.responseBody.length > 0) {
            this.invitationHistoryTableData = history.responseBody;
          } else {
            this.historyTableErrorMessage = 'No invitation history to display';
            this.invitationHistoryTableData = [];
          }
          this.changeDetector.detectChanges();
        },
        () => {
          this.historyTableErrorMessage =
            'An error occurred getting mobile invite history';
          this.invitationHistoryTableData = [];
          this.changeDetector.detectChanges();
        }
      );
  }

  downloadHelpPDF() {
    this.mobileInviteService.downloadHelpPDF().subscribe( result => {
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL( new Blob( [this.base64ToArrayBuffer(result.file)]));
      link.download = result.filename;
      link.click();
      link.remove();

});
  }

  base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    return bytes.map((byte, i) => binaryString.charCodeAt(i));
  }
}
