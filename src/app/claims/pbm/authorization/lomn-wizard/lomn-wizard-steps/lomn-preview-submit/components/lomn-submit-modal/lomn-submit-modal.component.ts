import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  CreateLOMNSubmitMessage,
  LOMNSubmitContactInfo
} from 'src/app/claims/pbm/authorization/store/models/create-lomn.models';
import { submitCreateLOMN } from 'src/app/claims/pbm/authorization/store/actions/create-lomn.actions';
import { Router } from '@angular/router';
import { AuthorizationLineItem } from '../../../../../store/models/pbm-authorization-information/authorization-line-item.models';

@Component({
  selector: 'healthe-lomn-submit-modal',
  templateUrl: './lomn-submit-modal.component.html',
  styleUrls: ['./lomn-submit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LomnSubmitModalComponent
  extends DestroyableComponent
  implements OnInit
{
  isSubmitting = false;
  isPosAuth = true;

  constructor(
    public store$: Store<RootState>,
    public matDialogRef: MatDialogRef<LomnSubmitModalComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public submitData: {
      submitMessage;
      ndcToLineItemMap: { [ndc: string]: AuthorizationLineItem };
      submittingLOMN$: Observable<boolean>;
      submittingResponse$: Observable<boolean>;
      claimantContactInfo: LOMNSubmitContactInfo;
      attorneyContactInfo: LOMNSubmitContactInfo;
    }
  ) {
    super();
    // For POS Auths, we do not send the paper bill key.
    if (-1 === this.router.url.indexOf('/pos/')) {
      this.isPosAuth = false;
    }
  }

  ngOnInit() {}

  submit() {
    const {
      ndcToLineItemMap,
      submitMessage,
      submittingLOMN$,
      claimantContactInfo,
      attorneyContactInfo
    } = this.submitData;
    let lomnSubmitMessage: CreateLOMNSubmitMessage[] = [];

    submitMessage.formState.medicationList.forEach(
      (medicationList: AuthorizationLineItem) => {
        lomnSubmitMessage.push({
          ...ndcToLineItemMap[medicationList.ndc],
          comment: medicationList.displayNotes,
          npi: medicationList.prescriber.npi,
          attorney: attorneyContactInfo,
          claimNo: submitMessage.claimNumber,
          claimant: claimantContactInfo,
          customerID: submitMessage.customerId,
          prescriberFax: medicationList.prescriberFax,
          paperBillKey: this.isPosAuth
            ? null
            : submitMessage.authorizationId,
          authorizationKey: this.isPosAuth
            ? submitMessage.authorizationId
            : null
        });
      }
    );

    this.isSubmitting = true;
    this.changeDetectorRef.detectChanges();
    this.store$.dispatch(
      submitCreateLOMN({ submitMessage: lomnSubmitMessage })
    );
    //This is being close in the LOMN effects
  }
}
