import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { isObservable, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'healthe-upload-files-progress-modal',
  templateUrl: './upload-files-progress-modal.component.html',
  styleUrls: ['./upload-files-progress-modal.component.scss']
})
export class UploadFilesProgressModalComponent implements OnInit {
  uploadedFiles: number = 0;
  allFiles: number = 0;

  constructor(
    public dialogRef: MatDialogRef<UploadFilesProgressModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    documentUploadMeta$: Observable<{
      totalDocuments: number;
      uploadedDocuments: number;
    }>
  ) {
    if (isObservable(documentUploadMeta$)) {
      documentUploadMeta$
        .pipe(takeUntil(this.dialogRef.afterClosed()))
        .subscribe(({ totalDocuments, uploadedDocuments }) => {
          this.uploadedFiles = uploadedDocuments;
          this.allFiles = totalDocuments;
          if (this.allFiles === this.uploadedFiles) {
            this.dialogRef.close();
          }
        });
    }
  }

  ngOnInit() {}
}
