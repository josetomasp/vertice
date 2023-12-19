import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxClickAction } from '@angular/material/checkbox';
import { MatTabNav } from '@angular/material/tabs';
import { HealtheTableColumnDef } from '@healthe/vertice-library';
import { select, Store } from '@ngrx/store';
import { pluckPrefValue } from '@shared/lib/store/pluckPrefValue';
import { iif, Observable, of } from 'rxjs';
import {
  concatAll,
  filter,
  first,
  mergeMap,
  takeWhile,
  tap
} from 'rxjs/operators';
import {
  ALL_TAB_COLUMNS,
  ANCILLARY_TAB_COLUMNS,
  CLINICAL_TAB_COLUMNS,
  PHARMACY_TAB_COLUMNS
} from 'src/app/claim-view/activity/activity-table/columns';
import { BILLING_TAB_COLUMNS } from 'src/app/claim-view/billing/columns';
import { TableTabType } from '../../claim-view/store/models/activity-tab.models';
import {
  SetClaimTableListPreferencesTab,
  UpdateClaimViewListsCardDirty
} from '../store/actions/preferences-screen.actions';
import {
  DeletePreferences,
  SavePreferences
} from '../store/actions/preferences.actions';
import {
  Preference,
  PreferenceType,
  RootPreferencesState
} from '../store/models/preferences.models';
import {
  getClaimTableListSettingsSelectedTab,
  getClaimViewListsDirt
} from '../store/selectors/preferences-screen.selectors';
import { getPreferenceByQuery } from '../store/selectors/user-preferences.selectors';
import { ClaimActivityTableColumnSettingsService } from './claim-activity-table-column-settings.service';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';

@Component({
  selector: 'healthe-claim-activity-table-lists',
  templateUrl: './claim-table-list-settings.component.html',
  styleUrls: ['./claim-table-list-settings.component.scss']
})
export class ClaimTableListSettingsComponent implements OnInit, OnDestroy {
  @ViewChild(MatTabNav, { static: true }) tab: MatTabNav;
  componentGroupName = 'claim-table-list-settings';
  isInternetExplorer: boolean;
  isAlive = false;
  navigationTabs: Array<{
    name: TableTabType;
    label: string;
    elementName: string;
  }> = [
    { name: 'all', label: 'All Activity', elementName: 'allActivityTab' },
    { name: 'pharmacy', label: 'Pharmacy', elementName: 'pharmacyActivityTab' },
    {
      name: 'ancillary',
      label: 'Ancillary',
      elementName: 'ancillaryActivityTab'
    },
    { name: 'clinical', label: 'Clinical', elementName: 'clinicalActivityTab' },
    { name: 'billing', label: 'Billing', elementName: 'billingTab' }
  ];
  dirty: boolean = false;
  activeTab: TableTabType = 'all';
  columnDefinitions: { [key: string]: Partial<HealtheTableColumnDef>[] } = {
    all: ALL_TAB_COLUMNS,
    pharmacy: PHARMACY_TAB_COLUMNS,
    ancillary: ANCILLARY_TAB_COLUMNS,
    clinical: CLINICAL_TAB_COLUMNS,
    billing: BILLING_TAB_COLUMNS
  };
  columnListPreference$ = this.store$.pipe(
    select(getPreferenceByQuery, {
      screenName: 'global',
      componentGroupName: 'global',
      componentName: this.columnSettingsService.getComponentNameFromTab(
        this.activeTab
      ),
      preferenceTypeName: PreferenceType.ColumnList
    })
  );
  columnLists = {
    all: [],
    pharmacy: [],
    ancillary: [],
    clinical: [],
    billing: []
  };
  tabDirt = {
    all: false,
    pharmacy: false,
    ancillary: false,
    clinical: false,
    billing: false
  };
  draggedColumnName = null;
  activityTab$: Observable<TableTabType> = this.store$.pipe(
    select(getClaimTableListSettingsSelectedTab)
  );
  columnViewFormGroup = new FormGroup({
    all: new FormControl(),
    pharmacy: new FormControl(),
    ancillary: new FormControl(),
    clinical: new FormControl(),
    billing: new FormControl()
  });
  columnUpdates$: Observable<Preference<any>> = of(this.navigationTabs).pipe(
    concatAll(),
    filter((tab) => this.tabDirt[tab.name]),
    tap((tab) => {
      if (this.columnLists[tab.name].length <= 0) {
        this.columnLists[
          tab.name
        ] = this.columnSettingsService.getDefaultTabColumns(tab.name);
      }
    }),
    mergeMap((tab) =>
      this.store$.pipe(
        select(getPreferenceByQuery, {
          screenName: 'global',
          componentGroupName: 'global',
          componentName: this.columnSettingsService.getComponentNameFromTab(
            tab.name
          )
        }),
        tap((pref) => (pref.value = this.columnLists[tab.name])),
        first()
      )
    )
  );

  constructor(
    public store$: Store<RootPreferencesState>,
    public breakpointObserver: BreakpointObserver,
    public columnSettingsService: ClaimActivityTableColumnSettingsService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  getColumns() {
    return this.columnDefinitions[this.activeTab];
  }

  ngOnInit() {
    this.isInternetExplorer = this.breakpointObserver.isMatched([
      '(-ms-high-contrast: none) ',
      '(-ms-high-contrast: active) '
    ]);
    this.isAlive = true;
    this.navigationTabs.forEach((tab) => this.setColumnList(tab.name));
    this.store$
      .pipe(
        select(getClaimViewListsDirt),
        takeWhile(() => this.isAlive)
      )
      .subscribe((dirt) => {
        return (this.tabDirt = dirt);
      });

    this.activityTab$.pipe(takeWhile(() => this.isAlive)).subscribe((tab) => {
      this.activeTab = tab;
      if (tab === 'all') {
        this.clickFirstTab();
      }
    });
    this.columnViewFormGroup.valueChanges.subscribe((columnView) =>
      this.store$.dispatch(
        new UpdateClaimViewListsCardDirty({
          [this.activeTab]: this.columnViewFormGroup.dirty
        })
      )
    );
    this.columnListPreference$.subscribe(() => {
      this.store$.dispatch(
        new UpdateClaimViewListsCardDirty({
          all: false,
          pharmacy: false,
          ancillary: false,
          clinical: false,
          billing: false
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  selectTab(tab: TableTabType) {
    this.store$.dispatch(new SetClaimTableListPreferencesTab(tab));
  }

  setColumnList(tab: string) {
    let componentName;
    if (tab !== 'billing') {
      componentName =
        'global' +
        tab.substring(0, 1).toUpperCase() +
        tab.substring(1, tab.length) +
        'ActivityTable';
      // componentName = 'globalAllActivityTable';
    } else {
      componentName = 'globalBillingActivityTable';
    }
    this.store$
      .pipe(
        select(getPreferenceByQuery, {
          screenName: 'global',
          componentGroupName: 'global',
          componentName,
          preferenceTypeName: PreferenceType.ColumnList
        }),
        pluckPrefValue
      )
      .subscribe((columnList: Array<string>) => {
        this.columnLists[tab] = [...columnList];
      });
  }

  isSelected(column: Partial<HealtheTableColumnDef>) {
    return this.columnLists[this.activeTab].indexOf(column.name) > -1;
  }

  updateColumnList(name: string, checked: MatCheckboxClickAction) {
    if (checked) {
      this.columnLists[this.activeTab].push(name);
    } else {
      const itemIndex = this.columnLists[this.activeTab].indexOf(name);
      this.columnLists[this.activeTab].splice(itemIndex, 1);
    }
    this.tabDirt[this.activeTab] = true;
    this.store$.dispatch(
      new UpdateClaimViewListsCardDirty({
        [this.activeTab]: this.tabDirt[this.activeTab]
      })
    );
  }

  getDisplayedColumns() {
    return this.columnLists[this.activeTab].map((col) => {
      return this.columnDefinitions[this.activeTab].find(
        (def) => def.name === col
      );
    });
  }

  clearColumns() {
    this.columnLists[this.activeTab] = [];
    this.tabDirt[this.activeTab] = true;
    this.store$.dispatch(
      new UpdateClaimViewListsCardDirty({
        [this.activeTab]: this.tabDirt[this.activeTab]
      })
    );
  }

  resetActiveTabColumns() {
    this.confirmationModalService
      .displayModal({
        titleString: 'Reset to Default?',
        bodyHtml:
          "Choosing 'yes' will reset and save all your " +
          this.activeTab +
          ' tab preferences to the default settings.',
        affirmString: 'Yes',
        denyString: 'No'
      })
      .afterClosed()
      .pipe(
        mergeMap((confirmed) =>
          iif(
            () => confirmed,
            this.store$.pipe(
              select(getPreferenceByQuery, {
                screenName: 'global',
                componentGroupName: 'global',
                componentName: this.columnSettingsService.getComponentNameFromTab(
                  this.activeTab
                ),
                preferenceTypeName: PreferenceType.ColumnList
              }),
              first()
            )
          )
        )
      )
      .subscribe((pref: Preference<any>) =>
        this.store$.dispatch(new DeletePreferences([pref]))
      );
  }

  resetTabColumns(tab: TableTabType) {
    this.store$
      .pipe(
        select(getPreferenceByQuery, {
          screenName: 'global',
          componentGroupName: 'global',
          componentName: this.columnSettingsService.getComponentNameFromTab(
            tab
          ),
          preferenceTypeName: PreferenceType.ColumnList
        }),
        first()
      )
      .subscribe((columnListPref) => {
        const patch = { ...columnListPref, value: this.columnLists[tab] };
        this.store$.dispatch(new SavePreferences([patch]));
      });
  }

  getUpdatedPreferences(): Preference<any>[] {
    let patches = [];
    this.columnUpdates$.subscribe((preference) => {
      patches.push(preference);
    });
    return patches;
  }

  dragStart($event: DragEvent, column: Partial<HealtheTableColumnDef>) {
    this.draggedColumnName = column.name;
    $event.dataTransfer.setData('columnName', column.name);
  }

  drop($event: DragEvent, column: Partial<HealtheTableColumnDef>) {
    const fromColumnName = column.name;
    const toColumnName = $event.dataTransfer.getData('columnName');

    const fromColumnIndex = this.columnLists[this.activeTab].indexOf(
      fromColumnName
    );
    const toColumnIndex = this.columnLists[this.activeTab].indexOf(
      toColumnName
    );

    this.columnLists[this.activeTab][fromColumnIndex] = toColumnName;
    this.columnLists[this.activeTab][toColumnIndex] = fromColumnName;
    this.store$.dispatch(
      new UpdateClaimViewListsCardDirty({ [this.activeTab]: true })
    );
  }

  allowDrop($event: DragEvent) {
    $event.preventDefault();
  }

  isDarkened(column: Partial<HealtheTableColumnDef>) {
    return this.draggedColumnName && this.draggedColumnName === column.name;
  }

  dragEnd() {
    this.draggedColumnName = null;
  }

  // This is used to make whichever the first tab displayed on the screen active on screen load.
  // This is used when healtheRemoveElementIfTrue directive is applied and removes some of the existing tabs
  clickFirstTab() {
    setTimeout(() => {
      (this.tab._tabList.nativeElement as any).click();
    }, 0);
  }
}
