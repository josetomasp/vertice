import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getEncodedAuthorizationId } from '../../../../store/selectors/router.selectors';
import { RootState } from '../../../../store/models/root.models';
import { filter, first } from 'rxjs/operators';
import { PageTitleService } from '@shared/service/page-title.service';
import { PharmacyModalService } from '@shared/components/pharmacy-lookup-modal/pharmacy-modal.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  AuthorizationDetails, PbmAuthNotesConfig,
  PbmAuthSubmitMessage,
  PbmAuthSubmitMessageLineItem
} from '../store/models/pbm-authorization-information.model';
import { hexDecode, is10DigitPhoneNumberValidator } from '@shared';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  getAuthorizationDetails,
  getAuthorizationDetailsNotes
} from '../store/selectors/pbm-authorization-information.selectors';
import { cloneDeep } from 'lodash';
import { getUsername } from '../../../../user/store/selectors/user.selectors';
import { Router } from '@angular/router';
import { PbmAuthorizationService } from '../pbm-authorization.service';
import { HealtheSnackBarService } from '@shared/service/snackbar.service';
import {
  postInternalNoteSuccess,
  resetRxAuthorizationState
} from '../store/actions/pbm-authorization-information.actions';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { LoadingModalComponent } from '@shared/components/loading-modal/loading-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FormValidationExtractorService } from '@modules/form-validation-extractor';

import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { PBM_AUTH_NOTES_DEFAULT_STATE } from '../store/models/pbm-auth-notes-default-state';
import { AuthorizationLineItem } from '../store/models/pbm-authorization-information/authorization-line-item.models';
import {
  PbmAuthorizationNote
} from '../store/models/pbm-authorization-information/pbm-authorization-note.models';

@Component({
  selector: 'healthe-rtr-promotion',
  templateUrl: './rtr-promotion.component.html',
  styleUrls: ['./rtr-promotion.component.scss'],
  providers: [FormValidationExtractorService]
})
export class RtrPromotionComponent implements OnInit, OnDestroy {
  @ViewChild('healtheErrorCardScrollElement')
  healtheErrorCardScrollElement;

  faExclamationTriangle = faExclamationTriangle;
  submitClickedOnce = false;
  userHasNoActions = false;

  authorizationDetails$: Observable<AuthorizationDetails> = this.store$.pipe(
    select(getAuthorizationDetails),
    first(
      (details) =>
        details !== null &&
        details.authorizationLineItems !== null &&
        details.authorizationLineItems.length > 0
    )
  );

  authorizationDetailsNotes$: Observable<
    PbmAuthorizationNote[]
  > = this.store$.pipe(select(getAuthorizationDetailsNotes));

  userName$: Observable<string> = this.store$.pipe(select(getUsername));
  userName: string = '';

  prescriptionNotesConfig: PbmAuthNotesConfig = {
    ...PBM_AUTH_NOTES_DEFAULT_STATE,
    noteTitle: 'Healthe CSC Internal Notes',
    placeholder: 'Enter Healthe Note',
    warnAboutSavingNote: false,
    autoExpandWhenNotesPresent: false
  };

  isLoading = true;
  formGroup: FormGroup = new FormGroup({});
  formArray: FormArray = new FormArray([]);
  encodedAuthId: string = '';
  decodedAuthId: string = '';
  authorizationDetails: AuthorizationDetails = null;
  isSubmitting: boolean;
  public canDeactivate: boolean = false;

  constructor(
    public store$: Store<RootState>,
    private pageTitleService: PageTitleService,
    public pharmacyModalService: PharmacyModalService,
    private http: HttpClient,
    private router: Router,
    private pbmAuthorizationService: PbmAuthorizationService,
    public confirmationModalService: ConfirmationModalService,
    private dialog: MatDialog,
    public fVES: FormValidationExtractorService,
    public snackBarService: HealtheSnackBarService
  ) {
    this.pageTitleService.setTitle(
      'CSC Administration',
      'Create POS Authorization From RTR'
    );

    fVES.registerErrorMessage({
      invalidPhoneNumber:
        'If entering a phone number it must contain 10 digits!',
      mask: ''
    });
  }

  ngOnInit() {
    this.store$
      .pipe(select(getEncodedAuthorizationId))
      .pipe(first())
      .subscribe((value) => {
        this.encodedAuthId = value;
        this.decodedAuthId = hexDecode(value);
      });

    this.userName$.pipe(first()).subscribe((username) => {
      this.userName = username;
    });

    this.formGroup.addControl('callerName', new FormControl());
    this.formGroup.addControl('note', new FormControl());
    this.formGroup.addControl(
      'callerNumber',
      new FormControl('', is10DigitPhoneNumberValidator)
    );
    this.formGroup.addControl('injuredWorkerWaiting', new FormControl(false));
    this.formGroup.addControl('prescriptions', this.formArray);

    this.authorizationDetails$.pipe(first()).subscribe((details) => {
      this.authorizationDetails = cloneDeep(details);
      for (let i = 0; i < details.authorizationLineItems.length; i++) {
        this.formArray.push(new FormGroup({}), { emitEvent: false });
      }
      this.isLoading = false;
      this.formGroup.controls['callerName'].setValue(
        this.authorizationDetails.pharmacyInformationForm.callerName
      );
      this.formGroup.controls['callerNumber'].setValue(
        this.authorizationDetails.authorizationDetailsHeader.pharmacy.phone
      );
      this.userHasNoActions = this.hasNoActionsForCurrentUser(
        details.authorizationLineItems
      );
    });
  }

  showPharamacyModal(nabp: string) {
    this.pharmacyModalService.showModal(nabp);
  }

  saveInternalNote(note: string) {
    this.pbmAuthorizationService
      .saveInternalNote(note, this.encodedAuthId)
      .pipe(first())
      .subscribe((response) => {
        if (200 === response.httpStatusCode) {
          this.store$.dispatch(
            postInternalNoteSuccess({ notes: response.responseBody })
          );
        }
      });
  }

  goBack() {
    this.router.navigate(['/csc-administration/real-time-rejects-queue']);
  }

  submit() {
    if (this.formGroup.invalid) {
      this.submitClickedOnce = true;
      this.formGroup.markAllAsTouched();
      this.goToElement(this.healtheErrorCardScrollElement.nativeElement);
    } else {
      this.confirmationModalService
        .displayModal({
          titleString: 'Save & Submit',
          bodyHtml:
            'Are you sure you want to create this authorization as is?  Please press “Continue” to confirm”.',
          affirmString: 'CONTINUE',
          denyString: 'CANCEL'
        })
        .afterClosed()
        .pipe(filter((confirm) => confirm))
        .subscribe(() => {
          this.isSubmitting = true;
          const fgValues = this.formGroup.value;
          const submit: PbmAuthSubmitMessage = {
            authorizationId: parseInt(this.decodedAuthId, 10),
            isPatientWaiting: this.formGroup.controls['injuredWorkerWaiting']
              .value,
            callerName: this.formGroup.controls['callerName'].value,
            callerNumber: this.formGroup.controls['callerNumber'].value,
            authorizationLineItems: fgValues['prescriptions'].map(
              (prescription) => {
                const lineItem: PbmAuthSubmitMessageLineItem = {
                  lineItemId: prescription['authLineItemID'],
                  action: prescription['CreateEpaq'],
                  prescriberInformation: prescription['prescriberInfoFG']
                };

                if ('DISCARD' === lineItem.action) {
                  lineItem.note = prescription['discardReasons'];
                  if ('OTHER' === lineItem.note) {
                    lineItem.note = prescription['otherReason'];
                  }
                }

                return lineItem;
              }
            )
          };

          const dialogRef = this.dialog.open(LoadingModalComponent, {
            width: '700px',
            data: 'Saving & Submitting...'
          });

          this.pbmAuthorizationService
            .submitRxAuthorization(submit)
            .pipe(first())
            .subscribe(
              (response) => {
                dialogRef.close();
                this.canDeactivate = true;
                this.isSubmitting = false;
                this.snackBarService.showSuccess('Submit Successful');
                this.goBack();
              },
              () => {
                dialogRef.close();
                this.canDeactivate = false;
                this.isSubmitting = false;
                this.snackBarService.showError([
                  'There was an error when trying to submit your request.'
                ]);
              }
            );
        });
    }
  }
  ngOnDestroy() {
    this.store$.dispatch(resetRxAuthorizationState());
  }

  goToElement(el: HTMLElement) {
    el.scrollIntoView({ block: 'center', inline: 'center' });
    el.focus();
  }

  createEPAQValueChange() {
    // The business rule is that if all items are discarded we do not want to enforce the
    // requirement of a caller number
    let allDiscard = true;
    this.formArray.controls.forEach((fg: FormGroup) => {
      let fc = fg.get('CreateEpaq');
      if (null != fc) {
        if ('DISCARD' !== fc.value) {
          allDiscard = false;
        }
      }
    });

    let callerNumberFc = this.formGroup.controls['callerNumber'];
    if (null !== callerNumberFc) {
      if (allDiscard) {
        if (null !== callerNumberFc.validator) {
          callerNumberFc.clearValidators();
          callerNumberFc.updateValueAndValidity();
        }
      } else {
        if (null === callerNumberFc.validator) {
          callerNumberFc.setValidators(is10DigitPhoneNumberValidator);
          callerNumberFc.updateValueAndValidity();
        }
      }
    }
  }

  hasNoActionsForCurrentUser(
    displayedLineItems: AuthorizationLineItem[]
  ): boolean {
    return !displayedLineItems.some(
      ({ permissibleActionsForCurrentUser }) =>
        permissibleActionsForCurrentUser.length > 0
    );
  }
}
