import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'healthe-add-note-modal',
  templateUrl: './add-note-modal.component.html',
  styleUrls: ['./add-note-modal.component.scss']
})
export class AddNoteModalComponent {
  public editMessageText: string;
  public noteFormControl: FormControl = new FormControl('');
  public placeholder = '';
  public headStyle = { 'min-height': '405px' };
  public readOnly: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      notes: string;
      editMessageText: string;
      readOnly?: boolean;
    }
  ) {
    this.noteFormControl.reset(this.data.notes || '');
    this.editMessageText = this.data.editMessageText;
    this.readOnly = this.data.readOnly;
    if (!this.readOnly) {
      this.placeholder = 'Enter notes';
      this.headStyle = { 'min-height': '440px' };
    }
  }
}
