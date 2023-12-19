import { Component, Input, OnInit } from '@angular/core';
import {
  FusionAuthorization
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import * as _moment from 'moment';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { AuthNarrativeMode } from '../../../../referral-authorization.models';

const moment = _moment;

@Component({
  selector: 'healthe-summary-details',
  templateUrl: './summary-details.component.html',
  styleUrls: ['./summary-details.component.scss']
})
export class SummaryDetailsComponent implements OnInit {
  @Input()
  fusionAuth: FusionAuthorization;

  @Input()
  icdCodesFormControl: FormControl;

  @Input()
  authNarrativeMode = AuthNarrativeMode.EditNarrative;

  authNarrativeModePostSubmit = AuthNarrativeMode.PostSubmit;

  serviceDate: string;

  constructor() {}

  ngOnInit() {
    if (
      this.fusionAuth &&
      this.fusionAuth.authorizationUnderReview &&
      this.fusionAuth.authorizationUnderReview.appointmentDate
    ) {
      this.serviceDate = moment(
        this.fusionAuth.authorizationUnderReview.appointmentDate
      )
        .endOf('day')
        .format(environment.dateFormat);
    }
  }
}
