import { mergeClone } from '@shared';
import * as _moment from 'moment';
import { ActionType } from '../actions/referral-notes.actions';
import { NoteOriginator, ReferralNote, ReferralNotesState } from '../models';

const moment = _moment;

export function referralNotesReducer(
  state: ReferralNotesState,
  action
): ReferralNotesState {
  switch (action.type) {
    case ActionType.REQUEST_REFERRAL_NOTES_SUCCESS:
      return mergeClone(state, { notes: action.payload });
    case ActionType.REQUEST_REFERRAL_NOTES_FAIL:
      return mergeClone(state, { errors: [...state.errors, action.payload] });
    case ActionType.POST_REFERRAL_NOTES_REQUEST_SUCCESS:
      const newNote: ReferralNote = {
        noteOrigination: NoteOriginator.VERTICE,
        note: action.payload.note,
        userCreated: action.payload.username,
        dateCreated: moment().format('MM/DD/YYYY'),
        timeCreated: moment().format('hh:mm A')
      };

      return mergeClone(state, {
        notes: [...state.notes, newNote]
      });
    default:
      return state;
  }
}
