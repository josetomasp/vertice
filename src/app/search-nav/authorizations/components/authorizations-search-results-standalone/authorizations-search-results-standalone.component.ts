import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { HealtheTableColumnDef, pageSizeOptions } from '@shared';
import { MatSort, MatSortable } from '@angular/material/sort';
import { HealtheComponentConfig } from '@modules/healthe-grid';
import { MatPaginator } from '@angular/material/paginator';
import {
  HealtheDataSource,
  HealtheSortableColumn
} from '@shared/models/healthe-data-source';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { TableCondition, VerbiageService } from '../../../../verbiage.service';
import { first } from 'rxjs/operators';
import { ComponentChanges } from '@shared/models/component-changes';
import { MatMenu } from '@angular/material/menu';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';
import {
  AuthorizationSearchFormField,
  AuthorizationSearchFormFieldType,
  ExportFormatOptions
} from '../../authorizations-models';
import {
  FeatureFlagService
} from '../../../../customer-configs/feature-flag.service';

@Component({
  selector: 'healthe-authorizations-search-results-standalone',
  templateUrl: './authorizations-search-results-standalone.component.html',
  styleUrls: ['./authorizations-search-results-standalone.component.scss']
})
export class AuthorizationsSearchResultsStandaloneComponent
  extends DestroyableComponent
  implements OnInit, OnChanges {
  @Input() // Used to build filter summary field labels since the controls use controlNames
  simpleSearchFormConfig: AuthorizationSearchFormField<any, any>[][];
  @Input() // Used to build filter summary field labels since the controls use controlNames. Initialized to empty as it is optional
  advancedSearchFormConfig: AuthorizationSearchFormField<any, any>[][] = [];
  @Input() // Use to tie show/hide configurations to this particular component group (screen)
  componentGroupName: string;
  @Input() // Configures columns
  resultsColumnsConfig: HealtheTableColumnDef[] = [];
  @Input() // Sets default sort column & direction
  resultsDefaultSort: MatSortable;
  @Input() // Holds page size preferences
  pageSizePreference: number;
  @Input() // Used to build filter summary values
  searchFormValues: { [field: string]: any };
  @Input()
  searchIsRecordCountLimited: boolean = false;
  @Input()
  searchResults: any[] = [];
  @Input()
  totalNumberOfResults: number = 0;
  @Input()
  isResultLoading: boolean = true;
  @Output()
  itemClicked: EventEmitter<any> = new EventEmitter();
  @Input()
  actionsConfig: HealtheComponentConfig;
  @Input()
  showExportButton = false;
  @Output()
  doExport: EventEmitter<ExportFormatOptions> = new EventEmitter();

  @ViewChild('matSort', { static: true })
  matSort: MatSort;
  @ViewChild('topPaginator', { static: true })
  topPaginator: MatPaginator;
  @ViewChild('bottomPaginator', { static: true })
  bottomPaginator: MatPaginator;

  filterSummaryText: string = '';
  tableDataSource: HealtheDataSource<any>;
  columnNames: string[];
  pageSizeOptions = pageSizeOptions;
  noDataForQueryVerbiage: string;
  exportMenuIcon = faChevronDown;
  exportMenuOptions = Object.keys(ExportFormatOptions).filter((option) => isNaN(Number(option)));

  constructor(private verbiageService: VerbiageService,
              private featureFlagService: FeatureFlagService) {
    super();
    this.noDataForQueryVerbiage = verbiageService.getTableVerbiage(
      TableCondition.NoDataForQuery
    );
  }

  ngOnInit() {
    this.tableDataSource = new HealtheDataSource(
      this.searchResults,
      null,
      this.resultsColumnsConfig as HealtheSortableColumn[]
    );
    this.tableDataSource.sort = this.matSort;
    if (this.resultsDefaultSort) {
      this.tableDataSource.sort.sort(this.resultsDefaultSort);
    }
    this.tableDataSource.primaryPaginator = this.topPaginator;
    this.tableDataSource.secondaryPaginator = this.bottomPaginator;
  }

  ngOnChanges(changes: ComponentChanges<AuthorizationsSearchResultsStandaloneComponent>) {
    if (changes.searchFormValues) {
      this.buildFilterSummary();
    }

    if (this.tableDataSource && changes.searchResults) {
      this.tableDataSource.data = changes.searchResults.currentValue;
      this.tableDataSource.primaryPaginator.firstPage();
    }

    if (changes.resultsColumnsConfig) {
      this.resultsColumnsConfig = changes.resultsColumnsConfig.currentValue.filter(
        (column) =>
          !this.featureFlagService.shouldElementBeRemoved(
            this.componentGroupName,
            column.name + 'Column'
          )
      );

      this.columnNames = this.resultsColumnsConfig.map((config) => {
        return config.name;
      });
    }
  }

  setOpenUntilClose(exportMenu: MatMenu) {
    this.exportMenuIcon = faChevronUp;
    exportMenu.closed.pipe(first()).subscribe(() => {
      this.exportMenuIcon = faChevronDown;
    });
  }

  buildFilterSummary() {
    this.filterSummaryText = '';
    let newFilterSummaryText = '';
    let allSearchFormConfigs = [].concat(
      ...this.simpleSearchFormConfig,
      ...this.advancedSearchFormConfig
    );

    Object.entries(this.searchFormValues)
      .filter(([, filterValue]) => filterValue && filterValue !== '')
      .forEach(([filterName, filterValue]) => {
        let filterValueText = filterValue;
        let currentFieldConfig: AuthorizationSearchFormField<any, any> = allSearchFormConfigs.find(
          (fieldConfig: AuthorizationSearchFormField<any, any>) =>
            fieldConfig.formControlName === filterName
        );

        if (currentFieldConfig.type === AuthorizationSearchFormFieldType.DateRange) {
          filterValueText =
            moment(filterValue.fromDate).format(environment.dateFormat) +
            ' - ' +
            moment(filterValue.toDate).format(environment.dateFormat);
        }

        // Translate the value into the label for switch statements.
        if (currentFieldConfig.type === AuthorizationSearchFormFieldType.Select) {
          currentFieldConfig.options.forEach((option) => {
            if (option.value === filterValue) {
              filterValueText = option.label;
            }
          });
        }

        newFilterSummaryText +=
          currentFieldConfig.label + ' (' + filterValueText + '), ';
      });

    if (newFilterSummaryText === '') {
      newFilterSummaryText = 'None';
    } else {
      newFilterSummaryText = newFilterSummaryText.substring(
        0,
        newFilterSummaryText.length - 2
      );
    }

    this.filterSummaryText = newFilterSummaryText;
  }

  trackByMethod(index: number, element: any): number {
    return element.id;
  }
}
