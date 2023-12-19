import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {
  faExclamationTriangle
} from '@fortawesome/pro-light-svg-icons/faExclamationTriangle';
import {faFile} from '@fortawesome/pro-light-svg-icons/faFile';
import {select, Store} from '@ngrx/store';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import {Observable} from 'rxjs';
import {debounceTime, withLatestFrom} from 'rxjs/operators';
import {RootState} from 'src/app/store/models/root.models';
import {
  getUsername
} from '../../../../../../../../user/store/selectors/user.selectors';
import {
  DocumentPickerModalMode
} from '../../../../../components/document-picker-modal/document-picker-modal.component';
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
import {FusionAuthorizationService} from '../../fusion-authorization.service';
import {
  FormValidationExtractorService
} from '@modules/form-validation-extractor';

@Component({
  selector: 'healthe-language-auth-info',
  templateUrl: './language-authorization-information.component.html',
  styleUrls: ['./language-authorization-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageAuthorizationInformationComponent
  extends DestroyableComponent
  implements OnInit {
  @Input()
  authorizations$: Observable<FusionAuthorization[]>;
  @Input()
  rush$: Observable<boolean>;
  @Input()
  notes$: Observable<NoteList[]>;
  @Input()
  documents$;
  @Input()
  fusionAuthorizationReasons$: Observable<AuthorizationReasons>;
  @Input()
  fusionFormArray: FormArray;
  @Output()
  relaySubmitClickedBeforeEvent = new EventEmitter();


  _abmLanguageAuthorizationFormGroup: FormGroup;
  _abmFusionFormGroup: FormGroup;

  archeType: ReferralAuthorizationArchetype =
    ReferralAuthorizationArchetype.Language;

  faFile = faFile;

  authorizations: FusionAuthorization[];

  notesFormControl = new FormControl([]);
  documentsFormControl = new FormControl([]);
  faExclamationTriangle = faExclamationTriangle;

  constructor(
    private fusionAuthorizationService: FusionAuthorizationService,
    public store$: Store<RootState>,
    public formValidationExtractorService: FormValidationExtractorService
  ) {
    super();
  }

  get abmFusionFormGroup() {
    return this._abmFusionFormGroup;
  }

  @Input()
  set abmFusionFormGroup(abmFusionFormGroup: FormGroup) {
    this._abmFusionFormGroup = abmFusionFormGroup;
  }

  setSubmittedClickedBefore($event) {
    this.relaySubmitClickedBeforeEvent.emit($event);
  }

  get abmLanguageAuthorizationFormGroup() {
    return this._abmLanguageAuthorizationFormGroup;
  }

  @Input()
  set abmLanguageAuthorizationFormGroup(languageAuthorizationForm: FormGroup) {
    this._abmLanguageAuthorizationFormGroup = languageAuthorizationForm;
  }



  ngOnInit() {
    this.formValidationExtractorService.registerErrorMessage({
      additionalNoteRequired: "An aditional note is required"
    })
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
    this.fusionFormArray.push(this.documentsFormControl);
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

  openDocumentsModal() {
    this.fusionAuthorizationService.openDocumentsModal(
      this.documentsFormControl,
      DocumentPickerModalMode.VIEW
    );
  }
}
