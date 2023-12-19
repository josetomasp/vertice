import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FusionAuthorization } from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import * as _moment from 'moment';
import { AuthNarrativeMode } from '../../../referral-authorization.models';

const moment = _moment;

@Component({
  selector: 'healthe-dme-authorization-data',
  templateUrl: './dme-authorization-data.component.html',
  styleUrls: ['./dme-authorization-data.component.scss']
})
export class DmeAuthorizationDataComponent implements OnInit {
  @Input()
  index: number;
  @Input()
  formGroup: FormGroup;
  @Input()
  fusionAuth: FusionAuthorization;
  @Input()
  minQuantity: number;
  @Input()
  narrativeMode = AuthNarrativeMode.EditDetails;
  @Input()
  isSubstitutionCard: boolean = false;

  // Attributes for DME
  authorizedPrice: string;
  authMaxQty: number;
  dateOfService: string;
  feeUcrAmt: string;

  constructor() {}

  ngOnInit() {
    if (this.isSubstitutionCard) {
      this.authorizedPrice = this.fusionAuth.authorizationUnderReview.substitutionAuthorizationUnderReview.authorizedPrice;
      this.authMaxQty = this.fusionAuth.authorizationUnderReview.substitutionAuthorizationUnderReview.authMaxQty;
      this.feeUcrAmt = this.fusionAuth.authorizationUnderReview.substitutionAuthorizationUnderReview.feeUcrAmt;
    } else {
      this.authorizedPrice = this.fusionAuth.authorizationUnderReview.authorizedPrice;
      this.authMaxQty = this.fusionAuth.authorizationUnderReview.authMaxQty;
      this.feeUcrAmt = this.fusionAuth.authorizationUnderReview.feeUcrAmt;
    }

    if (this.narrativeMode !== AuthNarrativeMode.PostSubmit) {
      this.formGroup.controls['authMaxQty'].setValue(this.authMaxQty);
    }
  }
}
