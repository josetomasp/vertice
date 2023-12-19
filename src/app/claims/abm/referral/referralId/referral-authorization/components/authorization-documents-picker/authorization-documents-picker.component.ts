import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { faTrashAlt } from '@fortawesome/pro-regular-svg-icons/faTrashAlt';
import { DocumentTableItem } from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { filter, first, mergeMap, takeUntil } from 'rxjs/operators';
import { noop, Observable, of } from 'rxjs';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { select, Store } from '@ngrx/store';
import { getUsername } from 'src/app/user/store/selectors/user.selectors';
import * as _moment from 'moment';
import { environment } from 'src/environments/environment';
import { RootState } from 'src/app/store/models/root.models';
import { BytesToMbPipe } from '@shared/pipes/bytes-to-mb.pipe';
import { each } from 'lodash';
import { getEncodedCustomerId } from 'src/app/store/selectors/router.selectors';
import { FusionAuthorizationService } from '../../fusion/fusion-authorization.service';

const moment = _moment;

@Component({
  selector: 'healthe-authorization-documents-picker',
  templateUrl: './authorization-documents-picker.component.html',
  styleUrls: ['./authorization-documents-picker.component.scss']
})
export class AuthorizationDocumentsPickerComponent extends DestroyableComponent
  implements OnInit {
  private onChange: any = noop;
  private onTouched: any = noop;

  @Input() maximumFileSizeInMb: number = 26;

  @Input()
  documents$: Observable<DocumentTableItem[]> = of([]);

  @Input()
  formArray: FormArray = new FormArray([]);

  @Output()
  selectedDocuments = new EventEmitter<DocumentTableItem[]>();

  @ViewChild('hiddenNativeFileInput', { static: true })
  hiddenNativeFileInput: ElementRef;

  userName$: Observable<string> = this.store$.pipe(select(getUsername));

  faTrashAlt = faTrashAlt;
  invalidDocumentsList: string[] = [];
  documentTypes = [
    'Prescription',
    'Correspondence',
    'Evaluation',
    'Medical Records',
    'Report',
    'Job Description'
  ];
  tableDataSource = new MatTableDataSource();
  tableColumns = [
    'fileName',
    'documentType',
    'submittedBy',
    'submitDate',
    'delete'
  ];
  documents: DocumentTableItem[] = [];

  encodedCustomerCode$ = this.store$.pipe(select(getEncodedCustomerId));

  constructor(
    public confirmationModalService: ConfirmationModalService,
    public changeDetectorRef: ChangeDetectorRef,
    public store$: Store<RootState>,
    private bytesToMbPipe: BytesToMbPipe,
    private fusionAuthorizationService: FusionAuthorizationService
  ) {
    super();
  }

  ngOnInit() {
    this.documents$.pipe(takeUntil(this.onDestroy$)).subscribe((documents) => {
      this.documents = documents;
      documents.forEach((doc) => {
        this.formArray.push(
          new FormControl(doc.documentType, Validators.required)
        );
      });
      this.stateChange();
    });

    this.formArray.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((typeArray) => {
        typeArray.forEach((type, i) => {
          if (type) {
            this.documents[i].documentType = type;
          }
        });
        this.stateChange();
      });
  }

  launchDocumentInput() {
    this.onTouched();
    (this.hiddenNativeFileInput.nativeElement as HTMLInputElement).click();
  }

  downloadFile(index, attachmentURL) {
    this.encodedCustomerCode$
      .pipe(
        first(),
        mergeMap(([encodedCustomerCode]) => {
          return this.fusionAuthorizationService.downloadFusionReferralDocument(
            {
              customerCode: encodedCustomerCode,
              attachmentURL: attachmentURL
            }
          );
        })
      )
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

  addFile(file: File): void {
    if (!this.documents) {
      this.documents = [];
    }
    this.userName$.pipe(first()).subscribe((submittedBy) => {
      this.documents.push({
        fileName: file.name,
        fileSize: file.size,
        submitDate: moment(new Date()).format(environment.dateFormat),
        submittedBy,
        file
      });
      this.formArray.push(new FormControl(null, Validators.required));
      this.formArray.markAllAsTouched();
    });
  }

  handleFileInput(event: Event) {
    const currentFileIndex = this.documents.length;
    this.invalidDocumentsList = [];
    const validDocumentsList = [];
    const files: FileList = (event.target as HTMLInputElement).files;

    if (files.length > 0) {
      each(files, (file: File, index) => {
        const fileSize = this.bytesToMbPipe.transform(file.size);
        if (fileSize <= this.maximumFileSizeInMb) {
          this.addFile(file);
          validDocumentsList.push(
            currentFileIndex + index + 1 + '. ' + file.name + '\n'
          );
        } else {
          this.invalidDocumentsList.push(`${file.name}, ${fileSize}MB`);
        }
      });

      if (validDocumentsList.length > 0) {
        // Blanking out values so that the native element doesn't track what
        // files were uploaded and the (change) event is fired every time a file is chosen
        (event.target as HTMLInputElement).value = '';
        this.stateChange();
      }
    }
  }

  confirmDelete(i) {
    this.confirmationModalService
      .displayModal(
        {
          titleString: 'Are you sure?',
          bodyHtml: `
        <p>Do you want to delete the document ${i + 1}. ${
            this.documents[i].fileName
          }?</p>
      `,
          affirmString: 'YES',
          denyString: 'NO'
        },
        '260px'
      )
      .afterClosed()
      .pipe(filter((confirmed) => confirmed))
      .subscribe(() => {
        this.removeDocumentByIndex(i);
      });
  }

  base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    return bytes.map((byte, i) => binaryString.charCodeAt(i));
  }

  removeDocumentByIndex(index: number) {
    if (!this.documents) {
      this.documents = [];
    }
    this.documents.splice(index, 1);
    this.formArray.removeAt(index);
    this.stateChange();
  }

  private stateChange() {
    this.onChange(this.documents);
    this.tableDataSource.data = this.documents;
    this.changeDetectorRef.detectChanges();
    this.selectedDocuments.emit(this.documents);
  }
}
