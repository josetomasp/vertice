import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceScheduledFusionModel } from './service-scheduled-fusion-model';
import { Vertice25Service } from '@shared/service/vertice25.service';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getFusionAuthorizationDefaultHesReferralDetailId } from 'src/app/claims/abm/referral/store/selectors/fusion/fusion-authorization.selectors';
import { takeUntil } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { RootState } from 'src/app/store/models/root.models';

@Component({
  selector: 'healthe-service-scheduled-modal',
  templateUrl: './service-scheduled-fusion-modal.component.html',
  styleUrls: ['./service-scheduled-fusion-modal.component.scss']
})
export class ServiceScheduledFusionModalComponent extends DestroyableComponent
  implements OnInit {
  requestDocumentationButtonDisabled = false;

  hesReferralDetailIdForUploadDocuments$: Observable<string> = this.store$.pipe(
    select(getFusionAuthorizationDefaultHesReferralDetailId),
    takeUntil(this.onDestroy$)
  );

  hesReferralDetailIdForUploadDocuments: string;

  constructor(
    public store$: Store<RootState>,
    public vertice25Service: Vertice25Service,
    public dialogRef: MatDialogRef<ServiceScheduledFusionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: ServiceScheduledFusionModel
  ) {
    super();
  }

  ngOnInit() {
    this.hesReferralDetailIdForUploadDocuments$.subscribe(
      (hesReferralDetailId) =>
        (this.hesReferralDetailIdForUploadDocuments = hesReferralDetailId)
    );
  }

  translateBoolean(value: boolean): string {
    if (null == value) {
      return 'Unknown';
    } else if (value) {
      return 'Yes';
    } else {
      return 'No';
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  createIncidentReport() {
    this.vertice25Service.createIncidentReport();
  }
}
