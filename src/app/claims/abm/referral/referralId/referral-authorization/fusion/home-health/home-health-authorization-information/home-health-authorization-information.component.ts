import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import {
  faExclamationTriangle,
  faFile
} from '@fortawesome/pro-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, withLatestFrom } from 'rxjs/operators';
import { RootState } from '../../../../../../../../store/models/root.models';
import {
  getUsername
} from '../../../../../../../../user/store/selectors/user.selectors';
import {
  updateFusionAuthHeaderNotes
} from '../../../../../store/actions/fusion/fusion-authorization.actions';
import {
  AuthorizationReasons,
  FusionAuthorization,
  NoteList
} from '../../../../../store/models/fusion/fusion-authorizations.models';
import {
  ReferralAuthorizationArchetype
} from '../../../referral-authorization.models';
import { FusionAuthorizationService } from '../../fusion-authorization.service';

@Component({
  selector: 'healthe-home-health-authorization-information',
  templateUrl: './home-health-authorization-information.component.html',
  styleUrls: ['./home-health-authorization-information.component.scss']
})
export class HomeHealthAuthorizationInformationComponent implements OnInit {
  @Input()
  fusionAuthorizationReasons$: Observable<AuthorizationReasons>;
  @Input()
  authorizations$: Observable<FusionAuthorization[]>;
  @Input()
  rush$: Observable<boolean>;
  @Input()
  notes$: Observable<NoteList[]>;
  @Input()
  documents$;
  @Input()
  formArray: FormArray;

  documentsFormControl = new FormControl([]);

  faExclamationTriangle = faExclamationTriangle;
  faFile = faFile;
  archetype = ReferralAuthorizationArchetype.HomeHealth;
  notesFormControl = new FormControl();

  constructor(
    private fusionAuthorizationService: FusionAuthorizationService,
    public store$: Store<RootState>
  ) {}

  ngOnInit() {
    this.notesFormControl.valueChanges
      .pipe(
        debounceTime(250),
        withLatestFrom(this.notes$, this.store$.pipe(select(getUsername)))
      )
      .subscribe(([newNote, notes, username]) => {
        let noteObj = [...notes].find((note) => !note.createdDate);
        if (!noteObj) {
          noteObj = {
            createdBy: username,
            createdDate: undefined,
            description: newNote
          };
          notes = [...notes, noteObj];
        } else {
          noteObj.description = newNote;
        }
        this.store$.dispatch(updateFusionAuthHeaderNotes({ notes }));
      });
    this.formArray.push(this.notesFormControl);
    this.formArray.push(this.documentsFormControl);
  }

  viewDocuments() {
    this.fusionAuthorizationService.displayViewDocumentsModal();
  }
}
