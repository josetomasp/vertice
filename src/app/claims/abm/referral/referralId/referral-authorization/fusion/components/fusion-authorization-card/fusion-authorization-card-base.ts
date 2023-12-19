import {
  ControlContainer,
  FormControl,
  FormGroup, FormGroupDirective, FormGroupName,
  Validators
} from '@angular/forms';

import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { faStickyNote } from '@fortawesome/pro-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { filter, withLatestFrom } from 'rxjs/operators';
import { updateFusionAuthorizationState } from 'src/app/claims/abm/referral/store/actions/fusion/fusion-authorization.actions';
import {
  FusionAuthorization,
  NoteList
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { RootState } from 'src/app/store/models/root.models';
import { getUsername } from '../../../../../../../../user/store/selectors/user.selectors';
import { AddNoteModalComponent } from '../../../../../make-a-referral/transportation/components/add-note-modal/add-note-modal.component';
import {
  AbstractFormGroupNamePassThrough
} from "@modules/form-validation-extractor";

export abstract class FusionAuthorizationCardBase extends AbstractFormGroupNamePassThrough {
  public abstract authorization: FusionAuthorization;
  // Actions FormGroup
  public actionFormGroup = new FormGroup({});
  detailNoteFormControl = new FormControl();
  faStickyNote = faStickyNote;

  constructor(public store$: Store<RootState>,
              public dialog: MatDialog,
              public parent: FormGroupName,
              public formGroupDirective: FormGroupDirective) {
    super();

    this.actionFormGroup = new FormGroup({
      'action': new FormControl(null, Validators.required),
      'approvalReason': new FormControl(null, [Validators.required]),
      'denialReason': new FormControl(null, [Validators.required]),
      'pendReason': new FormControl(null, [Validators.required])
    });
  }

  // Updates store$ with a modified authorization and the index
  updateAuthorization(authorization: FusionAuthorization) {
    this.store$.dispatch(
      updateFusionAuthorizationState({
        authorization: authorization
      })
    );
  }

  viewNotes(noteList: NoteList[], authorization: FusionAuthorization) {
    this.dialog
      .open(AddNoteModalComponent, {
        width: '50%',
        data: {
          notes: this.detailNoteFormControl.value as string,
          editMessageText: 'Add a note to this authorization'
        }
      })
      .afterClosed()
      .pipe(
        filter((output) => output !== false),
        withLatestFrom(this.store$.pipe(select(getUsername)))
      )
      .subscribe(([note, username]) => {
        this.detailNoteFormControl.setValue(note);

        let newNote = noteList.find(
          (existingNote) => !existingNote.createdDate
        );
        if (!newNote) {
          newNote = {
            createdBy: username,
            createdDate: undefined,
            description: note
          };
          noteList.push(newNote);
        } else {
          newNote.description = note;
        }

        this.updateAuthorization(authorization);
      });
  }

  toggleDetailPanel(expansionPanel: MatExpansionPanel) {
    expansionPanel.expanded = !expansionPanel.expanded;
  }
}
