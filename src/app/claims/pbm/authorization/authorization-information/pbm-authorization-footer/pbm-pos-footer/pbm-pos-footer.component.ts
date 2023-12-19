import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ErrorCardComponent } from '@modules/error-card';
import * as _moment from 'moment';
import { createSelector, select, Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { FormValidationExtractorService } from '@modules/form-validation-extractor';
import { first, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { generatePBMAuthTimeOptions } from '@shared/lib/options/generatePBMAuthTimeOptions';
import {
  ApprovalPeriodType,
  AuthorizationDenialReason,
  DenialPeriodType,
  PbmAuthFooterConfig,
  PbmAuthFormMode,
  PbmAuthPOSFooterConfig,
  PbmAuthSubmitMessage,
  PbmAuthSubmitMessageLineItem,
  PbmAuthSubmitResponse,
  PbmPosAuthorizationSaveRequest
} from '../../../store/models/pbm-authorization-information.model';
import { PbmAuthorizationService } from '../../../pbm-authorization.service';
import {
  saveDecision,
  submitRxAuthorization
} from '../../../store/actions/pbm-authorization-information.actions';
import {
  getEncodedAuthorizationId,
  getEncodedClaimNumber,
  getDecodedClaimNumber,
  getEncodedCustomerId,
  getPbmAuthStatusView,
  getPbmServiceType
} from 'src/app/store/selectors/router.selectors';
import {
  getAuthorizationDetails,
  getRxAuthorizationSubmitResponse,
  isRxAuthorizationSubmitting
} from '../../../store/selectors/pbm-authorization-information.selectors';
import { PbmAuthorizationConfigService } from '../../pbm-authorization-configs/pbm-authorization-config.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingModalComponent } from '@shared/components/loading-modal/loading-modal.component';
import { PbmPosFooterService } from '../pbm-pos-footer.service';
import { SaveDecisionRequest } from '../../../store/models/pbm-authorization.models';
import { getDecodedCustomerId } from '../../../../../../../../projects/lomn/src/app/store/selectors/router.selectors';
import { HealtheSnackBarService } from '@shared/service/snackbar.service';

const moment = _moment;

@Component({
  selector: 'healthe-pbm-pos-footer',
  templateUrl: './pbm-pos-footer.component.html',
  styleUrls: ['./pbm-pos-footer.component.scss']
})
export class PbmPosFooterComponent
  extends DestroyableComponent
  implements OnInit
{
  @Input()
  scrollToTarget: ElementRef;
  @Input()
  submitted: boolean;
  @Input()
  userIsInternal$: Observable<boolean>;
  @Input()
  authorizationDenialReasons$: Observable<AuthorizationDenialReason[]>;
  @Input()
  pbmAuthFooterConfig: PbmAuthFooterConfig;
  @Input()
  errorCardComponent: ErrorCardComponent;
  @Input()
  saveLineItemDecision$: BehaviorSubject<SaveDecisionRequest>;
  @Output()
  displayErrors = new EventEmitter();
  @Output()
  submittedClickedBefore = new EventEmitter();
  @Output()
  showValidationErrors = new EventEmitter();
  @Output()
  showInitializationErrorsBanner = new EventEmitter();
  @Output()
  setValidationErrorFilter = new EventEmitter();

  submittingRxAuth$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(isRxAuthorizationSubmitting)
  );

  rxAuthorizationSubmitResponse$: Observable<{
    response: PbmAuthSubmitResponse;
    isLastDecisionSave: boolean;
  }> = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getRxAuthorizationSubmitResponse)
  );

  redirectToReviewScreen = createSelector(
    getEncodedClaimNumber,
    getEncodedCustomerId,
    getEncodedAuthorizationId,
    getPbmServiceType,
    (eClaimNumber, eCustomerId, eAuthorizationId, serviceType) => {
      return [eClaimNumber, eCustomerId, eAuthorizationId, serviceType];
    }
  );

  pbmAuthFormMode = PbmAuthFormMode;
  timeDropdownValues = generatePBMAuthTimeOptions(
    moment().startOf('day').add(1230, 'minutes'),
    moment().startOf('day').add(7, 'hours')
  );
  submitButtonLabel: string = 'SUBMIT';
  cancelButtonLabel: string = 'CANCEL';
  saveButtonDisabled: boolean = false;
  isSubmitting: boolean = false;
  submissionSuccess: boolean = false;
  pbmPOSAuthConfig: PbmAuthPOSFooterConfig;
  userIsInternal: boolean;
  firstLoadedPage: boolean;
  today: Date = new Date();
  isOnSaveDecisionMode: boolean = false;
  isAwaitingDecision: boolean = false;
  originalPatientWaitingStatus: boolean = false;
  showSendNotificationToAdjuster: boolean = false;
  cscAuthStatusQueueSelectedTab = null;
  forInternalUsersShowCallBackAndInjuredWorkerOptions = true;

  // For some customers (travelers) this option is not available.  This is based on the claim customer, not user,
  // So the customer config system is not of any use here.  IE: Internal users who are working with Traveler's claims,
  // will not see the send notification options.
  removeSendNotificationToAdjuster: boolean = false;

  loadingDialog: MatDialogRef<LoadingModalComponent, any>;
  private authorizationDetails$ = this.store$.pipe(
    select(getAuthorizationDetails)
  );
  getPbmAuthStatusView$ = this.store$.pipe(select(getPbmAuthStatusView));
  urlStatus: string;
  returnToQueueLabel = 'RETURN TO AUTHORIZATION QUEUE';

  get adjusterRequestCallbackFormGroup(): FormGroup {
    return this.pbmAuthFooterConfig.pbmAuthformGroup.get(
      'adjusterRequestCallbackFormGroup'
    ) as FormGroup;
  }
  get lineItems(): FormArray {
    return this.pbmAuthFooterConfig.pbmAuthformGroup.get(
      'lineItemsFormArray'
    ) as FormArray;
  }

  get mode(): PbmAuthFormMode {
    return this.pbmAuthFooterConfig.mode;
  }

  getAdjusterRequestCallbackDateFormControl(): FormControl {
    return this.adjusterRequestCallbackFormGroup.get('date') as FormControl;
  }

  getAdjusterRequestCallbackTimeFormControl(): FormControl {
    return this.adjusterRequestCallbackFormGroup.get('time') as FormControl;
  }

  constructor(
    public store$: Store<RootState>,
    public router: Router,
    private location: Location,
    private pbmAuthorizationService: PbmAuthorizationService,
    private pbmAuthorizationConfigService: PbmAuthorizationConfigService,
    public fVES: FormValidationExtractorService,
    private confirmationModalService: ConfirmationModalService,
    private pbmPosFooterService: PbmPosFooterService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    public snackBarService: HealtheSnackBarService
  ) {
    super();
    this.firstLoadedPage = !router.navigated;
  }

  ngOnInit(): void {
    if (
      this.pbmAuthFooterConfig &&
      this.pbmAuthFooterConfig.authorizationDetails &&
      this.pbmAuthFooterConfig.authorizationDetails.authorizationDetailsHeader
    ) {
      this.isAwaitingDecision = 'AWAITING_DECISION'.equalsIgnoreCase(
        this.pbmAuthFooterConfig.authorizationDetails.authorizationDetailsHeader
          .status
      );
    }

    this.doCustomerSpecificInitialization();

    this.originalPatientWaitingStatus =
      this.pbmAuthFooterConfig?.authorizationDetails?.patientWaiting;

    this.pbmAuthFooterConfig.pbmAuthformGroup
      .get('isPatientWaitingFormControl')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        // Only show when setting the patient waiting to false when it was originally true.
        if (true === this.originalPatientWaitingStatus) {
          this.showSendNotificationToAdjuster = !value;
        }
      });

    this.pbmPOSAuthConfig = this.pbmAuthFooterConfig
      .footerConfig as PbmAuthPOSFooterConfig;
    this.userIsInternal$
      .pipe(first())
      .subscribe((isInternal) => (this.userIsInternal = isInternal));

    if (this.userIsInternal) {
      this.getPbmAuthStatusView$.pipe(first()).subscribe((urlStatus) => {
        this.urlStatus = urlStatus;
        switch (urlStatus) {
          default:
          case 'AWAITING_DECISION':
            this.cancelButtonLabel = 'RETURN TO AUTH REQUIRED QUEUE';
            this.cscAuthStatusQueueSelectedTab = 1;
            this.submitButtonLabel = 'PROCESS AUTHORIZATION';
            break;

          case 'AWAITING_DECISION_PT':
            this.submitButtonLabel = 'PROCESS AUTHORIZATION';
            this.cancelButtonLabel = 'RETURN TO AUTH REQ PT WAITING QUEUE';
            this.cscAuthStatusQueueSelectedTab = 0;
            break;

          case 'AWAITING_CALL':
            this.cancelButtonLabel = 'RETURN TO RFC - APPROVED QUEUE';
            this.submitButtonLabel = 'COMPLETE AUTHORIZATION';
            this.cscAuthStatusQueueSelectedTab = 2;
            this.forInternalUsersShowCallBackAndInjuredWorkerOptions = false;
            break;

          case 'AWAITING_CALL_DENY':
            this.cancelButtonLabel = 'RETURN TO RFC - DENIED QUEUE';
            this.submitButtonLabel = 'COMPLETE AUTHORIZATION';
            this.cscAuthStatusQueueSelectedTab = 3;
            this.forInternalUsersShowCallBackAndInjuredWorkerOptions = false;
            break;
          case 'COMPLETE':
            this.cscAuthStatusQueueSelectedTab = 1;
            this.cancelButtonLabel = 'RETURN TO AUTH REQUIRED QUEUE';
            break;
        }
        this.returnToQueueLabel = this.cancelButtonLabel;
      });
    }

    this.submittingRxAuth$.subscribe((isSubmittingRxAuth) => {
      this.isSubmitting = isSubmittingRxAuth;
      if (isSubmittingRxAuth) {
        this.loadingDialog = this.dialog.open(LoadingModalComponent, {
          width: '700px',
          height: 'auto',
          data: 'Processing POS (ePAQ) Authorization. Please wait until processing is complete.'
        });
      } else {
        if (this.loadingDialog) {
          this.loadingDialog.close();
        }
      }
    });
    this.rxAuthorizationSubmitResponse$.subscribe((submit) => {
      if (!submit.isLastDecisionSave) {
        this.submissionSuccess = submit.response.successful;
        if (submit.response.successful) {
          if (this.userIsInternal) {
            this.redirectToAuthStatusQueue();
          } else {
            this.store$
              .pipe(
                select(this.redirectToReviewScreen),
                first()
              )
              .subscribe(
                ([
                  eClaimNumber,
                  eCustomerId,
                  eAuthorizationId,
                  serviceType
                ]) => {
                  this.router.navigate([
                    `/claims/${eCustomerId}/${eClaimNumber}/pbm/${eAuthorizationId}/${serviceType}/review`
                  ]);
                }
              );
          }
        } else {
          if (!this.isSubmitting && submit?.response?.errors?.length > 0) {
            this.displayErrors.next({
              errors: submit.response.errors,
              errorBannerTitle: 'Unable to Submit Authorization at this time',
              apiFailureMessage: 'Authorization Service Down'
            });
          }
        }
      }
    });
    this.saveLineItemDecision$.subscribe((request) => {
      if (request.index > -1) {
        this.saveDecision('submit', request);
      }
    });

    this.pbmPosFooterService.isOnSaveDecisionModeObservable.subscribe(
      (isOnSaveDecisionMode) => {
        this.isOnSaveDecisionMode = isOnSaveDecisionMode;
      }
    );
  }

  private doCustomerSpecificInitialization() {
    this.store$
      .pipe(select(getDecodedCustomerId), first())
      .subscribe((decodedCustomerId) => {
        if ('TRAVELERS'.equalsIgnoreCase(decodedCustomerId)) {
          this.pbmAuthFooterConfig.pbmAuthformGroup
            .get('sendNotificationToAdjuster')
            .setValue(false, { emitEvent: false });
          this.removeSendNotificationToAdjuster = true;
        }
      });
  }

  cancel() {
    this.userIsInternal$.pipe(first()).subscribe((isInternalUser) => {
      isInternalUser ? this.redirectToAuthStatusQueue() : this.returnToQueue();
    });
  }
  sendToCompletedQueue() {
    this.router.navigateByUrl('/csc-administration/authorization-status-queue?selectedTab=4');
  }

  returnToQueue(): void {
    this.router.navigate(['/search-nav/epaq-authorizations']);
  }

  redirectToAuthStatusQueue() {
    let url = '/csc-administration/authorization-status-queue';
    if (null != this.cscAuthStatusQueueSelectedTab) {
      url = url + '?selectedTab=' + this.cscAuthStatusQueueSelectedTab;
    }
    this.router.navigateByUrl(url);
  }

  getLineItemDenialReason(denialReasonValue, denialReasons) {
    return denialReasonValue
      ? denialReasons.find((reason) => reason.value === denialReasonValue)
      : null;
  }

  save(doRedirect: boolean) {
    this.submittedClickedBefore.emit(true);
    const saveFilters = [
      'adjusterRequestCallbackFormGroup',
      'phoneNumber',
      'callerName'
    ];
    this.setValidationErrorFilter.emit({ includeFilter: saveFilters });
    this.fVES.errorMessages$
      .pipe(
        first(),
        map((errors) => {
          errors = errors.filter(
            (errorMessage) =>
              !saveFilters ||
              (saveFilters &&
                saveFilters.find((filter) =>
                  errorMessage.path.includes(filter)
                ))
          );
          return errors.length > 0;
        })
      )
      .subscribe((hasErrors) => {
        if (hasErrors) {
          this.showValidationErrors.emit(true);
          setTimeout(() => {
            this.errorCardComponent.elementRef.nativeElement.scrollIntoView({
              block: 'center',
              inline: 'center'
            });
          }, 250);
        } else {
          const request: PbmPosAuthorizationSaveRequest = {
            callbackNumber: '',
            contactName: '',
            internalNote: null,
            isPatientWaiting: null,
            sendPatientWaitingStatusChangeNotification: false,
            didPatientWaitingStatusChange: false
          };

          request.callbackNumber =
            this.pbmPOSAuthConfig.callerFormGroup.value['phoneNumber'];
          request.contactName =
            this.pbmPOSAuthConfig.callerFormGroup.value['callerName'];

          if (null != this.getAdjusterRequestCallbackDateFormControl()) {
            const rawDate =
              this.getAdjusterRequestCallbackDateFormControl().value;
            if (null != rawDate) {
              request.adjusterCallbackDate =
                this.getAdjusterRequestCallbackDateFormControl().value;
              request.internalNote =
                'CALL BACK ON ' + moment(rawDate).format('YYYY-MM-DD');
              if (
                this.getAdjusterRequestCallbackTimeFormControl() &&
                this.getAdjusterRequestCallbackTimeFormControl().value
              ) {
                request.internalNote +=
                  ' ' + this.getAdjusterRequestCallbackTimeFormControl().value;
                request.adjusterCallbackTime =
                  this.getAdjusterRequestCallbackTimeFormControl().value;
              } else {
                request.internalNote += ' 08:00:00';
              }
            }
          }

          if (
            null !=
            this.pbmAuthFooterConfig.pbmAuthformGroup.get(
              'isPatientWaitingFormControl'
            )
          ) {
            request.isPatientWaiting =
              this.pbmAuthFooterConfig.pbmAuthformGroup.get(
                'isPatientWaitingFormControl'
              ).value;
            request.didPatientWaitingStatusChange =
              request.isPatientWaiting !== this.originalPatientWaitingStatus;

            if ( true === this.originalPatientWaitingStatus && false === request.isPatientWaiting) {
              request.sendPatientWaitingStatusChangeNotification =
                this.pbmAuthFooterConfig.pbmAuthformGroup.get(
                  'sendNotificationToAdjuster'
                ).value;
            } else {
              request.sendPatientWaitingStatusChangeNotification = false;
            }
          }

          if (this.userIsInternal) {
            this.store$
              .pipe(select(getDecodedClaimNumber), first())
              .subscribe((decodedClaimNumber) => {
                // Create the adjusterNotification. It should be the case
                // where the original patient waiting was true, but has been since changed to false,
                // and the adjuster opted to send a notification.
                if (
                  false === request.isPatientWaiting &&
                  true === request.didPatientWaitingStatusChange &&
                  true ===
                    this.pbmAuthFooterConfig.pbmAuthformGroup.get(
                      'sendNotificationToAdjuster'
                    ).value
                ) {
                  request.adjusterNotification = {
                    adjusterEmail:
                      this.pbmAuthFooterConfig?.authorizationDetails
                        ?.adjusterEmail,
                    fullAuthorizationUrl: window.location.href.split('?')[0],
                    claimNumber: decodedClaimNumber
                  };
                }
              });
          }
          const dialogRef = this.dialog.open(LoadingModalComponent, {
            width: '700px',
            data: 'Saving...'
          });
          this.saveButtonDisabled = true;
          this.pbmAuthorizationService
            .pbmAuthorizationSave(request, {
              authorizationId:
                this.pbmAuthFooterConfig.authorizationDetails.authorizationId.toString()
            })
            .subscribe(
              (response) => {
                this.saveButtonDisabled = false;
                dialogRef.close();
                if (response.httpStatusCode >= 300) {
                  this.displayErrors.emit({
                    errors: response.errors,
                    errorBannerTitle:
                      'Unable to Save Authorization at this time',
                    apiFailureMessage: 'Save Failed'
                  });
                } else {
                  this.snackBarService.showSuccess('Saved Successfully');
                  if (doRedirect) {
                    this.redirectToAuthStatusQueue();
                  }
                }
              },
              () => {
                dialogRef.close();
                this.displayErrors.emit({
                  errors: [
                    'There was a problem saving the authorization, please try again later.  '
                  ],
                  errorBannerTitle: 'Unable to Save Authorization at this time',
                  apiFailureMessage: 'Save Failed'
                });
              }
            );
        }
      });
  }

  getActionDateForSubmitMessage(lineItemFormGroup: FormGroup): string {
    if (
      (lineItemFormGroup.get('approvalPeriodType').value &&
        lineItemFormGroup.get('approvalPeriodType').value ===
          ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_DATE) ||
      (lineItemFormGroup.get('denialPeriodType').value &&
        lineItemFormGroup.get('denialPeriodType').value ===
          DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_DATE)
    ) {
      return this.datePipe.transform(
        lineItemFormGroup.get('actionPeriodDate').value,
        'yyyy-MM-dd'
      );
    } else if (
      lineItemFormGroup.get('denialPeriodType').value ||
      lineItemFormGroup.get('approvalPeriodType').value
    ) {
      return this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    } else {
      return null;
    }
  }

  saveAndSubmit(action: string, index?: number) {
    if (
      true === this.pbmAuthFooterConfig.authorizationDetails.fatalErrorFound
    ) {
      this.showInitializationErrorsBanner.emit();
      return;
    }

    if (
      'AWAITING_CALL'.equalsIgnoreCase(this.urlStatus) ||
      'AWAITING_CALL_DENY'.equalsIgnoreCase(this.urlStatus)
    ) {
      action = 'complete';
    }

    if (!this.isOnSaveDecisionMode || index !== undefined) {
      this.displayErrors.next({
        errors: null,
        errorBannerTitle: null
      });
      this.pbmAuthFooterConfig.submitted = index === undefined;

      this.submittedClickedBefore.emit(index === undefined);

      const removeFilter = ['adjusterRequestCallbackFormGroup'];
      this.setValidationErrorFilter.emit({ removeFilter: removeFilter });
      this.fVES.errorMessages$
        .pipe(
          first(),
          map((errors) => {
            if (!this.pbmAuthFooterConfig.submitted) {
              errors = errors.filter((f) => {
                if (f.for.getAttribute('data-index')) {
                  return (
                    Number.parseInt(f.for.getAttribute('data-index'), 10) ===
                    index
                  );
                } else {
                  return true;
                }
              });
            }

            errors = errors.filter(
              (errorMessage) =>
                !removeFilter ||
                (removeFilter &&
                  !removeFilter.find((filter) =>
                    errorMessage.path.includes(filter)
                  ))
            );
            return errors.length > 0;
          })
        )
        .subscribe((hasErrors) => {
          if (hasErrors) {
            this.showValidationErrors.emit(true);
            setTimeout(() => {
              this.errorCardComponent.elementRef.nativeElement.scrollIntoView({
                block: 'center',
                inline: 'center'
              });
            }, 250);
          } else {
            this.showValidationErrors.emit(false);
            this.confirmationModalService
              .displayModal(
                {
                  titleString: `${
                    this.pbmAuthFooterConfig.submitted
                      ? 'Submit'
                      : 'Save Decision'
                  }`,
                  bodyHtml: `Are you sure you want to ${action} this ${
                    this.pbmAuthFooterConfig.submitted
                      ? "authorization? You won't be able to undo this action."
                      : 'decision.'
                  }`,
                  affirmString: 'Submit',
                  denyString: 'Cancel',
                  affirmClass: 'success-button'
                },
                '225px'
              )
              .afterClosed()
              .pipe(
                withLatestFrom(
                  this.authorizationDenialReasons$.pipe(first()),
                  this.authorizationDetails$.pipe(first()),
                  this.getPbmAuthStatusView$.pipe(first())
                )
              )
              .subscribe(
                ([isSure, denialReasons, authorizationDetails, statusView]) => {
                  if (isSure) {
                    let displayedLineItems = statusView
                      ? authorizationDetails.authorizationLineItems.filter(
                          (x) =>
                            this.pbmAuthorizationConfigService.VISIBLE_STATUSES_FOR_VIEW[
                              statusView
                            ].indexOf(x.currentStateName) !== -1
                        )
                      : authorizationDetails.authorizationLineItems;

                    let linesWhithNoPriorAuthLoaded = displayedLineItems.filter(
                      (x) => {
                        return (
                          x.permissibleActionsForCurrentUser &&
                          (x.permissibleActionsForCurrentUser.includes(
                            'SUBMIT'
                          ) ||
                            (x.permissibleActionsForCurrentUser.includes(
                              'SUBMIT'
                            ) &&
                              x.permissibleActionsForCurrentUser.includes(
                                'COMPLETE'
                              )))
                        );
                      }
                    );
                    if (
                      linesWhithNoPriorAuthLoaded &&
                      linesWhithNoPriorAuthLoaded.length > 0 &&
                      index === undefined
                    ) {
                      let errors = linesWhithNoPriorAuthLoaded.map((x) => {
                        return (
                          "Can't complete authorization without submitting a prior auth load action for " +
                          (x.compound ? 'compound' : x.drugDisplayName) +
                          ' for that line'
                        );
                      });
                      this.displayErrors.next({
                        errors: errors,
                        errorBannerTitle:
                          'Unable to Complete Authorization at this time'
                      });
                    } else {
                      if (isSure) {
                        let mappedLineItems: PbmAuthSubmitMessageLineItem[] =
                          this.lineItems.controls
                            .filter((lineItem, i) => {
                              let currentAuthorizationDetailsLineItem =
                                authorizationDetails.authorizationLineItems.find(
                                  (detailsLineItem) =>
                                    detailsLineItem.posLineItemKey ===
                                    lineItem.get('lineItemId').value
                                );
                              // If we are completing an auth, then prior auth loaded line items will not
                              // have any permissibleActionsForCurrentUser.  They must still be submitted.
                              if (
                                'complete'.equalsIgnoreCase(action) &&
                                statusView
                              ) {
                                return (
                                  this.pbmAuthorizationConfigService.VISIBLE_STATUSES_FOR_VIEW[
                                    statusView
                                  ].indexOf(
                                    currentAuthorizationDetailsLineItem.currentStateName
                                  ) !== -1
                                );
                              } else {
                                return (
                                  currentAuthorizationDetailsLineItem
                                    .permissibleActionsForCurrentUser.length > 0
                                );
                              }
                            })
                            .map((lineItem: FormGroup) => {
                              let submitMessageLineItem: PbmAuthSubmitMessageLineItem;
                              if (action.includes('submit')) {
                                submitMessageLineItem = {
                                  lineItemId: lineItem.get('lineItemId').value,
                                  action: this.getActionType(
                                    lineItem.get('action').value,
                                    authorizationDetails.authorizationLineItems.find(
                                      (detailsLineItem) =>
                                        detailsLineItem.posLineItemKey ===
                                        lineItem.get('lineItemId').value
                                    ).currentStateName
                                  ),
                                  actionPeriodDate:
                                    this.getActionDateForSubmitMessage(
                                      lineItem
                                    ),
                                  denialReason1: this.getLineItemDenialReason(
                                    lineItem.get('primaryDenialReason').value,
                                    denialReasons
                                  ),
                                  denialReason2: this.getLineItemDenialReason(
                                    lineItem.get('secondaryDenialReason').value,
                                    denialReasons
                                  ),
                                  note: lineItem.get('note').value
                                    ? lineItem.get('note').value
                                    : null
                                };
                              }
                              if (action.includes('complete')) {
                                submitMessageLineItem = {
                                  lineItemId: lineItem.get('lineItemId').value,
                                  action: 'COMPLETE'
                                };
                              }
                              return submitMessageLineItem;
                            });

                        // Single line item save decision
                        if (!this.pbmAuthFooterConfig.submitted) {
                          let singleItem = mappedLineItems[index];
                          mappedLineItems = [singleItem];
                        }

                        let submitMessage: PbmAuthSubmitMessage = {
                          authorizationId: authorizationDetails.authorizationId,
                          authorizationLineItems: mappedLineItems
                        };

                        if (this.userIsInternal) {
                          const { phoneNumber, callerName } =
                            this.pbmPOSAuthConfig.callerFormGroup.value;
                          submitMessage.callerNumber = phoneNumber;
                          submitMessage.callerName = callerName;

                          if (
                            this.pbmAuthFooterConfig.pbmAuthformGroup.get(
                              'isPatientWaitingFormControl'
                            )
                          ) {
                            submitMessage.isPatientWaiting =
                              this.pbmAuthFooterConfig.pbmAuthformGroup.get(
                                'isPatientWaitingFormControl'
                              ).value;

                            if ( true === this.originalPatientWaitingStatus && false === submitMessage.isPatientWaiting) {
                              submitMessage.sendPatientWaitingStatusChangeNotification =
                                this.pbmAuthFooterConfig.pbmAuthformGroup.get(
                                  'sendNotificationToAdjuster'
                                ).value;
                            } else {
                              submitMessage.sendPatientWaitingStatusChangeNotification = false;
                            }
                          }
                          if (
                            this.getAdjusterRequestCallbackDateFormControl() &&
                            this.getAdjusterRequestCallbackDateFormControl()
                              .value
                          ) {
                            submitMessage.adjusterCallbackDate =
                              this.getAdjusterRequestCallbackDateFormControl().value;
                          }
                          if (
                            this.getAdjusterRequestCallbackTimeFormControl() &&
                            this.getAdjusterRequestCallbackTimeFormControl()
                              .value
                          ) {
                            submitMessage.adjusterCallbackTime =
                              this.getAdjusterRequestCallbackTimeFormControl().value;
                          }
                        }

                        this.store$.dispatch(
                          submitRxAuthorization({
                            submitMessage,
                            isLastDecisionSave:
                              !this.pbmAuthFooterConfig.submitted
                          })
                        );
                      }
                    }
                  }
                }
              );
          }
        });
    } else {
      this.displayErrors.next({
        errors: [
          "Can't complete authorization without saving or resetting authorization decision changes for each line with an unsaved changed decision"
        ],
        errorBannerTitle: 'Unable to Complete Authorization at this time'
      });
    }
  }

  saveDecision(action: string, saveDecisionRequest: SaveDecisionRequest) {
    this.displayErrors.next({
      errors: null,
      errorBannerTitle: null
    });
    this.pbmAuthFooterConfig.submitted =
      saveDecisionRequest.index === undefined;

    this.submittedClickedBefore.emit(saveDecisionRequest.index === undefined);

    this.fVES.errorMessages$
      .pipe(
        first(),
        map((errors) => {
          if (!this.pbmAuthFooterConfig.submitted) {
            errors = errors.filter((f) => {
              if (f.for.getAttribute('data-index')) {
                return (
                  Number.parseInt(f.for.getAttribute('data-index'), 10) ===
                  saveDecisionRequest.index
                );
              } else {
                return true;
              }
            });
          }
          return errors.length > 0;
        })
      )
      .subscribe((hasErrors) => {
        if (hasErrors) {
          this.showValidationErrors.emit(true);
          setTimeout(() => {
            this.errorCardComponent.elementRef.nativeElement.scrollIntoView({
              block: 'center',
              inline: 'center'
            });
          }, 250);
        } else {
          this.showValidationErrors.emit(false);
          this.confirmationModalService
            .displayModal(
              {
                titleString: `${
                  this.pbmAuthFooterConfig.submitted
                    ? 'Submit'
                    : 'Save Decision'
                }`,
                bodyHtml: `Are you sure you want to ${action} this ${
                  this.pbmAuthFooterConfig.submitted
                    ? "authorization? You won't be able to undo this action."
                    : 'decision.'
                }`,
                affirmString: 'Submit',
                denyString: 'Cancel',
                affirmClass: 'success-button'
              },
              '225px'
            )
            .afterClosed()
            .pipe(
              withLatestFrom(
                this.authorizationDenialReasons$.pipe(first()),
                this.authorizationDetails$.pipe(first())
              )
            )
            .subscribe(([isSure, denialReasons, authorizationDetails]) => {
              if (isSure) {
                let mappedLineItems: PbmAuthSubmitMessageLineItem[] =
                  this.lineItems.controls
                    .filter((lineItem, i) => {
                      return lineItem;
                    })
                    .map((lineItem: FormGroup) => {
                      const submitMessageLineItem: PbmAuthSubmitMessageLineItem =
                        {
                          lineItemId: lineItem.get('lineItemId').value,
                          action: lineItem.get('action').value,
                          actionPeriodDate:
                            this.getActionDateForSubmitMessage(lineItem),
                          denialReason1: this.getLineItemDenialReason(
                            lineItem.get('primaryDenialReason').value,
                            denialReasons
                          ),
                          denialReason2: this.getLineItemDenialReason(
                            lineItem.get('secondaryDenialReason').value,
                            denialReasons
                          )
                        };
                      return submitMessageLineItem;
                    });

                // Single line item save decision
                if (!this.pbmAuthFooterConfig.submitted) {
                  let singleItem = mappedLineItems[saveDecisionRequest.index];
                  mappedLineItems = [singleItem];
                }

                let submitMessage: PbmAuthSubmitMessage = {
                  authorizationId: authorizationDetails.authorizationId,
                  authorizationLineItems: mappedLineItems
                };

                if (this.userIsInternal) {
                  const { phoneNumber, callerName } =
                    this.pbmPOSAuthConfig.callerFormGroup.value;
                  submitMessage.callerNumber = phoneNumber;
                  submitMessage.callerName = callerName;
                  if (
                    this.pbmAuthFooterConfig.pbmAuthformGroup.get(
                      'isPatientWaitingFormControl'
                    )
                  ) {
                    submitMessage.isPatientWaiting =
                      this.pbmAuthFooterConfig.pbmAuthformGroup.get(
                        'isPatientWaitingFormControl'
                      ).value;
                  }
                }
                this.store$.dispatch(
                  saveDecision({
                    submitMessage,
                    isLastDecisionSave: true,
                    successSubject: saveDecisionRequest.successSubject
                  })
                );
              }
            });
        }
      });
  }

  getActionType(lastDecisionAction: string, currentStateName: string) {
    switch (currentStateName) {
      default:
        return lastDecisionAction;

      case 'SUBMITTED':
        return 'COMPLETE';
    }
  }
}
