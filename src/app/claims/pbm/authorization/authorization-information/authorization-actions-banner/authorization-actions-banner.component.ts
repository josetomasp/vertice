import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { faExclamationCircle, faFlag } from '@fortawesome/pro-light-svg-icons';
import {
  HealtheTooltipAdvancedPosition,
  HealtheTooltipAdvancedService,
  NgxDrpOptions,
  ClaimStatusEnum
} from '@healthe/vertice-library';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { DrugInfoModalService } from '@shared/components/drug-info-modal/drug-info-modal.service';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { of, Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  startWith,
  takeUntil
} from 'rxjs/operators';

import { generateSingleDatePickerConfig } from '../../pbm-authorization-date.config';
import {
  ApprovalPeriodType,
  AuthorizationDenialReason,
  AuthorizationDetails,
  DenialPeriodType,
  PbmAuthFormMode,
  PbmAuthSubmitMessage,
  PbmInfoAndActionsData
} from '../../store/models/pbm-authorization-information.model';
import { CompoundModalComponent } from '@shared/components/compound-modal/compound-modal.component';
import { MmeModalComponent } from '../mme-modal/mme-modal.component';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { hexDecode, VerticeResponse } from '@shared';
import { PbmAuthorizationService } from '../../pbm-authorization.service';
import { HealtheSnackBarService } from '@shared/service/snackbar.service';
import { SingleDatePickerControlComponent } from '@shared/components/single-date-picker-control/single-date-picker-control.component';
import { FormValidationExtractorService } from '@modules/form-validation-extractor';
import { PbmPaperFooterService } from '../pbm-authorization-footer/pbm-paper-footer.service';
import { LoadingModalComponent } from '@shared/components/loading-modal/loading-modal.component';
import {
  submitByPassPriorAuthLoad,
  submitPriorAuthLoad,
  submitSamaritanDose
} from '../../store/actions/pbm-authorization-information.actions';
import {
  isSubmitSamaritanDose,
  submitByPassPriorAuthLoadResponse,
  submitSamaritanDoseResponse
} from '../../store/selectors/pbm-authorization-information.selectors';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { PbmPosFooterService } from '../pbm-authorization-footer/pbm-pos-footer.service';
import { getCreateLOMNResponse } from '../../store/selectors/create-lomn.selectors';
import { LOMNWizardFormResponse } from '../../store/models/create-lomn.models';
import { environment } from '../../../../../../environments/environment';
import { ActionOption } from '../../store/models/action.option';
import { getEncodedAuthorizationId } from 'src/app/store/selectors/router.selectors';
import { SaveDecisionRequest } from '../../store/models/pbm-authorization.models';
import { getPbmClaimStatus } from '@shared/store/selectors/claim.selectors';
import { AuthorizationLineItem } from '../../store/models/pbm-authorization-information/authorization-line-item.models';

@Component({
  selector: 'healthe-authorization-actions-banner',
  templateUrl: './authorization-actions-banner.component.html',
  styleUrls: ['./authorization-actions-banner.component.scss']
})
export class AuthorizationActionsBannerComponent
  extends DestroyableComponent
  implements OnInit, OnChanges
{
  @ViewChild(SingleDatePickerControlComponent, { static: false })
  effectiveToDatePicker: SingleDatePickerControlComponent;

  faExclamationCircle = faExclamationCircle;
  faFlag = faFlag;

  // TEMP test variables for datepicker
  dateConfigOptions: NgxDrpOptions;
  showAuthorizationPeriod: boolean = false;

  approvalPeriodType = ApprovalPeriodType;

  denialPeriodType = DenialPeriodType;

  actionOption = ActionOption;
  @Input()
  showDenialReasons: boolean;
  @Input()
  showSecondDenialReason: boolean;
  @Input()
  lineItem: AuthorizationLineItem;
  @Input()
  pbmInfoAndActionsData: PbmInfoAndActionsData;
  @Input()
  index: number = 0;
  @ViewChild('initialReview', { static: false }) initialReview: ElementRef;
  @Input()
  actionLabel: string;
  @Input()
  userIsInternal: boolean = false;
  @Output()
  priorAuthErrors: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output()
  saveLineItemDecision: EventEmitter<SaveDecisionRequest> = new EventEmitter<SaveDecisionRequest>();
  @Output()
  submittedClickedBefore = new EventEmitter();

  primaryDenialReasons$: Observable<AuthorizationDenialReason[]> = of([]);
  secondaryDenialReasons$: Observable<AuthorizationDenialReason[]> = of([]);
  showURLetterWarning$: Observable<boolean> = of(false);
  submitSamaritanDose$: Observable<boolean> = this.store$.pipe(
    select(isSubmitSamaritanDose),
    takeUntil(this.onDestroy$)
  );
  createLOMNResponse$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getCreateLOMNResponse)
  );

  submitSamaritanDoseResponse$: Observable<
    VerticeResponse<AuthorizationDetails>
  > = this.store$.pipe(
    select(submitSamaritanDoseResponse),
    takeUntil(this.onDestroy$)
  );
  submitByPassPriorAuthLoadResponse$: Observable<boolean> = this.store$.pipe(
    select(submitByPassPriorAuthLoadResponse),
    takeUntil(this.onDestroy$)
  );
  pbmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getPbmClaimStatus)
  );

  decodedAuthId: string = '';
  disablePriorLoadButton: boolean = false;
  showSamaritanDoseButton = false;
  showSaveAndResetButtons = false;
  lastDecisionAlreadySubmitted = false;
  lastDecisionInitialFormValues: object;
  isResettingToOriginalLastDecision: boolean = false;
  showPriorLoadButton: boolean = false;
  showByPassPriorLoadButton: boolean = false;
  showStatusIndicators: boolean = false;
  showActionMessages: boolean = false;
  isByPassPriorLoadButtonSubmitted: boolean = false;
  isOnSaveDecisionMode: boolean = false;
  isOneTimeOnly: boolean = false;
  isPBMStatusActive: boolean = true;
  PbmAuthFormMode = PbmAuthFormMode;
  lastDecisionNarrative: string = '';
  cleanLastDecisionNarrative: string = '';
  secondaryDenialReasonEnabledMap = {};
  primaryDenialReasonSupportsSecondaryDenialReason = true;

  samaritanDoseAcknowledgeCheckBox: FormControl = new FormControl( false);

  @Input()
  mode: PbmAuthFormMode;
  @Input()
  authorizationDetails: AuthorizationDetails;
  today = new Date();
  showResetOriginalDecision$: Observable<boolean> = of(false);
  constructor(
    public dialog: MatDialog,
    public drugModalService: DrugInfoModalService,
    public router: Router,
    public tooltip: HealtheTooltipAdvancedService,
    public changeDetectionRef: ChangeDetectorRef,
    public store$: Store<RootState>,
    private pbmAuthorizationService: PbmAuthorizationService,
    public snackBarService: HealtheSnackBarService,
    public fVES: FormValidationExtractorService,
    public pbmPaperFooterService: PbmPaperFooterService,
    private confirmationModalService: ConfirmationModalService,
    private pbmPosFooterService: PbmPosFooterService
  ) {
    super();
  }

  private _denialReasons = [];

  get denialReasons() {
    return this._denialReasons;
  }

  @Input()
  set denialReasons(denialReasons: AuthorizationDenialReason[]) {
    this._denialReasons = denialReasons;
  }

  _formGroup: FormGroup;

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  @Input()
  set formGroup(formGroup: FormGroup) {
    this._formGroup = formGroup;
  }

  get hasDenialReason(): boolean {
    return (
      this.formGroup.get('primaryDenialReason').value ||
      this.formGroup.get('secondaryDenialReason').value
    );
  }

  ngOnInit() {
    if (this.lineItem.actionMessages?.length > 0) {
      this.showActionMessages = true;
    }

    if (this.lineItem.statusIndicators?.length > 0) {
      this.showStatusIndicators = true;
    }

    this.createLOMNResponse$.subscribe((response: LOMNWizardFormResponse) => {
      if (response.successful) {
        this.pbmInfoAndActionsData.lomnAction = 'Sent';
        this.pbmInfoAndActionsData.lomnActionDate = moment(new Date()).format(
          environment.dateFormat
        );
        this.changeDetectionRef.detectChanges();
      }
    });

    this.displayActionButtons();
    this.showResetOriginalDecision$ = this.formGroup.valueChanges.pipe(
      map((formValues) => {
        if (
          this.lastDecisionInitialFormValues &&
          this.mode === PbmAuthFormMode.ReadWrite
        ) {
          return Object.keys(this.lastDecisionInitialFormValues).some(
            // This double equals is on purpose. I want fuzzy equality here
            // tslint:disable-next-line:triple-equals
            (key) => formValues[key] != this.lastDecisionInitialFormValues[key]
          );
        } else {
          return false;
        }
      })
    );
    this.enableActionPosAuthInputs();
    this.initializeReasonOptions();
    this.initializeURLetterWarningTrigger();
    this.initializeLastDecision(this.lineItem, this.formGroup); // VER-5114

    // Subscribe to all the value changes
    this.formGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((formValue) => {
        this.isLastDecisionFormGroupDifferentFromCurrent(formValue);
        this.changeDetectionRef.detectChanges();
      });

    this.formGroup
      .get('actionPeriodDate')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.changeDetectionRef.detectChanges());

    this.store$
      .pipe(select(getEncodedAuthorizationId))
      .pipe(first())
      .subscribe((value) => {
        this.decodedAuthId = hexDecode(value);
      });

    this.disablePriorLoadButton = this.lineItem.notes.some((note) => {
      return note.comment.toUpperCase() === 'PRIOR AUTH LOADED';
    });
    this.pbmPaperFooterService
      .getSelectedActionFormValues()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((formValues) => {
        formValues = {
          ...formValues,
          lineItemId: this.formGroup.get('lineItemId').value,
          note: this.formGroup.get('note').value
        };

        if (this.formGroup.get('amount')) {
          formValues = {
            ...formValues,
            amount: this.formGroup.get('amount').value
          };
        }

        this.formGroup.setValue(formValues);
      });

    this.submitSamaritanDoseResponse$.subscribe((response) => {
      if (
        response &&
        response.responseBody &&
        response.errors &&
        response.errors.length === 0
      ) {
        this.pbmAuthorizationService.dispatchLoadAuthData();
        this.snackBarService.showSuccess('Samaritan Dose Loaded Successfully.');
      }
    });
    this.showResetOriginalDecision$.subscribe((isOnSaveDecisionMode) => {
      this.isOnSaveDecisionMode = isOnSaveDecisionMode;
      this.pbmPosFooterService.sendSaveDecisionMode(isOnSaveDecisionMode);
    });
    this.changeDetectionRef.detectChanges();

    this.submitByPassPriorAuthLoadResponse$.subscribe(
      (isSubmitingByPassPriorAuthSuccess) => {
        if (
          isSubmitingByPassPriorAuthSuccess &&
          this.isByPassPriorLoadButtonSubmitted
        ) {
          this.showPriorLoadButton = false;
          this.showByPassPriorLoadButton = false;
          this.changeDetectionRef.detectChanges();
        }
      }
    );
    this.cleanLastDecisionNarrative =
      this.pbmInfoAndActionsData.lastDesicionNarrative.replace(
        /(<([^>]+)>)/gi,
        ''
      );
    if (
      this.mode === PbmAuthFormMode.ReadWrite &&
      this.lineItem.currentStateName === 'AWAITING_SECOND_DECISION'
    ) {
      this.formGroup.get('approvalPeriodType').setValue(undefined);
      this.formGroup.get('denialPeriodType').setValue(undefined);
      this.formGroup.get('action').setValue(undefined);
    }
  }

  isLastDecisionAuthorization(): boolean {
    return (
      this.lineItem.lastDecisionAction &&
      this.lineItem.currentStateName &&
      (this.lineItem.currentStateName === 'AWAITING_CALL' ||
        this.lineItem.currentStateName === 'AWAITING_CALL_DENY' ||
        this.lineItem.currentStateName === 'AWAITING_CALL_DENY_ONE_TIME_ONLY')
    );
  }

  // VER-5114 if we get the last decision info, then we need to populate it in the initialization
  initializeLastDecision(
    lineItem: AuthorizationLineItem,
    formGroup: FormGroup
  ) {
    if (this.isLastDecisionAuthorization()) {
      this.isResettingToOriginalLastDecision = true;
      // Set as disabled
      if (!this.canDoActions()) {
        formGroup.get('action').disable();
        formGroup.get('approvalPeriodType').disable();
        formGroup.get('denialPeriodType').disable();
        formGroup.get('actionPeriodDate').disable();
        formGroup.get('primaryDenialReason').disable();
        formGroup.get('secondaryDenialReason').disable();
      } else {
        formGroup.get('action').enable();
        formGroup.get('approvalPeriodType').enable();
        formGroup.get('denialPeriodType').enable();
        formGroup.get('actionPeriodDate').enable();
        formGroup.get('primaryDenialReason').enable();
        formGroup.get('secondaryDenialReason').enable();
      }

      const { note, ...completeForms } = formGroup.value;
      this.lastDecisionInitialFormValues = completeForms;
      this.isResettingToOriginalLastDecision = false;
      this.showSaveAndResetButtons = false;
      this.changeDetectionRef.detectChanges();
    }
  }

  actionValueChanges(action) {
    if (
      (action === this.actionOption.deny ||
        action === this.actionOption.denyIndefinitely) &&
      this.showDenialReasons
    ) {
      this.formGroup.get('primaryDenialReason').enable();
      if (this.showSecondDenialReason) {
        this.formGroup.get('secondaryDenialReason').enable();
      }
    } else {
      this.formGroup.get('primaryDenialReason').disable();
      this.formGroup.get('secondaryDenialReason').disable();
    }
  }

  isLastDecisionFormGroupDifferentFromCurrent(formValue) {
    if (
      formValue &&
      this.isLastDecisionAuthorization() &&
      !this.isResettingToOriginalLastDecision
    ) {
      this.showSaveAndResetButtons = Object.keys(
        this.lastDecisionInitialFormValues
      ).some(
        (key) =>
          this.formGroup.value[key] !== this.lastDecisionInitialFormValues[key]
      );
    }
  }

  displayDoActions() {
    return (
      (this.canDoActions() || this.isLastDecisionAuthorization()) &&
      this.mode !== PbmAuthFormMode.ReadOnly
    );
  }

  canDoActions() {
    return (
      this.mode === PbmAuthFormMode.ReadWrite &&
      this.pbmInfoAndActionsData.permissibleActionsForCurrentUser != null &&
      this.pbmInfoAndActionsData.permissibleActionsForCurrentUser.length > 0 &&
      !this.pbmInfoAndActionsData.actionMessageReplacement
    );
  }

  canDoAction(action: string) {
    return (
      this.pbmInfoAndActionsData.permissibleActionsForCurrentUser.findIndex(
        (a) => a === action
      ) >= 0
    );
  }

  saveChangeDecision() {
    this.showLineItemActionErrors([]);
    const success = new Subject<null>();
    success.pipe(first()).subscribe(() => {
      this.lastDecisionAlreadySubmitted = true;
      this.lastDecisionInitialFormValues = this.formGroup.value;
      this.formGroup.updateValueAndValidity();
      this.changeDetectionRef.detectChanges();
    });
    this.saveLineItemDecision.emit({
      index: this.index,
      successSubject: success
    });
    this.submittedClickedBefore.next(true);
  }

  resetToOriginalDecision() {
    this.showLineItemActionErrors([]);
    this.formGroup.reset(this.lastDecisionInitialFormValues);
    this.changeDetectionRef.detectChanges();
  }

  updateActionPeriodDateState(sectionType: string) {
    if (
      sectionType === this.approvalPeriodType.AUTH_INFO_APPROVAL_PERIOD_DATE ||
      sectionType === this.denialPeriodType.AUTH_INFO_DENIAL_PERIOD_DATE
    ) {
      this.formGroup.get('actionPeriodDate').enable();

      // This is totally stupid, but if fixes a mysterious date picker validation bug when
      // enabling this control.
      this.formGroup
        .get('actionPeriodDate')
        .setValue(this.formGroup.get('actionPeriodDate').value);
    } else {
      this.formGroup.get('actionPeriodDate').setValue(null);
      this.formGroup.get('actionPeriodDate').disable();
    }
  }

  showTooltip() {
    this.tooltip.show({
      title: 'Initial Review',
      content: 'An alternate reviewer/approver has been notified.',
      position: HealtheTooltipAdvancedPosition.Top,
      target: this.initialReview
    });
  }

  ngOnChanges(change: SimpleChanges) {
    if (
      !isEmpty(this.denialReasons) &&
      this.formGroup &&
      this.formGroup.get('primaryDenialReason') &&
      this.formGroup.get('secondaryDenialReason')
    ) {
      this.changeDetectionRef.detectChanges();
    }

    if (change.lineItem) {
      this.displayActionButtons();
      this.enableActionPosAuthInputs();
      this.initializeLastDecision(this.lineItem, this.formGroup); // VER-5114
    }
  }

  hideTooltip() {
    this.tooltip.hide();
  }

  openMMEModal() {
    // TODO: map claimMme and claimWithPresceiption values
    this.dialog.open(MmeModalComponent, {
      autoFocus: false,
      width: '700px',
      data: {
        claimMme: this.pbmInfoAndActionsData.claimMme,
        isRetroAuthorization:
          this.authorizationDetails.authorizationType === 'Retro',
        prescription: {
          displayName: this.lineItem.drugDisplayName,
          transactionalMme: this.lineItem.transactionalMme,
          claimMmeWithPrescription: this.lineItem.claimMmeWithPrescription
        }
      }
    });
  }

  openDrugOrCompoundModal(pbmData: PbmInfoAndActionsData) {
    if (this.lineItem.compound !== null && this.lineItem.compound) {
      this.dialog.open(CompoundModalComponent, {
        autoFocus: false,
        width: '700px',
        data: pbmData.compoundModalData
      });
    } else {
      this.drugModalService.showDrugInfoModal(
        this.lineItem.ndc,
        this.lineItem.dateFilled,
        this.lineItem.quantity
      );
    }
  }

  public initializeReasonOptions() {
    if (this.formGroup) {
      this.primaryDenialReasons$ = this.formGroup.valueChanges.pipe(
        map(({ secondaryDenialReason }) => secondaryDenialReason),
        distinctUntilChanged(),
        map((denialReason) => {
          return this.denialReasons.filter(
            (reason) => reason.value !== denialReason
          );
        }),
        startWith(this.denialReasons)
      );

      this.secondaryDenialReasons$ = this.formGroup.valueChanges.pipe(
        map(({ primaryDenialReason }) => primaryDenialReason),
        distinctUntilChanged(),
        map((denialReason) => {
          return [
            {
              value: '-1',
              label: 'Select None',
              validOnlyInLomnState: false,
              showURLetterWarningMessage: false,
              displaySecondaryDenialReason: false
            } as AuthorizationDenialReason
          ].concat(
            this.denialReasons.filter((reason) => reason.value !== denialReason)
          );
        }),
        startWith(this.denialReasons)
      );
      if (this.formGroup.get('secondaryDenialReason')) {
        this.formGroup
          .get('secondaryDenialReason')
          .valueChanges.pipe(takeUntil(this.onDestroy$))
          .subscribe((secondaryDenialReason) => {
            if (secondaryDenialReason && secondaryDenialReason === '-1') {
              this.formGroup.get('secondaryDenialReason').reset();
            }
          });
      }
    }

    this.secondaryDenialReasonEnabledMap = {};
    this.denialReasons.forEach((reason) => {
      this.secondaryDenialReasonEnabledMap[reason.value] =
        reason.displaySecondaryDenialReason;
    });
  }

  public initializeURLetterWarningTrigger() {
    this.showURLetterWarning$ = this.formGroup.valueChanges.pipe(
      map(({ primaryDenialReason, secondaryDenialReason }) => {
        const primaryReason = this.denialReasons.find(
          (reason) => reason.value === primaryDenialReason
        );
        const secondaryReason = this.denialReasons.find(
          (reason) => reason.value === secondaryDenialReason
        );

        return (
          (primaryReason && primaryReason.showURLetterWarningMessage) ||
          (secondaryReason && secondaryReason.showURLetterWarningMessage)
        );
      })
    );
  }
  loadSamaritanDose() {
    const dialogRef = this.dialog.open(LoadingModalComponent, {
      width: '700px',
      data: 'Loading Sam Dose Prior Auth into PHI, Please Wait...'
    });
    const submit: PbmAuthSubmitMessage = {
      authorizationId: parseInt(this.decodedAuthId, 10),
      authorizationLineItems: [
        {
          lineItemId: this.formGroup.get('lineItemId').value,
          action: 'SAMARITAN_DOSE',
          actionPeriodDate: moment(new Date()).format('YYYY-MM-DD')
        }
      ]
    };
    this.store$.dispatch(submitSamaritanDose({ submit }));
  }

  submitPriorAuthLoad() {
    if (!this.isOnSaveDecisionMode) {
      this.showLineItemActionErrors([]);
      const dialogRef = this.dialog.open(LoadingModalComponent, {
        width: '700px',
        data: 'Prior Auth Loading...'
      });
      const authorizationDetails = this.authorizationDetails;
      const submit: PbmAuthSubmitMessage = {
        authorizationId: parseInt(this.decodedAuthId, 10),
        authorizationLineItems: [
          {
            lineItemId: this.formGroup.get('lineItemId').value,
            action: 'SUBMIT'
          }
        ]
      };

      this.store$.dispatch(
        submitPriorAuthLoad({ submit, authorizationDetails })
      );
    } else {
      this.showLineItemActionErrors([
        "Can't submit prior auth load without saving or resetting authorization decision changes for " +
          (this.lineItem.compound
            ? 'compound'
            : this.lineItem.drugDisplayName) +
          ' for that line'
      ]);
    }
  }
  showLineItemActionErrors(errors: string[]) {
    this.priorAuthErrors.next(errors);
  }

  compareWithReason(option, selection) {
    return (
      option &&
      selection &&
      (selection.value ? option === selection.value : option === selection)
    );
  }

  resetPaperFooter() {
    this.pbmPaperFooterService.setLineItemAsUsed();
    this.pbmPaperFooterService.resetFooterActionForm(
      'LineItem ' + this.index + ': Override Footer'
    );
  }

  getDenialReason(denialReasonId) {
    return this.denialReasons.find(
      (reason) => reason.value === denialReasonId
    )?.label;
  }

  submitByPassPriorAuthLoad() {
    if (!this.isOnSaveDecisionMode) {
      this.showLineItemActionErrors([]);
      this.confirmationModalService
        .displayModal({
          titleString: 'Submit',
          bodyHtml:
            'Are you sure you want "Byass the Prior Auth Load" for this line item',
          affirmString: 'Submit',
          denyString: 'Cancel',
          affirmClass: 'success-button'
        })
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((isSubmit) => {
          if (isSubmit) {
            this.dialog.open(LoadingModalComponent, {
              width: '700px',
              data: 'ByPass Loading......'
            });
            const authorizationDetails = this.authorizationDetails;
            const submit: PbmAuthSubmitMessage = {
              authorizationId: parseInt(this.decodedAuthId, 10),
              authorizationLineItems: [
                {
                  lineItemId: this.formGroup.get('lineItemId').value,
                  action: 'COMPLETE',
                  actionPeriodDate: moment(new Date()).format('YYYY-MM-DD')
                }
              ]
            };
            this.isByPassPriorLoadButtonSubmitted = true;
            this.store$.dispatch(
              submitByPassPriorAuthLoad({ submit, authorizationDetails })
            );
          }
        });
    } else {
      this.showLineItemActionErrors([
        "Can't submit bypass prior auth load without saving or resetting authorization decision changes for " +
          (this.lineItem.compound
            ? 'compound'
            : this.lineItem.drugDisplayName) +
          ' for that line'
      ]);
    }
  }
  displayActionButtons() {
    if (
      this.lineItem.permissibleActionsForCurrentUser &&
      this.lineItem.permissibleActionsForCurrentUser.includes('SAMARITAN_DOSE')
    ) {
      this.showSamaritanDoseButton = true;
    }
    if (this.lineItem.permissibleActionsForCurrentUser) {
      this.showPriorLoadButton =
        this.lineItem.permissibleActionsForCurrentUser.includes('SUBMIT');
      this.showByPassPriorLoadButton =
        this.lineItem.permissibleActionsForCurrentUser.includes('SUBMIT') &&
        this.lineItem.permissibleActionsForCurrentUser.includes('COMPLETE');
    }
  }
  enableActionPosAuthInputs() {
    switch (this.formGroup.get('action').value) {
      case ActionOption.approve:
        this.formGroup.get('denialPeriodType').disable({ emitEvent: false });
        this.formGroup.get('primaryDenialReason').disable({ emitEvent: false });
        this.formGroup
          .get('secondaryDenialReason')
          .disable({ emitEvent: false });
        break;
      // tslint:disable-next-line:no-switch-case-fall-through
      case ActionOption.denyIndefinitely:
      case ActionOption.deny:
        this.formGroup.get('approvalPeriodType').disable({ emitEvent: false });
        break;
      default:
        this.formGroup.get('action').enable();
        this.formGroup.get('approvalPeriodType').disable({ emitEvent: false });
        this.formGroup.get('denialPeriodType').disable({ emitEvent: false });
        this.formGroup.get('actionPeriodDate').disable({ emitEvent: false });
        this.formGroup.get('primaryDenialReason').disable({ emitEvent: false });
        this.formGroup
          .get('secondaryDenialReason')
          .disable({ emitEvent: false });
    }
    if (this.mode === PbmAuthFormMode.ReadOnly) {
      this.formGroup.get('action').disable();
    } else {
      this.formGroup.get('action').enable();
      const fromDate: Date = new Date(
        this.pbmInfoAndActionsData.effectiveDateTo
      );
      this.formGroup
        .get('action')
        .valueChanges.pipe(takeUntil(this.onDestroy$))
        .subscribe((action) => {
          this.actionValueChanges(action);
        });

      this.dateConfigOptions = generateSingleDatePickerConfig(
        fromDate, // From date
        this.lineItem.datePickerPresets, // Presets
        this.pbmInfoAndActionsData.maxDate // Max date
      );

      if (
        this.dateConfigOptions &&
        this.dateConfigOptions.presets &&
        this.dateConfigOptions.presets.length > 0
      ) {
        this.showAuthorizationPeriod = true;
        this.formGroup
          .get('approvalPeriodType')
          .valueChanges.pipe(
            filter((approvalPeriodType) => approvalPeriodType !== null),
            takeUntil(this.onDestroy$)
          )
          .subscribe((approvalPeriodType) =>
            this.updateActionPeriodDateState(approvalPeriodType)
          );

        this.formGroup
          .get('denialPeriodType')
          .valueChanges.pipe(
            filter((denialPeriodType) => denialPeriodType !== null),
            takeUntil(this.onDestroy$)
          )
          .subscribe((denialPeriodType) =>
            this.updateActionPeriodDateState(denialPeriodType)
          );
      } else {
        this.formGroup
          .get('action')
          .valueChanges.pipe(takeUntil(this.onDestroy$))
          .subscribe((action) => {
            if (action === this.actionOption.approve) {
              this.formGroup
                .get('approvalPeriodType')
                .setValue(
                  ApprovalPeriodType.AUTH_INFO_APPROVAL_PERIOD_ONE_TIME,
                  { emitEvent: false }
                );
            } else if (action === this.actionOption.deny) {
              this.formGroup
                .get('denialPeriodType')
                .setValue(DenialPeriodType.AUTH_INFO_DENIAL_PERIOD_ONE_TIME, {
                  emitEvent: false
                });
            } else {
              this.formGroup
                .get('approvalPeriodType')
                .setValue(null, { emitEvent: false });
              this.formGroup
                .get('denialPeriodType')
                .setValue(null, { emitEvent: false });
            }
          });
        this.formGroup
          .get('actionPeriodDate')
          .setValue(null, { emitEvent: false });
        this.showAuthorizationPeriod = false;
      }
    }
    this.formGroup
      .get('action')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((action) => {
        if (
          action === this.actionOption.approve ||
          action === this.actionOption.recommendApprove
        ) {
          this.isOneTimeOnly = this.lineItem.isOneTimeOnly;
          this.formGroup.get('approvalPeriodType').enable();
          this.formGroup.get('denialPeriodType').disable();
        } else if (
          action === this.actionOption.deny ||
          action === this.actionOption.denyIndefinitely
        ) {
          this.isOneTimeOnly = false;
          this.formGroup.get('approvalPeriodType').disable();
          this.formGroup.get('denialPeriodType').enable();
        } else {
          this.isOneTimeOnly = false;
          this.formGroup.get('approvalPeriodType').disable();
          this.formGroup.get('denialPeriodType').disable();
        }
      });
  }

  primaryDenialReasonValueChange($event: number) {
    if (this.secondaryDenialReasonEnabledMap[$event]) {
      this.formGroup.get('secondaryDenialReason').enable();
      this.primaryDenialReasonSupportsSecondaryDenialReason = true;
    } else {
      this.formGroup.get('secondaryDenialReason').reset();
      this.formGroup.get('secondaryDenialReason').disable();
      this.primaryDenialReasonSupportsSecondaryDenialReason = false;
    }
  }

  userHasNotAcknowledgedSamDoseWarnings(): boolean {
    return this.lineItem.samaritanDoseWarnings?.length > 0 && !this.samaritanDoseAcknowledgeCheckBox.value;
  }
}
