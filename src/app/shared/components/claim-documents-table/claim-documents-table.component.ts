import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { select, Store } from '@ngrx/store';
import { pageSizeOptions } from '../../models/pagerOptions';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '../../models/healthe-data-source';
import { Observable, zip } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import { TableCondition, VerbiageService } from 'src/app/verbiage.service';

import {
  Document,
  DOCUMENTS_TABLE_COLUMNS as DOCUMENTS_TABLE_COLUMNS_DEF,
  DocumentsTableColumnDef
} from '../../store/models/claim-documents-table.models';

import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../store/selectors/router.selectors';
import { PageTitleService } from '@shared/service/page-title.service';
import { Router } from '@angular/router';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser/openCenteredNewWindow';
import {
  generate3_0ABMReferralActivityTabUrl,
  generateExternal3_0PBMAuthorizationTabUrl
} from '@shared/lib/links/linkGenerator30';
import { generateQueryParams, getApiUrl, hexDecode } from '@shared/lib';
import { ClaimDocumentTableComponentStoreService } from '@shared/components/claim-documents-table/claim-document-table-component-store.service';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { DocumentTableViewModel } from '@shared/components/claim-documents-table/claim-document-table.models';

@Component({
  selector: 'healthe-documents',
  templateUrl: './claim-documents-table.component.html',
  styleUrls: ['./claim-documents-table.component.scss']
})
export class ClaimDocumentsTableComponent
  extends DestroyableComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild('primaryPaginator')
  primaryPaginator: MatPaginator;
  @ViewChild('secondaryPaginator')
  secondaryPaginator: MatPaginator;

  @Input()
  primarySectionTitle: string;

  pagerSizeOptions: number[] = pageSizeOptions;

  claimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  customerId$ = this.store$.pipe(select(getEncodedCustomerId));

  documentsTableColumnsDef = DOCUMENTS_TABLE_COLUMNS_DEF;
  displayedDocumentColumnsNames: string[] = this.documentsTableColumnsDef.map(
    (column: Partial<DocumentsTableColumnDef>) => column.name
  );

  dataSource: HealtheDataSource<Document> = new HealtheDataSource(
    this.componentStore.documents$,
    this.componentStore.currentDocumentsFilters$,
    this.documentsTableColumnsDef as HealtheSortableColumn[]
  );

  readonly viewModel$: Observable<DocumentTableViewModel> =
    this.componentStore.select(
      ({ pageSize, numberOfDocuments, errors, isLoading }) => ({
        pageSize,
        numberOfDocuments,
        errors,
        isLoading
      })
    );

  constructor(
    public store$: Store<RootState>,
    public verbiageService: VerbiageService,
    private pageTitleService: PageTitleService,
    protected router: Router,
    public componentStore: ClaimDocumentTableComponentStoreService
  ) {
    super();
  }

  ngOnInit() {
    this.componentStore.init();

    if (this.primarySectionTitle) {
      this.pageTitleService.setTitleWithClaimNumber(
        this.primarySectionTitle,
        'Documents'
      );
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.matSort;
    this.dataSource.primaryPaginator = this.primaryPaginator;
    this.dataSource.secondaryPaginator = this.secondaryPaginator;

    this.componentStore.currentDocumentSort$
      .pipe(first())
      .subscribe((sortData) => this.matSort.sort(sortData));

    this.matSort.sortChange.subscribe((sortChange: Sort) => {
      this.componentStore.setCurrentDocumentSort({
        id: sortChange.active,
        start: sortChange.direction === '' ? null : sortChange.direction,
        disableClear: false
      });
    });

    this.primaryPaginator.page
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => this.componentStore.setPageSize(value.pageSize));
  }

  localizeURI(uri: string, customerId: string, claimId: string, documentDescription: string): string {
    return getApiUrl(
      'documentsDownload',
      generateQueryParams({uri, customerId, claimId, documentDescription})
    );
  }

  getNoDocumentsVerbiage() {
    return this.verbiageService.getTableVerbiage(TableCondition.NoDocuments);
  }

  public openDocumentRelatedTransURL(document: Document) {
    if (document.isVertice30RelatedTransURL) {
      if (document.sourceId) {
        if (document.productType === 'Ancillary') {
          zip(this.claimNumber$, this.customerId$)
            .pipe(first())
            .subscribe(([claimNumber, customerId]) => {
              let customer = hexDecode(customerId);
              let claim = hexDecode(claimNumber);
              this.router.navigate([
                generate3_0ABMReferralActivityTabUrl(
                  customer,
                  claim,
                  document.sourceId,
                  document.serviceCode,
                  document.legacySource
                )
              ]);
            });
        }
      } else {
        switch (document.serviceCode) {
          default:
            openCenteredNewWindowDefaultSize(document.relatedTransURL);
            break;
          case 'LOMN':
            if (document.documentType.indexOf('POS') >= 0) {
              const strArray = document.relatedTransURL.split('auth=');
              if (null == strArray || strArray.length < 2) {
                console.error('Unable to parse url=', document.relatedTransURL);
              } else {
                zip(this.claimNumber$, this.customerId$)
                  .pipe(first())
                  .subscribe(([claimNumber, customerId]) => {
                    let customer = hexDecode(customerId);
                    let claim = hexDecode(claimNumber);
                    this.router.navigate([
                      generateExternal3_0PBMAuthorizationTabUrl(
                        customer,
                        claim,
                        strArray[1],
                        'pos'
                      )
                    ]);
                  });
              }
            } else {
              openCenteredNewWindowDefaultSize(document.relatedTransURL);
            }
            break;
        }
      }
    } else {
      openCenteredNewWindowDefaultSize(document.relatedTransURL);
    }
  }
}
