import { MatSortable } from '@angular/material/sort';
import { Range } from '@healthe/vertice-library';
import { TableColumnState } from '@shared/models/table-column-state';

export interface AllActivityData {
  creationDate: string;
  activityType: string;
  activityId?: string;
  productType: string;
  daysSupply: string;
  itemName: string;
  quantity: string;
  pharmacy: string;
  descriptionReason: string;
  outcome: string;
  paidAmount: string;
  dateModified: string;
  modifiedByUser: string;
  priorAuthDateRange: string;
  prescriberName: string;
  prescriberId: string;
  dateFilled: string;
  rush: boolean;
  serviceType: string;
  serviceCode?: string;
  requestorRole: string;
  requestorName: string;
  vendor: string;
  vertice25Link: string;
  isLegacy?: boolean;
  isVertice30Link?: boolean;
  ndc: string;
  nabp: string;
  isCompound: boolean;
}

export interface PendingActivityDTO {
  activities: PendingActivityData[];
  serverErrors: string[];
  requestErrors: string[];
}

export interface PendingActivityData {
  activityId?: string;
  serviceCode?: string;
  type: string;
  productType: ActivityProductType;
  dateModified: string;
  creationDate: string;
  descriptionOrReason: string;
  prescriber: string[];
  prescriberId: number;
  pharmacyOrVendor: string[];
  action: string;
  itemName: string[];
  isVertice30Link?: boolean;
  isLegacy?: boolean;
  rush: boolean;
  requestorRole: string;
  nabp: string;
}

export enum ActivityProductType {
  PHARMACY = 'Pharmacy',
  CLINICAL = 'Clinical',
  ANCILLARY = 'Ancillary'
}

export interface PendingActivityTotals {
  all: number;
  pharmacy: number;
  ancillary: number;
  clinical: number;
}

export interface ClaimActivityDTO {
  activities: Array<AllActivityData>;
  serverErrors: Array<string>;
}

export interface ActivityResponse {
  activities: AllActivityData[];
  serverErrors: string[];
}

export interface ActivityRequestQuery {
  dateRange: Range;
  claimNumber: string;
  customerId: string;
}

export interface FilterPredicates {
  prescriberName: Array<string>;
  outcome: Array<string>;
  activityType: Array<string>;
  itemName: Array<string>;
}

export type TableTabType =
  | 'all'
  | 'pharmacy'
  | 'ancillary'
  | 'clinical'
  | 'billing';

export interface ActivityTabPager {
  currentPage: number;
  pageSize: number;
}

export type PagerPatch = { [key: string]: ActivityTabPager };

export interface ActivityPagerState {
  all: ActivityTabPager;
  pharmacy: ActivityTabPager;
  ancillary: ActivityTabPager;
  clinical: ActivityTabPager;
}

export interface ActivityTabState {
  initialized: boolean;
  isAllActivityLoading: boolean;
  isPendingActivityLoading: boolean;
  dateRange: Range;
  activityTab: TableTabType;
  filterPredicates: FilterPredicates;
  allActivityData: Array<AllActivityData>;
  pendingActivityData: Array<PendingActivityData>;
  columnView: TableColumnState;
  columnSort: MatSortable;
  serverErrors: Array<string>;
  pendingActivityTotals: PendingActivityTotals;
  pagers: ActivityPagerState;
}
