import { createAction, props } from '@ngrx/store';
import {
  FirstFillClaimSearchFormValues,
  FirstFillClaimSearchResult,
  FirstFillLineItemsToAssignResponseBody
} from './assign-first-fill-to-claim.reducer';

export const loadFirstFillsToAssign = createAction(
  '[AssignFirstFillToClaim] Load First Fills To Assign',
  props<{ temporaryMemberId: string }>()
);

export const loadFirstFillsToAssignSuccess = createAction(
  '[AssignFirstFillToClaim] Load First Fills To Assign Success',
  props<{
    firstFillLineItemsToAssign: FirstFillLineItemsToAssignResponseBody;
  }>()
);

export const loadFirstFillsToAssignFailure = createAction(
  '[AssignFirstFillToClaim] Load First Fills To Assign Failure',
  props<{ errors: string[] }>()
);

// saveWebUserNotes
export const saveWebUserNotes = createAction(
  '[AssignFirstFillToClaim] Save Web User Notes',
  props<{ temporaryMemberId: string; customerId: string; notes: string }>()
);

export const saveWebUserNotesSuccess = createAction(
  '[AssignFirstFillToClaim] Save Web User Notes Success',
  props<{ notes: string }>()
);

export const saveWebUserNotesFailure = createAction(
  '[AssignFirstFillToClaim] Save Web User Notes Failure',
  props<{ errors: string[] }>()
);

// moveToNextQueue
export const moveToNextQueue = createAction(
  '[AssignFirstFillToClaim] Move To Next Queue',
  props<{ temporaryMemberId: string; customerId: string }>()
);

export const moveToNextQueueSuccess = createAction(
  '[AssignFirstFillToClaim] Move To Next Queue Success'
);

export const moveToNextQueueFailure = createAction(
  '[AssignFirstFillToClaim] Move To Next Queue Failure',
  props<{ errors: string[] }>()
);

// saveWebUserNotesAndMoveToNextQueue
export const saveWebUserNotesAndMoveToNextQueue = createAction(
  '[AssignFirstFillToClaim] Save Web User Notes And Move To Next Queue',
  props<{ temporaryMemberId: string; customerId: string; notes: string }>()
);

export const saveWebUserNotesAndMoveToNextQueueSuccess = createAction(
  '[AssignFirstFillToClaim] Save Web User Notes And Move To Next Queue Success',
  props<{ notes: string }>()
);

export const saveWebUserNotesAndMoveToNextQueueFailure = createAction(
  '[AssignFirstFillToClaim] Save Web User Notes And Move To Next Queue Failure',
  props<{ errors: string[] }>()
);

export const loadClaimSearchResults = createAction(
  '[AssignFirstFillToClaim] Load Claim Search Results',
  props<{ claimSearchFormValues: FirstFillClaimSearchFormValues }>()
);

export const loadClaimSearchResultsSuccess = createAction(
  '[AssignFirstFillToClaim] Load Claim Search Results Success',
  props<{ firstFillClaimSearchResults: FirstFillClaimSearchResult[] }>()
);

export const loadClaimSearchResultsFailure = createAction(
  '[AssignFirstFillToClaim] Load Claim Search Results Failure',
  props<{ errors: string[] }>()
);

export const saveSelectedClaim = createAction(
  '[AssignFirstFillToClaim] Saving Selected Claim',
  props<{ selectedClaimNumber: string; selectedCustomerId: string }>()
);

// Assign to selected claim
export const assignFirstFillToNewClaim = createAction(
  '[AssignFirstFillToClaim] Assigning to a new Claim',
  props<{
    selectedClaimNumber: string;
    selectedCustomerId: string;
    temporaryMemberId: string;
    currentCustomerId: string;
  }>()
);

export const confirmAssignFirstFillToNewClaim = createAction(
  '[AssignFirstFillToClaim] Confirm the assignment to a new Claim',
  props<{
    selectedClaimNumber: string;
    selectedCustomerId: string;
    temporaryMemberId: string;
    currentCustomerId: string;
  }>()
);

export const assignFirstFillToNewClaimSuccess = createAction(
  '[AssignFirstFillToClaim] Assigning to new Claim Success',
  props<{ selectedClaimNumber: string }>()
);

export const assignFirstFillToNewClaimFailure = createAction(
  '[AssignFirstFillToClaim] Assigning to new Claim Failure',
  props<{ errors: string[] }>()
);
