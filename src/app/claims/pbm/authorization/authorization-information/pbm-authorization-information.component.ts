import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { createSelector, select, Store } from '@ngrx/store';
import { hexEncode, VerticeResponse } from '@shared';
import { takeWhileRouteActive } from '@shared/lib/operators/takeWhileRouteActive';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  filter,
  finalize,
  first,
  map,
  mergeMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import * as _moment from 'moment';
import { RootState } from 'src/app/store/models/root.models';
import {
  getDecodedAuthorizationId,
  getEncodedAuthorizationId,
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getPbmAuthStatusView,
  getDecodedClaimNumber
} from 'src/app/store/selectors/router.selectors';
import {
  getUsername,
  isUserInternal
} from 'src/app/user/store/selectors/user.selectors';
import {
  postInternalNote,
  saveRxAuthNote
} from '../store/actions/pbm-authorization-information.actions';
import {
  AuthorizationDenialReason,
  AuthorizationDetails,
  PbmAuthFooterConfig,
  PbmAuthFormMode,
  PbmAuthNotesConfig,
  PbmAuthorizationReviewerAlert,
  ValidationErrorFilter,
  PbmReassignNewClaim
} from '../store/models/pbm-authorization-information.model';
import {
  getAuthorizationActionLabel,
  getAuthorizationDenialReasons,
  getAuthorizationDetails,
  getAuthorizationDetailsNotes,
  getAuthorizationReassignedIndicator,
  getIsReconsideration,
  getRxAuthorizationSubmitResponse,
  getShowDenialReasons,
  getShowSecondDenialReason,
  submitSamaritanDoseResponse,
  getReviewerAlerts,
  getPaperAuthorizationReassignResponse,
  isAuthorizationIsLoading
} from '../store/selectors/pbm-authorization-information.selectors';

import { adjusterCallbackDateNullOrTodayOrLaterValidator } from './authorization-information.validators';
import { ReassignClaimModalComponent } from './reassign-claim-modal/reassign-claim-modal.component';
import { PbmAuthorizationConfigService } from './pbm-authorization-configs/pbm-authorization-config.service';
import {
  PBM_AUTH_FOOTER_DEFAULT_CONFIG,
  PBM_AUTH_NOTES_DEFAULT_STATE,
  SaveDecisionRequest
} from '../store/models/pbm-authorization.models';
import { LoadingModalComponent } from '@shared/components/loading-modal/loading-modal.component';
import { getAuthorizationClaimNumberToRouteComparison } from '../store/selectors/pbm-authorization-reassign.selectors';
import { ViewLogModalService } from '../view-log-modal/view-log-modal.service';
import { PbmAuthNotesComponent } from './pbm-auth-notes/pbm-auth-notes.component';
import { getClaimV3 } from '@shared/store/selectors/claim.selectors';
import {
  FormValidationExtractorService,
  ErrorMessage
} from '@modules/form-validation-extractor';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { ErrorCardComponent } from '@modules/error-card';
import { PbmPaperFooterService } from './pbm-authorization-footer/pbm-paper-footer.service';
import { faCheck, faBadgeDollar } from '@fortawesome/pro-solid-svg-icons';
import { PbmAuthorizationService } from '../pbm-authorization.service';
import { PageTitleService } from '@shared/service/page-title.service';
import { PbmSuccessfulSubmissionModalService } from './pbm-successful-submission-modal/pbm-successful-submission-modal.service';
import {
  TrackFormValidationExtractionService,
  TrackIgnoredFeatureService
} from 'src/app/modules/rum';
import { PbmAuthorizationNote } from '../store/models/pbm-authorization-information/pbm-authorization-note.models';
import {
  PbmAuthorizationServiceType
} from '../store/models/pbm-authorization-service-type.models';

const moment = _moment;

@Component({
  selector: 'healthe-authorization-information',
  templateUrl: './pbm-authorization-information.component.html',
  styleUrls: ['./pbm-authorization-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FormValidationExtractorService,
    PbmPaperFooterService,
    TrackIgnoredFeatureService,
    TrackFormValidationExtractionService
  ]
})
export class PbmAuthorizationInformationComponent
  extends DestroyableComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(ErrorCardComponent)
  errorCardComponent: ErrorCardComponent;

  faExclamationTriangle = faExclamationTriangle;
  faBadgeDollar = faBadgeDollar;
  @ViewChild('submitBanner', { static: false }) submitBanner: ElementRef;

  mode: PbmAuthFormMode = PbmAuthFormMode.ReadWrite;
  showSuccessSubmitBanner$: Observable<boolean> = this.store$.pipe(
    select(getRxAuthorizationSubmitResponse),
    map((res) => res.response.successful),
    tap((successful) => {
      if (successful) {
        document
          .getElementById('auth-info-header-title')
          .scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    })
  );
  @ViewChild('authorizationNotes')
  notesSection: PbmAuthNotesComponent;
  encodedCustomerId$: Observable<string> = this.store$.pipe(
    takeWhileRouteActive('pbm'),
    select(getEncodedCustomerId)
  );
  authorizationDetailsNotes$: Observable<PbmAuthorizationNote[]> =
    this.store$.pipe(select(getAuthorizationDetailsNotes));
  decodedAuthorizationId$: Observable<string> = this.store$.pipe(
    takeWhileRouteActive('pbm'),
    select(getDecodedAuthorizationId)
  );
  encodedClaimNumber$: Observable<string> = this.store$.pipe(
    takeWhileRouteActive('pbm'),
    select(getEncodedClaimNumber)
  );
  decodedClaimNumber$: Observable<string> = this.store$.pipe(
    takeWhileRouteActive('pbm'),
    select(getDecodedClaimNumber)
  );
  userIsInternal$: Observable<boolean> = this.store$.pipe(
    select(isUserInternal),
    first()
  );
  isCurrentClaimNumberEqualsRoutedClaimNumber$ = this.store$.pipe(
    takeWhileRouteActive('pbm'),
    select(getAuthorizationClaimNumberToRouteComparison),
    takeUntil(this.onDestroy$)
  );
  authorizationDetails: AuthorizationDetails;
  authorizationDenialReasons$: Observable<AuthorizationDenialReason[]> =
    this.store$.pipe(select(getAuthorizationDenialReasons));
  showDenialReasons$: Observable<boolean> = this.store$.pipe(
    select(getShowDenialReasons)
  );
  showSecondDenialReason$: Observable<boolean> = this.store$.pipe(
    select(getShowSecondDenialReason)
  );
  authorizationActionLabel$: Observable<string> = this.store$.pipe(
    select(getAuthorizationActionLabel)
  );
  submitSamaritanDoseResponse$: Observable<
    VerticeResponse<AuthorizationDetails>
  > = this.store$.pipe(
    select(submitSamaritanDoseResponse),
    takeUntil(this.onDestroy$)
  );

  paperAuthorizationReassignResponse$: Observable<VerticeResponse<string>> =
    this.store$.pipe(
      select(getPaperAuthorizationReassignResponse),
      takeUntil(this.onDestroy$)
    );

  isLoading$: Observable<boolean> = this.store$.pipe(
    select(isAuthorizationIsLoading),
    takeUntil(this.onDestroy$)
  );

  private validationErrorFilter: ValidationErrorFilter;
  private validationErrors: ErrorMessage[];
  displayValidationErrors: ErrorMessage[];
  validationErrorMessages$: Observable<ErrorMessage[]> =
    this.fVES.errorMessages$.pipe(takeUntil(this.onDestroy$));

  authorizationFooterConfig: PbmAuthFooterConfig = {
    ...PBM_AUTH_FOOTER_DEFAULT_CONFIG
  };
  isReconsideration$: Observable<boolean> = this.store$.pipe(
    select(getIsReconsideration)
  );

  reviewerAlerts$: Observable<PbmAuthorizationReviewerAlert[]> =
    this.store$.pipe(select(getReviewerAlerts));
  showReassignmentBanner: boolean = false;
  phiMemberId: string;
  currentPhiMemberId: string;
  showRequestedCallbackFields: boolean = false;
  submitErrors: string[] = [];
  errorBannerTitle = '';
  userName: string = '';
  userName$: Observable<string> = this.store$.pipe(
    select(getUsername),
    first(),
    tap((userName) => (this.userName = userName))
  );
  saveLineItemDecision$: BehaviorSubject<SaveDecisionRequest> =
    new BehaviorSubject({ index: -1, successSubject: null });
  prescriptionNotesConfig: PbmAuthNotesConfig = {
    ...PBM_AUTH_NOTES_DEFAULT_STATE,
    noteTitle: 'Healthe CSC Internal Notes',
    placeholder: 'Enter Healthe Note',
    warnAboutSavingNote: false,
    autoExpandWhenNotesPresent: true
  };
  encodedAuthId$: Observable<string> = this.store$.pipe(
    select(getEncodedAuthorizationId)
  );
  isAuthorizationOnPend: boolean = false;
  userIsInternal: boolean;
  isAuthDataLoaded: boolean = false;

  showErrors = PBM_AUTH_FOOTER_DEFAULT_CONFIG.showErrors;

  submitClickedBefore = PBM_AUTH_FOOTER_DEFAULT_CONFIG.submitClickedBefore;
  @ViewChild('errorBannerSpacer')
  private errorBannerSpacer: ElementRef;
  faCheck = faCheck;

  constructor(
    private dialog: MatDialog,
    public store$: Store<RootState>,
    private confirmationModalService: ConfirmationModalService,
    public router: Router,
    private fb: FormBuilder,
    private pbmAuthorizationService: PbmAuthorizationService,
    private changeDetectionRef: ChangeDetectorRef,
    public pbmAuthorizationConfigService: PbmAuthorizationConfigService,
    public pbmSuccessfulSubmissionModalService: PbmSuccessfulSubmissionModalService,
    private viewLogModalService: ViewLogModalService,
    public snackbar: MatSnackBar,
    public fVES: FormValidationExtractorService,
    private pageTitleService: PageTitleService
  ) {
    super();
    this.pbmSuccessfulSubmissionModalService.setConfigService(
      this.pbmAuthorizationConfigService
    );
    this.store$
      .pipe(
        takeWhileRouteActive('pbm'),
        select(getPbmAuthStatusView),
        takeUntil(this.onDestroy$)
      )
      .subscribe((statusView) =>
        !!statusView
          ? this.pageTitleService.setTitleWithClaimNumberAndAuthorizationId(
              'POS Authorization',
              'Information for ' + statusView.toString()
            )
          : this.pageTitleService.setTitleWithClaimNumberAndAuthorizationId(
              'POS Authorization',
              'Information'
            )
      );
    this.validationErrorMessages$.subscribe((errors) => {
      this.validationErrors = errors;
    });
  }

  get lineItems(): FormArray {
    return this.pbmAuthorizationConfigService.authorizationFormGroup.get(
      'lineItemsFormArray'
    ) as FormArray;
  }

  ngOnInit() {
    this.submitErrors = [];
    this.fVES.registerErrorMessage({
      dateMustBeInFuture: 'Please select a date in the future.',
      invalidDate:
        'The date entered is not in a recognized format (MM/DD/YYYY).',
      dateBeyondMaxDate: 'The date entered is beyond the max date.',
      min: 'Amount should be 0 or greater',
      dateIsBeforeToday: 'Past date not allowed',
      noPendActionToSubmitPaper: 'Paper (Retro) Bill cannot be process unless item is approved/denied. Please click "Save" if you want to pend any line item(s)'
    });
    this.pbmAuthorizationConfigService.authorizationLevelAccessMode$
      .pipe(filter((mode) => mode === PbmAuthFormMode.ReadWrite))
      .subscribe((mode) => {
        if (mode === PbmAuthFormMode.ReadWrite) {
          // Check if the claim number changes
          this.isCurrentClaimNumberEqualsRoutedClaimNumber$.subscribe(
            ({ isEqual, decodedClaimNumber, currentClaimNumber }) => {
              // This means the reassignment took place
              if (!isEqual && decodedClaimNumber && currentClaimNumber) {
                let newUrl = this.router.url.replace(
                  hexEncode(decodedClaimNumber),
                  hexEncode(currentClaimNumber)
                );
                this.router.navigate([newUrl]).then(() => {
                  window.location.reload();
                });
              }
            }
          );

          this.userIsInternal$.pipe(first()).subscribe((userIsInternal) => {
            this.userIsInternal = userIsInternal;
          });
        }
      });
    this.pbmAuthorizationConfigService.showReassignModalRef$
      .pipe(
        mergeMap((showModal) =>
          this.store$.pipe(
            select(
              createSelector(
                getClaimV3,
                getDecodedAuthorizationId,
                (claim, id) => [showModal, claim, id]
              )
            )
          )
        )
      )
      .subscribe(([show, ci, authId]: [boolean, ClaimV3, string]) => {
        if (show) {
          this.openReassignClaim(
            ci.claimant.firstName,
            ci.claimant.lastName,
            ci.header.hesClaimNumber,
            authId
          );
        }
      });

    this.pbmAuthorizationConfigService.showViewLogModalRef$
      .pipe(
        mergeMap((showModal) =>
          this.decodedAuthorizationId$.pipe(map((id) => [showModal, id]))
        )
      )
      .subscribe(([show, authId]: [boolean, string]) => {
        if (show) {
          this.openViewLogData(authId);
        }
      });
    this.store$
      .pipe(
        select(getAuthorizationReassignedIndicator),
        first(
          (phis) =>
            phis !== null &&
            phis.phiMemberId !== null &&
            phis.currentPhiMemberId !== null
        )
      )
      .subscribe((phis) => {
        this.showReassignmentBanner =
          phis.phiMemberId !== phis.currentPhiMemberId;
        this.phiMemberId = phis.phiMemberId;
        this.currentPhiMemberId = phis.currentPhiMemberId;
      });

    this.store$
      .pipe(
        select(getAuthorizationDetails),
        takeUntil(this.onDestroy$),
        filter(
          (details) =>
            details !== null &&
            details.authorizationLineItems !== null &&
            details.authorizationLineItems.length > 0
        ),
        tap((details) => {
          this.authorizationDetails = details;
          this.pbmAuthorizationConfigService.authorizationFormGroup
            .get('isPatientWaitingFormControl')
            .setValue(details.patientWaiting);
          this.isAuthDataLoaded = true;

          // Adjuster Callback logic
          if (
            'AWAITING_DECISION' === details.authorizationDetailsHeader.status &&
            !details.patientWaiting
          ) {
            const fg: FormGroup =
              this.pbmAuthorizationConfigService.authorizationFormGroup.get(
                'adjusterRequestCallbackFormGroup'
              ) as FormGroup;
            fg.addControl(
              'date',
              new FormControl(
                null,
                adjusterCallbackDateNullOrTodayOrLaterValidator
              )
            );
            fg.addControl('time', new FormControl('07:00:00'));

            this.showRequestedCallbackFields = true;
          }
        }),
        finalize(() => {
          if (
            'COMPLETE' ===
            this.authorizationDetails.authorizationDetailsHeader.status
          ) {
            this.authorizationFooterConfig.isCompletedAuthorization = true;
          }
        })
      )
      .subscribe((cardConfigs) => {
        this.changeDetectionRef.detectChanges();
      });

    this.submitSamaritanDoseResponse$.subscribe((response) => {
      if (response && response.errors && response.errors.length > 0) {
        this.showLineItemActionErrors(response.errors);
      }
    });

    this.paperAuthorizationReassignResponse$
      .pipe(
        mergeMap((response: VerticeResponse<string>) =>
          this.decodedClaimNumber$.pipe(
            map((decodedClaimNumber) => [response, decodedClaimNumber])
          )
        )
      )
      .subscribe(
        ([response, decodedClaimNumber]: [VerticeResponse<string>, string]) => {
          if (response) {
            if (response.errors && response.errors.length > 0) {
              this.displayErrors(
                response.errors,
                'Reassignment of Retro (Paper) Bill',
                null
              );
            } else {
              this.confirmationModalService
                .displayModal(
                  {
                    titleString: 'Retro (Paper) Bill Reassignment Successful',
                    bodyHtml:
                      'Retro (Paper) Bill Claim # ' +
                      decodedClaimNumber +
                      ' was successfully reassingned to Claim # ' +
                      response.responseBody +
                      '.<br><br>' +
                      'Selecting a new claim requires the bill to be reprocessed through the established ' +
                      'program edits and may result in pricing changes and/or additional prior authorizations.',
                    affirmString: 'OK',
                    affirmClass: 'success-button'
                  },
                  '250px'
                )
                .afterClosed()
                .subscribe(() => {
                  this.router.navigate(['/search-nav/paper-authorizations']);
                });
            }
          }
        }
      );
    this.changeDetectionRef.detectChanges();
  }

  ngAfterViewInit(): void {}

  saveInternalNote(note: string) {
    this.encodedAuthId$.pipe(first()).subscribe((encodedAuthId) => {
      this.store$.dispatch(postInternalNote({ note, encodedAuthId }));
    });
  }

  addNoteToAuthorization(note: string) {
    this.pbmAuthorizationConfigService.authorizationLevelNotesConfig$
      .pipe(first())
      .subscribe((config) => {
        let newNote: PbmAuthorizationNote;
        if (config.historyNotes) {
          // The note only needs the comment and the parentId to be saved
          newNote = {
            comment: note,
            userId: this.userName,
            userModified: this.userName,
            userRole: null,
            noteId: null,
            dateTimeCreated: moment(new Date()).format('hh:mm A MM/DD/YYYY'),
            dateTimeModified: moment(new Date()).format('hh:mm A MM/DD/YYYY')
          };
          (
            this.authorizationDetails
              .authorizationNotes as PbmAuthorizationNote[]
          ).push(newNote);
        } else {
          newNote = this.authorizationDetails
            .authorizationNotes as PbmAuthorizationNote;
          if (newNote) {
            newNote.comment = note;
          } else {
            newNote = {
              comment: note,
              userId: this.userName,
              userModified: this.userName,
              userRole: null,
              noteId: null,
              dateTimeCreated: moment(new Date()).format('hh:mm A MM/DD/YYYY'),
              dateTimeModified: moment(new Date()).format('hh:mm A MM/DD/YYYY')
            };
          }
        }
        this.store$.dispatch(
          saveRxAuthNote({
            note: newNote
          })
        );
        this.checkIfPendNotesRequired();
      });
  }

  checkIfPendNotesRequired(isPendRequired?: boolean) {
    this.pbmAuthorizationConfigService.authorizationLevelNotesConfig$
      .pipe(first())
      .subscribe((config) => {
        if (config.pendActionCondition) {
          if (this.isAuthorizationOnPend) {
            config.requiredErrorMessage =
              'Explanatory comments are required if pending is selected for any item.';
            if (!this.notesSection.expansionPanelComponent.expanded) {
              this.notesSection.expansionPanelComponent.open();
            }
          } else {
            config.requiredErrorMessage = 'Please enter a note.';
            if (
              this.notesSection.expansionPanelComponent.expanded &&
              this.notesSection.notes.length === 0
            ) {
              this.notesSection.expansionPanelComponent.close();
            }
          }
          this.checkUserNotesInput(isPendRequired);
        }
      });
  }

  checkUserNotesInput(isPendNoteRequired: boolean) {
    const userNoteIndex = this.notesSection.notes.findIndex(
      (note: PbmAuthorizationNote) =>
        note.userRole !== 'HES' && note.userRole !== 'SYSTEM'
    );
    if (userNoteIndex === -1 && isPendNoteRequired) {
      this.pbmAuthorizationConfigService.authorizationFormGroup
        .get('noteFormControl')
        .setValidators(Validators.required);
      this.pbmAuthorizationConfigService.authorizationFormGroup
        .get('noteFormControl')
        .markAsTouched();

      this.notesSection.lastElement.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      });
      setTimeout(() => {
        this.notesSection.notesInputElement.focus();
      }, 1000);
    } else {
      this.pbmAuthorizationConfigService.authorizationFormGroup
        .get('noteFormControl')
        .clearValidators();
    }
    this.pbmAuthorizationConfigService.authorizationFormGroup
      .get('noteFormControl')
      .updateValueAndValidity();
  }

  setSubmittedClickedBefore($event) {
    this.submitClickedBefore = $event;
  }
  setShowValidationErrors($event) {
    this.showErrors = $event;
  }

  setValidationErrorFilter($event: ValidationErrorFilter) {
    this.validationErrorFilter = $event;
    this.builtDisplayValidationErrors();
  }

  builtDisplayValidationErrors() {
    this.displayValidationErrors = this.validationErrorFilter
      ? this.validationErrors.filter(
          (errorMessage) =>
            !this.validationErrorFilter ||
            (this.validationErrorFilter &&
              this.validationErrorFilter.includeFilter &&
              this.validationErrorFilter.includeFilter.find((filterPredicate) =>
                errorMessage.path.includes(filterPredicate)
              )) ||
            (this.validationErrorFilter &&
              this.validationErrorFilter.removeFilter &&
              !this.validationErrorFilter.removeFilter.find((filterPredicate) =>
                errorMessage.path.includes(filterPredicate)
              ))
        )
      : this.validationErrors;
  }

  useDisplayErrors($event) {
    this.displayErrors(
      $event.errors,
      $event.errorBannerTitle,
      $event.apiFailureMessage
    );
  }

  displayErrors(
    errors: string[],
    errorBannerTitle: string,
    apiFailureMessage: string
  ) {
    const apiFailureMessageArray = apiFailureMessage ? [apiFailureMessage] : [];
    this.submitErrors =
      errors && errors.length > 0 ? errors : apiFailureMessageArray;

    if (this.submitErrors && this.submitErrors.length > 0) {
      this.errorBannerSpacer.nativeElement.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      });
    }

    this.errorBannerTitle = errorBannerTitle;
    this.changeDetectionRef.detectChanges();
  }

  showLineItemActionErrors(errors: string[]) {
    this.displayErrors(errors, 'Line Item Action Errors', '');
  }

  goToElement(el: HTMLElement) {
    el.scrollIntoView({ block: 'center', inline: 'center' });
    el.focus();
  }

  addPaperAuthNote(note: string) {
    this.decodedAuthorizationId$.pipe(first()).subscribe((authId) => {
      this.pbmAuthorizationService
        .savePaperAuthNote(note, authId)
        .pipe(first())
        .subscribe((result) => {
          if (result.errors && result.errors.length > 0) {
            this.displayErrors(
              result.errors,
              'Saving Authorization Note Failed!',
              ''
            );
          }
        });
    });
  }

  private async openReassignClaim(
    claimantFirstName: string,
    claimantLastName: string,
    originalClaimNumber: string,
    authorizationId: string
  ): Promise<void> {
    this.dialog
      .open(ReassignClaimModalComponent, {
        height: '730px',
        width: '1200px',
        data: { claimantFirstName, claimantLastName, originalClaimNumber }
      })
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((response) => {
        if (response) {
          this.showConfirm(response, originalClaimNumber, authorizationId);
        }
      });
  }

  private async openViewLogData(authorizationId: string): Promise<void> {
    this.viewLogModalService.viewLogData(authorizationId);
  }

  private showConfirm(
    reassign: PbmReassignNewClaim,
    originalClaimNumber,
    authorizationId
  ) {
    this.confirmationModalService
      .displayModal({
        titleString: 'Submit',
        bodyHtml:
          'Are you sure you want to reassign this transaction from Claim '
            .concat(originalClaimNumber)
            .concat(' to Claim ')
            .concat(reassign.claimNumber)
            .concat('?'),
        affirmString: 'Submit',
        denyString: 'Cancel',
        affirmClass: 'success-button'
      })
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isSubmit) => {
        if (!isSubmit) {
          this.pbmAuthorizationConfigService.showReassignModalRef$.next(true);
        } else {
          this.dialog.open(LoadingModalComponent, {
            width: '700px',
            data: 'Reassigning...'
          });
          this.pbmAuthorizationConfigService.reassignToNewClaim(
            authorizationId,
            reassign
          );
        }
      });
  }

  showInitializationErrorsBanner() {
    let element = document.getElementById(
      'pbm-auth-initializationErrorsBanner'
    );

    if (element) {
      element.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
}
