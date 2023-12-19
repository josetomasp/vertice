import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  Document,
  DocumentsApiResults,
  DocumentsFilters,
  DocumentsFilterTriggerText
} from '@shared/store/models/claim-documents-table.models';
import { createSelector, select, Store } from '@ngrx/store';
import { RootState } from '../../../store/models/root.models';
import { ClaimDocumentTableService } from '@shared/components/claim-documents-table/claim-document-table.service';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../store/selectors/router.selectors';
import { combineLatest, Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { pluckPrefValue, VerticeResponse } from '@shared';
import { MatSortable } from '@angular/material/sort';
import * as _ from 'lodash';
import { getPreferenceByQuery } from '../../../preferences/store/selectors/user-preferences.selectors';
import { PreferenceType } from '../../../preferences/store/models/preferences.models';

export interface ClaimDocumentTableComponentStoreState {
  documents: Document[];
  errors: string[];
  numberOfDocuments: number;
  isLoaded: boolean;
  isLoading: boolean;
  currentDocumentsFilters: DocumentsFilters;
  allDocumentsFilters: DocumentsFilters;
  documentsTriggerTexts: DocumentsFilterTriggerText;
  currentDocumentSort: MatSortable;
  pageSize: number;
}

export interface DocumentsQuery {
  claimNumber: string;
  customerId: string;
}
const defaultState: ClaimDocumentTableComponentStoreState = {
  documents: [],
  errors: [],
  numberOfDocuments: 0,
  currentDocumentsFilters: {
    documentDescription: [],
    documentType: [],
    serviceType: [],
    submittedBy: [],
    productType: []
  },
  allDocumentsFilters: {
    documentDescription: [],
    documentType: [],
    serviceType: [],
    submittedBy: [],
    productType: []
  },
  documentsTriggerTexts: {
    description: '',
    type: '',
    serviceType: '',
    submittedBy: '',
    productType: ''
  },
  currentDocumentSort: {
    id: 'documentDate',
    start: 'desc',
    disableClear: false
  },
  pageSize: 50,
  isLoaded: false,
  isLoading: false
};

const getDocumentsQuery = createSelector(
  getEncodedClaimNumber,
  getEncodedCustomerId,
  (claimNumber, customerId) => ({
    claimNumber,
    customerId
  })
);

@Injectable()
export class ClaimDocumentTableComponentStoreService extends ComponentStore<ClaimDocumentTableComponentStoreState> {
  documentsQuery$ = this.store$.pipe(select(getDocumentsQuery));
  pageSizeFromPreferences$: Observable<number> = this.store$.pipe(
    select(getPreferenceByQuery, {
      screenName: 'global',
      preferenceTypeName: PreferenceType.PageSize
    }),
    pluckPrefValue
  );

  // Selectors
  readonly documents$ = this.select((state) => state.documents);
  readonly isLoaded$ = this.select((state) => state.isLoaded);
  readonly isLoading$ = this.select((state) => state.isLoading);
  readonly currentDocumentsFilters$ = this.select(
    (state) => state.currentDocumentsFilters
  );
  readonly currentDocumentSort$ = this.select(
    (state) => state.currentDocumentSort
  );

  readonly pageSize$ = this.select((state) => state.pageSize);

  // Updaters
  readonly setDocumentsTriggerTexts = this.updater(
    (state, documentsTriggerTexts: DocumentsFilterTriggerText) => ({
      ...state,
      documentsTriggerTexts
    })
  );

  readonly setCurrentDocumentSort = this.updater(
    (state, currentDocumentSort: MatSortable) => ({
      ...state,
      currentDocumentSort
    })
  );

  readonly setAllDocumentsFilters = this.updater(
    (state, allDocumentsFilters: DocumentsFilters) => ({
      ...state,
      allDocumentsFilters
    })
  );

  readonly setCurrentDocumentsFilters = this.updater(
    (state, currentDocumentsFilters: DocumentsFilters) => ({
      ...state,
      currentDocumentsFilters
    })
  );

  readonly setIsLoading = this.updater((state, isLoading: boolean) => ({
    ...state,
    isLoading
  }));
  readonly setIsLoaded = this.updater((state, isLoaded: boolean) => ({
    ...state,
    isLoaded
  }));
  readonly setDocuments = this.updater((state, documents: Document[]) => ({
    ...state,
    documents
  }));
  readonly setErrors = this.updater((state, errors: string[]) => ({
    ...state,
    errors
  }));
  readonly setNumberOfDocuments = this.updater(
    (state, numberOfDocuments: number) => ({ ...state, numberOfDocuments })
  );
  readonly setPageSize = this.updater((state, pageSize: number) => ({
    ...state,
    pageSize
  }));

  readonly updateDocumentFilters = this.updater(
    (state, filters: DocumentsFilters) => ({
      ...state,
      currentDocumentsFilters: filters,
      documentsTriggerTexts: this.getAllTriggerTexts(
        filters,
        state.allDocumentsFilters
      )
    })
  );

  // Effects
  readonly getDocuments = this.effect(
    (documentQuery$: Observable<DocumentsQuery>) => {
      return documentQuery$.pipe(
        switchMap((query) => {
          this.setIsLoading(true);

          return this.documentService
            .getDocuments(query.claimNumber, query.customerId)
            .pipe(
              tapResponse(
                (response: VerticeResponse<DocumentsApiResults>) => {
                  if (response.httpStatusCode >= 300) {
                    this.setErrors(response.errors);
                    this.setIsLoading(false);
                  } else {
                    this.setNumberOfDocuments(
                      response.responseBody.numberOfDocuments
                    );

                    this.setDocuments(response.responseBody.documents);
                    this.setIsLoaded(true);
                    this.setIsLoading(false);
                    this.setErrors([]);

                    let allFilters = this.getAllDocumentFilters(
                      response.responseBody.documents
                    );
                    this.setAllDocumentsFilters(allFilters);
                    this.setCurrentDocumentsFilters(allFilters);
                    this.setDocumentsTriggerTexts(
                      this.getAllTriggerTexts(allFilters, allFilters)
                    );
                  }
                },
                (error) => {
                  console.error(error);
                  this.setIsLoading(false);
                  this.setErrors([
                    'General API Error.  Please contact HealtheSystems for support.'
                  ]);
                }
              )
            );
        })
      );
    }
  );

  constructor(
    public store$: Store<RootState>,
    public documentService: ClaimDocumentTableService
  ) {
    super(defaultState);
  }

  init(): void {
    combineLatest([
      this.isLoaded$,
      this.documentsQuery$,
      this.pageSizeFromPreferences$
    ])
      .pipe(first())
      .subscribe(([isLoaded, documentsQuery, pageSize]) => {
        if (false === isLoaded) {
          this.setPageSize(pageSize);
          this.getDocuments(documentsQuery);
        }
      });
  }

  getAllDocumentFilters(documents: Document[]): DocumentsFilters {
    let filters: DocumentsFilters = {} as DocumentsFilters;

    filters.documentDescription = _.union(
      _.clone(documents).map(
        (document: Document) => document.documentDescription
      )
    );

    filters.documentType = _.union(
      _.clone(documents).map((document: Document) => document.documentType)
    );

    filters.serviceType = _.union(
      _.clone(documents).map((document: Document) => document.serviceType)
    );

    filters.submittedBy = _.union(
      _.clone(documents).map((document: Document) => document.submittedBy)
    );

    filters.productType = _.union(
      _.clone(documents).map((document: Document) => document.productType)
    );

    return filters;
  }

  getShowingText(
    filtersSelected: Array<string>,
    totalPossible: Array<string>,
    allSelectedText: string
  ): string {
    if (filtersSelected.length !== totalPossible.length) {
      return (
        'Showing ' + filtersSelected.length + ' of ' + totalPossible.length
      );
    }
    return allSelectedText;
  }

  getAllTriggerTexts(
    currentFilters: DocumentsFilters,
    possibleFilters: DocumentsFilters
  ): DocumentsFilterTriggerText {
    let triggerTexts: DocumentsFilterTriggerText = {
      description: 'All Values',
      type: 'All Values',
      serviceType: 'All Values',
      submittedBy: 'All Values',
      productType: 'All Values'
    };

    triggerTexts.description = this.getShowingText(
      currentFilters.documentDescription,
      possibleFilters.documentDescription,
      triggerTexts.description
    );

    triggerTexts.type = this.getShowingText(
      currentFilters.documentType,
      possibleFilters.documentType,
      triggerTexts.type
    );

    triggerTexts.serviceType = this.getShowingText(
      currentFilters.serviceType,
      possibleFilters.serviceType,
      triggerTexts.serviceType
    );

    triggerTexts.submittedBy = this.getShowingText(
      currentFilters.submittedBy,
      possibleFilters.submittedBy,
      triggerTexts.submittedBy
    );

    triggerTexts.productType = this.getShowingText(
      currentFilters.productType,
      possibleFilters.productType,
      triggerTexts.productType
    );

    return triggerTexts;
  }
}
