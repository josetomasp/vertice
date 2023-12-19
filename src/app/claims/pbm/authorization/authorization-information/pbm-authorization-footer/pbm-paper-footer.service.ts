import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import {
  ConfirmationModalService
} from '@shared/components/confirmation-modal/confirmation-modal.service';
import { RxAuthorizationLineItemFormState } from '../../store/models/pbm-authorization-information/authorization-line-item.models';

@Injectable({
  providedIn: 'root'
})
export class PbmPaperFooterService extends DestroyableComponent {
  private paperActionFormValues = new Subject<RxAuthorizationLineItemFormState>();

  private resetFooterActionFormFlag = new Subject<string>();
  private isLineItemActionUsed: boolean = false;
  private lastestFooterActionValues: RxAuthorizationLineItemFormState;
  constructor(private confirmationModalService: ConfirmationModalService) {
    super();
  }

  setLineItemAsUsed() {
    this.isLineItemActionUsed = true;
  }

  private sendFormValuesTolineItems(
    formValues: RxAuthorizationLineItemFormState
  ) {
    this.lastestFooterActionValues = formValues;
    this.paperActionFormValues.next(formValues);
  }

  sendSelectedActionFormValues(formValues: RxAuthorizationLineItemFormState) {
    if (this.isLineItemActionUsed) {
      this.confirmationModalService
        .displayModal({
          titleString: 'Changing Approval Status',
          bodyHtml:
            'You have already chosen an action on individual line item(s). By selecting OVERRIDE ALL you will be overriding your previous selections. Are you sure you want to do this?',
          affirmString: 'OVERRIDE ALL',
          denyString: 'CANCEL',
          affirmClass: 'primary-button'
        })
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((override) => {
          if (override) {
            this.isLineItemActionUsed = false;
            this.sendFormValuesTolineItems(formValues);
          } else {
            this.lastestFooterActionValues = null;
            this.resetFooterActionForm(
              'Confirmation Modal: No Override lineItem'
            );
          }
        });
    } else {
      this.lastestFooterActionValues = formValues;
      this.paperActionFormValues.next(formValues);
    }
  }

  getSelectedActionFormValues(): Observable<RxAuthorizationLineItemFormState> {
    return this.paperActionFormValues.asObservable();
  }

  resetFooterActionForm(action?: string) {
    if (this.isLineItemActionUsed && this.lastestFooterActionValues) {
      this.confirmationModalService
        .displayModal({
          titleString: 'Changing Approval Status',
          bodyHtml:
            'You have already chosen an action all on the footer. By selecting OVERRIDE ALL you will be overriding your previous selections. Are you sure you want to do this?',
          affirmString: 'OVERRIDE ALL',
          denyString: 'CANCEL',
          affirmClass: 'primary-button'
        })
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((override) => {
          if (override) {
            this.lastestFooterActionValues = null;
            this.resetFooterActionFormFlag.next(action);
          } else {
            this.isLineItemActionUsed = false;
            this.sendFormValuesTolineItems(this.lastestFooterActionValues);
          }
        });
    } else {
      this.setLineItemAsUsed();
      this.lastestFooterActionValues = null;
      this.resetFooterActionFormFlag.next(action);
    }
  }

  getResetFooterActionForm(): Observable<string> {
    return this.resetFooterActionFormFlag.asObservable();
  }
}
