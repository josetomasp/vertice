import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  FusionAuthorization,
  FusionAuthorizationBodyPart,
  FusionAuthorizationBodyPartApprovalOptions
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { FusionAuthorizationService } from '../../fusion-authorization.service';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import {
  ReferralBodyPart
} from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { takeUntil } from 'rxjs/operators';
import { FormArray } from '@angular/forms';
import { AuthNarrativeMode } from '../../../referral-authorization.models';

@Component({
  selector: 'healthe-auth-body-parts',
  templateUrl: './auth-body-parts.component.html',
  styleUrls: ['./auth-body-parts.component.scss']
})
export class AuthBodyPartsComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  fusionAuth: FusionAuthorization;

  @Input()
  fusionAuthIndex: number;

  @Input()
  authBodyPartsFormArray: FormArray;

  @Input()
  authNarrativeMode = AuthNarrativeMode.EditNarrative;

  isReadOnly = false;

  originalBodyParts: FusionAuthorizationBodyPart[];

  bodyPartApprovalOptions: FusionAuthorizationBodyPartApprovalOptions[] = [
    { value: 'Approved', label: 'Approved' },
    { value: 'Denied', label: 'Denied' }
  ];

  selectedBodyParts: ReferralBodyPart[][] = [];
  faPlus = faPlus;

  constructor(
    private fusionAuthorizationService: FusionAuthorizationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.isReadOnly = this.authNarrativeMode === AuthNarrativeMode.PostSubmit;

    this.originalBodyParts = Object.assign(
      [],
      this.fusionAuth.authorizationUnderReview.bodyParts
    );
  }

  openAddBodyPartsModal(
    bodyParts: FusionAuthorizationBodyPart[],
    index: number
  ) {
    this.fusionAuthorizationService
      .displayAddBodyPartModal(bodyParts, this.selectedBodyParts[index])
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result) {
          this.selectedBodyParts[index] = result;
          this.changeDetectorRef.detectChanges();
        }
      });
  }
}
