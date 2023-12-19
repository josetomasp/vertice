import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faTrashAlt } from '@fortawesome/pro-regular-svg-icons/faTrashAlt';
import { select, Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { BytesToMbPipe } from '@shared/pipes/bytes-to-mb.pipe';
import { each } from 'lodash';
import * as _moment from 'moment';
import { noop, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { environment } from '../../../../../../environments/environment';
import { RootState } from '../../../../../store/models/root.models';
import { getUsername } from '../../../../../user/store/selectors/user.selectors';
import { DocumentTableItem } from '../../store/models/make-a-referral.models';

const moment = _moment;

@Component({
  selector: 'healthe-document-picker',
  templateUrl: './document-picker.component.html',
  styleUrls: ['./document-picker.component.scss'],
  providers: [
    {
      useExisting: forwardRef(() => DocumentPickerComponent),
      multi: true,
      provide: NG_VALUE_ACCESSOR
    }
  ]
})
export class DocumentPickerComponent implements ControlValueAccessor {
  private onChange: any = noop;
  private onTouched: any = noop;

  @Input()
  hideUploadDocumentsButton: boolean;

  constructor(
    private bytesToMbPipe: BytesToMbPipe,
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService,
    public changeDetectorRef: ChangeDetectorRef,
    public snackbar: MatSnackBar
  ) {}
  @Input() maximumFileSizeInMb: number = 26;
  @Input() sectionName: string;

  @ViewChild('hiddenNativeFileInput', { static: true })
  hiddenNativeFileInput: ElementRef;
  invalidDocumentsList: string[] = [];
  userName$: Observable<string> = this.store$.pipe(select(getUsername));
  documents: DocumentTableItem[] = [];
  tableDataSource = new MatTableDataSource();
  tableColumns = ['fileName', 'submittedBy', 'submitDate', 'delete'];
  faTrashAlt = faTrashAlt;

  writeValue(documents: DocumentTableItem[]): void {
    this.documents = documents;
    /**
     * Not calling stateChange to avoid looping.
     */
    this.tableDataSource.data = this.documents;
    this.changeDetectorRef.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
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
    });
  }

  removeDocumentByIndex(index: number) {
    if (!this.documents) {
      this.documents = [];
    }
    this.documents.splice(index, 1);
    this.stateChange();
  }

  launchDocumentInput() {
    this.onTouched();
    (this.hiddenNativeFileInput.nativeElement as HTMLInputElement).click();
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
        this.snackbar.open(
          `File(s) successfully attached for upload:\n${validDocumentsList.join(
            ''
          )}`,
          null,
          {
            duration: 2000,
            panelClass: ['success', 'snackbar', 'prewrap']
          }
        );

        // Blanking out values so that the native element doesn't track what
        // files were uploaded and the (change) event is fired every time a file is chosen
        (event.target as HTMLInputElement).value = '';
        this.stateChange();
      }
    }
  }

  private stateChange() {
    this.onChange(this.documents);
    this.tableDataSource.data = this.documents;
    this.changeDetectorRef.detectChanges();
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
}
