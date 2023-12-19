import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

export enum DocumentPickerModalMode {
  VIEW = 'View',
  ADD = 'Add'
}

export interface DocumentPickerModalConfig {
  formControl: FormControl;
  mode: DocumentPickerModalMode;
}

@Component({
  selector: 'healthe-document-picker-modal',
  templateUrl: './document-picker-modal.component.html',
  styleUrls: ['./document-picker-modal.component.scss']
})
export class DocumentPickerModalComponent implements OnInit {
  maximumFileSizeInMb = 26;
  DocumentPickerModalMode = DocumentPickerModalMode;
  formControl: FormControl;
  mode: DocumentPickerModalMode;
  constructor(
    @Inject(MAT_DIALOG_DATA) public config: DocumentPickerModalConfig,
    public dialogRef: MatDialogRef<DocumentPickerModalComponent>
  ) {}

  ngOnInit() {
    this.formControl = this.config.formControl;
    this.mode = this.config.mode;
  }
}
