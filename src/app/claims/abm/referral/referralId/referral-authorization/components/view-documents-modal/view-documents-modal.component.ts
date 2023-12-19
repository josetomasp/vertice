import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RootState } from 'src/app/store/models/root.models';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import {
  getEncodedCustomerId,
  getEncodedReferralId
} from 'src/app/store/selectors/router.selectors';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { loadFusionReferralDocuments } from 'src/app/claims/abm/referral/store/actions/fusion/fusion-authorization.actions';
import {
  getFusionAuthorizationDocuments,
  isFusionAuthorizationDocumentsLoading
} from 'src/app/claims/abm/referral/store/selectors/fusion/fusion-authorization.selectors';
import { isEqual } from 'lodash';
import { DocumentFusionTableItem } from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';

@Component({
  selector: 'healthe-view-documents-modal',
  templateUrl: './view-documents-modal.component.html',
  styleUrls: ['./view-documents-modal.component.scss']
})
export class ViewDocumentsModalComponent extends DestroyableComponent
  implements OnInit, OnDestroy {
  documents: DocumentFusionTableItem[] = [];
  tableDataSource = new MatTableDataSource();
  tableColumns = ['fileName', 'submittedBy', 'submitDate'];

  isLoading = false;

  encodedCustomerCode;

  constructor(
    private store$: Store<RootState>,
    public dialogRef: MatDialogRef<ViewDocumentsModalComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public service: any
  ) {
    super();
  }

  isDocumentsLoading$ = this.store$.pipe(
    select(isFusionAuthorizationDocumentsLoading)
  );

  fusionReferralDocuments$: Observable<
    DocumentFusionTableItem[]
  > = this.store$.pipe(
    select(getFusionAuthorizationDocuments),
    distinctUntilChanged(isEqual)
  );

  ngOnInit() {
    combineLatest([
      this.store$.pipe(select(getEncodedCustomerId)),
      this.store$.pipe(select(getEncodedReferralId))
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([encodedCustomerId, encodedReferralId]) => {
        this.encodedCustomerCode = encodedCustomerId;
        this.store$.dispatch(
          loadFusionReferralDocuments({
            customerCode: encodedCustomerId,
            referralId: encodedReferralId
          })
        );
      });
    this.isDocumentsLoading$
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged()
      )
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
        this.changeDetectorRef.detectChanges();
      });

    this.fusionReferralDocuments$.subscribe(
      (attachments: DocumentFusionTableItem[]) => {
        this.documents = attachments;
        /**
         * Not calling stateChange to avoid looping.
         */
        this.tableDataSource.data = this.documents;
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  downloadFile(index, attachmentURL) {
    this.service
      .downloadFusionReferralDocument({
        customerCode: this.encodedCustomerCode,
        attachmentURL: attachmentURL
      })
      .subscribe((response) => {
        let byteArray: ArrayBuffer = this.base64ToArrayBuffer(response.file);
        let file: Blob = new Blob([byteArray]);
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        let fileName = this.documents[index].fileName;
        link.download = fileName;
        link.click();

        // Remove link from body
        link.remove();
      });
  }

  base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    return bytes.map((byte, i) => binaryString.charCodeAt(i));
  }
}
