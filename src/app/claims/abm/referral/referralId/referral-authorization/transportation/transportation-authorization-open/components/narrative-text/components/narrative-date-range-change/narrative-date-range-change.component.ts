import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  environment
} from '../../../../../../../../../../../../environments/environment';
import {
  AuthNarrativeConfig,
  AuthNarrativeConfigControl,
  AuthNarrativeMode,
  NarrativeTextItem
} from '../../../../../../referral-authorization.models';
import { FormGroup } from '@angular/forms';
import * as _moment from 'moment';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import {
  AuthorizationInformationService
} from '../../../../../../authorization-information.service';
import { takeUntil } from 'rxjs/operators';

const moment = _moment;

@Component({
  selector: 'healthe-narrative-date-range-change',
  templateUrl: './narrative-date-range-change.component.html',
  styleUrls: ['./narrative-date-range-change.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NarrativeDateRangeChangeComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  narrativeTextItem: NarrativeTextItem;

  @Input()
  formGroup: FormGroup;

  @Input()
  authNarrativeConfig: AuthNarrativeConfig;

  @Input()
  authNarrativeMode: AuthNarrativeMode;

  @Input()
  chosenAction: string;

  AuthNarrativeModeEnum = AuthNarrativeMode;

  firstDateConfig: AuthNarrativeConfigControl;
  firsDateNarrativeName: string;

  useOriginalEndDate: boolean = false;

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

    if (this.narrativeTextItem.startDate) {
      this.formGroup.controls[
        this.authNarrativeConfig.startDate.controlName
      ].setValue(
        moment(this.narrativeTextItem.startDate)
          .hours(12)
          .toDate()
      );
    }
    this.firstDateConfig = this.authNarrativeConfig.startDate;
    this.firsDateNarrativeName = 'Start date';

    if (this.narrativeTextItem.originalEndDate) {
      this.formGroup.controls[
        this.authNarrativeConfig.originalEndDate.controlName
      ].setValue(
        moment(this.narrativeTextItem.originalEndDate)
          .hours(12)
          .toDate()
      );
      this.firstDateConfig = this.authNarrativeConfig.originalEndDate;
      this.firsDateNarrativeName = 'Original end date';
      this.useOriginalEndDate = true;
    } else {
      if (
        this.authNarrativeConfig.originalEndDate &&
        this.authNarrativeConfig.originalEndDate.controlName &&
        this.formGroup.controls[
          this.authNarrativeConfig.originalEndDate.controlName
        ]
      ) {
        this.formGroup.controls[
          this.authNarrativeConfig.originalEndDate.controlName
        ].disable();
      }
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
  }

  getFormattedDate(controlName: string) {
    return moment(this.formGroup.get(controlName).value).format(
      environment.dateFormat
    );
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
