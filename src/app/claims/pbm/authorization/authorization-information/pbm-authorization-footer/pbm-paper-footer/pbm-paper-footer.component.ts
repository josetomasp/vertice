import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { Observable, of } from 'rxjs';
import { FormValidationExtractorService } from '@modules/form-validation-extractor';
import { ErrorCardComponent } from '@modules/error-card';
import {
  distinctUntilChanged,
  first,
  map,
  startWith,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  ApprovalPeriodType,
  AuthorizationDenialReason,
  DenialPeriodType,
  PbmAuthFooterConfig,
  PbmAuthFormMode,
  PbmAuthSubmitResponse,
  PbmPaperAuthorizationSubmitMessage,
  PbmPaperAuthorizationSubmitPrescription,
  PbmPaperAuthorizationPrepareMessage,
  PbmPaperAuthorizationPreparePrescriptionManualAuthorizations,
  PbmPaperAuthorizationPrepareAuthorizationActionInfo,
  PbmPaperAuthorizationSaveMessage,
  PbmPreparePaperAuthorizationResponse
} from '../../../store/models/pbm-authorization-information.model';
import { PbmPaperFooterService } from '../pbm-paper-footer.service';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import {
  savePaperAuthorization,
  submitPaperAuthorization,
  preparePaperAuthorization
} from '../../../store/actions/pbm-authorization-information.actions';
import { RootState } from 'src/app/store/models/root.models';
import { createSelector, select, Store } from '@ngrx/store';
import { VerticeResponse } from '@shared';
import { takeWhileRouteActive } from '@shared/lib/operators/takeWhileRouteActive';
import {
  getAuthorizationSaveResponse,
  getRxAuthorizationSubmitResponse,
  isAuthorizationSaving,
  isRxAuthorizationSubmitting,
  isPaperAuthorizationPreparing,
  getPaperAuthorizationPrepareResponse
} from '../../../store/selectors/pbm-authorization-information.selectors';
import {
  getDecodedClaimNumber,
  getEncodedAuthorizationId,
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getPbmServiceType
} from 'src/app/store/selectors/router.selectors';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingModalComponent } from '@shared/components/loading-modal/loading-modal.component';

import * as _moment from 'moment';
import { ActionOption } from '../../../store/models/action.option';
import { PreparePaperActionOption } from '../../../store/models/prepare-paper-action.option';

const moment = _moment;

@Component({
  selector: 'healthe-pbm-paper-footer',
  templateUrl: './pbm-paper-footer.component.html',
  styleUrls: ['./pbm-paper-footer.component.scss']
})
export class PbmPaperFooterComponent
  extends DestroyableComponent
  implements OnInit
{
  approvalPeriodType = ApprovalPeriodType;

  denialPeriodType = DenialPeriodType;

  actionOption = ActionOption;
  preparePaperActionOption = PreparePaperActionOption;

  pbmAuthFormMode = PbmAuthFormMode;

  @Input()
  userIsInternal$: Observable<boolean>;
  @Input()
  pbmAuthFooterConfig: PbmAuthFooterConfig;
  @Input()
  errorCardComponent: ErrorCardComponent;
  @Input()
  authorizationDenialReasons$: Observable<AuthorizationDenialReason[]>;
  @Input()
  encodedAuthId$: Observable<string>;
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

  primaryDenialReasons$: Observable<AuthorizationDenialReason[]> = of([]);
  secondaryDenialReasons$: Observable<AuthorizationDenialReason[]> = of([]);
  saveResponse$: Observable<VerticeResponse<void>> = this.store$.pipe(
    select(getAuthorizationSaveResponse),
    takeUntil(this.onDestroy$)
  );
  isAuthSaving$: Observable<boolean> = this.store$.pipe(
    select(isAuthorizationSaving),
    takeUntil(this.onDestroy$)
  );

  submittingPaperAuth$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(isRxAuthorizationSubmitting)
  );

  preparingPaperAuth$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(isPaperAuthorizationPreparing)
  );

  rxAuthorizationSubmitResponse$: Observable<{
    response: PbmAuthSubmitResponse;
    isLastDecisionSave: boolean;
  }> = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getRxAuthorizationSubmitResponse)
  );

  paperAuthorizationPrepareResponse$: Observable<
    VerticeResponse<PbmPreparePaperAuthorizationResponse>
  > = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getPaperAuthorizationPrepareResponse)
  );

  decodedClaimNumber$: Observable<string> = this.store$.pipe(
    takeWhileRouteActive('pbm'),
    select(getDecodedClaimNumber),
    takeUntil(this.onDestroy$)
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

  submitButtonLabel: string = 'SUBMIT';
  saveButtonDisabled: boolean = false;
  isSubmitting: boolean = false;
  submissionSuccess: boolean = false;
  submitted: boolean = false;
  loadingDialog: MatDialogRef<LoadingModalComponent, any>;
  decodedClaimNumber: string;
  encodedAuthId: string;
  firstLoadedPage: boolean;
  userIsInternal: boolean;
  footerPermissableActions: string[] = [];
  isPreparingPaperAuth: boolean = false;
  denialReasons: AuthorizationDenialReason[];

  get actionFooterFormGroup(): FormGroup {
    return this.pbmAuthFooterConfig.pbmAuthformGroup.get(
      'footerActionForm'
    ) as FormGroup;
  }

  constructor(
    public store$: Store<RootState>,
    public router: Router,
    private location: Location,
    public pbmPaperFooterService: PbmPaperFooterService,
    public fVES: FormValidationExtractorService,
    private confirmationModalService: ConfirmationModalService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    super();
    this.firstLoadedPage = !router.navigated;
  }

  ngOnInit(): void {
    this.userIsInternal$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isInternal) => {
        this.userIsInternal = isInternal;
      });

    this.encodedAuthId$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((encodedAuthId) => (this.encodedAuthId = encodedAuthId));

    this.actionFooterFormGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((values) => {
        if (values.action) {
          if (
            values.action === this.actionOption.approve ||
            values.action === this.actionOption.pend
          ) {
            values.denialPeriodType = null;
          }
          if (
            values.action === this.actionOption.deny ||
            values.action === this.actionOption.pend
          ) {
            values.approvalPeriodType = null;
          }

          this.pbmPaperFooterService.sendSelectedActionFormValues(values);
        }
      });

    this.pbmPaperFooterService
      .getResetFooterActionForm()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((action) => {
        this.actionFooterFormGroup.reset({}, { emitEvent: false });
      });

    this.authorizationDenialReasons$
      .pipe(takeUntil(this.onDestroy$), distinctUntilChanged())
      .subscribe((denialReasons) => {
        this.denialReasons = denialReasons;
        this.initializeReasonOptions(denialReasons);
      });

    this.decodedClaimNumber$.subscribe(
      (decodedClaimNumber) => (this.decodedClaimNumber = decodedClaimNumber)
    );

    if (this.pbmAuthFooterConfig.mode === this.pbmAuthFormMode.ReadWrite) {
      this.isAuthSaving$.subscribe((isAuthSaving) => {
        if (isAuthSaving) {
          this.loadingDialog = this.dialog.open(LoadingModalComponent, {
            width: '700px',
            data: 'Saving Prior Authorization Bill with significant line items will take longer to process. Please wait until processing is complete.'
          });
        } else {
          if (this.loadingDialog) {
            this.loadingDialog.close();
          }
        }
      });

      this.saveResponse$.subscribe((response) => {
        if (response) {
          if (response.errors && response.errors.length > 0) {
            this.displayErrors.emit({
              errors: response.errors,
              errorBannerTitle: 'Saving Paper (Retro) Bill',
              apiFailureMessage:
                'Paper (Retro) Bill cannot be saved at this time. Please try again later.'
            });
          } else {
            this.confirmationModalService
              .displayModal(
                {
                  titleString: 'Retro Bill Saved Successfully',
                  bodyHtml:
                    'Retro Bill saved for Claim ' + this.decodedClaimNumber,
                  affirmString: 'OK',
                  affirmClass: 'success-button'
                },
                '225px'
              )
              .afterClosed()
              .subscribe(([isSure]) => {
                this.returnToQueue();
              });
          }
        }
      });

      this.submittingPaperAuth$.subscribe((issubmittingPaperAuth) => {
        this.isSubmitting = issubmittingPaperAuth;
        if (issubmittingPaperAuth) {
          this.loadingDialog = this.dialog.open(LoadingModalComponent, {
            width: '700px',
            height: 'auto',
            data: 'Submitting Request...'
          });
        } else {
          if (this.loadingDialog) {
            this.loadingDialog.close();
          }
        }
      });

      this.preparingPaperAuth$.subscribe((isPreparingPaperAuth) => {
        this.isPreparingPaperAuth = isPreparingPaperAuth;
        if (isPreparingPaperAuth) {
          this.loadingDialog = this.dialog.open(LoadingModalComponent, {
            width: '700px',
            height: 'auto',
            data: 'Checking for time periods.'
          });
        } else {
          if (this.loadingDialog) {
            this.loadingDialog.close();
          }
        }
      });
      this.rxAuthorizationSubmitResponse$.subscribe((submit) => {
        this.submissionSuccess = submit.response.successful;
        if (
          this.submitted &&
          !this.isSubmitting &&
          submit.response.errors?.length > 0
        ) {
          this.displayErrors.emit({
            errors: submit.response.errors,
            errorBannerTitle: 'Unable to Submit Authorization at this time',
            apiFailureMessage: 'Authorization Service Down'
          });
        }
      });

      this.paperAuthorizationPrepareResponse$.subscribe((response) => {
        if (!this.isPreparingPaperAuth && response?.errors?.length > 0) {
          this.displayErrors.emit({
            errors: response.errors,
            errorBannerTitle: 'Unable to Submit Authorization at this time',
            apiFailureMessage: 'Authorization Service Down'
          });
        }
      });
    }
    this.getPermissableActionsForFooter();
  }

  getPermissableActionsForFooter() {
    this.pbmAuthFooterConfig.authorizationDetails.authorizationLineItems.forEach(
      (lineItem) => {
        if (
          lineItem.permissibleActionsForCurrentUser &&
          lineItem.permissibleActionsForCurrentUser.length > 0
        ) {
          lineItem.permissibleActionsForCurrentUser.forEach((action) => {
            if (!this.footerPermissableActions.includes(action)) {
              this.footerPermissableActions.push(action);
            }
          });
        }
      }
    );
  }

  cancel() {
    this.returnToQueue();
  }

  returnToQueue(): void {
    this.router.navigate(['/search-nav/paper-authorizations']);
  }

  compareWithReason(option, selection) {
    return option && selection && option === selection;
  }

  canDoAction(action: string) {
    return this.footerPermissableActions.findIndex((a) => a === action) >= 0;
  }

  initializeReasonOptions(reasons) {
    if (this.actionFooterFormGroup) {
      this.primaryDenialReasons$ = this.actionFooterFormGroup.valueChanges.pipe(
        map(({ secondaryDenialReason }) => secondaryDenialReason),
        distinctUntilChanged(),
        map((denialReason) =>
          denialReason
            ? reasons.filter((reason) => reason.value !== denialReason.value)
            : reasons
        ),
        startWith(reasons)
      );

      this.secondaryDenialReasons$ =
        this.actionFooterFormGroup.valueChanges.pipe(
          map(({ primaryDenialReason }) => primaryDenialReason),
          distinctUntilChanged(),
          map((denialReason) =>
            denialReason
              ? [
                  {
                    value: '-1',
                    label: 'Select None',
                    validOnlyInLomnState: false,
                    showURLetterWarningMessage: false
                  }
                ].concat(
                  reasons.filter((reason) => reason.value !== denialReason)
                )
              : reasons
          ),
          startWith(reasons)
        );

      if (this.actionFooterFormGroup.get('secondaryDenialReason')) {
        this.actionFooterFormGroup
          .get('secondaryDenialReason')
          .valueChanges.pipe(takeUntil(this.onDestroy$))
          .subscribe((secondaryDenialReason) => {
            if (secondaryDenialReason && secondaryDenialReason.value === '-1') {
              this.actionFooterFormGroup.get('secondaryDenialReason').reset();
            }
          });
      }
    }
  }

  getLineItemDenialReason(denialReasonValue, denialReasons) {
    return denialReasonValue
      ? denialReasons.find((reason) => reason.value === denialReasonValue)
      : null;
  }

  getActionMessageForSubmitMessage(lineItemFormGroup: FormGroup): string {
    let message: string = '';
    if (
      (lineItemFormGroup.get('approvalPeriodType').value &&
        lineItemFormGroup.get('approvalPeriodType').value ===
          ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_DATE) ||
      (lineItemFormGroup.get('denialPeriodType').value &&
        lineItemFormGroup.get('denialPeriodType').value ===
          DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_DATE)
    ) {
      message =
        lineItemFormGroup.get('action').value === this.actionOption.approve
          ? 'Approved'
          : 'Denied';
      message = `${message} until ${moment(
        lineItemFormGroup.get('actionPeriodDate').value
      ).format('MM/DD/YYYY')}`;
    } else if (
      (lineItemFormGroup.get('approvalPeriodType').value &&
        lineItemFormGroup.get('approvalPeriodType').value ===
          ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_ONE_TIME) ||
      (lineItemFormGroup.get('denialPeriodType').value &&
        lineItemFormGroup.get('denialPeriodType').value ===
          DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_ONE_TIME)
    ) {
      message =
        lineItemFormGroup.get('action').value === this.actionOption.approve
          ? 'Approval'
          : 'Denial';
      message = `One-Time Only ${message}`;
    } else {
      message = lineItemFormGroup.get('action').value;
    }
    return message;
  }

  getActionDateForSubmitMessage(
    lineItemFormGroup: FormGroup,
    index: number
  ): string {
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
      return this.datePipe.transform(
        this.pbmAuthFooterConfig.authorizationDetails.authorizationLineItems[
          index
        ].dateFilled,
        'yyyy-MM-dd'
      );
    } else {
      return null;
    }
  }

  getActionForSave(
    lineItemActionControl: FormControl,
    isPreparePaper: boolean = false
  ): string {
    let actionToSave = lineItemActionControl.value;
    if (!actionToSave) {
      actionToSave = this.canDoAction(this.actionOption.pend)
        ? this.actionOption.pend
        : this.actionOption.deny;
    }
    if (isPreparePaper) {
      switch (actionToSave) {
        case this.actionOption.pend:
          actionToSave = this.preparePaperActionOption.pend;
          break;
        case this.actionOption.approve:
          actionToSave = this.preparePaperActionOption.approve;
          break;
        case this.actionOption.deny:
          actionToSave = this.preparePaperActionOption.deny;
          break;
        case this.actionOption.unknown:
          actionToSave = this.preparePaperActionOption.unknown;
          break;
      }
    }
    return actionToSave;
  }

  getPrepareSavePaperSubmitMessage(): PbmPaperAuthorizationSaveMessage {
    return {
      note: {
        createdBy: '',
        description:
          this.pbmAuthFooterConfig.pbmAuthformGroup.get('noteFormControl').value
      },
      submittedBy: '',
      prescriptionManualAuthorizations: (
        this.pbmAuthFooterConfig.pbmAuthformGroup.get(
          'lineItemsFormArray'
        ) as FormArray
      ).controls.map((lineItem: FormGroup, index) => {
        let primaryDenialReason;
        let secondaryDenialReason;
        if(this.actionOption.deny.equalsIgnoreCase(lineItem.get('action').value)){
          primaryDenialReason=this.getLineItemDenialReason(
            lineItem.get('primaryDenialReason').value,
            this.denialReasons
          );
          secondaryDenialReason=this.getLineItemDenialReason(
            lineItem.get('secondaryDenialReason').value,
            this.denialReasons
          );
        }
        const authorizationActionInfo: PbmPaperAuthorizationPrepareAuthorizationActionInfo =
          {
            action: this.getActionForSave(
              lineItem.get('action') as FormControl,
              true
            ),
            primaryReasonCode: primaryDenialReason?.value,
            primaryReasonDescriptionForAction: primaryDenialReason?.label,
            secondaryReasonCodeForAction: secondaryDenialReason?.value,
            secondaryReasonDescriptionForAction: secondaryDenialReason?.label
          };
        const saveRequestLineItem: PbmPaperAuthorizationPreparePrescriptionManualAuthorizations =
          {
            prescriptionId: lineItem.get('lineItemId').value,
            claimsProfessionalOverrideAmount: lineItem.get('amount')
              ? lineItem.get('amount').value
              : undefined,
            authorizationActionInfo: authorizationActionInfo
          };
        return saveRequestLineItem;
      })
    };
  }

  save() {
    this.submittedClickedBefore.emit(true);
    const saveFilters = [
      'amount'
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
          }, 500);
        } else {
          this.confirmationModalService
            .displayModal(
              {
                titleString: 'Save',
                bodyHtml:
                  'This bill will not be processed. Changes will be saved. Do you want to continue?',
                affirmString: 'CONTINUE',
                denyString: 'CANCEL',
                affirmClass: 'success-button'
              },
              '225px'
            )
            .afterClosed()
            .pipe(
              withLatestFrom(
                this.authorizationDenialReasons$.pipe(first()),
                this.encodedAuthId$
              )
            )
            .subscribe(([isSure, denialReasons, encodedAuthId]) => {
              if (isSure) {
                let saveRequestBody: PbmPaperAuthorizationSaveMessage =
                  this.getPrepareSavePaperSubmitMessage();
                this.store$.dispatch(
                  savePaperAuthorization({
                    saveRequestBody,
                    authorizationId: encodedAuthId
                  })
                );
              }
            });
        }
      });

  }

  submit() {
    if (
      true === this.pbmAuthFooterConfig.authorizationDetails.fatalErrorFound
    ) {
      this.showInitializationErrorsBanner.emit();
      return;
    }

    this.displayErrors.next({
      errors: null,
      errorBannerTitle: null
    });

    this.submittedClickedBefore.emit(true);
    this.pbmAuthFooterConfig.submitted = true;
    this.submitted = true;
    this.setValidationErrorFilter.emit();
    this.fVES.errorMessages$
      .pipe(
        first(),
        map((errors) => errors.length > 0)
      )
      .subscribe((hasErrors) => {
        if (hasErrors) {
          this.showValidationErrors.emit(true);
          setTimeout(() => {
            this.errorCardComponent.elementRef.nativeElement.scrollIntoView({
              block: 'center',
              inline: 'center'
            });
          }, 500);
        } else {
          this.showValidationErrors.emit(false);

          const submitMessage: PbmPaperAuthorizationPrepareMessage =
            this.getPrepareSavePaperSubmitMessage();
          this.store$.dispatch(
            preparePaperAuthorization({
              submitMessage,
              authorizationId: this.encodedAuthId
            })
          );
        }
      });
  }
}
