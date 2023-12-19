import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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
  selector: 'healthe-physical-medicine-post-submit',
  templateUrl: './physical-medicine-post-submit.component.html',
  styleUrls: ['./physical-medicine-post-submit.component.scss']
})
export class PhysicalMedicinePostSubmitComponent implements OnInit {
  @Input()
  fusionReferralAuthorizations$: Observable<FusionAuthorization[]>;

  icdCodesFormControl = new FormControl([]);
  authBodyPartsFormArray = new FormArray([]);
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
