import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faTrashAlt } from '@fortawesome/pro-light-svg-icons';
import { Store } from '@ngrx/store';
import { debounceTime, takeWhile } from 'rxjs/operators';

import { RootState } from '../../../../../../../store/models/root.models';
import {
  removeReferralAuthorizationItem,
  updateReferralAuthorizationFormData
} from '../../../../store/actions/referral-authorization.actions';
import { AuthorizationInformationService } from '../../authorization-information.service';
import {
  ActionReasonSelectSet,
  AuthApprovalState,
  ReferralAuthData,
  ReferralAuthorizationItem,
  ReferralAuthorizationType
} from '../../referral-authorization.models';
import { CreateNewAuthorizationService } from '../../transportation/transportation-authorization/components/createNewAuthorization/create-new-authorization.service';

interface AuthorizationActionsData extends ReferralAuthData {
  AuthAction_ApprovalType: string;
  AuthAction_ApprovalReason: string;
}

@Component({
  selector: 'healthe-authorization-actions',
  templateUrl: './authorization-actions.component.html',
  styleUrls: ['./authorization-actions.component.scss']
})
export class AuthorizationActionsComponent implements OnInit, OnDestroy {
  @Input()
  referralAuthorizationItem: ReferralAuthorizationItem;

  @Input()
  idIndex;

  @Input()
  referralAuthorizationType: ReferralAuthorizationType;

  faTrashAlt = faTrashAlt;
  formGroup: FormGroup;

  AuthApprovalState = AuthApprovalState;

  actionReasonSelectSet: ActionReasonSelectSet;
  authData: AuthorizationActionsData;

  isAlive = true;
  iWasTouchedRecently: boolean = false;

  constructor(
    private authorizationActionsService: AuthorizationInformationService,
    private createNewAuthorizationServiceService: CreateNewAuthorizationService,
    private store$: Store<RootState>
  ) {}

  ngOnInit() {
    this.formGroup = this.referralAuthorizationItem.formGroup;
    this.authData = this.referralAuthorizationItem
      .authData as AuthorizationActionsData;

    this.setupPostSubmitData();

    this.formGroup.addControl(
      'AuthAction_ApprovalType',
      new FormControl(
        this.authData.AuthAction_ApprovalType,
        Validators.required
      )
    );
    this.formGroup.addControl(
      'AuthAction_ApprovalReason',
      new FormControl(
        this.authData.AuthAction_ApprovalReason,
        Validators.required
      )
    );

    if (this.authData.AuthAction_ApprovalType) {
      this.setApprovalReasonForTypeInActions(this.authData
        .AuthAction_ApprovalType as AuthApprovalState);

      // Need to set the value again because the above function sets it to null.
      this.formGroup.controls['AuthAction_ApprovalReason'].setValue(
        this.authData.AuthAction_ApprovalReason
      );
    }

    this.formGroup.valueChanges
      .pipe(
        debounceTime(750),
        takeWhile(() => this.isAlive)
      )
      .subscribe(() => {
        this.saveForm();
      });

    this.formGroup.controls['AuthAction_ApprovalType'].valueChanges
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((value) => {
        if (this.iWasTouchedRecently) {
          this.authorizationActionsService.didUserChangeAuthStateOrReason.next({
            didUserChangeAuthStateOrReason: true,
            actionFromFooter: false
          });
          this.iWasTouchedRecently = false;
        } else {
          this.authorizationActionsService.didUserChangeAuthStateOrReason.next({
            didUserChangeAuthStateOrReason: true,
            actionFromFooter: true
          });
        }
        this.setApprovalReasonForTypeInActions(value);
      });

    this.formGroup.controls['AuthAction_ApprovalReason'].valueChanges
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => {
        if (this.iWasTouchedRecently) {
          this.authorizationActionsService.didUserChangeAuthStateOrReason.next({
            didUserChangeAuthStateOrReason: true,
            actionFromFooter: false
          });
          this.iWasTouchedRecently = false;
        } else {
          this.authorizationActionsService.didUserChangeAuthStateOrReason.next({
            didUserChangeAuthStateOrReason: true,
            actionFromFooter: true
          });
        }
      });

    if (false === this.referralAuthorizationItem.isAddedItem) {
      this.authorizationActionsService.setApproval
        .pipe(takeWhile(() => this.isAlive))
        .subscribe((value) => {
          this.formGroup.controls['AuthAction_ApprovalType'].setValue(
            value.authApprovalState,
            {
              emitEvent: true
            }
          );

          this.setApprovalReasonForTypeInActions(value.authApprovalState);
          this.formGroup.controls['AuthAction_ApprovalReason'].setValue(
            value.reason,
            {
              emitEvent: true
            }
          );
        });
    }

    this.authorizationActionsService.showValidationErrors
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => {
        this.formGroup.markAllAsTouched();
      });
  }

  setApprovalReasonForTypeInActions(value: AuthApprovalState) {
    this.formGroup.controls['AuthAction_ApprovalReason'].setValue(null, {
      emitEvent: false
    });

    switch (value) {
      case AuthApprovalState.Approve:
        this.actionReasonSelectSet = null;
        this.formGroup.controls['AuthAction_ApprovalReason'].disable({
          emitEvent: false
        });
        break;
      case AuthApprovalState.Deny:
        this.actionReasonSelectSet = this.authorizationActionsService.denialReasonSelectSet;
        this.formGroup.controls['AuthAction_ApprovalReason'].enable({
          emitEvent: false
        });
        break;
      case AuthApprovalState.Pending:
        this.actionReasonSelectSet = this.authorizationActionsService.pendingReasonSelectSet;
        this.formGroup.controls['AuthAction_ApprovalReason'].enable({
          emitEvent: false
        });
        break;
    }
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  deleteThisItem() {
    this.store$.dispatch(
      removeReferralAuthorizationItem({
        authItem: this.referralAuthorizationItem
      })
    );

    this.createNewAuthorizationServiceService.reloadAuthItems$.next();
  }

  private saveForm() {
    this.store$.dispatch(
      updateReferralAuthorizationFormData({
        authItemId: this.referralAuthorizationItem.uniqueId,
        formData: this.formGroup.value
      })
    );
  }

  // These form controls are not directly used.  They just hold data for the post submit screen.
  private setupPostSubmitData() {
    this.formGroup.addControl('authData', new FormControl(this.authData));

    this.formGroup.addControl(
      'reasonsReviewIsNeeded',
      new FormControl(this.referralAuthorizationItem.reasonsReviewIsNeeded)
    );

    this.formGroup.addControl(
      'icon',
      new FormControl(this.referralAuthorizationItem.icon)
    );

    this.formGroup.addControl(
      'title',
      new FormControl(this.referralAuthorizationItem.title)
    );
  }
}
