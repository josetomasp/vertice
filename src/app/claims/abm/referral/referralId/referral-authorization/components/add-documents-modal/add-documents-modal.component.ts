import { Component, Inject, OnInit } from '@angular/core';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentTableItem } from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import { FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'healthe-add-documents-modal',
  templateUrl: './add-documents-modal.component.html',
  styleUrls: ['./add-documents-modal.component.scss']
})
export class AddDocumentsModalComponent extends DestroyableComponent
  implements OnInit {
  formArray: FormArray = new FormArray([]);

  documents$: Observable<DocumentTableItem[]> = of([]);

  documents: DocumentTableItem[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddDocumentsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentTableItem[]
  ) {
    super();

    if (this.data && this.data.length > 0) {
      this.documents$ = of(this.data);
    }
  }

  ngOnInit() {}

  getSelectedDocuments(selectedDocs: DocumentTableItem[]) {
    this.documents = selectedDocs;
  }

  closeModal() {
    if (this.formArray.valid) {
      this.dialogRef.close(this.documents);
    } else {
      this.formArray.markAllAsTouched();
    }
  }
}
