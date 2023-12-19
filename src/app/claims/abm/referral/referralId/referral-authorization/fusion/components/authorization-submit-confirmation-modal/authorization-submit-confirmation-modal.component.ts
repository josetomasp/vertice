import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AuthorizationFusionSubmitMessage } from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RootState } from 'src/app/store/models/root.models';
import { Store } from '@ngrx/store';
import { submitFusionAuthorizations } from 'src/app/claims/abm/referral/store/actions/fusion/fusion-authorization.actions';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

@Component({
  selector: 'healthe-authorization-submit-confirmation-modal',
  templateUrl: './authorization-submit-confirmation-modal.component.html',
  styleUrls: ['./authorization-submit-confirmation-modal.component.scss']
})
export class AuthorizationSubmitConfirmationModalComponent
  extends DestroyableComponent
  implements OnInit {
  constructor(
    public store$: Store<RootState>,
    public matDialogRef: MatDialogRef<
      AuthorizationSubmitConfirmationModalComponent
    >,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public submitData: {
      submitMessage: AuthorizationFusionSubmitMessage;
      submittingAuthorizations$: Observable<boolean>;
      submittingResponse$: Observable<boolean>;
    }
  ) {
    super();
  }

  ngOnInit() {}

  submit() {
    const { submitMessage, submittingAuthorizations$ } = this.submitData;
    this.store$.dispatch(submitFusionAuthorizations({ submitMessage }));
    // This is being close in the fusion authorization effects
  }
}
