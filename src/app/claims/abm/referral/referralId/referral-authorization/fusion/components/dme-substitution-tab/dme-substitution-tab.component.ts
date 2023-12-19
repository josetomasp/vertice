import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AuthorizationReasons,
  FusionAuthorization,
  FusionClinicalAlert
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'healthe-dme-substitution-tab',
  templateUrl: './dme-substitution-tab.component.html',
  styleUrls: ['./dme-substitution-tab.component.scss']
})
export class DmeSubstitutionTabComponent implements OnInit {
  selectedTab: number = 0;

  @Input()
  fusionAuthorizationReasons$: Observable<AuthorizationReasons>;
  @Input()
  authorization: FusionAuthorization;
  @Input()
  clinicalAlerts: FusionClinicalAlert[];
  @Input()
  $index: number;
  @Input()
  formArray: FormArray;

  constructor() {}

  ngOnInit() {
    if (this.authorization.authorizationUnderReview.isSubstitution) {
      if (this.authorization.authorizationUnderReview.substitutionApproved) {
        this.selectedTab = 1;
      }
    }
  }
}
