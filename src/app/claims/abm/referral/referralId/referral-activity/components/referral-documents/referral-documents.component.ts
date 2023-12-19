import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { combineLatest, noop, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { RootState } from '../../../../../../../store/models/root.models';
import {
  getAuthorizationArchetype,
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getEncodedReferralId
} from '../../../../../../../store/selectors/router.selectors';
import { ClaimsService } from '../../../../../../claims.service';
import { ReferralDocument } from '../../../../store/models/referral-id.models';
import { ReferralIdService } from '../../../referral-id.service';
import { ReferralDocumentsDownloadService } from './referral-documents-download.service';
import { hexDecode, hexEncode } from '@shared';
import { uploadFusionDocument } from '../../../../store/actions/fusion/fusion-make-a-referral.actions';
import {
  ReferralAuthorizationArchetype
} from '../../../referral-authorization/referral-authorization.models';

@Component({
  selector: 'healthe-referral-documents',
  templateUrl: './referral-documents.component.html',
  styleUrls: ['./referral-documents.component.scss']
})
export class ReferralDocumentsComponent extends DestroyableComponent
  implements OnInit, OnDestroy {
  @Input()
  dateOfService: string;
  @Input() showCurrentDocs = true;
  @Input() hesReferralDetailId: string;
  // PM extension attachments need to be sent immediately with a different
  //  attachmentType (ReferralUI vs Referral for the rest of the contexts)
  @Input() isForPmExtension: boolean = false;

  dataSource = new MatTableDataSource();

  documents: ReferralDocument[] = [];

  @ViewChild('HiddenFileInputButton', { static: true })
  hiddenFileInputButtonRef: ElementRef;
  hiddenFileInputButton: HTMLInputElement;
  private onChange: any = noop;

  encodedReferralId$: Observable<string> = this.store$.pipe(
    select(getEncodedReferralId)
  );

  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );

  encodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getEncodedClaimNumber)
  );

  authorizationArchType$: Observable<ReferralAuthorizationArchetype> =
    this.store$.pipe(select(getAuthorizationArchetype));

  isUploading = false;
  isLoading = true;

  ReferralAuthorizationArchetype = ReferralAuthorizationArchetype;

  tableColumns: Array<string> = ['name', 'attachmentSource', 'dateTimeCreated'];

  constructor(
    private referralDocumentsDownloadService: ReferralDocumentsDownloadService,
    public store$: Store<RootState>,
    public changeDetectorRef: ChangeDetectorRef,
    public referralIdService: ReferralIdService,
    public claimsService: ClaimsService,
    private documentsDownloadService: ReferralDocumentsDownloadService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.showCurrentDocs) {
      combineLatest([
        this.encodedClaimNumber$,
        this.encodedCustomerId$,
        this.encodedReferralId$,
        this.authorizationArchType$
      ])
        .pipe(first())
        .subscribe(([claimNumber, customerId, referralId, archType]) => {
          this.documentsDownloadService
            .getDocuments(customerId, referralId, claimNumber, archType)
            .subscribe((docs) => {
              this.documents = docs;
              this.dataSource.data = this.documents;
              this.stateChange();
            });
        });
    }

    this.hiddenFileInputButton = this.hiddenFileInputButtonRef
      .nativeElement as HTMLInputElement;
  }

  // This will cause the file choose box to appear
  uploadDocument(): void {
    this.hiddenFileInputButton.click();
  }

  // This is the actual result of having chosen a file.
  // It is a list of files, but since we are just allowing a single file, we can use element 0
  chosenFile(event: FileList) {
    this.isUploading = true;
    combineLatest([
      this.encodedClaimNumber$,
      this.encodedCustomerId$,
      this.encodedReferralId$,
      this.authorizationArchType$
    ])
      .pipe(first())
      .subscribe(([claimNumber, customerId, referralId, archType]) => {
        let document: ReferralDocument = {
          attachmentSource: 'HES',
          dateTimeCreated: new Date().toISOString(),
          documentType: 'Vertice Submitted',
          name: null,
          notes: null,
          linkToDownloadAttachment: null
        };
        if (!this.isForPmExtension) {
          this.referralIdService
            .referralUploadDocument(
              customerId,
              claimNumber,
              referralId,
              this.hesReferralDetailId
                ? hexEncode(this.hesReferralDetailId)
                : null,
              this.dateOfService,
              event.item(0),
              archType
            )
            .subscribe(
              (good) => {
                this.claimsService.showSnackBar(
                  'DocumentTableItem uploaded successfully',
                  true
                );
                this.hiddenFileInputButton.value = '';
                this.isUploading = false;
                this.documents.push(document);
                this.stateChange();
              },
              (error) => {
                this.claimsService.showSnackBar(
                  'DocumentTableItem upload failed',
                  false
                );
                this.hiddenFileInputButton.value = '';
                this.isUploading = false;
              }
            );
        } else {
          // for PM extension documents use the endpoint that fusion enhanced to support
          //  sending documents to vendors immediately. Since the endpoint we're using for
          //  for this is an optimistic update, we'll have to do the same and set the flags/values appropriately
          this.store$.dispatch(
            uploadFusionDocument({
              claimNumber: hexDecode(claimNumber),
              customerId: hexDecode(customerId),
              referralId: parseInt(hexDecode(referralId), 10),
              document: event.item(0),
              serviceName: 'Physical Medicine',
              isForPmExtension: true,
              hesReferralDetailId: parseInt(this.hesReferralDetailId, 10)
            })
          );

          this.hiddenFileInputButton.value = '';
          this.isUploading = false;
          this.documents.push(document);
          this.stateChange();
        }
      });
  }

  downloadDocument(referralDocument: ReferralDocument): void {
    combineLatest([this.encodedCustomerId$, this.authorizationArchType$])
   .pipe(first()).subscribe(([customerId, archType]) => {
      return this.referralDocumentsDownloadService.getDocument(
        customerId,
        referralDocument.linkToDownloadAttachment,
        archType
      );
    });
  }

  private stateChange(): void {
    this.onChange(this.documents);
    this.dataSource.data = this.documents;
    this.changeDetectorRef.detectChanges();
  }
}
