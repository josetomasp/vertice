import { Component, Input, OnInit } from '@angular/core';
import {
  FusionAuthorization,
  FusionAuthorizationBodyPart,
  FusionBodyPartHistory
} from '../../../store/models/fusion/fusion-authorizations.models';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {
  BodyPartsHistoryModalComponent
} from './components/body-parts-history-modal/body-parts-history-modal.component';
import {
  ReferralAuthorizationArchetype
} from '../../referral-authorization/referral-authorization.models';
import * as _ from 'lodash';

@Component({
  selector: 'healthe-referral-authorization-body-parts-history',
  templateUrl: './referral-authorization-body-parts-history.component.html',
  styleUrls: ['./referral-authorization-body-parts-history.component.scss']
})
export class ReferralAuthorizationBodyPartsHistoryComponent
  extends DestroyableComponent
  implements OnInit {
  @Input()
  fusionReferralAuthorizations$: Observable<FusionAuthorization[]>;

  @Input()
  archeType: ReferralAuthorizationArchetype;

  bodyParts: FusionAuthorizationBodyPart[] = [];

  bodyPartsCsv: string = '';

  bodyPartHistoryArray: FusionBodyPartHistory[] = [];

  DxArchetype: ReferralAuthorizationArchetype =
    ReferralAuthorizationArchetype.Diagnostics;

  PmArchetype: ReferralAuthorizationArchetype =
    ReferralAuthorizationArchetype.PhysicalMedicine;

  constructor(public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    // Merge all body parts in a single list, remove duplicates
    this.fusionReferralAuthorizations$
      .pipe(
        takeUntil(this.onDestroy$),
        map((auth) => _.cloneDeep(auth))
      )
      .subscribe((auths) => {
        if (auths != null) {
          auths.forEach((auth, index) => {
            if (
              auth.authorizationUnderReview &&
              auth.authorizationUnderReview.bodyParts
            ) {
              // Add unfiltered body parts
              this.bodyPartHistoryArray[index] = {
                authorizationDescription:
                  auth.authorizationUnderReview.categoryDesc,
                bodyParts: []
              };

              // Filter repeated body parts, this is used to build the body parts CSV label.
              auth.authorizationUnderReview.bodyParts
                .map((bodyPart) => ({ ...bodyPart }))
                .forEach((bodyPart) => {
                  if (
                    this.bodyParts.filter(
                      (bp) =>
                        // tslint:disable-next-line:triple-equals
                        bp.id == bodyPart.id &&
                        bp.sideOfBody === bodyPart.sideOfBody
                    ).length === 0
                  ) {
                    this.bodyParts.push(bodyPart);
                  }
                  bodyPart.description = this.getBodyPartDisplayName(bodyPart);
                  this.bodyPartHistoryArray[index].bodyParts.push(bodyPart);
                });
            }
          });

          // Build the CSV label
          if (this.bodyParts.length > 0) {
            this.bodyPartsCsv = this.bodyParts
              .map((bp) => this.getBodyPartDisplayName(bp))
              .join(', ');
          }
        }
      });
  }

  getBodyPartDisplayName({
    description,
    sideOfBody
  }: FusionAuthorizationBodyPart) {
    if (
      sideOfBody &&
      sideOfBody.trim() !== '' &&
      description.indexOf(sideOfBody) < 0 &&
      description.search('-') === -1
    ) {
      return description.concat(' - ', sideOfBody.trim());
    }
    return description;
  }

  openViewAllModal() {
    this.dialog.open(BodyPartsHistoryModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '700px',
      data: { bodyPartHistoryArray: this.bodyPartHistoryArray }
    });
  }
}
