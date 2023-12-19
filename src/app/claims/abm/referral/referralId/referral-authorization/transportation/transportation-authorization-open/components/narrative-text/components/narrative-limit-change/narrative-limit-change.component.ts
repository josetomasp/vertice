import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { takeUntil } from 'rxjs/operators';
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

@Component({
  selector: 'healthe-narrative-limit-change',
  templateUrl: './narrative-limit-change.component.html',
  styleUrls: ['./narrative-limit-change.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class NarrativeLimitChangeComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  narrativeTextItem: NarrativeTextItem;

  @Input()
  formGroup: FormGroup;

  @Input()
  authNarrativeConfig: AuthNarrativeConfig;

  @Input()
  chosenAction: string;

  newTotalDisplay: number;

  authNarrativeModeState: AuthNarrativeMode;
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

  tripsInputFC = new FormControl(null, [greaterThanZeroValidator]);
  initDone = false;

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
    this.doModeConfig();
    this.initDone = true;
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
}
