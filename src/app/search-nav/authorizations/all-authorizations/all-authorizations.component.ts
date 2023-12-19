import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AllAuthorizationSearchFormValues,
  AllAuthorizationsStore,
  AllAuthorizationsViewModel,
  AllAuthorizationTableRow
} from './all-authorizations.store';
import {
  alphaNumericComparator,
  dateComparator,
  HealtheTableColumnDef
} from '@shared';
import { Observable, Subject } from 'rxjs';
import { MatSortable } from '@angular/material/sort';
import {
  filter,
  first,
  map,
  pairwise,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { Router } from '@angular/router';
import { openCenteredNewWindowDefaultSize } from '@shared/lib/browser';
import {
  ServerErrorOverlayAnchorDirective
} from '@modules/server-error-overlay/server-error-overlay-anchor.directive';
import { ExportFormatOptions } from '../authorizations-models';

@Component({
  selector: 'healthe-all-authorizations',
  templateUrl: './all-authorizations.component.html',
  styleUrls: ['./all-authorizations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllAuthorizationsComponent extends DestroyableComponent implements OnInit, AfterViewInit {
  @ViewChild(ServerErrorOverlayAnchorDirective)
  serverErrorOverlay: ServerErrorOverlayAnchorDirective;
  searchName: string = 'Authorization Search';
  authorizationLinkClicked: Subject<any> = new Subject();
  resultsColumnsConfig: HealtheTableColumnDef[] = [
    {
      label: 'TYPE',
      name: 'authorizationType',
      comparator: alphaNumericComparator,
      clickEvent: this.authorizationLinkClicked
    },
    {
      label: 'RUSH?',
      name: 'rush',
      cellStyles: { marginLeft: '15px' },
      comparator: alphaNumericComparator
    },
    {
      label: 'SLR',
      name: 'isSLR',
      comparator: alphaNumericComparator,
      headerStyles: { width: '60px' },
      headerToolTip: 'Second Level Review',
      informationIcon: (row) => ({
        tooltipMessage: row.secondaryPaperNotificationRule || row.workflowGpi,
        position: 'label'
      })
    },
    {
      label: 'CLAIM #',
      name: 'claimNumber',
      comparator: alphaNumericComparator,
      linkProp: 'claimIdUrl'
    },
    {
      label: 'CLAIMANT NAME',
      name: 'claimantName',
      comparator: alphaNumericComparator
    },
    {
      label: 'STATE OF VENUE',
      name: 'stateOfVenue',
      comparator: alphaNumericComparator
    },
    {
      label: 'DATE OF INJURY',
      name: 'dateOfInjury',
      comparator: dateComparator
    },
    {
      label: 'ASSIGNED ADJUSTER',
      name: 'assignedAdjuster',
      comparator: alphaNumericComparator
    },
    {
      label: 'OFFICE CODE',
      name: 'afo',
      headerStyles: { width: '60px' },
      cellStyles: { marginLeft: '10px' },
      comparator: alphaNumericComparator
    },
    {
      label: 'DATE RECEIVED',
      name: 'dateReceived',
      comparator: dateComparator
    },
    {
      label: 'STATUS',
      name: 'status',
      comparator: alphaNumericComparator
    },
    {
      label: 'VENDOR',
      name: 'vendor',
      comparator: alphaNumericComparator
    }
  ] as HealtheTableColumnDef[];
  resultsDefaultSort = {
    id: 'dateReceived',
    start: 'asc'
  } as MatSortable;
  formGroupValidationErrorMessages: { [key: string]: string };

  viewModel$: Observable<Partial<AllAuthorizationsViewModel>> = this.store.select(
    ({
       isAuthorizationTypeOptionsLoading,
       authorizationTypeOptionsErrors,
       isAssignedAdjusterOptionsLoading,
       assignedAdjusterOptionsErrors,
       searchFormValues,
       simpleSearchFormConfig,
       searchResultRows,
       totalNumberOfResults,
       searchIsRecordCountLimited,
       isSearchLoading,
       pageSizePreference
     }) =>
      ({
        isAuthorizationTypeOptionsLoading,
        authorizationTypeOptionsErrors,
        isAssignedAdjusterOptionsLoading,
        assignedAdjusterOptionsErrors,
        searchFormValues,
        simpleSearchFormConfig,
        searchResultRows,
        totalNumberOfResults,
        searchIsRecordCountLimited,
        isSearchLoading,
        pageSizePreference
      })
  );

  constructor(private router: Router,
              public store: AllAuthorizationsStore) {
    super();
    this.store.init();

    // This subscription displays the server error overlay if errors happen while loading search options
    this.store.isAnyOptionLoading$.pipe(
      takeUntil(this.onDestroy$),
      pairwise(),
      filter(([wasAnyOptionLoading, isAnyOptionLoading]: [boolean, boolean]) => wasAnyOptionLoading && !isAnyOptionLoading),
      withLatestFrom(this.store.searchOptionsErrors$),
      map(([, searchOptionsErrors]: [[boolean, boolean], string[]]): string[] => searchOptionsErrors),
      filter((searchOptionsErrors: string[]) => searchOptionsErrors.length > 0))
      .subscribe((searchOptionsErrors: string[]) =>
        this.doServerErrorOverlay(searchOptionsErrors));

    // This subscription navigates the user to the page for the authorization link they clicked and has
    // different behavior depending on if the link is within Vertice 3.0 or not
    this.authorizationLinkClicked
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((row: AllAuthorizationTableRow) => {
        if (row.authorizationUrl.includes('PbmPaper')
          || row.authorizationUrl.includes('pbmmailorder')
          || row.authorizationUrl.includes('PbmClinical')) {
          openCenteredNewWindowDefaultSize(row.authorizationUrl);
          this.store.displayRefreshModal();
        } else {
          this.router.navigateByUrl(row.authorizationUrl);
        }
      });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // This subscription displays the server error overlay if search option errors already exist within the component store
    this.store.searchOptionsErrors$.pipe(first(),
      filter((errors: string[]) => errors.length > 0))
      .subscribe((errors: string[]) =>
        this.doServerErrorOverlay(errors));
  }

  executeSearch(searchParameters: AllAuthorizationSearchFormValues): void {
    this.store.setSearchFormValues(searchParameters);
    this.store.loadSearchResults();
  }

  doExport($event: ExportFormatOptions): void {
    this.store.downloadExportResults({
      filename: this.searchName,
      exportFormatOption: $event,
      columns: this.resultsColumnsConfig
    });
  }

  doServerErrorOverlay(errors: string[]): void {
    this.serverErrorOverlay.open(() => {
      this.serverErrorOverlay.detach();
      this.store.loadAllOptions();
    }, errors);
  }
}
