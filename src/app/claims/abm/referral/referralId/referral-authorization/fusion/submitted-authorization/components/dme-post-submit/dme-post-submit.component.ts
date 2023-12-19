import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  FusionAuthorization
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import {
  AddNoteModalComponent
} from '../../../../../../make-a-referral/transportation/components/add-note-modal/add-note-modal.component';
import { AuthNarrativeMode } from '../../../../referral-authorization.models';

@Component({
  selector: 'healthe-dme-post-submit',
  templateUrl: './dme-post-submit.component.html',
  styleUrls: ['./dme-post-submit.component.scss']
})
export class DmePostSubmitComponent implements OnInit {
  @Input()
  fusionReferralAuthorizations$: Observable<FusionAuthorization[]>;

  narrativeMode = AuthNarrativeMode.PostSubmit;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  viewNotes(authorization: FusionAuthorization) {
    this.dialog.open(AddNoteModalComponent, {
      width: '50%',
      data: {
        notes: authorization.authorizationUnderReview.noteList
          .map((note) => note.description)
          .join('\n\n'),
        readOnly: true
      }
    });
  }
}
