import { createFeatureSelector } from '@ngrx/store';

import { ClaimViewState } from '../models/claim-view.models';

/**
 * This 'createFeatureSelector' functions breaks the RootState into ClaimViewState
 * the key name 'claimview' is set up in the claim-view.module.ts
 */
export const getClaimViewState = createFeatureSelector<ClaimViewState>(
  'claimview'
);
