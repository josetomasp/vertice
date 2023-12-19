import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {ControlContainer, FormGroup, FormGroupDirective} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { Observable, of } from 'rxjs';
import { delay, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { updateFusionAuthorizationState } from 'src/app/claims/abm/referral/store/actions/fusion/fusion-authorization.actions';
import {
  AuthorizationHeaderReasonGroupCodes,
  AuthorizationReasonCombined,
  AuthorizationReasons,
  FusionAuthorization,
  fusionAuthorizationsInitialState
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { RootState } from 'src/app/store/models/root.models';
import { getDecodedCustomerId } from '../../../../../../../../store/selectors/router.selectors';
import { FusionAuthorizationService } from '../../fusion-authorization.service';
import { ClaimStatusEnum } from '@healthe/vertice-library';
import { getAbmClaimStatus } from '@shared/store/selectors/claim.selectors';
import { FeatureFlagService } from 'src/app/customer-configs/feature-flag.service';
import { areApproveReasonsVisible } from '../../lib';
import {
  FormValidationExtractorService
} from "@modules/form-validation-extractor";

@Component({
  selector: 'healthe-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionFormComponent extends DestroyableComponent
  implements OnInit, OnDestroy {
  @Input()
  fusionAuth: FusionAuthorization;
  @Input()
  index: number;

  @Input()
  fusionAuthorizationReasons$: Observable<AuthorizationReasons> = of(
    fusionAuthorizationsInitialState.reasons
  );

  _formGroup: FormGroup;

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  @Input()
  set formGroup(formGroup: FormGroup) {
    this._formGroup = formGroup;
  }

  abmClaimStatus$: Observable<ClaimStatusEnum> = this.store$.pipe(
    select(getAbmClaimStatus)
  );

  showApprovedReasons: boolean = false;
  showPendAction: boolean = false;
  disabledActionOnPend: boolean = false;
  approvalAction: AuthorizationReasonCombined;

  AUTH_INFO_ACTION_TYPE_APPROVE = 'approve';
  AUTH_INFO_ACTION_TYPE_DENY = 'deny';
  AUTH_INFO_ACTION_TYPE_PEND = 'pend';

  approvalReasons$ = of([]);
  denialReasons$ = of([]);
  pendReasons$ = of([]);

  denialReasonSelectionPlaceholder: string = '';

  customerId$: Observable<string> = this.store$.pipe(
    select(getDecodedCustomerId),
    map((code) => (code + '').toUpperCase()),
    takeUntil(this.onDestroy$)
  );

  constructor(
    private formValidationExtractorService: FormValidationExtractorService,
    private fusionAuthorizationService: FusionAuthorizationService,
    private store$: Store<RootState>,
    private changeDetectorRef: ChangeDetectorRef,
    private featureFlagService: FeatureFlagService
  ) {
    super();

    this.fusionAuthorizationService
      .getSelectedAuthHeaderReason()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((reason: AuthorizationReasonCombined) => {
        this.selectHeaderReason(reason);
      });
  }

  formGroupDirective: FormGroupDirective;
    parent: ControlContainer;
    parentFormGroup: FormGroup;
    parentPath: string[];

  ngOnInit() {
    // TODO: Revisit this strategy of registering. I only want the directives to know about the FormValidationExtractorService
    this.formValidationExtractorService.registerErrorMessage('required', 'This field is required');
    this.disableReasonsControls();
    this.denialReasonSelectionPlaceholder = 'Select '
      .concat(this.featureFlagService.labelChange('Denial', 'denial'))
      .concat(' Explanation');

    this._formGroup
      .get('action')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value: string) => {
        this.updateActionValue(value);
      });

    this._formGroup
      .get('approvalReason')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value: AuthorizationReasonCombined) => {
        if (value) {
          this.selectApprovalLineItemReason(value);
        }
      });

    this._formGroup
      .get('denialReason')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value: AuthorizationReasonCombined) => {
        if (value) {
          this.selectDenialLineItemReason(value);
        }
      });

    this._formGroup
      .get('pendReason')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((value: AuthorizationReasonCombined) => {
        if (value) {
          this.selectPendLineItemReason(value);
        }
      });

    this.approvalReasons$ = this.fusionAuthorizationReasons$.pipe(
      delay(100),
      map((m) => {
        this.setNewReasonReference(m.approvalLineItemReasons);
        return m.approvalLineItemReasons;
      })
    );
    this.denialReasons$ = this.fusionAuthorizationReasons$.pipe(
      delay(100),
      map((m) => {
        this.setNewReasonReference(m.denialLineItemReasons);
        return m.denialLineItemReasons;
      })
    );
    this.pendReasons$ = this.fusionAuthorizationReasons$.pipe(
      delay(100),
      map((m) => {
        this.setNewReasonReference(m.pendLineItemReasons);
        return m.pendLineItemReasons;
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
                if (
                  this._formGroup.get('action').value ===
                    this.AUTH_INFO_ACTION_TYPE_APPROVE &&
                  this.approvalAction &&
                  this.fusionAuth.actionId !== this.approvalAction.actionId
                ) {
                  this.updateActionValue(this._formGroup.get('action').value);
                }
              }
            });
        }
      });
  }

  private selectHeaderReason(reason: AuthorizationReasonCombined) {
    if (
      (reason && !this.fusionAuth.actionValue) ||
      ((reason && reason.actionId !== this.fusionAuth.actionId) ||
        reason.explanationId !== this.fusionAuth.explanationId) ||
      ((reason &&
        reason.actionGroupCode === 'PENDVEND' &&
        reason.actionId[0] !== this.fusionAuth.actionId[0]) ||
        reason.actionDescription !== this.fusionAuth.reasonForAction)
    ) {
      this.fusionAuth.actionId = reason.actionId;
      if (reason.explanationDescription) {
        this.fusionAuth.reasonForAction = reason.explanationDescription;
      } else {
        this.fusionAuth.reasonForAction = reason.actionDescription;
      }
      this.fusionAuth.explanationId = reason.explanationId;
      this.fusionAuth.actionValue = reason;
      if (reason.actionDescription === 'pend') {
        this.fusionAuth.pendType = reason.actionGroupCode;
      }

      this.disabledActionOnPend =
        reason.actionConfig && reason.actionConfig.disableInlineActions
          ? reason.actionConfig.inlineHide
          : false;
      this.changeDetectorRef.detectChanges();
      this.updateAuthorization();
      this.setActionFormGroupValues(reason);
    }
  }

  private selectApprovalLineItemReason(reason: AuthorizationReasonCombined) {
    if (reason.explanationId !== this.fusionAuth.explanationId) {
      this.fusionAuthorizationService.sendSelectedDetailAuthReason(
        reason.explanationDescription
      );
      this.fusionAuth.actionId = reason.actionId;
      this.fusionAuth.reasonForAction = reason.explanationDescription;
      this.fusionAuth.explanationId = reason.explanationId;
      this.fusionAuth.pendType = '';
      this.fusionAuth.actionValue = reason;
      this.updateAuthorization();
    }
  }

  private selectDenialLineItemReason(reason: AuthorizationReasonCombined) {
    if (
      !this.fusionAuth.actionValue ||
      reason.explanationId !== this.fusionAuth.explanationId
    ) {
      this.fusionAuthorizationService.sendSelectedDetailAuthReason(
        reason.explanationDescription
      );
      this.fusionAuth.actionId = reason.actionId;
      this.fusionAuth.reasonForAction = reason.explanationDescription;
      this.fusionAuth.explanationId = reason.explanationId;
      this.fusionAuth.pendType = '';
      this.fusionAuth.actionValue = reason;
      this.updateAuthorization();
    }
  }

  private selectPendLineItemReason(reason: AuthorizationReasonCombined) {
    if (
      !this.fusionAuth.actionValue ||
      reason.actionDescription !== this.fusionAuth.reasonForAction
    ) {
      this.fusionAuthorizationService.sendSelectedDetailAuthReason(
        reason.actionDescription
      );
      this.fusionAuth.actionId = reason.actionId;
      this.fusionAuth.reasonForAction = reason.actionDescription;
      this.fusionAuth.explanationId = reason.explanationId;
      this.fusionAuth.pendType = reason.actionGroupCode;
      this.fusionAuth.actionValue = reason;

      this.updateAuthorization();
    }
  }

  /* As the athorization is updated the reasons are reload and the objects' references changes so the dropdown
  doesn't show the actual value so this method its to find the new value reference and set it up
  so the dropdown displays the current value */
  setNewReasonReference(newReferences: AuthorizationReasonCombined[]) {
    let currentValue = this.fusionAuth;
    if (currentValue) {
      let reasonIndex: number;
      if (this.fusionAuth.action === 'pend' && currentValue.actionId) {
        reasonIndex = newReferences.findIndex(
          (reasonRef) =>
            reasonRef.actionId[0] === currentValue.actionId[0] &&
            reasonRef.actionDescription === currentValue.reasonForAction
        );
      } else {
        reasonIndex = newReferences.findIndex(
          (reasonRef) =>
            reasonRef.actionId === currentValue.actionId &&
            reasonRef.explanationId === currentValue.explanationId
        );
      }
      if (reasonIndex >= 0) {
        this.fusionAuth.actionValue = newReferences[reasonIndex];
        this.setActionFormGroupValues(this.fusionAuth.actionValue);
      }
    }
  }

  setActionFormGroupValues(values: AuthorizationReasonCombined) {
    if (values) {
      switch (values.actionGroupCode.trim()) {
        case AuthorizationHeaderReasonGroupCodes.APPROVAL:
          {
            this._formGroup
              .get('action')
              .setValue(this.AUTH_INFO_ACTION_TYPE_APPROVE);

            this._formGroup.get('approvalReason').setValue(values);
            this._formGroup.get('denialReason').reset();
            this._formGroup.get('pendReason').reset();
            this._formGroup.get('action').enable();
          }
          break;
        case AuthorizationHeaderReasonGroupCodes.DENY:
          {
            this._formGroup
              .get('action')
              .setValue(this.AUTH_INFO_ACTION_TYPE_DENY);
            this._formGroup.get('approvalReason').reset();
            this._formGroup.get('denialReason').setValue(values);
            this._formGroup.get('pendReason').reset();
            this._formGroup.get('action').enable();
          }
          break;
        case AuthorizationHeaderReasonGroupCodes.PENDINT:
        case AuthorizationHeaderReasonGroupCodes.PENDVEND:
        case AuthorizationHeaderReasonGroupCodes.PEND:
          {
            this._formGroup
              .get('action')
              .setValue(this.AUTH_INFO_ACTION_TYPE_PEND);
            this._formGroup.get('approvalReason').reset();
            this._formGroup.get('denialReason').reset();
            this._formGroup.get('pendReason').setValue(values);

            if (
              values.actionConfig &&
              values.actionConfig.expirationDateNeeded
            ) {
              this.disableActionForm();
            } else {
              this._formGroup.get('action').enable();
              this._formGroup.get('pendReason').enable();
            }
          }
          break;
      }
    }
  }

  setReasonSelectorState(action: string) {
    if (action) {
      switch (action) {
        default:
        case this.AUTH_INFO_ACTION_TYPE_APPROVE:
          {
            this.showApprovedReasons
              ? this._formGroup.get('approvalReason').enable()
              : this._formGroup.get('approvalReason').disable();
            this._formGroup.get('denialReason').disable();
            this._formGroup.get('pendReason').disable();
          }
          break;
        case this.AUTH_INFO_ACTION_TYPE_DENY:
          {
            this._formGroup.get('approvalReason').disable();
            this._formGroup.get('denialReason').enable();
            this._formGroup.get('pendReason').disable();
          }
          break;
        case this.AUTH_INFO_ACTION_TYPE_PEND:
          {
            this._formGroup.get('approvalReason').disable();
            this._formGroup.get('denialReason').disable();
            this._formGroup.get('pendReason').enable();
          }
          break;
      }
    }
  }

  disableActionForm() {
    this._formGroup.get('action').disable();
    this.disableReasonsControls();
  }

  disableReasonsControls() {
    this._formGroup.get('approvalReason').disable();
    this._formGroup.get('denialReason').disable();
    this._formGroup.get('pendReason').disable();
  }

  updateActionValue(value: string) {
    if (value !== this.fusionAuth.action) {
      this._formGroup.get('approvalReason').reset();
      this._formGroup.get('denialReason').reset();
      this._formGroup.get('pendReason').reset();
      this.fusionAuthorizationService.sendSelectedDetailAuthReason(value);
      if (
        value === this.AUTH_INFO_ACTION_TYPE_APPROVE &&
        !this.showApprovedReasons
      ) {
        if (this.approvalAction) {
          this.fusionAuth.actionId = this.approvalAction.actionId;
          this.fusionAuth.actionValue = this.approvalAction;
        } else {
          this.fusionAuth.actionId = null;
          this.fusionAuth.actionValue = null;
        }
      } else {
        this.fusionAuth.actionId = null;
        this.fusionAuth.actionValue = null;
      }
      this.fusionAuth.action = value;
      this.fusionAuth.reasonForAction = null;
      this.fusionAuth.pendType = null;
      this.fusionAuth.explanationId = null;
      this.setReasonSelectorState(value);
      this.updateAuthorization();
    } else if (
      value === this.AUTH_INFO_ACTION_TYPE_APPROVE &&
      !this.showApprovedReasons &&
      this.approvalAction &&
      this.fusionAuth.actionId !== this.approvalAction.actionId
    ) {
      this.fusionAuth.action = this.approvalAction.actionDescription;
      this.fusionAuth.actionId = this.approvalAction.actionId;
      this.fusionAuth.actionValue = this.approvalAction;
      this.setReasonSelectorState(value);
      this.updateAuthorization();
    }
  }
  resetAuthorizationValues() {
    // reset data logic here
  }

  updateAuthorization() {
    this.store$.dispatch(
      updateFusionAuthorizationState({
        authorization: this.fusionAuth
      })
    );
  }
}
