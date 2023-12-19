import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import {
  AuthNarrativeConfig,
  AuthNarrativeMode,
  NarrativeTextItem
} from '../../../../../../referral-authorization.models';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationInformationService } from '../../../../../../authorization-information.service';

@Component({
  selector: 'healthe-narrative-additional-quantity',
  templateUrl: './narrative-additional-quantity.component.html',
  styleUrls: ['./narrative-additional-quantity.component.scss']
})
export class NarrativeAdditionalQuantityComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  narrativeTextItem: NarrativeTextItem;

  @Input()
  formGroup: FormGroup;

  @Input()
  authNarrativeConfig: AuthNarrativeConfig;

  authNarrativeModeState: AuthNarrativeMode;
  initDone = false;

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

  tripsInputFC = new FormControl(0);

  newTotalDisplay: number;

  constructor(
    private authorizationActionsService: AuthorizationInformationService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.authorizationActionsService.showValidationErrors
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.formGroup.markAllAsTouched();
        this.changeDetector.detectChanges();
      });

    this.tripsInputFC.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        value = value || 0;
        if (value < 0) {
          this.tripsInputFC.setValue(0, { emitEvent: false });
        } else {
          this.newTotalDisplay = value + this.narrativeTextItem.originalLimit;
          this.formGroup.controls[
            this.authNarrativeConfig.quantity.controlName
          ].setValue(this.newTotalDisplay);
          if (this.newTotalDisplay === this.narrativeTextItem.originalLimit) {
            this.formGroup.markAsPristine();
          } else {
            this.formGroup.markAsDirty();
          }
        }
      });

    this.doModeConfig();
    this.initDone = true;
  }

  private doModeConfig() {
    if (
      this.authNarrativeModeState !== AuthNarrativeMode.EditNarrative ||
      this.authNarrativeConfig.quantity.isDisabled
    ) {
      this.formGroup.controls[
        this.authNarrativeConfig.quantity.controlName
      ].disable();
      this.tripsInputFC.setValue(0);
      this.tripsInputFC.disable();
    } else {
      this.formGroup.controls[
        this.authNarrativeConfig.quantity.controlName
      ].enable();
      this.tripsInputFC.enable();
    }
  }
}
