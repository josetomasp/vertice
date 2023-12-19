import { Injectable } from '@angular/core';
import { HealtheTableColumnDef } from '@shared/models';

import { BILLING_TAB_COLUMNS } from '../../claim-view/billing/columns';
import { TableTabType } from '../../claim-view/store/models/activity-tab.models';
import {
  ALL_TAB_COLUMNS,
  ANCILLARY_TAB_COLUMNS, CLINICAL_TAB_COLUMNS, PHARMACY_TAB_COLUMNS
} from '../../claim-view/activity/activity-table/columns';

@Injectable({
  providedIn: 'root'
})
export class ClaimActivityTableColumnSettingsService {
  private tabToComponentName = {
    all: 'globalAllActivityTable',
    pharmacy: 'globalPharmacyActivityTable',
    ancillary: 'globalAncillaryActivityTable',
    clinical: 'globalClinicalActivityTable',
    billing: 'globalBillingActivityTable'
  };

  private columnDefinitions: {
    [key: string]: Partial<HealtheTableColumnDef>[];
  } = {
    all: ALL_TAB_COLUMNS,
    pharmacy: PHARMACY_TAB_COLUMNS,
    ancillary: ANCILLARY_TAB_COLUMNS,
    clinical: CLINICAL_TAB_COLUMNS,
    billing: BILLING_TAB_COLUMNS
  };

  getComponentNameFromTab(tab: TableTabType) {
    return this.tabToComponentName[tab];
  }

  constructor() {}

  public getDefaultTabColumns(tab: TableTabType): string[] {
    return this.columnDefinitions[tab]
      .filter((col) => col.defaultColumn)
      .map((col) => col.name);
  }
}
