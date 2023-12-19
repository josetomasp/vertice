import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import {
  AuthNarrativeConfig,
  AuthNarrativeMode,
  NarrativeTextItem
} from '../../../../../../referral-authorization.models';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationInformationService } from '../../../../../../authorization-information.service';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'healthe-narrative-authorized-dates',
  templateUrl: './narrative-authorized-dates.component.html',
  styleUrls: ['./narrative-authorized-dates.component.scss']
})
export class NarrativeAuthorizedDatesComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  narrativeTextItem: NarrativeTextItem;

  @Input()
  formGroup: FormGroup;

  @Input()
  authNarrativeConfig: AuthNarrativeConfig;

  @Input()
  authNarrativeMode: AuthNarrativeMode;

  AuthNarrativeModeEnum = AuthNarrativeMode;

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

    this.formGroup.controls[
      this.authNarrativeConfig.startDate.controlName
    ].setValue(
      moment(this.narrativeTextItem.startDate)
        .hours(12)
        .toDate()
    );

    this.formGroup.controls[
      this.authNarrativeConfig.endDate.controlName
    ].setValue(
      moment(this.narrativeTextItem.endDate)
        .hours(12)
        .toDate()
    );
  }
}
