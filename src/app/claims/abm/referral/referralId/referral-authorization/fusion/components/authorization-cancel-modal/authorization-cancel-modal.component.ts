import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AuthorizationReasonCombined,
  AuthorizationReasons,
  FusionAuthorization,
  FusionAuthorizationCancel,
  FusionAuthorizationCancelSubmitReason
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import {
  submitFusionAuthCancellation
} from 'src/app/claims/abm/referral/store/actions/fusion/fusion-authorization.actions';
import {
  ReferralAuthorizationArchetype
} from '../../../referral-authorization.models';

const moment = _moment;

@Component({
  selector: 'healthe-authorization-cancel-modal',
  templateUrl: './authorization-cancel-modal.component.html',
  styleUrls: ['./authorization-cancel-modal.component.scss']
})
export class AuthorizationCancelModalComponent extends DestroyableComponent
  implements OnInit {
  authorizations: FusionAuthorizationCancel[] = [];

  cancelReasons: AuthorizationReasonCombined[] = [];

  isAuthCancelSubmitting = false;

  displayedColumns: string[] = [
    'isCancelling',
    'description',
    'dateOfServiceOrDateRange',
    'cancelReason'
  ];

  // The FormArrays share the index per row.
  formGroup: FormGroup = new FormGroup({
    isCancelling: new FormArray([]),
    selectedResons: new FormArray([])
  });

  constructor(
    public store$: Store<RootState>,
    public matDialogRef: MatDialogRef<AuthorizationCancelModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public cancelParameters: {
      referralId: string;
      encodedCustomerId: string;
      encodedClaimNumber: string;
      fusionReferralAuthorizations: FusionAuthorization[];
      fusionAuthorizationReasons$: Observable<AuthorizationReasons>;
      archeType: ReferralAuthorizationArchetype;
    }
  ) {
    super();
  }

  ngOnInit() {
    this.mapFusionAuthorizationIntoCancelList();
    this.subsToAuthorizationReasons();
  }

  reasonRequiredValidator(indexInArray: number): ValidatorFn {
    return (ac: AbstractControl) => {
      if (ac.parent && ac.parent.parent) {
        const cancelFormArray = ac.parent.parent.get(
          'isCancelling'
        ) as FormArray;

        // If there's no reason selected and the cancel checkbox is checked.
        if (!ac.value && cancelFormArray.controls[indexInArray].value) {
          return {
            reasonRequired: true
          };
        }
      }

      return {};
    };
  }

  subsToAuthorizationReasons() {
    if (
      this.cancelParameters &&
      this.cancelParameters.fusionAuthorizationReasons$
    ) {
      this.cancelParameters.fusionAuthorizationReasons$
        .pipe(
          takeUntil(this.onDestroy$),
          first(
            (reasons) =>
              reasons &&
              reasons.denialLineItemReasons &&
              reasons.denialLineItemReasons.length > 0
          )
        )
        .subscribe(
          (reasons) => (this.cancelReasons = reasons.denialLineItemReasons)
        );
    }
  }

  mapFusionAuthorizationIntoCancelList() {
    if (
      this.cancelParameters &&
      this.cancelParameters.fusionReferralAuthorizations
    ) {
      this.cancelParameters.fusionReferralAuthorizations.map((auth, index) => {
        let dateOfServiceOrDateRange: string = '';
        let reasonDesc: string = '';
        if (
          auth.authorizationUnderReview.startDate &&
          auth.authorizationUnderReview.endDate
        ) {
          dateOfServiceOrDateRange = moment(
            auth.authorizationUnderReview.startDate
          )
            .format(environment.dateFormat)
            .concat(' - ')
            .concat(
              moment(auth.authorizationUnderReview.endDate).format(
                environment.dateFormat
              )
            );
        } else {
          if (auth.authorizationUnderReview.dateOfService) {
            dateOfServiceOrDateRange = moment(
              auth.authorizationUnderReview.dateOfService
            ).format(environment.dateFormat);
          } else if (auth.authorizationUnderReview.anticipatedDeliveryDate) {
            dateOfServiceOrDateRange = moment(
              auth.authorizationUnderReview.anticipatedDeliveryDate
            ).format(environment.dateFormat);
          } else if (auth.authorizationUnderReview.lastServiceDate) {
            dateOfServiceOrDateRange = moment(
              auth.authorizationUnderReview.lastServiceDate
            ).format(environment.dateFormat);
          }
        }
        if (auth.customerStatusReasonDesc) {
          reasonDesc = auth.customerStatusReasonDesc;
        } else if (auth.reasonForAction) {
          reasonDesc = auth.reasonForAction;
        }
        // Add the new row
        this.authorizations.push({
          isCancelling: false,
          description: auth.authorizationUnderReview.categoryDesc,
          dateOfServiceOrDateRange: dateOfServiceOrDateRange,
          cancelReason: null,
          authorizationId: auth.authorizationUnderReview.authorizationId,
          allowCancel:
            auth.authorizationUnderReview.allowCancel != null
              ? auth.authorizationUnderReview.allowCancel
              : false,
          reasonForAction: reasonDesc
        });
        // Set the default values for the FormArray
        (this.formGroup.get('isCancelling') as FormArray).push(
          new FormControl(false)
        );
        (this.formGroup.get('selectedResons') as FormArray).push(
          new FormControl(null, [this.reasonRequiredValidator(index)])
        );
      });
    }
  }

  changeIsCancelCheckbox(isCancelling: boolean, index: number) {
    const reasonCtrl = (this.formGroup.get('selectedResons') as FormArray)
      .controls[index];

    if (isCancelling) {
      reasonCtrl.enable();
      reasonCtrl.updateValueAndValidity();
    } else {
      reasonCtrl.disable();
      reasonCtrl.setValue(null);
    }
  }

  isSubmitDisabled(): boolean {
    const cancelArray = this.formGroup.get('isCancelling') as FormArray;

    return (
      this.formGroup.invalid ||
      this.formGroup.untouched ||
      cancelArray.controls.find((ac) => ac.value) === undefined
    );
  }

  submitCancelation() {
    this.isAuthCancelSubmitting = true;
    let authorizationToSubmit: FusionAuthorizationCancelSubmitReason[] = [];

    const cancelArray = this.formGroup.get('isCancelling') as FormArray;
    const reasonsArray = this.formGroup.get('selectedResons') as FormArray;

    cancelArray.controls.forEach((cancelCtrl, ind) => {
      // this rows auth will be canceled
      if (cancelCtrl.value) {
        const reasonValue = reasonsArray.controls[ind]
          .value as AuthorizationReasonCombined;

        authorizationToSubmit.push({
          authorizationId: this.authorizations[ind].authorizationId,
          reasonId: reasonValue.explanationId
        });
      }
    });

    // Submit Cancelation
    this.store$.dispatch(
      submitFusionAuthCancellation({
        submitMessage: {
          referralId: this.cancelParameters.referralId,
          authorizations: authorizationToSubmit
        },
        submitParameters: {
          encodedCustomerId: this.cancelParameters.encodedCustomerId,
          encodedClaimNumber: this.cancelParameters.encodedClaimNumber,
          archeType: this.cancelParameters.archeType
        }
      })
    );
  }
}
