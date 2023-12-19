import {
  PbmAuthFormMode,
  PbmAuthNotesConfig
} from './pbm-authorization-information.model';

export const PBM_AUTH_NOTES_DEFAULT_STATE: PbmAuthNotesConfig = {
  noteTitle: 'Prescription Notes',
  placeholder: 'Enter Additional Notes',
  confirmServiceName: 'ePAQ',
  requiredErrorMessage: 'Please enter a note.',
  inLineNotes: true,
  authorizationLevelNotes: false,
  historyNotes: true,
  addNoteButton: true,
  warnAboutSavingNote: true,
  isAnExpandableSection: true,
  showCharCount: false,
  autoExpandOnLoad: false,
  autoExpandWhenNotesPresent: true,
  pendActionCondition: true,
  avoidSubmitOriginalValue: false,
  orginalValue: '',
  mode: PbmAuthFormMode.ReadWrite
};
