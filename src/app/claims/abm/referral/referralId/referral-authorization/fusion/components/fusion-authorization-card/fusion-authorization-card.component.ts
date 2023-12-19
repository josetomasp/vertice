import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AuthorizationReasons,
  FusionAuthorization,
  FusionClinicalAlert
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import {
  ReferralAuthorizationArchetype
} from '../../../referral-authorization.models';

export function bodyPartFormArrayActionValidator(): ValidatorFn {
  return (ac: AbstractControl): ValidationErrors => {
    let bodyPartList: FormArray = (ac as FormGroup).get(
      'authBodyPartsFormArray'
    ) as FormArray;
    let actionFormGroup: FormGroup = (ac as FormGroup).get(
      'actionFormGroup'
    ) as FormGroup;
    let actionValue: string =
      actionFormGroup && actionFormGroup.get('action')
        ? actionFormGroup.get('action').value
        : '';
    if (bodyPartList && bodyPartList.controls && actionValue) {
      let valid: boolean = false;
      bodyPartList.controls.forEach((bodyPart: FormControl) => {
        valid = valid || bodyPart.value === 'Approved';
      });

      return valid || actionValue === 'deny'
        ? {}
        : { NoBodyPartApproved: true };
    }
  };
}
@Component({
  selector: 'healthe-fusion-authorization-card',
  templateUrl: './fusion-authorization-card.component.html',
  styleUrls: ['./fusion-authorization-card.component.scss']
})
export class FusionAuthorizationCardComponent implements OnInit {
  @Input()
  authorizations$: Observable<FusionAuthorization[]>;

  @Input()
  fusionAuthorizationReasons$: Observable<AuthorizationReasons>;

  @Input()
  formArray: FormArray;

  fusionAuthorizationFormGroup: FormGroup = new FormGroup({lineItems: new FormArray([])});
  get lineItemsFormArray (): FormArray {
    return (this.fusionAuthorizationFormGroup.get('lineItems') as FormArray) ?? new FormArray([]);}
  @Input()
  clinicalAlerts: FusionClinicalAlert[];
  @Input()
  archeType: ReferralAuthorizationArchetype;
  ReferralAuthorizationArchetype = ReferralAuthorizationArchetype;

  getClinicalAlertsByAuthorizationID(authorizationId: number) {
    if (this.clinicalAlerts) {
      return this.clinicalAlerts.filter(
        (alert) => alert.authorizationId === authorizationId
      );
    } else {
      return [];
    }
  }

  constructor() {}

  ngOnInit() {}
}
