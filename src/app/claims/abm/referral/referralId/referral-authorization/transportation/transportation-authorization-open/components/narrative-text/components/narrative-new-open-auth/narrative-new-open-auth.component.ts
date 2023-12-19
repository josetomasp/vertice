import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import * as _moment from 'moment';
import {
  environment
} from '../../../../../../../../../../../../environments/environment';
import {
  AuthNarrativeConfig,
  AuthNarrativeMode,
  NarrativeTextItem
} from '../../../../../../referral-authorization.models';
import {
  preventLessThanZero
} from '../../../../../transportation-authorization/transportation-authorization-form-builder.service';
import {
  AuthorizationInformationService
} from '../../../../../../authorization-information.service';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { takeUntil } from 'rxjs/operators';
import { faCalendarAlt } from '@fortawesome/pro-solid-svg-icons';
import {
  FormValidationExtractorService
} from "@modules/form-validation-extractor";

const moment = _moment;

@Component({
  selector: 'healthe-narrative-new-open-auth',
  templateUrl: './narrative-new-open-auth.component.html',
  styleUrls: ['./narrative-new-open-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NarrativeNewOpenAuthComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  narrativeTextItem: NarrativeTextItem;

  @Input()
  formGroup: FormGroup;

  @Input()
  authNarrativeConfig: AuthNarrativeConfig;

  @Input()
  chosenAction: string;

  authNarrativeModeState: AuthNarrativeMode;
  AuthNarrativeModeEnum = AuthNarrativeMode;
  unlimitedMode = false;
  initDone = false;
  singleDateMode = false;
  isAnticipated = false;
  calendar = faCalendarAlt;

  constructor(
    private authorizationActionsService: AuthorizationInformationService,
    private changeDetector: ChangeDetectorRef,
    private formValidationExtractorService: FormValidationExtractorService
  ) {
    super();
  }

  get authNarrativeMode() {
    return this.authNarrativeModeState;
  }

  @Input()
  set authNarrativeMode(authNarrativeMode: AuthNarrativeMode) {
    this.authNarrativeModeState = authNarrativeMode;
    if (this.initDone) {
      this.doModeConfig();
    }
  }

  ngOnInit() {
    this.authorizationActionsService.showValidationErrors
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.formGroup.markAllAsTouched();
        this.changeDetector.detectChanges();
      });

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
    if (this.narrativeTextItem.limitValue > -1) {
      this.formGroup.controls[
        this.authNarrativeConfig.quantity.controlName
      ].setValue(this.narrativeTextItem.limitValue);
    }

    preventLessThanZero(
      this.formGroup.controls[this.authNarrativeConfig.quantity.controlName]
    );

    this.doModeConfig();

    if (this.authNarrativeConfig.unlimitedQuantity != null) {
      if (
        this.formGroup.controls[this.authNarrativeConfig.unlimitedQuantity]
          .value
      ) {
        this.unlimitedMode = true;
      }
    }

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

    this.initDone = true;

    this.formValidationExtractorService.registerErrorMessage('invalidDateRange', 'A valid end/start date must be entered');
    this.formValidationExtractorService.registerErrorMessage('min', 'The value entered must be above the minimum allowed');
  }

  doModeConfig() {
    if (
      this.authNarrativeModeState !== AuthNarrativeMode.EditNarrative ||
      this.authNarrativeConfig.quantity.isDisabled
    ) {
      this.formGroup.controls[
        this.authNarrativeConfig.quantity.controlName
      ].disable();
    } else {
      this.formGroup.controls[
        this.authNarrativeConfig.quantity.controlName
      ].enable();
    }
  }

  getFormattedAction() {
    switch (this.chosenAction.toLowerCase()) {
      case 'approve':
        return 'authorized';
      case 'deny':
        return 'denied';
      case 'pend':
        return 'pended';
    }
  }

  getFormattedDate(controlName: string) {
    return moment(this.formGroup.get(controlName).value).format(
      environment.dateFormat
    );
  }
}
