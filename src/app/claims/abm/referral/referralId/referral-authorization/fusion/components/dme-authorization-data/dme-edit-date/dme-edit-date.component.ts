import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  FusionAuthorization
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { AuthNarrativeMode } from '../../../../referral-authorization.models';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import {
  DateRangeValidators
} from 'src/app/claims/abm/referral/make-a-referral/components/date-range-form/dateRangeValidators';

const moment = _moment;

@Component({
  selector: 'healthe-dme-edit-date',
  templateUrl: './dme-edit-date.component.html',
  styleUrls: ['./dme-edit-date.component.scss']
})
export class DmeEditDateComponent implements OnInit {
  @Input()
  index: number;
  @Input()
  formGroup: FormGroup;
  @Input()
  fusionAuth: FusionAuthorization;
  @Input()
  narrativeMode = AuthNarrativeMode.EditDetails;
  @Input()
  isSubstitutionCard: boolean = false;

  initialAuthNarrative: boolean;
  isDateRange: boolean = false;

  dateOfService: string;
  startDate: string;
  endDate: string;
  anticipatedDeliveryDate: string;

  readOnlyDisplayDate: string;

  constructor() {}

  ngOnInit() {
    this.initialAuthNarrative =
      this.fusionAuth.authorizationChangeSummary.findIndex(
        (change) =>
          change.changeType === 'NEW_OPEN_AUTHORIZATION' ||
          change.changeType === 'NON_DATE_QTY_LOCATION_CHANGE'
      ) >= 0;

    if (this.isSubstitutionCard) {
      this.dateOfService = this.fusionAuth.authorizationUnderReview.substitutionAuthorizationUnderReview.dateOfService;
      this.startDate = this.fusionAuth.authorizationUnderReview.substitutionAuthorizationUnderReview.startDate;
      this.endDate = this.fusionAuth.authorizationUnderReview.substitutionAuthorizationUnderReview.endDate;
      this.anticipatedDeliveryDate = this.fusionAuth.authorizationUnderReview.substitutionAuthorizationUnderReview.anticipatedDeliveryDate;
    } else {
      this.dateOfService = this.fusionAuth.authorizationUnderReview.dateOfService;
      this.startDate = this.fusionAuth.authorizationUnderReview.startDate;
      this.endDate = this.fusionAuth.authorizationUnderReview.endDate;
      this.anticipatedDeliveryDate = this.fusionAuth.authorizationUnderReview.anticipatedDeliveryDate;
    }

    if (
      this.startDate &&
      this.endDate &&
      this.startDate !== '1900-01-01' &&
      this.endDate !== '1900-01-01' &&
      moment(this.endDate).diff(moment(this.startDate)) > 0
    ) {
      if (this.narrativeMode === 'PostSubmit') {
        this.readOnlyDisplayDate = `${moment(this.startDate).format(
          environment.dateFormat
        )}`
          .concat(' - ')
          .concat(`${moment(this.endDate).format(environment.dateFormat)}`);
      } else {
        this.formGroup.addControl(
          'startDate',
          new FormControl(
            moment(this.startDate)
              .hours(12)
              .toDate()
          )
        );
        this.formGroup
          .get('startDate')
          .setValidators([
            Validators.required,
            DateRangeValidators.startDateValidation
          ]);

        this.formGroup.addControl(
          'endDate',
          new FormControl(
            moment(this.endDate)
              .hours(12)
              .toDate()
          )
        );
        let endDateValidators = [
          Validators.required,
          DateRangeValidators.endDateValidation
        ];
        let newAuth =
          this.fusionAuth.authorizationChangeSummary.findIndex((change) => {
            return (
              change.changeType === 'NEW_OPEN_AUTHORIZATION' ||
              change.changeType === 'NON_DATE_QTY_LOCATION_CHANGE'
            );
          }) > -1;
        if (!newAuth) {
          endDateValidators.push(
            DateRangeValidators.dateEqualsOrGreaterThan(
              this.fusionAuth.authorizationUnderReview.lastServiceDate
            )
          );
        } else {
          const notDateQty =
            this.fusionAuth.authorizationChangeSummary.findIndex((change) => {
              return change.changeType === 'NON_DATE_QTY_LOCATION_CHANGE';
            }) > -1;
          if (notDateQty) {
            this.formGroup.get('startDate').disable();
          }
        }

        this.formGroup.get('endDate').setValidators(endDateValidators);
      }
      this.isDateRange = true;
    } else if (this.dateOfService && this.dateOfService !== '1900-01-01') {
      this.readOnlyDisplayDate = `${moment(this.dateOfService).format(
        environment.dateFormat
      )}`;
    } else {
      this.readOnlyDisplayDate = 'Est: '.concat(
        `${moment(this.anticipatedDeliveryDate).format(environment.dateFormat)}`
      );
    }
  }
}
