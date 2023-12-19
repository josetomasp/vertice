import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { RootState } from '../../../../../../../../../store/models/root.models';
import { Observable } from 'rxjs';
import { getFusionAuthorizationDefaultHesReferralDetailId } from 'src/app/claims/abm/referral/store/selectors/fusion/fusion-authorization.selectors';
import { first, takeUntil } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { ReferralAuthorizationArchetype } from '../../../../../referral-authorization/referral-authorization.models';
import { getAuthorizationArchetype } from '../../../../../../../../../store/selectors/router.selectors';

@Component({
  selector: 'healthe-notes-docs-modal',
  templateUrl: './referral-notes-documents-modal.component.html',
  styleUrls: ['./referral-notes-documents-modal.component.scss']
})
/**
 *Fusion and Core are using the same modal
 */
export class ReferralNotesAndDocumentsModalComponent
  extends DestroyableComponent
  implements OnInit
{
  isCore = false;
  ReferralAuthorizationArchetype = ReferralAuthorizationArchetype;

  hesReferralDetailIdForUploadDocuments$: Observable<string> = this.store$.pipe(
    select(getFusionAuthorizationDefaultHesReferralDetailId),
    takeUntil(this.onDestroy$)
  );

  hesReferralDetailIdForUploadDocuments: string;

  authorizationArchType$: Observable<ReferralAuthorizationArchetype> =
    this.store$.pipe(select(getAuthorizationArchetype));

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: { dateOfService: string },
    public store$: Store<RootState>,
    private router: Router,
    public dialogRef: MatDialogRef<ReferralNotesAndDocumentsModalComponent>
  ) {
    super();
  }

  ngOnInit() {
    this.hesReferralDetailIdForUploadDocuments$.subscribe(
      (hesReferralDetailId) =>
        (this.hesReferralDetailIdForUploadDocuments = hesReferralDetailId)
    );

    if (this.router.url.indexOf('transportation') > -1) {
      this.isCore = true;
    }
  }
  closeModal() {
    this.dialogRef.close();
  }
}
