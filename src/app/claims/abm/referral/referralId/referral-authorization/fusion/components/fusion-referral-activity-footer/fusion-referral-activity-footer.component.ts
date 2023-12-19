import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClaimStatusEnum } from '@healthe/vertice-library';
import { select, Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { getAbmClaimStatus } from '@shared/store/selectors/claim.selectors';
import { cloneDeep } from 'lodash';
import * as _moment from 'moment';
import { Observable, of, zip } from 'rxjs';
import { first, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { updateFusionAuthHeaderPendExpirationDate } from 'src/app/claims/abm/referral/store/actions/fusion/fusion-authorization.actions';
import {
  AuthorizationHeaderReasonConfig,
  AuthorizationHeaderReasonGroupCodes,
  AuthorizationReasonCombined,
  AuthorizationReasons,
  AuthorizationUnderReview,
  FusionAuthorization,
  FusionAuthorizationBodyPart,
  fusionAuthorizationsInitialState,
  FusionSubmitAuthorization
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import {
  getFusionAuthorizationState,
  isSubmittingAuthorizations
} from 'src/app/claims/abm/referral/store/selectors/fusion/fusion-authorization.selectors';
import { FeatureFlagService } from 'src/app/customer-configs/feature-flag.service';
import { RootState } from 'src/app/store/models/root.models';
import {
  getAuthorizationArchetype,
  getDecodedClaimNumber,
  getDecodedCustomerId,
  getDecodedReferralId
} from 'src/app/store/selectors/router.selectors';
import { FusionAuthorizationService } from '../../fusion-authorization.service';
import { areApproveReasonsVisible } from '../../lib';
import {
  getUnActionableAuthorizations,
  getUnapprovedAuthorizations
} from '../../lib/fusionReferralAuthorizationFilters';
import { AuthorizationSubmitConfirmationModalComponent } from '../authorization-submit-confirmation-modal/authorization-submit-confirmation-modal.component';
import { FusionReferralActivityFooterValidators } from './fusion-referral-activity-footer.validators';
import {
  FormValidationExtractorService
} from "@modules/form-validation-extractor";

const moment = _moment;

@Component({
  selector: 'healthe-fusion-referral-activity-footer',
  templateUrl: './fusion-referral-activity-footer.component.html',
  styleUrls: ['./fusion-referral-activity-footer.component.scss']
})
export class FusionReferralActivityFooterComponent extends DestroyableComponent
  implements OnInit, OnDestroy {
  @Input()
  fusionAuthorizationReasons$: Observable<AuthorizationReasons> = of(
    fusionAuthorizationsInitialState.reasons
  );
  @Input()
  formArray: FormArray;
  @Output()
  submittedClickedBefore = new EventEmitter();

  claimNumber$ = this.store$.pipe(
    first(),
    select(getDecodedClaimNumber)
  );
  customerId$ = this.store$.pipe(
    first(),
    select(getDecodedCustomerId)
  );
  referralId$ = this.store$.pipe(
    first(),
    select(getDecodedReferralId)
  );
  abmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getAbmClaimStatus)
  );
  referralArchetype$ = this.store$.pipe(
    first(),
    select(getAuthorizationArchetype)
  );
  AUTH_INFO_ACTION_TYPE_APPROVE_ALL = 'approve';
  AUTH_INFO_ACTION_TYPE_DENY_ALL = 'deny';
  AUTH_INFO_ACTION_TYPE_PEND_ALL = 'pend';
  isDetailSelected: boolean = false;
  showApprovedReasons: boolean = false;
  // use only when claim is active
  approvalAction: AuthorizationReasonCombined;
  approvalReasons$ = of([]);
  denialReasons$ = of([]);
  pendReasons$ = of([]);
  showPendExpirationDatepicker: boolean = false;
  pendExpirationDatepickerMaxDate: Date = null;
  denialReasonSelectionPlaceholder: string = '';
  formGroup = new FormGroup({
    action: new FormControl(null),
    approvalReason: new FormControl(null),
    denialReason: new FormControl(null),
    pendReason: new FormControl(null),
    pendReasonExpirationDate: new FormControl(null)
  });
  selectedValue: AuthorizationReasonCombined;

  authorizationForm$ = this.store$.pipe(
    first(),
    select(getFusionAuthorizationState),
    map((authorizationState) => {
      const {
        originalAuthorizations: { authorizations: originalAuthorizationList },
        workingAuthorizations: {
          noteList,
          authorizations: workingAuthorizationList
        }
      } = cloneDeep(authorizationState);

      const newAuthorizations = getUnapprovedAuthorizations(
        workingAuthorizationList
      );
      const preApprovedAuthorizations = getUnActionableAuthorizations(
        originalAuthorizationList
      );
      // This only runs if there is both an unapproved OnSite and Translation travel that aren't NEW_OPEN_AUTH
      this.copyActionToHiddenTranslationTravel(newAuthorizations);
      const authorizations: FusionSubmitAuthorization[] = newAuthorizations.map(
        (workingAuth, workingAuthIndex) => {
          // Declare constants I need
          const { authorizationUnderReview } = workingAuth;
          const originalAuth = originalAuthorizationList[workingAuthIndex];
          const {
            authorizationUnderReview: originalAuthUnderReview
          } = originalAuth;
          // Update bodyParts if they exist
          authorizationUnderReview.bodyParts = this.getBodyPartDiff(
            authorizationUnderReview,
            originalAuthUnderReview
          );
          // Bundle submit auth message
          let submitAuth: FusionSubmitAuthorization;
          if (authorizationUnderReview?.isSubstitution) {
            submitAuth = {
              action: originalAuth.action,
              pendType: originalAuth.pendType,
              reasonForAction: originalAuth.reasonForAction,
              authorizationUnderReview: {
                ...authorizationUnderReview,
                substitutionAuthorizationUnderReview: {
                  ...authorizationUnderReview.substitutionAuthorizationUnderReview,
                  action: this.getWorkingAuthActionValue(workingAuth),
                  reasonForAction:
                    this.getWorkingAuthReasonForAction(workingAuth),
                  pendType: workingAuth.pendType
                }
              },
              authorizationChangeSummary:
                workingAuth.authorizationChangeSummary,
              reasonsReviewNeeded: workingAuth.reasonsReviewNeeded,
              alertInfoList: workingAuth.alertInfoList,
              customerStatusReasonDesc: workingAuth.customerStatusReasonDesc
            };
          } else {
            submitAuth = {
              action: this.getWorkingAuthActionValue(workingAuth),
              reasonForAction: this.getWorkingAuthReasonForAction(workingAuth),
              pendType: workingAuth.pendType,
              authorizationUnderReview,
              authorizationChangeSummary:
                workingAuth.authorizationChangeSummary,
              reasonsReviewNeeded: workingAuth.reasonsReviewNeeded,
              alertInfoList: workingAuth.alertInfoList,
              customerStatusReasonDesc: workingAuth.customerStatusReasonDesc
            };
          }
          return submitAuth;
        }
      );
      // Add back the non-actionable authorizations
      authorizations.push(...preApprovedAuthorizations);

      return {
        authorizations,
        noteList,
        rush: authorizationState.rush,
        pendExpireDate: authorizationState.workingAuthorizations.pendExpireDate
      };
    })
  );
  submitMessage$ = zip(
    this.customerId$,
    this.claimNumber$,
    this.referralId$,
    this.referralArchetype$,
    this.authorizationForm$
  );

  constructor(
    private datePipe: DatePipe,
    private fusionAuthorizationService: FusionAuthorizationService,
    private confirmationModalService: ConfirmationModalService,
    private store$: Store<RootState>,
    public matDialog: MatDialog,
    private featureFlagService: FeatureFlagService,
    private formValidationExtractorService: FormValidationExtractorService,
    private router: Router
  ) {
    super();

    this.fusionAuthorizationService
      .getSelectedDetailAuthReason()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((reason) => {
        this.isDetailSelected = true;

        let denialReason: string = this.formGroup.get('denialReason').value
          ? this.formGroup.get('denialReason').value.explanationDescription
          : null;
        let pendReason: string = this.formGroup.get('pendReason').value
          ? this.formGroup.get('pendReason').value.actionDescription
          : null;
        let approvalReason: string = this.formGroup.get('approvalReason').value
          ? this.formGroup.get('approvalReason').value.explanationDescription
          : null;

        if (
          reason !== this.formGroup.get('action').value &&
          reason !== denialReason &&
          reason !== approvalReason &&
          reason !== pendReason
        ) {
          if (this.showApprovedReasons) {
            this.formGroup.get('action').reset();
          } else if (
            (this.selectedValue &&
              this.selectedValue.actionDescription !==
                this.approvalAction.actionDescription) ||
            reason
          ) {
            this.formGroup.get('action').reset();
          }
          this.formGroup.get('approvalReason').reset();
          this.formGroup.get('denialReason').reset();
          this.formGroup.get('pendReason').reset();
          this.selectedValue = null;
        }
      });
  }

  private getWorkingAuthReasonForAction(
    workingAuthorization: FusionAuthorization
  ) {
    // IF we show approved reasons and the working auth action does match the footer's approval action
    // THEN return string with replaced ' All' with ''
    return !this.showApprovedReasons &&
      workingAuthorization.actionValue.actionDescription ===
        this.approvalAction.actionDescription
      ? null
      : workingAuthorization.reasonForAction
      ? workingAuthorization.reasonForAction.replace(' All', '')
      : workingAuthorization.reasonForAction;
  }

  private getWorkingAuthActionValue(workingAuth) {
    return workingAuth.actionValue.actionDescription
      ? workingAuth.actionValue.actionDescription.replace(' All', '')
      : workingAuth.actionValue.actionDescription;
  }

  private processPendReasonConfiguration(
    config: AuthorizationHeaderReasonConfig
  ) {
    if (config) {
      this.showPendExpirationDatepicker = config.expirationDateNeeded;
      if (this.showPendExpirationDatepicker && config.expirationDateMaxDate) {
        this.pendExpirationDatepickerMaxDate = new Date(
          config.expirationDateMaxDate
        );
        this.formGroup
          .get('pendReasonExpirationDate')
          .setValidators(
            FusionReferralActivityFooterValidators.pendExpirationDateValidation(
              this.pendExpirationDatepickerMaxDate
            )
          );
      } else {
        this.clearPendReasonConfiguration();
      }
    } else {
      this.clearPendReasonConfiguration();
    }
  }

  private clearPendReasonConfiguration() {
    this.showPendExpirationDatepicker = false;
    this.pendExpirationDatepickerMaxDate = null;
    this.formGroup.get('pendReasonExpirationDate').clearValidators();
    this.formGroup.get('pendReasonExpirationDate').updateValueAndValidity();
  }

  private copyActionToHiddenTranslationTravel(
    newAuthorizations: FusionAuthorization[]
  ) {
    const allAuthsAreNewOpen = newAuthorizations
      .map((auth) => {
        const isNewOpenAuth = auth.authorizationChangeSummary.findIndex(
          (cs) => cs.changeType === 'NEW_OPEN_AUTHORIZATION'
        );
        return isNewOpenAuth > -1;
      })
      .every((res) => res);
    if (allAuthsAreNewOpen) {
      return;
    }
    const translationTravelIndex = newAuthorizations.findIndex(
      ({
        authorizationUnderReview: { categoryDesc },
        customerStatusReasonDesc
      }) =>
        categoryDesc === 'Translation Travel' &&
        customerStatusReasonDesc !== 'Authorization Approved'
    );
    const onSiteTranslationIndex = newAuthorizations.findIndex(
      ({
        authorizationUnderReview: { categoryDesc },
        customerStatusReasonDesc
      }) =>
        categoryDesc === 'On-site Translation' &&
        customerStatusReasonDesc !== 'Authorization Approved'
    );
    if (translationTravelIndex > -1 && onSiteTranslationIndex > -1) {
      newAuthorizations[translationTravelIndex].actionValue =
        newAuthorizations[onSiteTranslationIndex].actionValue;
      newAuthorizations[translationTravelIndex].reasonForAction =
        newAuthorizations[onSiteTranslationIndex].reasonForAction;
      newAuthorizations[translationTravelIndex].pendType =
        newAuthorizations[onSiteTranslationIndex].pendType;
    }
  }

  private getBodyPartDiff(
    workingAuthUnderReview: AuthorizationUnderReview,
    originalAuthUnderReview: AuthorizationUnderReview
  ): FusionAuthorizationBodyPart[] {
    const { bodyParts } = workingAuthUnderReview;
    if (bodyParts) {
      return (
        bodyParts
          // Filter out for original updates
          .filter(({ status: workingBodyPartStatus }, bodyPartIndex) => {
            let postBodyPart = true;
            // This try/catch is to get around annoying property checks.
            try {
              // If the body part's status equals the original status
              // then throw it out
              const {
                status: passableStatus
              } = originalAuthUnderReview.bodyParts[bodyPartIndex];
              return passableStatus !== workingBodyPartStatus;
            } catch (e) {}
            return postBodyPart;
          })
          .map((bodyPart) => {
            bodyPart.lastActionDate = this.datePipe.transform(
              new Date(),
              'yyyy-MM-dd'
            );
            bodyPart.description = bodyPart.descOriginal ? bodyPart.descOriginal : bodyPart.description;
            return bodyPart;
          })
      );
    }
  }

  ngOnInit() {
    this.denialReasonSelectionPlaceholder = 'Select '
      .concat(this.featureFlagService.labelChange('Denial', 'denial'))
      .concat(' Explanation');

    this.formGroup
      .get('action')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value: string) => {
        if (value !== this.AUTH_INFO_ACTION_TYPE_PEND_ALL) {
          this.clearPendReasonConfiguration();
        } else {
          if (
            this.formGroup.get('pendReason').value &&
            this.formGroup.get('pendReason').value.actionConfig
          ) {
            this.processPendReasonConfiguration(
              this.formGroup.get('pendReason').value.actionConfig
            );
          }
        }
      });

    this.formGroup
      .get('approvalReason')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value: AuthorizationReasonCombined) => {
        if (value) {
          if (
            !this.selectedValue ||
            (value.actionId !== this.selectedValue.actionId ||
              value.explanationId !== this.selectedValue.explanationId)
          ) {
            this.processDropdownSelection(value);
            this.formGroup.get('denialReason').reset();
            this.formGroup.get('pendReason').reset();
            this.selectedValue = value;
            this.setActionFormGroupValues(this.selectedValue);
          }
        }
      });

    this.formGroup
      .get('denialReason')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value: AuthorizationReasonCombined) => {
        if (value) {
          if (
            !this.selectedValue ||
            (value.actionId !== this.selectedValue.actionId ||
              value.explanationId !== this.selectedValue.explanationId)
          ) {
            this.processDropdownSelection(value);
            this.formGroup.get('approvalReason').reset();
            this.formGroup.get('pendReason').reset();
            this.selectedValue = value;
            this.setActionFormGroupValues(this.selectedValue);
          }
        }
      });

    this.formGroup
      .get('pendReason')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value: AuthorizationReasonCombined) => {
        if (value) {
          if (
            !this.selectedValue ||
            (value.actionId[0] !== this.selectedValue.actionId[0] ||
              value.actionDescription !== this.selectedValue.actionDescription)
          ) {
            this.processDropdownSelection(value);
            this.processPendReasonConfiguration(value.actionConfig);
            this.formGroup.get('approvalReason').reset();
            this.formGroup.get('denialReason').reset();
            this.selectedValue = value;
            this.setActionFormGroupValues(this.selectedValue);
          }
        }
      });

    this.formGroup
      .get('pendReasonExpirationDate')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (value) {
          value = moment(value)
            .hours(12)
            .toDate();
        }
        this.store$.dispatch(
          updateFusionAuthHeaderPendExpirationDate({ expirationDate: value })
        );
      });

    this.approvalReasons$ = this.fusionAuthorizationReasons$.pipe(
      takeUntil(this.onDestroy$),
      map((m) => {
        return m.approvalHeaderReasons;
      })
    );
    this.denialReasons$ = this.fusionAuthorizationReasons$.pipe(
      takeUntil(this.onDestroy$),
      map((m) => {
        return m.denialHeaderReasons;
      })
    );
    this.pendReasons$ = this.fusionAuthorizationReasons$.pipe(
      takeUntil(this.onDestroy$),
      map((m) => {
        return m.pendHeaderReasons;
      })
    );

    this.abmClaimStatus$
      .pipe(
        takeUntil(this.onDestroy$),
        withLatestFrom(this.customerId$),
        map(([status, customerId]) =>
          areApproveReasonsVisible(status, customerId)
        )
      )
      .subscribe((show) => {
        this.showApprovedReasons = show;
        if (!this.showApprovedReasons) {
          this.approvalReasons$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((reasons) => {
              if (reasons && reasons.length > 0) {
                this.approvalAction = {
                  actionId: reasons[0].actionId,
                  actionDescription: reasons[0].actionDescription,
                  actionGroupCode: reasons[0].actionGroupCode
                };
              }
            });
          this.formGroup
            .get('action')
            .valueChanges.pipe(takeUntil(this.onDestroy$))
            .subscribe((value: string) => {
              if (value === this.AUTH_INFO_ACTION_TYPE_APPROVE_ALL) {
                this.processDropdownSelection(this.approvalAction);
              }
            });
        }
      });
    this.formArray.push(this.formGroup);
  }

  compareWithReason(option, selection) {
    return (
      option &&
      selection &&
      option.actionId === selection.actionId &&
      option.explanationId === selection.explanationId
    );
  }

  compareWithPendReason(option, selection) {
    return (
      option &&
      selection &&
      option.actionId &&
      selection.actionId &&
      option.actionId[0] === selection.actionId[0] &&
      option.actionDescription === selection.actionDescription
    );
  }
  goToAuthorizationQueue() {
    this.router.navigate(['referrals', 'authorizations']);
  }

  setActionFormGroupValues(values: AuthorizationReasonCombined) {
    if (values) {
      switch (values.actionGroupCode.trim()) {
        case AuthorizationHeaderReasonGroupCodes.APPROVAL:
          {
            this.formGroup
              .get('action')
              .setValue(this.AUTH_INFO_ACTION_TYPE_APPROVE_ALL);

            this.formGroup.get('approvalReason').setValue(values);
            this.formGroup.get('denialReason').reset();
            this.formGroup.get('pendReason').reset();
          }
          break;
        case AuthorizationHeaderReasonGroupCodes.DENY:
          {
            this.formGroup
              .get('action')
              .setValue(this.AUTH_INFO_ACTION_TYPE_DENY_ALL);
            this.formGroup.get('approvalReason').reset();
            this.formGroup.get('denialReason').setValue(values);
            this.formGroup.get('pendReason').reset();
          }
          break;
        case AuthorizationHeaderReasonGroupCodes.PENDINT:
        case AuthorizationHeaderReasonGroupCodes.PENDVEND:
        case AuthorizationHeaderReasonGroupCodes.PEND:
          {
            this.formGroup
              .get('action')
              .setValue(this.AUTH_INFO_ACTION_TYPE_PEND_ALL);
            this.formGroup.get('approvalReason').reset();
            this.formGroup.get('denialReason').reset();
            this.formGroup.get('pendReason').setValue(values);
          }
          break;
      }
    }
  }

  submit(): void {
    this.submittedClickedBefore.emit(true);
    if (this.formGroup.valid && (this.formValidationExtractorService.errorMessages$.getValue().length == 0)) {
      this.submitMessage$
        .pipe(first())
        .subscribe(
          ([
             customerId,
             claimNumber,
             referralId,
             archeType,
             authorizationForm
           ]) => {
            this.matDialog.open(AuthorizationSubmitConfirmationModalComponent, {
              autoFocus: false,
              width: '750px',
              height: '225px',
              minHeight: '220px',
              disableClose: false,
              data: {
                submitMessage: {
                  claimNumber,
                  customerId,
                  referralId,
                  archeType,
                  formValues: { ...authorizationForm }
                },
                submittingAuthorizations$: this.store$.pipe(
                  select(isSubmittingAuthorizations)
                )
              }
            });
          }
        );
    }
  }

  private processDropdownSelection(value: AuthorizationReasonCombined) {
    this.selectedValue = value;
    if (this.isDetailSelected) {
      this.displayAlreadySelectionWarning(value.actionDescription, value);
    } else {
      this.fusionAuthorizationService.sendSelectedAuthHeaderReason(value);
    }
  }

  private displayAlreadySelectionWarning(
    selectionType: string,
    value: AuthorizationReasonCombined
  ) {
    let bodyText =
      'You have already chosen an action on individual line item(s). By selecting ' +
      selectionType +
      ' you will be overriding your previous selections. Are you sure you want to do this?';

    this.confirmationModalService
      .displayModal({
        titleString: 'Changing Approval Status',
        bodyHtml: bodyText,
        affirmString: 'Override All',
        denyString: 'cancel'
      })
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.fusionAuthorizationService.sendSelectedAuthHeaderReason(value);
          this.selectedValue = value;
        } else {
          this.formGroup.get('action').reset();
          this.formGroup.get('approvalReason').reset();
          this.formGroup.get('denialReason').reset();
          this.formGroup.get('pendReason').reset();
          this.selectedValue = null;
        }
      });
  }
}
