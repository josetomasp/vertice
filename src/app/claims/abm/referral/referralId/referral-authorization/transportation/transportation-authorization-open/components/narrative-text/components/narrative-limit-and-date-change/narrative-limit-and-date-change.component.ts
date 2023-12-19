import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import * as _moment from 'moment';
import {
  environment
} from '../../../../../../../../../../../../environments/environment';
import {
  greaterThanZeroValidator
} from '../../../../../../components/Validators/validatorGreaterThanZero';
import {
  AuthNarrativeConfig,
  AuthNarrativeMode,
  NarrativeTextItem
} from '../../../../../../referral-authorization.models';
import {
  AuthorizationInformationService
} from '../../../../../../authorization-information.service';
import { takeUntil } from 'rxjs/operators';

const moment = _moment;

@Component({
  selector: 'healthe-narrative-limit-and-date-change',
  templateUrl: './narrative-limit-and-date-change.component.html',
  styleUrls: ['./narrative-limit-and-date-change.component.scss']
})
export class NarrativeLimitAndDateChangeComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  narrativeTextItem: NarrativeTextItem;

  @Input()
  formGroup: FormGroup;

  @Input()
  authNarrativeConfig: AuthNarrativeConfig;

  @Input()
  chosenAction: string;

  @Input()
  set authNarrativeMode(authNarrativeMode: AuthNarrativeMode) {
    this.authNarrativeModeState = authNarrativeMode;
    if (this.initDone) {
      this.doModeConfig();
    }
  }

  get authNarrativeMode() {
    return this.authNarrativeModeState;
  }

  newTotalDisplay: number;
  authNarrativeModeState: AuthNarrativeMode;
  tripsInputFC = new FormControl(null, [greaterThanZeroValidator]);
  initDone = false;
  AuthNarrativeModeEnum = AuthNarrativeMode;

  // For Single Date
  singleDateMode = false;
  isAnticipated = false;

  constructor(
    private authorizationActionsService: AuthorizationInformationService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.authorizationActionsService.showValidationErrors
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.formGroup.markAllAsTouched();
        this.changeDetector.detectChanges();
      });

    if (this.authNarrativeConfig.quantity.useFormControl) {
      this.tripsInputFC.disable();
      this.formGroup.controls[
        this.authNarrativeConfig.quantity.controlName
      ].valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((value) => {
          this.newTotalDisplay = value + this.narrativeTextItem.originalLimit;
        });
      this.formGroup.controls[
        this.authNarrativeConfig.quantity.controlName
      ].setValue(this.setInputFCInitialValue());
      if (!this.authNarrativeConfig.quantity.min) {
        this.authNarrativeConfig.quantity.min = 0;
        this.formGroup.controls[
          this.authNarrativeConfig.quantity.controlName
        ].setValidators([
          Validators.min(this.authNarrativeConfig.quantity.min),
          Validators.required
        ]);
        this.formGroup.controls[
          this.authNarrativeConfig.quantity.controlName
        ].updateValueAndValidity();
      }
    } else {
      this.tripsInputFC.setValue(this.setInputFCInitialValue());
      this.tripsInputFC.valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((value) => {
          value = value || 0;
          if (value < 0) {
            this.tripsInputFC.setValue(0, { emitEvent: false });
          } else {
            this.formGroup.controls[
              this.authNarrativeConfig.quantity.controlName
            ].setValue(value + this.narrativeTextItem.originalLimit);
            this.newTotalDisplay = value + this.narrativeTextItem.originalLimit;
          }
        });
    }
    if (this.narrativeTextItem.startDate) {
      this.formGroup.controls[
        this.authNarrativeConfig.startDate.controlName
      ].setValue(
        moment(this.narrativeTextItem.startDate)
          .hours(12)
          .toDate()
      );
    }
    if (this.narrativeTextItem.endDate) {
      this.formGroup.controls[
        this.authNarrativeConfig.endDate.controlName
      ].setValue(
        moment(this.narrativeTextItem.endDate)
          .hours(12)
          .toDate()
      );
    }

    // Single date mode
    if (
      (this.narrativeTextItem.serviceDate ||
        this.narrativeTextItem.anticipatedServiceDate) &&
      !this.narrativeTextItem.endDate &&
      !this.narrativeTextItem.startDate
    ) {
      this.singleDateMode = true;
      let singleDate: string;

      if (this.narrativeTextItem.serviceDate) {
        this.isAnticipated = false;
        singleDate = this.narrativeTextItem.serviceDate;
      } else {
        this.isAnticipated = true;
        singleDate = this.narrativeTextItem.anticipatedServiceDate;
      }

      this.formGroup.controls[
        this.authNarrativeConfig.serviceDate.controlName
      ].setValue(
        moment(singleDate)
          .hours(12)
          .toDate()
      );
    }
    this.doModeConfig();
  }

  private setInputFCInitialValue(): number {
    if (this.narrativeTextItem.newTotalLimit) {
      return (
        this.narrativeTextItem.newTotalLimit -
        this.narrativeTextItem.originalLimit
      );
    } else {
      return (
        this.formGroup.controls[this.authNarrativeConfig.quantity.controlName]
          .value - this.narrativeTextItem.originalLimit
      );
    }
  }

  private doModeConfig() {
    if (
      this.authNarrativeModeState !== AuthNarrativeMode.EditNarrative ||
      this.authNarrativeConfig.quantity.isDisabled
    ) {
      this.formGroup.controls[
        this.authNarrativeConfig.quantity.controlName
      ].disable();
      this.tripsInputFC.disable();
    } else {
      this.formGroup.controls[
        this.authNarrativeConfig.quantity.controlName
      ].enable();
      this.tripsInputFC.enable();
    }
  }

  getFormattedAction() {
    switch (this.chosenAction.toLowerCase()) {
      case 'approve':
        return 'authorized';
      case 'pend':
        return 'pended';
      case 'deny':
        return 'denied';
    }
  }

  getFormattedDate(controlName: string) {
    return moment(this.formGroup.get(controlName).value).format(
      environment.dateFormat
    );
  }
}
