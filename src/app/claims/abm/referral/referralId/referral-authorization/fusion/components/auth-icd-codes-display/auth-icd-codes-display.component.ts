import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  FusionAuthorization
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import {
  FusionICDCode
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-make-a-referral.models';
import { AuthNarrativeMode } from '../../../referral-authorization.models';
import {
  AuthIcdCodesModalComponent
} from './auth-icd-codes-modal/auth-icd-codes-modal.component';

@Component({
  selector: 'healthe-auth-icd-codes-display',
  templateUrl: './auth-icd-codes-display.component.html',
  styleUrls: ['./auth-icd-codes-display.component.scss']
})
export class AuthIcdCodesDisplayComponent extends DestroyableComponent
  implements OnInit {
  diagnosisCodesAndDescriptionsCsv: string = '';
  openICDCodesModalLabel: string = '';
  diagnosisCodesAndDescriptionsSelected$: Observable<FusionICDCode[]> = of([]);
  noICDCodesPlaceholder: string =
    'No Diagnosis Codes associated with this authorization.';
  noICDCodesPlaceholderLbl: string = 'Add';
  iCDCodesPlaceholderLbl: string = 'View/Edit all';

  @Input()
  icdCodesFormControl: FormControl;

  @Input()
  authNarrativeMode: AuthNarrativeMode;

  @Input()
  fusionAuth: FusionAuthorization;

  authNarrativeModePostSubmit = AuthNarrativeMode.PostSubmit;

  constructor(
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    // Default initial values
    if (!this.icdCodesFormControl.value) {
      this.setModalButtonLabel(0);
      this.diagnosisCodesAndDescriptionsCsv = this.icdCodeListToCsv([]);
    } else {
      let icdCodes = this.fusionAuth.authorizationUnderReview.icdCodes
        ? this.fusionAuth.authorizationUnderReview.icdCodes
        : [];

      this.setModalButtonLabel(icdCodes.length);

      this.diagnosisCodesAndDescriptionsCsv = this.icdCodeListToCsv(icdCodes);

      this.diagnosisCodesAndDescriptionsSelected$ = new Observable((ob) => {
        ob.next(icdCodes);
      });
    }

    // Subscribe to the FormControl change event
    this.icdCodesFormControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((icdCodeList: FusionICDCode[]) => {
        this.diagnosisCodesAndDescriptionsCsv = this.icdCodeListToCsv(
          icdCodeList
        );

        this.setModalButtonLabel(icdCodeList.length);
        this.diagnosisCodesAndDescriptionsSelected$ = new Observable((ob) => {
          ob.next(icdCodeList);
        });
      });
  }

  // Open the modal and provide it the icd codes observable.
  // Once closed, get the selected list for the sub-service.
  openICDCodesModal() {
    this.dialog
      .open(AuthIcdCodesModalComponent, {
        autoFocus: false,
        width: '702px',
        data: {
          icdCodeList$: this.diagnosisCodesAndDescriptionsSelected$,
          isReadOnly:
            this.authNarrativeMode === this.authNarrativeModePostSubmit
        }
      })
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((icdCodeList: FusionICDCode[]) => {
        if (icdCodeList) {
          this.icdCodesFormControl.setValue(icdCodeList);
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  private icdCodeListToCsv(icdCodeList: FusionICDCode[]) {
    if (icdCodeList.length > 0) {
      return icdCodeList
        .map((icdCode) => icdCode.code.concat(' - ', icdCode.desc))
        .join(', ');
    } else {
      return this.noICDCodesPlaceholder;
    }
  }

  private setModalButtonLabel(icdCodeListLength: number) {
    if (icdCodeListLength > 0) {
      this.openICDCodesModalLabel = this.iCDCodesPlaceholderLbl;
    } else {
      if (this.authNarrativeMode === this.authNarrativeModePostSubmit) {
        this.openICDCodesModalLabel = '';
      } else {
        this.openICDCodesModalLabel = this.noICDCodesPlaceholderLbl;
      }
    }
  }
}
