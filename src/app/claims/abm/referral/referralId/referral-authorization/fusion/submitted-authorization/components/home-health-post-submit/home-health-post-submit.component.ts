import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  FusionAuthorization
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { FormGroup } from '@angular/forms';
import {
  AddNoteModalComponent
} from '../../../../../../make-a-referral/transportation/components/add-note-modal/add-note-modal.component';
import { AuthNarrativeMode } from '../../../../referral-authorization.models';

@Component({
  selector: 'healthe-home-health-post-submit',
  templateUrl: './home-health-post-submit.component.html',
  styleUrls: ['./home-health-post-submit.component.scss']
})
export class HomeHealthPostSubmitComponent implements OnInit {
  @Input()
  fusionReferralAuthorizations$: Observable<FusionAuthorization[]>;

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
