import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  AuthNarrativeConfig,
  AuthNarrativeMode,
  ReferralAuthorization,
  ReferralAuthorizationItem
} from '../../../../referral-authorization.models';
import { FormGroup } from '@angular/forms';
import { ClaimLocation } from '../../../../../../store/models/make-a-referral.models';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { AuthorizationInformationService } from '../../../../authorization-information.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'healthe-narrative-text',
  templateUrl: './narrative-text.component.html',
  styleUrls: ['./narrative-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NarrativeTextComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  referralAuthorization: ReferralAuthorization;

  @Input()
  formGroup: FormGroup;

  @Input()
  // This formGroup is only used to display errors at the bottom of the narrative text component when the details is collapsed.
  // This is to solve the problem of validation errors you can't see in narrative area.
  openAuthValidationFormGroup: FormGroup = null;

  @Input()
  isOpenAuthDetailedExpanded: boolean = false;

  @Input()
  authNarrativeMode: AuthNarrativeMode;

  @Input()
  authNarrativeConfig: AuthNarrativeConfig;

  @Input()
  claimLocations: ClaimLocation[];

  @Input()
  chosenAction: string;

  showErrors: boolean = false;

  supportedTypes = [
    'QUANTITY_USED',
    'OPEN_AUTHORIZATION_DATE_RANGE',
    'OPEN_AUTHORIZATION_LIMIT_MODIFICATION',
    'NEW_OPEN_AUTHORIZATION',
    'OPEN_AUTHORIZATION_LOCATION_LIMIT',
    'OPEN_AUTHORIZATION_NEW_LOCATION',
    'OPEN_AUTHORIZATION_QUANTITY_CHANGE_WITH_DATE',
    'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
    'OPEN_AUTHORIZATION_DATE_CHANGE',
    'AUTHORIZED_DATES',
    'ADDITIONAL_QUANTITY'
  ];

  referralAuthorizationItem: ReferralAuthorizationItem = null;

  constructor(
    private authorizationActionsService: AuthorizationInformationService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    if (null !== this.openAuthValidationFormGroup) {
      this.authorizationActionsService.showValidationErrors
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          this.showErrors = true;
          this.changeDetector.detectChanges();
        });
      this.openAuthValidationFormGroup.statusChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          this.changeDetector.detectChanges();
        });
    }

    if (
      this.referralAuthorization &&
      this.referralAuthorization.authorizationItems &&
      this.referralAuthorization.authorizationItems.length > 0
    ) {
      // This is only ever supposed to be a list of exactly 1 item.
      this.referralAuthorizationItem = this.referralAuthorization.authorizationItems[0];
    }
  }

  getNarrativeTextList() {
    return this.referralAuthorizationItem?.narrativeTextList?.filter(
      (narrative) => this.supportedTypes.indexOf(narrative.type) > -1
    );
  }

  showFutureDateError(): boolean {
    if (null !== this.openAuthValidationFormGroup) {
      let hasRedundantType = false;
      this.referralAuthorizationItem?.narrativeTextList?.forEach((item) => {
        if (
          'NEW_OPEN_AUTHORIZATION' === item.type ||
          'OPEN_AUTHORIZATION_DATE_RANGE' === item.type ||
          'OPEN_AUTHORIZATION_QUANTITY_CHANGE_WITH_DATE' === item.type
        ) {
          hasRedundantType = true;
        }
      });

      if (hasRedundantType) {
        return false;
      }
      return this.openAuthValidationFormGroup
        .get('endDate')
        .hasError('endDateMustBeInFuture');
    }

    return false;
  }
}
