import { mergeClone } from '../../../shared/lib/store';
import { Action, ActionTypes } from '../actions/user.actions';
import { UserState } from '../models/user.models';

const initialState: UserState = {
  info: {
    customerID: '',
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    internal: true,
    jarvisLinkHidden: true,
    internalUserCustomer: '',
    oktaSettingsURL: ''
  },
  errors: []
};

export function reducer(state: UserState = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.USER_INFO_SUCCESS:
      return mergeClone(state, { info: action.payload });
    case ActionTypes.USER_INFO_FAIL:
      return mergeClone(state, { errors: [...state.errors, action.payload] });
    case ActionTypes.USER_SET_INTERNAL_USER_CUSTOMER:
      return mergeClone(state, {
        info: { internalUserCustomer: action.payload }
      });
    case ActionTypes.SET_JARVIS_LINK_VISIBILITY:
      return {
        ...state,
        info: {
          ...state.info,
          jarvisLinkHidden: action.payload.jarvisLinkHidden,
          jarvisSSOLink: action.payload.jarvisSSOLink
        }
      };
    case ActionTypes.TOGGLE_INTERNAL:
      return mergeClone(state, {
        info: {
          ...state.info,
          internal: !state.info.internal
        }
      });
    default:
      return state;
  }
}
