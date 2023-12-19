import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, filter, first, takeWhile } from 'rxjs/operators';

import { RootState } from '../../../../../../store/models/root.models';
import {
  getDecodedReferralId,
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../../store/selectors/router.selectors';
import {
  rollbackTripsAuthorized,
  setAuthorizationIsSuccessfullySubmitted
} from '../../../store/actions/referral-authorization.actions';
import { ReferralSubmitError } from '../../../store/models/fusion/fusion-make-a-referral.models';
import {
  AuthorizationActionSetStatus,
  AuthorizationInformationService
} from '../../referral-authorization/authorization-information.service';
import {
  ActionReasonSelectSet,
  AuthApprovalState,
  ReferralAuthorizationAction,
  ReferralAuthorizationItem,
  ReferralAuthorizationType
} from '../../referral-authorization/referral-authorization.models';
import {
  PostReferralNoteRequest,
  PostReferralNoteRequestSuccess
} from '../../../store/actions/referral-notes.actions';
import { getUsername } from '../../../../../../user/store/selectors/user.selectors';
import { CancelTransportationReferralModalService } from '../cancel-transportation-referral-modal/cancel-transportation-referral-modal.service';
import { CancelTransportationReferralModalModelActionResultType } from '../cancel-transportation-referral-modal/cancel-transportation-referral-modal.model';
import { ErrorBannerMessages } from '../../referral-authorization/transportation/transportation-authorization/transportation-authorization.component';
import { LoadingModalComponent } from '@shared/components/loading-modal/loading-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { InformationModalService } from '@shared/components/information-modal/information-modal.service';
import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'healthe-referral-authorization-footer',
  templateUrl: './referral-authorization-footer.component.html',
  styleUrls: ['./referral-authorization-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralAuthorizationFooterComponent implements OnInit, OnDestroy {
  @Input()
  referralAuthorizationType: ReferralAuthorizationType;

  @Input()
  authorizationItems: ReferralAuthorizationItem[];

  @Input()
  formGroup: FormGroup;

  @Input()
  referralAuthorizationAction: ReferralAuthorizationAction;

  @Input()
  isCancelOnly: boolean = false;

  @Output()
  denialSubmit: EventEmitter<null> = new EventEmitter<null>();

  @Output()
  submissionErrors: EventEmitter<ErrorBannerMessages> = new EventEmitter<
    ErrorBannerMessages
  >();

  actionChoicesControl = new FormControl();
  approvalReasonControl = new FormControl();
  initialFormValues : any;

  AuthApprovalState = AuthApprovalState;
  approvalValue: AuthApprovalState = null;

  hiddenReasonSelect: ActionReasonSelectSet = {
    selectPlaceholder: 'APPROVE (ALL)',
    selectLabel: '',
    selectReasons: [],
    errorMessage: ''
  };
  actionReasonSelectSet: ActionReasonSelectSet = this.hiddenReasonSelect;
  actionReasonChange$: Subject<AuthApprovalState> = new Subject<
    AuthApprovalState
  >();

  isAlive = true;
  submitButtonInitialState = true;
  isSubmitEnabled = true;
  rollbackTripsAuthorized = false;

  constructor(
    private authorizationInformationService: AuthorizationInformationService,
    private confirmationModalService: ConfirmationModalService,
    private store$: Store<RootState>,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public matDialog: MatDialog,
    private cancelTransportationReferralService: CancelTransportationReferralModalService,
    private informationModalService: InformationModalService
  ) {}

  ngOnInit(): void {
    if (this.referralAuthorizationType === ReferralAuthorizationType.OPEN) {
      this.actionChoicesControl.setValidators(Validators.required);
    }

    // I tried multiple ways to get these reason into the modal, but when I injected the authorizationInformationService
    // the reasons were blank.  I spent a few hours debugging it and could not find out why.
    this.cancelTransportationReferralService.cancelReasons = this.authorizationInformationService.denialReasonSelectSet.selectReasons;

    this.authorizationInformationService.resetFormEvent
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => {
        this.clearSelections();
      });

    this.actionChoicesControl.valueChanges
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((value) => {
        if (value === 'Deny') {
          this.rollbackTripsAuthorized = true;
        } else {
          this.rollbackTripsAuthorized = false;
        }

        this.actionReasonChange$.next(value);
      });

    this.actionReasonChange$
      .pipe(
        debounceTime(100),
        takeWhile(() => this.isAlive)
      )
      .subscribe((value) => {
        this.approvalValue = value;
        this.setApprovalReasonForTypeInFooter(value);
      });

    this.approvalReasonControl.valueChanges
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((value) => {
        this.invokeApprovalAction(value);

        if (
          this.referralAuthorizationType === ReferralAuthorizationType.OPEN &&
          (value || this.approvalValue === AuthApprovalState.Approve)
        ) {
          this.isSubmitEnabled = true;
        }
      });

    this.authorizationInformationService.didUserChangeAuthStateOrReason
      .pipe(
        filter(
          (authActionEvent) => authActionEvent.didUserChangeAuthStateOrReason
        ),
        takeWhile(() => this.isAlive)
      )
      .subscribe((authActionEvent) => {
        if (
          this.referralAuthorizationType ===
            ReferralAuthorizationType.DETAILED &&
          !authActionEvent.actionFromFooter
        ) {
          this.clearSelections();
        }
      });

    this.authorizationInformationService.isAuthInformationValid
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((value) => {
        this.isSubmitEnabled = this.submitButtonInitialState || value;

        this.changeDetectorRef.detectChanges();
      });
    this.initForms();
  }

  clearSelections() {
    this.actionChoicesControl.setValue(null, { emitEvent: false });
    this.approvalReasonControl.setValue(null, { emitEvent: false });
    this.actionReasonSelectSet = this.hiddenReasonSelect;
  }

  invokeApprovalAction(reason: string) {
    if (this.referralAuthorizationType === ReferralAuthorizationType.OPEN) {
      this.performApprovalAction(reason);
    } else {
      this.authorizationInformationService.didUserChangeAuthStateOrReason
        .pipe(first())
        .subscribe((authActionEvent) => {
          if (false === authActionEvent.didUserChangeAuthStateOrReason) {
            this.performApprovalAction(reason);
          } else {
            let selectionText = '';
            switch (this.approvalValue) {
              case AuthApprovalState.Approve:
                selectionText = 'Approve All';
                break;
              case AuthApprovalState.Deny:
                selectionText = 'Deny All';
                break;
              case AuthApprovalState.Pending:
                selectionText = 'Pend All';
                break;
            }

            let bodyText =
              'You have already chosen an action on individual line item(s). By selecting ' +
              selectionText +
              ' you will be overriding your previous selections. Are you sure you want to do this?';

            this.confirmationModalService
              .displayModal({
                titleString: 'Changing Approval Status',
                bodyHtml: bodyText,
                affirmString: 'Override All',
                denyString: 'cancel'
              })
              .afterClosed()
              .subscribe((result) => {
                if (result) {
                  this.performApprovalAction(reason);
                } else {
                  this.clearSelections();
                }
              });
          }
        });
    }
  }

  performApprovalAction(reason: string) {
    const authorizationAction: AuthorizationActionSetStatus = {
      authApprovalState: this.approvalValue,
      reason: reason
    };

    this.authorizationInformationService.setApproval.next(authorizationAction);
    this.authorizationInformationService.didUserChangeAuthStateOrReason.next({
      didUserChangeAuthStateOrReason: false,
      actionFromFooter: true
    });
  }

  setApprovalReasonForTypeInFooter(value: AuthApprovalState) {
    this.approvalReasonControl.setValue(null, {
      emitEvent: false
    });

    switch (value) {
      case AuthApprovalState.Approve:
        this.actionReasonSelectSet = this.hiddenReasonSelect;
        if (this.referralAuthorizationType === ReferralAuthorizationType.OPEN) {
          this.approvalReasonControl.setValidators(null);
          this.approvalReasonControl.updateValueAndValidity();
        }
        this.invokeApprovalAction(null);
        break;
      case AuthApprovalState.Deny:
        this.actionReasonSelectSet = this.authorizationInformationService.denialReasonSelectSet;
        if (this.referralAuthorizationType === ReferralAuthorizationType.OPEN) {
          this.approvalReasonControl.setValidators(Validators.required);
          this.approvalReasonControl.updateValueAndValidity();
          this.invokeApprovalAction(null);
        }
        break;
      case AuthApprovalState.Pending:
        this.actionReasonSelectSet = this.authorizationInformationService.pendingReasonSelectSet;
        if (this.referralAuthorizationType === ReferralAuthorizationType.OPEN) {
          this.approvalReasonControl.setValidators(Validators.required);
          this.approvalReasonControl.updateValueAndValidity();
          this.invokeApprovalAction(null);
        }
        break;
    }
  }

  goToAuthorizationQueue(): void {
    this.router.navigate(['referrals', 'authorizations']);
  }

  submit(): void {
    this.authorizationInformationService.isAuthInformationValid
      .pipe(first())
      .subscribe((isAuthInformationValid) => {
        if (isAuthInformationValid) {
          // Since we're making an API call, reset the error messages currently displayed for the user
          this.submissionErrors.emit({ title: '', errors: [] });
          if (this.rollbackTripsAuthorized) {
            this.store$.dispatch(rollbackTripsAuthorized());
          }

          this.isSubmitEnabled = false;
          this.changeDetectorRef.detectChanges();

          if (
            this.referralAuthorizationType === ReferralAuthorizationType.OPEN
          ) {
            this.doOpenAuthSubmit();
          } else {
            this.doDetailedAuthSubmit();
          }
        } else {
          this.submitButtonInitialState = false;
          this.isSubmitEnabled = false;
          this.actionChoicesControl.markAsTouched();
          this.approvalReasonControl.markAsTouched();
          this.authorizationInformationService.showValidationErrors.next();
        }
      });
  }

  private doOpenAuthSubmit() {
    // This event will cause the form values to be reverted back to the original state.
    // when the submit is a denial type
    if (this.actionChoicesControl.value === AuthApprovalState.Deny) {
      this.denialSubmit.emit();
    }

    combineLatest([
      this.store$.pipe(select(getEncodedCustomerId)),
      this.store$.pipe(select(getEncodedReferralId)),
      this.store$.pipe(select(getUsername))
    ])
      .pipe(first())
      .subscribe(([encodedCustomerId, encodedReferralId, username]) => {
        this.authorizationInformationService
          .postOpenTransportationAuthorization(
            encodedCustomerId,
            encodedReferralId,
            this.formGroup.value
          )
          .subscribe((value) => {
            this.isSubmitEnabled = true;
            this.handleOpenAuthSubmitResponse(
              value,
              this.formGroup.value['additionalNotes'],
              username
            );
            this.changeDetectorRef.detectChanges();
          });
      });
  }

  private doDetailedAuthSubmit() {
    combineLatest([
      this.store$.pipe(select(getEncodedCustomerId)),
      this.store$.pipe(select(getEncodedReferralId)),
      this.store$.pipe(select(getUsername))
    ])
      .pipe(first())
      .subscribe(([encodedCustomerId, encodedReferralId, username]) => {
        this.authorizationInformationService
          .postDetailedTransportationAuthorization(
            encodedCustomerId,
            encodedReferralId,
            this.formGroup.value
          )
          .subscribe((value) => {
            this.isSubmitEnabled = true;
            this.handleDetailedAuthSubmitResponse(
              value,
              this.formGroup.value['additionalNotes'],
              username
            );
            this.changeDetectorRef.detectChanges();
          });
      });
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  // The purpose of this is to handle a special case.  If you click approve then change something itinerary item to something other
  // than approve, then go and click approve again, nothing would happen because the control still thought it was in approve mode
  // and would not fire a change event.  Deny/Pend trigger changes based on the select dropdown, not the radio buttons and do not have this issue.
  chooseApprove() {
    this.actionReasonChange$.next(AuthApprovalState.Approve);
  }

  private handleOpenAuthSubmitResponse(
    value: ReferralSubmitError,
    newNote: string,
    username: string
  ) {
    // Currently there is null response when there are no errors
    if (null == value) {
      this.store$.dispatch(
        setAuthorizationIsSuccessfullySubmitted({
          authorizationIsSuccessfullySubmitted: true
        })
      );
      if (newNote != null && newNote !== '') {
        this.store$.dispatch(
          new PostReferralNoteRequestSuccess({
            note: newNote,
            username: username
          })
        );
      }
    } else {
      // Update the errors so that the error banner appears and displays them
      this.submissionErrors.emit({
        title:
          'The authorization submission has failed with the following errors. Please try again or contact Healthesystems for assistance.',
        errors: value.messages
      });
    }
  }

  private handleDetailedAuthSubmitResponse(
    value: ReferralSubmitError,
    newNote: string,
    username: string
  ) {
    // Currently there is null response when there are no errors
    if (null == value) {
      this.store$.dispatch(
        setAuthorizationIsSuccessfullySubmitted({
          authorizationIsSuccessfullySubmitted: true
        })
      );
      if (newNote != null && newNote !== '') {
        this.store$.dispatch(
          new PostReferralNoteRequestSuccess({
            note: newNote,
            username: username
          })
        );
      }
    } else {
      // Update the errors so that the error banner appears and displays them
      this.submissionErrors.emit({
        title:
          'The authorization submission has failed with the following errors. Please try again or contact Healthesystems for assistance.',
        errors: value.messages
      });
    }
  }

  public isAuthorizeMode(): boolean {
    return (
      this.referralAuthorizationAction === ReferralAuthorizationAction.AUTHORIZE
    );
  }

  modifyReferralClicked(): void {
    // I hate to do this every time, but these form group members are not needed and are in an invalid state always.
    // I did spend some time trying to figure out where they were created, but also was not sure what to even do
    // if I found where they were made.  I am paranoid of fixing this and breaking it for something else
    // so I am just going to do this everytime here.
    const formGroup0: FormGroup = (this.formGroup.controls[
      'authItems'
    ] as FormArray).at(0) as FormGroup;
    formGroup0.controls['AuthAction_ApprovalReason'].disable();
    formGroup0.controls['AuthAction_ApprovalType'].disable();

    if (this.formGroup.valid ) {
      if(this.isIsFormUpdated(this.formGroup.value.authItems[0])){
        this.submissionErrors.emit({
          title:'',
          errors: []
        });
        this.confirmationModalService
          .displayModal({
            titleString: 'Modify Referral?',
            bodyHtml: "Are you sure you'd like to modify the authorization?",
            affirmString: 'SUBMIT',
            denyString: 'GO BACK'
          })
          .afterClosed()
          .subscribe((result) => {
            if (result) {
               this.store$
                 .pipe(
                   select(getEncodedReferralId),
                   first()
                 )
                 .subscribe((encReferralId) => {
                   this.submissionErrors.emit({ title: '', errors: [] });
                   const loadingDialogRef = this.matDialog.open(
                     LoadingModalComponent,
                     {
                       width: '700px',
                       data: 'Modifying authorization...'
                     }
                   );

                   this.authorizationInformationService
                     .postOpenTransportationAuthorizationModification(
                       encReferralId,
                       this.formGroup.value
                     )
                     .subscribe(
                       (response) => {
                         loadingDialogRef.close();
                         if (response.errors && response.errors.length > 0) {
                           this.submissionErrors.emit({
                             title:
                               'Errors while attempting to modify authorizations.',
                             errors: response.errors
                           });
                         } else {
                           let additionalNotesValue = this.formGroup.value
                             .additionalNotes;
                           if (
                             !!additionalNotesValue &&
                             additionalNotesValue !== ''
                           ) {
                             this.store$.dispatch(
                               new PostReferralNoteRequest({
                                 referralId: encReferralId,
                                 note: additionalNotesValue,
                                 archType: 'transportation'
                               })
                             );
                           }

                           this.informationModalService.displayModal({
                             titleString: 'Referral modified successfully',
                             bodyHtml:
                               'The authorization was successfully modified. Click OK to view referral activity.',
                             affirmString: 'OK',
                             affirmClass: 'success-button',
                             minHeight: '190px'
                           });

                           this.authorizationInformationService.reloadActivityData.next();
                           this.router.navigate(['../activity/grid'], {
                             relativeTo: this.activatedRoute
                           });
                         }
                       },
                       (error) => {
                         loadingDialogRef.close();
                         this.submissionErrors.emit({
                           title:
                             'Errors while attempting to modify authorizations.',
                           errors: [
                             'A general error occurred, please contact HealheSystems.'
                           ]
                         });
                       }
                     );
                 });
             }
          });
      }
      else{
        this.submissionErrors.emit({
          title:
            'Errors while attempting to modify authorizations.',
          errors: [
            'The request could not be processed, the authorization is unchanged.'
          ]
        });
      }
    }
  }

  cancelReferralClicked(): void {
    this.submissionErrors.emit({ title: '', errors: [] });
    this.store$
      .pipe(
        select(getDecodedReferralId),
        first()
      )
      .subscribe((authId) => {
        this.cancelTransportationReferralService
          .showModal(this.authorizationItems, +authId)
          .subscribe((result) => {
            switch (result.actionResult) {
              case CancelTransportationReferralModalModelActionResultType.Cancel:
                break;

              case CancelTransportationReferralModalModelActionResultType.Fail:
                this.submissionErrors.emit({
                  title:
                    'Errors while attempting to cancel authorizations. Referral cancellation has failed. Please try again later.',
                  errors: result.errors
                });

                break;

              case CancelTransportationReferralModalModelActionResultType.Success:
                this.authorizationInformationService.reloadActivityData.next();
                this.router.navigate(['../activity/grid'], {
                  relativeTo: this.activatedRoute
                });
                break;
            }
          });
      });
  }

  isIsFormUpdated(formValue): boolean {
    if (formValue) {
      formValue.startDate = moment(formValue.startDate).hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
      formValue.endDate = moment(formValue.endDate).hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
      return Object.keys(formValue).some((key) => JSON.stringify(formValue[key]) !== JSON.stringify(this.initialFormValues[key]));
    }
  }

  initForms() {
    let formValue = this.formGroup.value.authItems[0];
    formValue.startDate = moment(formValue.startDate).hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    formValue.endDate = moment(formValue.endDate).hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    const { value, ...initialFormValues } = formValue;
    this.initialFormValues = initialFormValues;
  }
}
