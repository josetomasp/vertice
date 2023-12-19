import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  faExclamationTriangle,
  faFile
} from '@fortawesome/pro-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, first, withLatestFrom } from 'rxjs/operators';
import {
  loadFusionBodyParts
} from 'src/app/claims/abm/referral/store/actions/fusion/fusion-make-a-referral.actions';
import {
  AuthorizationReasons,
  FusionAuthorization,
  NoteList
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { RootState } from 'src/app/store/models/root.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../../../../store/selectors/router.selectors';
import {
  getUsername
} from '../../../../../../../../user/store/selectors/user.selectors';
import {
  updateFusionAuthHeaderNotes
} from '../../../../../store/actions/fusion/fusion-authorization.actions';
import {
  ReferralAuthorizationArchetype
} from '../../../referral-authorization.models';
import { FusionAuthorizationService } from '../../fusion-authorization.service';

@Component({
  selector: 'healthe-diagnostics-auth-info',
  templateUrl: './diagnostics-authorization-information.component.html',
  styleUrls: ['./diagnostics-authorization-information.component.scss']
})
export class DiagnosticsAuthorizationInformationComponent
  implements OnInit, OnChanges {
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
  encodedClaimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  encodedCustomerId$ = this.store$.pipe(select(getEncodedCustomerId));

  faExclamationTriangle = faExclamationTriangle;
  faFile = faFile;
  archeType: ReferralAuthorizationArchetype =
    ReferralAuthorizationArchetype.Diagnostics;
  notesFormControl = new FormControl();
  actionFormGroup = new FormGroup({});
  constructor(
    private fusionAuthorizationService: FusionAuthorizationService,
    public store$: Store<RootState>
  ) {}

  ngOnInit() {
    combineLatest([
      this.encodedClaimNumber$.pipe(first()),
      this.encodedCustomerId$.pipe(first())
    ]).subscribe(([encodedClaimNumber, encodedCustomerId]) => {
      this.store$.dispatch(
        loadFusionBodyParts({ encodedClaimNumber, encodedCustomerId })
      );
    });
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['documents$'] && changes['documents$'].firstChange) {
      this.documents$.subscribe((documents) => {
        this.documentsFormControl.setValue(documents);
      });
    }
  }

  viewDocuments() {
    this.fusionAuthorizationService.displayViewDocumentsModal();
  }
}
