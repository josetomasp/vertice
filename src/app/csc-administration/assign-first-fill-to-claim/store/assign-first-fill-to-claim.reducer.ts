import {
  assignFirstFillToNewClaimFailure,
  assignFirstFillToNewClaimSuccess,
  loadClaimSearchResults,
  loadClaimSearchResultsFailure,
  loadClaimSearchResultsSuccess,
  loadFirstFillsToAssign,
  loadFirstFillsToAssignFailure,
  loadFirstFillsToAssignSuccess,
  moveToNextQueue,
  moveToNextQueueFailure,
  moveToNextQueueSuccess,
  saveSelectedClaim,
  saveWebUserNotes,
  saveWebUserNotesAndMoveToNextQueue,
  saveWebUserNotesAndMoveToNextQueueFailure,
  saveWebUserNotesAndMoveToNextQueueSuccess,
  saveWebUserNotesFailure,
  saveWebUserNotesSuccess
} from './assign-first-fill-to-claim.actions';
import { createReducer, on } from '@ngrx/store';

// If this interface works well we may consider extracting it to outside of csc-admin
export interface ResponseState<T> {
  data?: T;
  isLoadingData?: boolean;
  serverErrorMessages?: string[];
}

export interface AssignFirstFillsToClaimState {
  firstFillLineItemsToAssignState: ResponseState<
    FirstFillLineItemsToAssignResponseBody
  >;
  notesAndMoveState: ResponseState<void>;
  claimSearchState: FirstFillClaimSearchState;
  assignToClaimState: ResponseState<void>;
}

export interface FirstFillLineItemsToAssignResponseBody {
  firstFillLineItemDetails: FirstFillLineItemDetails[];
  webUserNotes: string;
}

export interface FirstFillClaimSearchState {
  searchResults: ResponseState<FirstFillClaimSearchResult[]>;
  selectedClaimNumber: string;
  selectedCustomerId: string;
}

export interface FirstFillLineItemDetails {
  firstFillTempId: string;
  customer: string;
  claimantFirstName: string;
  claimantLastName: string;
  employerName: string;
  dateOfInjury: string;
  rxName: string;
  submittedDate: string;
}

export interface FirstFillClaimSearchFormValues {
  claimNumber: string;
  claimantFirstName: string;
  claimantLastName: string;
  claimantSsn: string;
}

export interface FirstFillClaimSearchResult {
  memberId: string;
  claimNumber: string;
  claimant: string;
  claimantFirstName: string;
  claimantLastName: string;
  ssn: string;
  dateOfInjury: string;
  customer: string;
  stateOfVenue: string;
}

export interface FirstFillSelectedClaimAndCustomer {
  selectedClaimNumber: string;
  selectedCustomerId: string;
}

export interface AssignFirstFillToClaimServerErrors {
  firstFillLineItemsToAssignServerErrors: string[];
  firstFillLineNotesAndMoveServerErrors: string[];
  firstFillClaimSearchServerErrors: string[];
  firstFillAssignToClaimServerErrors: string[];
}

// Each call to ngVertice-Service will probably need a serverErrorMessages string[] and an isLoading boolean so
// that issues can be tracked independently
export const initialFirstFillLineItemsToAssignState: ResponseState<
  FirstFillLineItemsToAssignResponseBody
> = {
  data: {
    firstFillLineItemDetails: [],
    webUserNotes: ''
  },
  isLoadingData: true,
  serverErrorMessages: []
};

export const defaultVoidResponseStateInitialState: ResponseState<void> = {
  isLoadingData: false,
  serverErrorMessages: []
};

export const initialSearchResultsState: ResponseState<
  FirstFillClaimSearchResult[]
> = {
  data: [],
  isLoadingData: false,
  serverErrorMessages: []
};

export const initialFirstFillClaimSearchState: FirstFillClaimSearchState = {
  searchResults: initialSearchResultsState,
  selectedClaimNumber: '',
  selectedCustomerId: ''
};

export const initialAssignFirstFillsToClaimState: AssignFirstFillsToClaimState = {
  firstFillLineItemsToAssignState: initialFirstFillLineItemsToAssignState,
  claimSearchState: initialFirstFillClaimSearchState,
  notesAndMoveState: defaultVoidResponseStateInitialState,
  assignToClaimState: defaultVoidResponseStateInitialState
};

// Upon initiating an HTTP request, clear anything a result of the same
// request could populate (errors, results, loading, etc.) while the
// success/fail only need populate their individual pieces since the rest
// was cleared here. Success adds only data and fail only adds errors
export const assignFirstFillsToClaimReducer = createReducer(
  initialAssignFirstFillsToClaimState,

  // loadFirstFillsToAssign, loadFirstFillsToAssignSuccess, & loadFirstFillsToAssignFailure
  on(
    loadFirstFillsToAssign,
    (state): AssignFirstFillsToClaimState => ({
      ...state,
      firstFillLineItemsToAssignState: initialFirstFillLineItemsToAssignState,
      notesAndMoveState: defaultVoidResponseStateInitialState,
      claimSearchState: initialFirstFillClaimSearchState,
      assignToClaimState: defaultVoidResponseStateInitialState
    })
  ),
  on(
    loadFirstFillsToAssignSuccess,
    (state, payload): AssignFirstFillsToClaimState => ({
      ...state,
      firstFillLineItemsToAssignState: {
        ...state.firstFillLineItemsToAssignState,
        data: {
          firstFillLineItemDetails:
            payload.firstFillLineItemsToAssign.firstFillLineItemDetails,
          webUserNotes: payload.firstFillLineItemsToAssign.webUserNotes
        },
        isLoadingData: false
      }
    })
  ),
  on(
    loadFirstFillsToAssignFailure,
    (state, payload): AssignFirstFillsToClaimState => ({
      ...state,
      firstFillLineItemsToAssignState: {
        ...state.firstFillLineItemsToAssignState,
        serverErrorMessages: payload.errors,
        isLoadingData: false
      }
    })
  ),

  // saveWebUserNotes, moveToNextQueue, & saveWebUserNotesAndMoveToNextQueue
  on(
    saveWebUserNotes,
    moveToNextQueue,
    saveWebUserNotesAndMoveToNextQueue,
    (state): AssignFirstFillsToClaimState => ({
      ...state,
      notesAndMoveState: {
        isLoadingData: true,
        serverErrorMessages: []
      }
    })
  ),
  on(
    saveWebUserNotesSuccess,
    moveToNextQueueSuccess,
    saveWebUserNotesAndMoveToNextQueueSuccess,
    (state): AssignFirstFillsToClaimState => ({
      ...state,
      notesAndMoveState: {
        ...state.notesAndMoveState,
        isLoadingData: false
      }
    })
  ),
  on(
    saveWebUserNotesFailure,
    moveToNextQueueFailure,
    saveWebUserNotesAndMoveToNextQueueFailure,
    (state, payload): AssignFirstFillsToClaimState => ({
      ...state,
      notesAndMoveState: {
        isLoadingData: false,
        serverErrorMessages: payload.errors
      }
    })
  ),

  // loadClaimSearchResults, loadClaimSearchResultsSuccess, & loadClaimSearchResultsFailure
  on(
    loadClaimSearchResults,
    (state): AssignFirstFillsToClaimState => ({
      ...state,
      claimSearchState: {
        ...state.claimSearchState,
        searchResults: {
          ...initialSearchResultsState,
          isLoadingData: true
        }
      }
    })
  ),
  on(
    loadClaimSearchResultsSuccess,
    (state, payload): AssignFirstFillsToClaimState => ({
      ...state,
      claimSearchState: {
        ...state.claimSearchState,
        searchResults: {
          ...state.claimSearchState.searchResults,
          data: payload.firstFillClaimSearchResults,
          isLoadingData: false
        }
      }
    })
  ),
  on(
    loadClaimSearchResultsFailure,
    (state, payload): AssignFirstFillsToClaimState => ({
      ...state,
      claimSearchState: {
        ...state.claimSearchState,
        searchResults: {
          ...state.claimSearchState.searchResults,
          serverErrorMessages: payload.errors,
          isLoadingData: false
        }
      }
    })
  ),
  on(
    saveSelectedClaim,
    (state, payload): AssignFirstFillsToClaimState => ({
      ...state,
      claimSearchState: {
        ...state.claimSearchState,
        selectedClaimNumber: payload.selectedClaimNumber,
        selectedCustomerId: payload.selectedCustomerId
      }
    })
  ),
  // assignFirstFillToNewClaimSuccess & assignFirstFillToNewClaimFailure
  on(
    assignFirstFillToNewClaimSuccess,
    (state): AssignFirstFillsToClaimState => ({
      ...state,
      assignToClaimState: {
        isLoadingData: false,
        serverErrorMessages: []
      }
    })
  ),
  on(
    assignFirstFillToNewClaimFailure,
    (state, payload): AssignFirstFillsToClaimState => ({
      ...state,
      assignToClaimState: {
        isLoadingData: false,
        serverErrorMessages: payload.errors
      }
    })
  )
);
