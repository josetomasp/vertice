import { ClaimSearchForm } from '@shared/store/models/claim-search-models';

export interface SnoozeClaimActionsQuery {
  claimNumber: string;
}

export interface SnoozeClaimActionsResponse {
  ok?: boolean;
}

export interface ClaimSearchExport extends ClaimSearchForm {
  columns: string[];
  exportType: string;
}
