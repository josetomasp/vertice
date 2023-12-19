import { createSelector } from '@ngrx/store';
import {
  AssignFirstFillsToClaimState,
  AssignFirstFillToClaimServerErrors,
  FirstFillClaimSearchFormValues,
  FirstFillClaimSearchResult,
  FirstFillClaimSearchState,
  FirstFillLineItemDetails,
  FirstFillLineItemsToAssignResponseBody,
  FirstFillSelectedClaimAndCustomer,
  ResponseState
} from './assign-first-fill-to-claim.reducer';
import { getCscAdminState } from '../../store/selectors/cscAdmin.selectors';
import { CscAdminState } from '../../store/reducers/cscAdmin.reducers';
import { getRouterParams } from 'src/app/store/selectors/router.selectors';

export const selectAssignFirstFillsToClaimState = createSelector(
  getCscAdminState,
  ({
     assignFirstFillLineItemsToClaimState
   }: CscAdminState): AssignFirstFillsToClaimState =>
    assignFirstFillLineItemsToClaimState
);

export const selectFirstFillLineItemsToAssignState = createSelector(
  getCscAdminState,
  ({
     assignFirstFillLineItemsToClaimState
   }: CscAdminState): ResponseState<FirstFillLineItemsToAssignResponseBody> =>
    assignFirstFillLineItemsToClaimState.firstFillLineItemsToAssignState
);

export const selectIsLoadingFirstFillLinesToAssign = createSelector(
  selectFirstFillLineItemsToAssignState,
  (state: ResponseState<FirstFillLineItemsToAssignResponseBody>): boolean =>
    state.isLoadingData
);

export const selectLoadingFirstFillLinesServerErrors = createSelector(
  selectAssignFirstFillsToClaimState,
  (state: AssignFirstFillsToClaimState): string[] => {
    return state.firstFillLineItemsToAssignState.serverErrorMessages;
  }
);

export const selectFirstFillSaveNoteOrMoveQueueServerErrors = createSelector(
  selectAssignFirstFillsToClaimState,
  (state: AssignFirstFillsToClaimState): string[] => {
    return state.notesAndMoveState.serverErrorMessages;
  }
);

export const selectFirstFillClaimSearchServerErrors = createSelector(
  selectAssignFirstFillsToClaimState,
  (state: AssignFirstFillsToClaimState): string[] => {
    return state.claimSearchState.searchResults.serverErrorMessages;
  }
);

export const selectFirstFillAssignToClaimServerErrors = createSelector(
  selectAssignFirstFillsToClaimState,
  (state: AssignFirstFillsToClaimState): string[] => {
    return state.assignToClaimState.serverErrorMessages;
  }
);

export const selectCombinedFirstFillServerErrors = createSelector(
  selectLoadingFirstFillLinesServerErrors,
  selectFirstFillSaveNoteOrMoveQueueServerErrors,
  selectFirstFillClaimSearchServerErrors,
  selectFirstFillAssignToClaimServerErrors,
  (
    firstFillClaimSearchServerErrors,
    firstFillLineItemsToAssignServerErrors,
    firstFillLineNotesAndMoveServerErrors,
    firstFillAssignToClaimServerErrors
  ): AssignFirstFillToClaimServerErrors => {
    return {
      firstFillClaimSearchServerErrors,
      firstFillLineItemsToAssignServerErrors,
      firstFillLineNotesAndMoveServerErrors,
      firstFillAssignToClaimServerErrors
    };
  }
);

export const selectHaveServerErrors = createSelector(
  selectCombinedFirstFillServerErrors,
  (errors): boolean => {
    return (
      errors.firstFillLineItemsToAssignServerErrors.length > 0 ||
      errors.firstFillLineNotesAndMoveServerErrors.length > 0 ||
      errors.firstFillClaimSearchServerErrors.length > 0 ||
      errors.firstFillAssignToClaimServerErrors.length > 0
    );
  }
);

export const selectFirstFillLineItemDetails = createSelector(
  selectFirstFillLineItemsToAssignState,
  (
    state: ResponseState<FirstFillLineItemsToAssignResponseBody>
  ): FirstFillLineItemDetails[] => state.data.firstFillLineItemDetails
);

export const selectFirstFillInitialClaimSearchFormValues = createSelector(
  selectFirstFillLineItemsToAssignState,
  (
    state: ResponseState<FirstFillLineItemsToAssignResponseBody>
  ): FirstFillClaimSearchFormValues => ({
    claimantFirstName: state.data.firstFillLineItemDetails[0]?.claimantFirstName,
    claimantLastName: state.data.firstFillLineItemDetails[0]?.claimantLastName,
    claimantSsn: '',
    claimNumber: ''
  })
);

export const selectCustomerIdFromLineItemDetails = createSelector(
  selectAssignFirstFillsToClaimState,
  (state: AssignFirstFillsToClaimState): string => {
    if (
      state.firstFillLineItemsToAssignState.data.firstFillLineItemDetails &&
      state.firstFillLineItemsToAssignState.data.firstFillLineItemDetails
        .length > 0
    ) {
      return state.firstFillLineItemsToAssignState.data
        .firstFillLineItemDetails[0].customer;
    }
    return '';
  }
);

export const selectFirstFillWebUserNotes = createSelector(
  selectFirstFillLineItemsToAssignState,
  (state: ResponseState<FirstFillLineItemsToAssignResponseBody>): string =>
    state.data.webUserNotes
);

export const selectFirstFillClaimSearchState = createSelector(
  getCscAdminState,
  ({
     assignFirstFillLineItemsToClaimState
   }: CscAdminState): FirstFillClaimSearchState =>
    assignFirstFillLineItemsToClaimState.claimSearchState
);

export const selectIsLoadingFirstFillClaimSearchResults = createSelector(
  selectFirstFillClaimSearchState,
  (state: FirstFillClaimSearchState): boolean =>
    state.searchResults.isLoadingData
);

export const selectFirstFillClaimSearchResults = createSelector(
  selectFirstFillClaimSearchState,
  (state: FirstFillClaimSearchState): FirstFillClaimSearchResult[] =>
    state.searchResults.data
);

export const selectedClaimAndCustomerFromFirstFillClaimSearchResults = createSelector(
  selectFirstFillClaimSearchState,
  (state: FirstFillClaimSearchState): FirstFillSelectedClaimAndCustomer => {
    return {
      selectedClaimNumber: state.selectedClaimNumber,
      selectedCustomerId: state.selectedCustomerId
    };
  }
);

export const selectTemporaryMemberIdFromRoute = createSelector(
  getRouterParams,
  ({ temporaryMemberId }) => temporaryMemberId
);

export const selectSaveNotesOrMoveInformation = createSelector(
  selectCustomerIdFromLineItemDetails,
  selectTemporaryMemberIdFromRoute,
  (customerId, temporaryMemberId) => {
    return ({ customerId, temporaryMemberId });
  }
);

export const selectClaimAssignmentInformation = createSelector(
  selectCustomerIdFromLineItemDetails,
  selectedClaimAndCustomerFromFirstFillClaimSearchResults,
  selectTemporaryMemberIdFromRoute,
  (customerId, selectedCustomerAndClaim, temporaryMemberId) => {
    return ({ customerId, selectedCustomerAndClaim, temporaryMemberId });
  }
);
