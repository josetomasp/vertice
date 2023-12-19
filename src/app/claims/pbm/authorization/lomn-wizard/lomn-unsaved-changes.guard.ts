import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { Observable, of } from 'rxjs';
import { LomnWizardComponent } from './lomn-wizard.component';

@Injectable({
  providedIn: 'root'
})
export class LomnUnsavedChangesGuard
  implements CanDeactivate<LomnWizardComponent> {
  constructor(public confirmationModalService: ConfirmationModalService) {}
  canDeactivate(
    { lomnFormGroup, submissionSuccess }: LomnWizardComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    if (lomnFormGroup.touched && !submissionSuccess) {
      return this.confirmationModalService
        .displayModal({
          affirmString: 'YES',
          bodyHtml: `<span>If you leave all your data will be lost. Are you sure you want to leave?</span>`,
          denyString: 'NO',
          titleString: 'Are you sure?'
        })
        .afterClosed();
    } else {
      return of(true);
    }
  }
}
