import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateRangeValidators } from 'src/app/claims/abm/referral/make-a-referral/components/date-range-form/dateRangeValidators';
import { FusionAuthorization } from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import {
  AuthNarrativeConfig,
  AuthNarrativeMode,
  ReferralAuthorization
} from '../../../referral-authorization.models';

@Component({
  selector: 'healthe-fusion-narrative-text',
  templateUrl: './fusion-narrative-text.component.html',
  styleUrls: ['./fusion-narrative-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FusionNarrativeTextComponent implements OnInit {
  @Input()
  fusionAuth: FusionAuthorization;

  @Input()
  narrativeTextFormGroup: FormGroup;

  referralAuth: ReferralAuthorization;

  @Input()
  authNarrativeMode = AuthNarrativeMode.EditNarrative;

  @Input()
  authNarrativeConfig: AuthNarrativeConfig;

  constructor() {}

  ngOnInit() {
    if (this.authNarrativeMode) {
      // Start Date
      if (
        // TODO: narrativeTextFormGroup can be null
        this.authNarrativeConfig?.startDate?.controlName &&
        !this.narrativeTextFormGroup?.controls[
          this.authNarrativeConfig?.startDate?.controlName
        ]
      ) {
        this.narrativeTextFormGroup.addControl(
          this.authNarrativeConfig?.startDate?.controlName,
          new FormControl()
        );
      }

      // End Date
      if (
        !this.narrativeTextFormGroup.controls[
          this.authNarrativeConfig?.endDate?.controlName
        ]
      ) {
        this.narrativeTextFormGroup.addControl(
          this.authNarrativeConfig?.endDate?.controlName,
          new FormControl()
        );
      }

      // Original End Date
      if (this.authNarrativeConfig?.originalEndDate) {
        if (
          !this.narrativeTextFormGroup.controls[
            this.authNarrativeConfig?.originalEndDate?.controlName
          ]
        ) {
          this.narrativeTextFormGroup.addControl(
            this.authNarrativeConfig?.originalEndDate?.controlName,
            new FormControl()
          );
        }
      }

      // Quantity
      if (
        this.authNarrativeConfig?.quantity?.controlName &&
        !this.narrativeTextFormGroup.controls[
          this.authNarrativeConfig?.quantity?.controlName
        ]
      ) {
        this.narrativeTextFormGroup.addControl(
          this.authNarrativeConfig?.quantity?.controlName,
          new FormControl()
        );
      }

      // Service Date
      if (
        this.authNarrativeConfig?.serviceDate?.controlName &&
        !this.narrativeTextFormGroup.controls[
          this.authNarrativeConfig?.serviceDate?.controlName
        ]
      ) {
        this.narrativeTextFormGroup.addControl(
          this.authNarrativeConfig.serviceDate.controlName,
          new FormControl()
        );
      }
    }
    this.fusionAuth?.narrativeTextList.forEach((narrative) => {
      // Check if there is dates in the narrative so the dates validation can be set
      if (narrative.startDate && narrative.endDate) {
        this.narrativeTextFormGroup.controls[
          this.authNarrativeConfig.startDate.controlName
        ].setValidators([
          Validators.required,
          DateRangeValidators.startDateValidation
        ]);

        let endDateValidators = [
          Validators.required,
          DateRangeValidators.endDateValidation
        ];
        let newAuth =
          this.fusionAuth.narrativeTextList.findIndex((narrativePredicate) => {
            return narrativePredicate.type === 'NEW_OPEN_AUTHORIZATION';
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
            this.narrativeTextFormGroup.controls[
              this.authNarrativeConfig.startDate.controlName
            ].disable();
          }
        }

        this.narrativeTextFormGroup.controls[
          this.authNarrativeConfig.endDate.controlName
        ].setValidators(endDateValidators);
      }
      if (narrative.newTotalLimit) {
        this.narrativeTextFormGroup.controls[
          this.authNarrativeConfig.quantity.controlName
        ].setValidators([
          Validators.min(this.authNarrativeConfig.quantity.min),
          Validators.required
        ]);
        if (narrative.originalEndDate) {
          this.narrativeTextFormGroup.controls[
            this.authNarrativeConfig.originalEndDate.controlName
          ].setValidators([
            Validators.required,
            DateRangeValidators.startDateValidation
          ]);

          this.narrativeTextFormGroup.controls[
            this.authNarrativeConfig.originalEndDate.controlName
          ].updateValueAndValidity();
        }
      }
      this.narrativeTextFormGroup.controls[
        this.authNarrativeConfig.startDate.controlName
      ].updateValueAndValidity();
      this.narrativeTextFormGroup.controls[
        this.authNarrativeConfig.endDate.controlName
      ].updateValueAndValidity();
      this.narrativeTextFormGroup.controls[
        this.authNarrativeConfig.quantity.controlName
      ].updateValueAndValidity();
    });

    this.referralAuth = {
      authorizationItems: [
        {
          reasonsReviewIsNeeded: [],
          narrativeTextList: this.fusionAuth?.narrativeTextList,
          authData: null
        }
      ],
      originalAuthorizationItems: [],
      vendorNote: '',
      subHeaderNote: ''
    };
  }
}
