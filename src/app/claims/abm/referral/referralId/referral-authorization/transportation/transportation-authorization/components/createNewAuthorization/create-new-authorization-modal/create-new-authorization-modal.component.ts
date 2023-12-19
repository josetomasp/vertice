import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TimeOption } from '@shared';
import { takeUntil } from 'rxjs/operators';

import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { RootState } from '../../../../../../../../../../store/models/root.models';
import {
  TRANSPORTATION_FLIGHT_STEP_NAME,
  TRANSPORTATION_LODGING_STEP_NAME,
  TRANSPORTATION_OTHER_STEP_NAME,
  TRANSPORTATION_SEDAN_STEP_NAME,
  TRANSPORTATION_STEP_DEFINITIONS,
  TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME
} from '../../../../../../../make-a-referral/transportation/transportation-step-definitions';
import { addReferralAuthorizationItem } from '../../../../../../../store/actions/referral-authorization.actions';
import {
  ClaimLocation,
  WizardStep
} from '../../../../../../../store/models/make-a-referral.models';
import { AuthorizationInformationService } from '../../../../../authorization-information.service';
import {
  AuthApprovalState,
  ReferralAuthorizationItem,
  ReferralAuthorizationTypeCode
} from '../../../../../referral-authorization.models';
import { CreateNewAuthorizationService } from '../create-new-authorization.service';

export interface CreateNewAuthorizationModalComponentData {
  locations: { label: string; value: ClaimLocation }[];
  appointmentTypes: string[];
  timeDropdownValues: TimeOption[];
}

@Component({
  selector: 'healthe-create-new-authorization-modal',
  templateUrl: './create-new-authorization-modal.component.html',
  styleUrls: ['./create-new-authorization-modal.component.scss']
})
export class CreateNewAuthorizationModalComponent extends DestroyableComponent
  implements OnInit {
  transportationTypes: WizardStep[] = TRANSPORTATION_STEP_DEFINITIONS;
  inServiceSelectionMode = true;
  referralAuthorizationItem: ReferralAuthorizationItem;
  referralAuthorizationType = ReferralAuthorizationTypeCode;
  formIsInAValidState = false;
  clickedAddOnce = false;
  disableAddButton = false;

  radioButton: FormControl = new FormControl(TRANSPORTATION_SEDAN_STEP_NAME, [
    Validators.required
  ]);

  constructor(
    public dialogRef: MatDialogRef<CreateNewAuthorizationModalComponent>,
    private authorizationInformationService: AuthorizationInformationService,
    private createNewAuthorizationServiceService: CreateNewAuthorizationService,
    private store$: Store<RootState>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: CreateNewAuthorizationModalComponentData
  ) {
    super();
    createNewAuthorizationServiceService.reset();
    createNewAuthorizationServiceService.formIsValid$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.formIsInAValidState = value;
      });
  }

  ngOnInit() {}

  isAddButtonDisabled(): boolean {
    if (this.inServiceSelectionMode) {
      return this.radioButton.invalid;
    } else {
      if (false === this.clickedAddOnce) {
        return this.disableAddButton;
      } else {
        return !this.formIsInAValidState || this.disableAddButton;
      }
    }
  }

  // We need to check the modal CD
  addButtonClick(): void {
    if (this.inServiceSelectionMode) {
      if (this.radioButton.valid) {
        this.referralAuthorizationItem = this.createAuthItem(
          this.radioButton.value
        );
        this.inServiceSelectionMode = false;
      }
    } else {
      if (this.formIsInAValidState) {
        this.disableAddButton = true;
        this.createNewAuthorizationServiceService.saveFormData$.next();
        this.store$.dispatch(
          addReferralAuthorizationItem({
            authItem: this.referralAuthorizationItem
          })
        );
        this.createNewAuthorizationServiceService.reloadAuthItems$.next();
        this.dialogRef.close();
      } else {
        if (false === this.clickedAddOnce) {
          this.clickedAddOnce = true;
          this.createNewAuthorizationServiceService.showErrors$.next();
        }
      }
    }
  }

  toggleCheckboxAndUpdateForm(name) {
    this.radioButton.setValue(name);
  }

  createAuthItem(authItemType: string): ReferralAuthorizationItem {
    return {
      authData: {
        appointmentDate: null,
        appointmentTime: null,
        appointmentType: null,
        doctorNameAndSpecialty: null,
        AuthAction_ApprovalType: AuthApprovalState.Approve,
        AuthAction_ApprovalReason: null,
        rush: false,
        authorizationTypeCode: this.convertAuthType(authItemType)
      },
      reasonsReviewIsNeeded: null,
      narrativeTextList: null,
      isAddedItem: true,
      uniqueId: this.authorizationInformationService.getUniqueId()
    };
  }

  convertAuthType(type: string): ReferralAuthorizationTypeCode {
    switch (type) {
      case TRANSPORTATION_SEDAN_STEP_NAME:
        return ReferralAuthorizationTypeCode.DETAILED_SEDAN;
      case TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME:
        return ReferralAuthorizationTypeCode.DETAILED_WHEELCHAIR;
      case TRANSPORTATION_FLIGHT_STEP_NAME:
        return ReferralAuthorizationTypeCode.DETAILED_FLIGHT;
      case TRANSPORTATION_LODGING_STEP_NAME:
        return ReferralAuthorizationTypeCode.DETAILED_LODGING;
      case TRANSPORTATION_OTHER_STEP_NAME:
        return ReferralAuthorizationTypeCode.DETAILED_OTHER;

      default:
        console.warn(
          'warning, unknown type passed into CreateNewAuthorizationModalService.convertAuthType ' +
            type
        );
        return ReferralAuthorizationTypeCode.DETAILED_SEDAN;
    }
  }
}
