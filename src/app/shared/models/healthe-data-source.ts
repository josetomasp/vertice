import { _isNumberValue } from '@angular/cdk/coercion';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { find, has, includes, isArray, isEmpty, isObject } from 'lodash';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  of as observableOf,
  Subject,
  Subscription
} from 'rxjs';
import { map } from 'rxjs/operators';

function defaultSort<T>(
  data: T[],
  sort: MatSort,
  columns: HealtheSortableColumn[]
): T[] {
  const active = sort.active;
  const direction = sort.direction;
  if (!active || direction === '') {
    return data;
  }
  const sortedColumn = find(columns, { name: active });
  return data.sort((a, b) => {
    if (sortedColumn.sortByRow === true) {
      return sortedColumn.comparator(a, b, direction === 'asc');
    } else {
      return sortedColumn.comparator(a[active], b[active], direction === 'asc');
    }
  });
}

export interface HealtheSortableColumn {
  name: string;
  comparator: (alpha: any, beta: any, ascending: boolean) => number;
  sortByRow?: boolean;
}

const MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Sortable, Filterable and Paging Data Source
 */
export class HealtheDataSource<T> implements DataSource<T> {
  /**
   * Subscription to the changes that should trigger an update to the table's rendered rows, such
   * as filtering, sorting, pagination, or base data changes.
   */
  _renderChangesSubscription = Subscription.EMPTY;

  /**
   * Secondary pager events
   */
  _secondaryPagingSubscription = Subscription.EMPTY;

  /**
   * The filtered set of data that has been matched by the filter string, or all the data if there
   * is no filter. Useful for knowing the set of data the table represents.
   * For example, a 'selectAll()' function would likely want to select the set of filtered data
   * shown to the user rather than all the data.
   */
  filteredData: T[];
  sortData: ((
    data: T[],
    sort: MatSort,
    columns: HealtheSortableColumn[]
  ) => T[]) = defaultSort;
  private readonly _initialDataSubscription;
  private readonly _data: BehaviorSubject<T[]>;
  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly _renderData = new BehaviorSubject<T[]>([]);
  /** Stream that emits when a new filter string is set on the data source. */
  private readonly _filter = new BehaviorSubject<{ [key: string]: any }>({});
  /** Used to react to internal changes of the primaryPaginator that are made by the data source itself. */
  private readonly _internalPageChanges = new Subject<void>();
  private readonly _secondaryPageChanges = new Subject<PageEvent>();
  private customFilters = {};

  constructor(
    initialData: T[] | Observable<T[]> = [],
    filterFormValueChanges?: Observable<{ [key: string]: any }>,
    columns?: HealtheSortableColumn[] | Observable<HealtheSortableColumn[]>
  ) {
    if (initialData instanceof Observable) {
      this._data = new BehaviorSubject<T[]>([]);
      this._initialDataSubscription = initialData.subscribe((data) =>
        this._data.next(data)
      );
    } else {
      this._data = new BehaviorSubject<T[]>(initialData);
    }
    if (filterFormValueChanges) {
      filterFormValueChanges.subscribe((form) => this._filter.next(form));
    }
    if (columns instanceof Observable) {
      columns.subscribe((cols) => (this.columns = cols));
    } else if (columns) {
      this._columns = columns;
    }
    this._updateChangeSubscription();
  }

  private _columns: HealtheSortableColumn[];

  get columns(): HealtheSortableColumn[] {
    return this._columns;
  }

  set columns(value: HealtheSortableColumn[]) {
    this._columns = value;
    this._updateChangeSubscription();
  }

  /** Array of data that should be rendered by the table, where each object represents one row. */
  get data() {
    return this._data.value;
  }

  set data(data: T[]) {
    this._data.next(data);
  }

  /**
   * Filter term that should be used to filter out objects from the data array. To override how
   * data objects match to this filter string, provide a custom function for filterPredicate.
   */
  get filter(): { [key: string]: any } {
    return this._filter.value;
  }

  set filter(filter: { [key: string]: any }) {
    this._filter.next(filter);
  }

  private _sort: MatSort | null;

  /**
   * Instance of the MatSort directive used by the table to control its sorting. Sort changes
   * emitted by the MatSort will trigger an update to the table's rendered data.
   */
  get sort(): MatSort | null {
    return this._sort;
  }

  set sort(sort: MatSort | null) {
    this._sort = sort;
    this._updateChangeSubscription();
  }

  private _primaryPaginator: MatPaginator | null;

  /**
   * Instance of the MatPaginator component used by the table to control what page of the data is
   * displayed. Page changes emitted by the MatPaginator will trigger an update to the
   * table's rendered data.
   *
   * Note that the data source uses the primaryPaginator's properties to calculate which page of data
   * should be displayed. If the primaryPaginator receives its properties as template inputs,
   * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the primaryPaginator's view has been
   * initialized before assigning it to this data source.
   */
  get primaryPaginator(): MatPaginator | null {
    return this._primaryPaginator;
  }

  set primaryPaginator(paginator: MatPaginator | null) {
    this._primaryPaginator = paginator;
    this._updateChangeSubscription();
  }

  private _secondaryPaginator: MatPaginator | null;

  get secondaryPaginator(): MatPaginator | null {
    return this._secondaryPaginator;
  }

  set secondaryPaginator(paginator: MatPaginator | null) {
    if (this.primaryPaginator) {
      this._secondaryPaginator = paginator;
      if (paginator.page) {
        paginator.page.subscribe((event) =>
          this._secondaryPageChanges.next(event)
        );
      } else {
        //console.warn('No event emitter on paginator!!', paginator);
      }
      this._updateChangeSubscription();
    } else {
      console.warn('Secondary pager added before primary!');
    }
  }

  /**
   * Checks if a data object matches the data source's filter string. By default, each data object
   * is converted to a string of its properties and returns true if the filter has
   * at least one occurrence in that string. By default, the filter string has its whitespace
   * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
   * filter matching.
   * @param data Data object used to check against the filter.
   * @param filter Filter string that has been set on the data source.
   * @returns Whether the filter matches against the data
   */

  filterPredicate(data: T, filter: { [key: string]: any }) {
    const filterKeys = Object.keys(filter);
    if (filterKeys.length === 0 || !filter) {
      return true;
    }
    for (let key of filterKeys) {
      if (
        this.customFilters[key] &&
        this.customFilters[key](data[key], filter[key]) === false
      ) {
        return false;
      }
      if (isObject(data) && !has(data as any, key)) {
        console.warn(`The key '${key}' doesn't show up in this obj!`, data);
        continue;
      }
      if (isArray(filter[key])) {
        if (isEmpty(filter[key]) || !includes(filter[key], data[key])) {
          return false;
        }
        continue;
      }
      if (typeof filter[key] === 'string' && filter[key] !== data[key]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Data accessor function that is used for accessing data properties for sorting through
   * the default sortData function.
   * This default function assumes that the sort header IDs (which defaults to the column name)
   * matches the data's properties (e.g. column Xyz represents data['Xyz']).
   * May be set to a custom function for different behavior.
   * @param data Data object that is being accessed.
   * @param sortHeaderId The name of the column that represents the data.
   */
  sortingDataAccessor: ((data: T, sortHeaderId: string) => string | number) = (
    data: T,
    sortHeaderId: string
  ): string | number => {
    const value = (data as { [key: string]: any })[sortHeaderId];

    if (_isNumberValue(value)) {
      const numberValue = Number(value);

      // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
      // leave them as strings. For more info: https://goo.gl/y5vbSg
      return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
    }

    return value;
  };

  /**
   * Subscribe to changes that should trigger an update to the table's rendered rows. When the
   * changes occur, process the current state of the filter, sort, and pagination along with
   * the provided base data and send it to the table for rendering.
   */
  _updateChangeSubscription() {
    // Sorting and/or pagination should be watched if MatSort and/or MatPaginator are provided.
    // The events should emit whenever the component emits a change or initializes, or if no
    // component is provided, a stream with just a null event should be provided.
    // The `sortChange` and `pageChange` acts as a signal to the combineLatests below so that the
    // pipeline can progress to the next step. Note that the value from these streams are not used,
    // they purely act as a signal to progress in the pipeline.
    const sortChange: Observable<Sort | null | void> = this._sort
      ? (merge(
          this._sort.sortChange,
          this._sort.initialized
        ) as Observable<Sort | void>)
      : observableOf(null);
    const pageChange: Observable<PageEvent | null | void> = this
      ._primaryPaginator
      ? (merge(
          this._primaryPaginator.page,
          this._internalPageChanges,
          this._primaryPaginator.initialized
        ) as Observable<PageEvent | void>)
      : observableOf(null);
    const dataStream = this._data;
    // Watch for base data or filter changes to provide a filtered set of data.
    const filteredData = combineLatest([dataStream, this._filter]).pipe(
      map(([data]) => this._filterData(data as T[]))
    );
    // Watch for filtered data or sort changes to provide an ordered set of data.
    const orderedData = combineLatest([filteredData, sortChange]).pipe(
      map(([data]) => this._orderData(data))
    );
    // Watch for ordered data or page changes to provide a paged set of data.
    const paginatedData = combineLatest([orderedData, pageChange]).pipe(
      map(([data]) => this._pageData(data))
    );
    // Watch for secondary paging events to sync the primary paginator
    const secondaryPageChange: Observable<PageEvent | null | void> = this
      ._secondaryPaginator
      ? merge(
          this._secondaryPaginator.page,
          this._secondaryPageChanges,
          this._secondaryPaginator.initialized
        )
      : observableOf(null);

    this._secondaryPagingSubscription.unsubscribe();
    this._secondaryPagingSubscription = secondaryPageChange.subscribe((page) =>
      this.syncPrimaryPaginator(page)
    );

    // Watched for paged data changes and send the result to the table to render.
    this._renderChangesSubscription.unsubscribe();
    this._renderChangesSubscription = paginatedData.subscribe((data) =>
      this._renderData.next(data)
    );
  }

  /**
   * Returns a filtered data array where each filter object contains the filter string within
   * the result of the filterTermAccessor function. If no filter is set, returns the data array
   * as provided.
   */
  _filterData(data: T[]) {
    // If there is a filter string, filter out data that does not contain it.
    // Each data object is converted to a string using the function defined by filterTermAccessor.
    // May be overridden for customization.
    this.filteredData = !this.filter
      ? data
      : data.filter((obj) => this.filterPredicate(obj, this.filter));

    if (this.primaryPaginator) {
      this._updatePaginator(this.filteredData.length);
    }

    return this.filteredData;
  }

  /**
   * Returns a sorted copy of the data if MatSort has a sort applied, otherwise just returns the
   * data array as provided. Uses the default data accessor for data lookup, unless a
   * sortDataAccessor function is defined.
   */
  _orderData(data: T[]): T[] {
    // If there is no active sort or direction, return the data without trying to sort.
    if (!this.sort || !this._columns) {
      return data;
    }

    return this.sortData(data.slice(), this.sort, this._columns);
  }

  /**
   * Returns a paged slice of the provided data array according to the provided MatPaginator's page
   * index and length. If there is no primaryPaginator provided, returns the data array as provided.
   */
  _pageData(data: T[]): T[] {
    if (!this.primaryPaginator) {
      return data;
    }

    const startIndex =
      this.primaryPaginator.pageIndex * this.primaryPaginator.pageSize;

    if (this.secondaryPaginator) {
      this._updateSecondaryPager();
    }

    return data.slice(startIndex, startIndex + this.primaryPaginator.pageSize);
  }

  /**
   * Updates the primaryPaginator to reflect the length of the filtered data, and makes sure that the page
   * index does not exceed the primaryPaginator's last page. Values are changed in a resolved promise to
   * guard against making property changes within a round of change detection.
   */
  _updatePaginator(filteredDataLength: number) {
    Promise.resolve().then(() => {
      const paginator = this.primaryPaginator;

      if (!paginator) {
        return;
      }

      paginator.length = filteredDataLength;

      // If the page index is set beyond the page, reduce it to the last page.
      if (paginator.pageIndex > 0) {
        const lastPageIndex =
          Math.ceil(paginator.length / paginator.pageSize) - 1 || 0;
        const newPageIndex = Math.min(paginator.pageIndex, lastPageIndex);

        if (newPageIndex !== paginator.pageIndex) {
          paginator.pageIndex = newPageIndex;

          // Since the primaryPaginator only emits after user-generated changes,
          // we need our own stream so we know to should re-render the data.
          this._internalPageChanges.next();
        }
      }
      if (this.secondaryPaginator) {
        this._updateSecondaryPager();
      }
    });
  }

  /**
   * Used by the MatTable. Called when it connects to the data source.
   * @docs-private
   */
  connect() {
    return this._renderData;
  }

  /**
   * Used by the MatTable. Called when it is destroyed. No-op.
   * @docs-private
   */
  disconnect() {
    if (this._initialDataSubscription) {
      this._initialDataSubscription.unsubscribe();
    }
  }

  public setCustomFilter(
    columnName: string,
    filterFunction: (data: any, filterPredicate: any) => boolean
  ) {
    this.customFilters[columnName] = filterFunction;
  }

  private _updateSecondaryPager() {
    this.secondaryPaginator.pageIndex = this.primaryPaginator.pageIndex;
    this.secondaryPaginator.pageSize = this.primaryPaginator.pageSize;
    this.secondaryPaginator.pageSizeOptions = this.primaryPaginator.pageSizeOptions;
    this.secondaryPaginator.length = this.primaryPaginator.length;
  }

  private syncPrimaryPaginator(page: PageEvent | void) {
    if (page) {
      if (this.primaryPaginator) {
        this.primaryPaginator.pageIndex = page.pageIndex;
        this.primaryPaginator.pageSize = page.pageSize;
        this.primaryPaginator.page.emit(page);
      } else {
        console.warn('Sync cannot work without a primary paginator!');
      }
    }
  }
}
