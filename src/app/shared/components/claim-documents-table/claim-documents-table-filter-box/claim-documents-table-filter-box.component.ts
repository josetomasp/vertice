import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { first, skipUntil } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import { DocumentsFilters } from '@shared/store/models/claim-documents-table.models';

import { ClaimDocumentTableComponentStoreService } from '@shared/components/claim-documents-table/claim-document-table-component-store.service';
import { Observable } from 'rxjs';
import { DocumentTableFilterViewModel } from '@shared/components/claim-documents-table/claim-document-table.models';

@Component({
  selector: 'healthe-documents-filter-box',
  templateUrl: './claim-documents-table-filter-box.component.html',
  styleUrls: ['./claim-documents-table-filter-box.component.scss']
})
export class ClaimDocumentsTableFilterBoxComponent {
  documentsFilterFormGroup: FormGroup = new FormGroup({
    documentDescription: new FormControl([]),
    documentType: new FormControl([]),
    serviceType: new FormControl([]),
    submittedBy: new FormControl([]),
    productType: new FormControl([])
  });

  allFilterValues = {} as DocumentsFilters;

  readonly viewModel$: Observable<DocumentTableFilterViewModel> =
    this.componentStore.select(
      ({ allDocumentsFilters, documentsTriggerTexts }) => ({
        allDocumentsFilters,
        documentsTriggerTexts
      })
    );

  constructor(
    public store: Store<RootState>,
    public componentStore: ClaimDocumentTableComponentStoreService
  ) {
    this.documentsFilterFormGroup.valueChanges.subscribe((form) => {
      this.componentStore.updateDocumentFilters(form);
    });

    this.componentStore.currentDocumentsFilters$
      .pipe(
        skipUntil(
          this.componentStore.isLoaded$.pipe(
            first((isLoaded) => isLoaded === true)
          )
        ),
        first()
      )
      .subscribe((allFilters) => {
        if (Object.keys(allFilters).length > 0) {
          this.allFilterValues = allFilters;
          this.clearFilters();
        }
      });
  }

  clearFilters(): void {
    this.documentsFilterFormGroup.setValue({
      documentDescription: this.allFilterValues.documentDescription,
      documentType: this.allFilterValues.documentType,
      serviceType: this.allFilterValues.serviceType,
      submittedBy: this.allFilterValues.submittedBy,
      productType: this.allFilterValues.productType
    });
  }
}
