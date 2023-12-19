import { Component, Inject, OnInit } from '@angular/core';
import { RootState } from 'src/app/store/models/root.models';
import { select, Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, takeUntil } from 'rxjs/operators';
import { ReferralBodyPart } from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import { getFusionBodyPartsForClaim } from 'src/app/claims/abm/referral/store/selectors/fusion/fusion-make-a-referrral.selectors';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FusionAuthorizationBodyPart } from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';

@Component({
  selector: 'healthe-body-parts-modal',
  templateUrl: './body-parts-modal.component.html',
  styleUrls: ['./body-parts-modal.component.scss']
})
export class BodyPartsModalComponent extends DestroyableComponent
  implements OnInit {
  filterParts: FusionAuthorizationBodyPart[];
  bodyParts$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getFusionBodyPartsForClaim),
    map((values: ReferralBodyPart[]) => {
      if (this.filterParts && this.filterParts.length > 0) {
        values = values.filter((bodyPart) => {
          let foundIndex;
          let found = this.filterParts.some((element, index) => {
            foundIndex = index;
            return (
              element.id
                .toString()
                .concat(element.sideOfBody ? element.sideOfBody.trim() : '') ===
              bodyPart.ncciCode
                .toString()
                .concat(bodyPart.sideOfBody ? bodyPart.sideOfBody.trim() : '')
            );
          });
          if (found) {
            this.filterParts.splice(foundIndex, 1);
          }
          return !found;
        });
      }
      return values.map((bodyPart: ReferralBodyPart) => ({
        label: bodyPart.desc,
        value: bodyPart
      }));
    })
  );

  form: FormGroup = new FormGroup({
    bodyParts: new FormControl(this.data.selectedBodyParts)
  });

  required: boolean = false;

  constructor(
    public store$: Store<RootState>,
    public dialogRef: MatDialogRef<BodyPartsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();

    if (!data.selectedBodyParts || data.selectedBodyParts.length === 0) {
      this.form.controls['bodyParts'].setValidators(Validators.required);
      this.required = true;
    }
    this.filterParts = Object.assign([], data.bodyParts);
  }

  ngOnInit() {}

  addSelectedBodyParts() {
    let control = this.form.get('bodyParts');
    control.markAsTouched();
    if (this.form.valid) {
      this.dialogRef.close(control.value);
    }
  }
}
