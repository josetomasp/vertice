import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PbmTimePeriodModalComponent } from './pbm-time-period-modal.component';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { PbmPaperAuthorizationSubmitMessage } from '../../store/models/pbm-authorization-information.model';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { submitPaperAuthorization } from '../../store/actions/pbm-authorization-information.actions';

@Injectable({
  providedIn: 'root'
})
export class PbmTimePeriodModalService {
  constructor(
    private dialog: MatDialog,
    private confirmationModalService: ConfirmationModalService,
    private store$: Store<RootState>
  ) {}

  showModal(data) {
    this.dialog.open(PbmTimePeriodModalComponent, {
      data: data,
      width: '1000px'
    });
  }

  submitPaperAuthorization(
    submitMessage: PbmPaperAuthorizationSubmitMessage,
    authorizationId: string
  ) {
    this.confirmationModalService
      .displayModal(
        {
          titleString: 'Submit',
          bodyHtml:
            "Are you sure you want to submit this authorization? You won't be able to undo this action.",
          affirmString: 'Submit',
          denyString: 'Cancel',
          affirmClass: 'success-button'
        },
        '225px'
      )
      .afterClosed()
      .subscribe((isSure) => {
        if (isSure) {
          this.store$.dispatch(
            submitPaperAuthorization({ submitMessage, authorizationId })
          );
        }
      });
  }
}
