import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { faUsers } from '@fortawesome/pro-solid-svg-icons';
import { Observable } from 'rxjs';
import {
  AddNoteModalComponent
} from '../../../../../../make-a-referral/transportation/components/add-note-modal/add-note-modal.component';
import {
  FusionAuthorization
} from '../../../../../../store/models/fusion/fusion-authorizations.models';
import { AuthNarrativeMode } from '../../../../referral-authorization.models';

@Component({
  selector: 'healthe-language-post-submit',
  templateUrl: './language-post-submit.component.html',
  styleUrls: ['../../../authorization-card.component.scss']
})
export class LanguagePostSubmitComponent implements OnInit {
  @Input()
  fusionReferralAuthorizations$: Observable<FusionAuthorization[]>;

  faUsers = faUsers;
  narrativeTextFormGroup = new FormGroup({});
  narrativeMode = AuthNarrativeMode.PostSubmit;
  authNarrativeConfig = {
    startDate: { controlName: 'startDate', isDisabled: true },
    endDate: { controlName: 'endDate' },
    originalEndDate: { controlName: 'originalEndDate' },
    serviceDate: { controlName: 'serviceDate' },
    quantity: {
      controlName: 'quantity',
      min: 1
    }
  };
  locationDetailsFormGroup = new FormGroup({});
  minDetailsInput: any;

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
