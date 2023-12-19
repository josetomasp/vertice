import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  faExclamationTriangle,
  faFile
} from '@fortawesome/pro-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, first, takeUntil, withLatestFrom } from 'rxjs/operators';
import {
  AuthorizationReasons,
  FusionAuthorization,
  NoteList
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import {
  DocumentTableItem
} from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from 'src/app/store/selectors/router.selectors';
import { RootState } from '../../../../../../../store/models/root.models';
import {
  getUsername
} from '../../../../../../../user/store/selectors/user.selectors';
import {
  updateFusionAuthHeaderNotes
} from '../../../../store/actions/fusion/fusion-authorization.actions';
import {
  loadFusionBodyParts
} from '../../../../store/actions/fusion/fusion-make-a-referral.actions';
import {
  AddDocumentsModalComponent
} from '../../components/add-documents-modal/add-documents-modal.component';
import {
  ReferralAuthorizationArchetype
} from '../../referral-authorization.models';
import { FusionAuthorizationService } from '../fusion-authorization.service';

@Component({
  selector: 'healthe-physical-medicine-auth-info',
  templateUrl: './physical-medicine-authorization-information.component.html',
  styleUrls: ['./physical-medicine-authorization-information.component.scss']
})
export class PhysicalMedicineAuthorizationInformationComponent
  extends DestroyableComponent
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

  encodedCustomerId$ = this.store$.pipe(
    select(getEncodedCustomerId),
    first()
  );
  encodedClaimNumber$ = this.store$.pipe(
    select(getEncodedClaimNumber),
    first()
  );

  documentsFormControl = new FormControl([]);

  documentsToUpload: DocumentTableItem[] = [];

  faExclamationTriangle = faExclamationTriangle;
  faFile = faFile;
  archetype: ReferralAuthorizationArchetype =
    ReferralAuthorizationArchetype.PhysicalMedicine;
  notesFormControl = new FormControl();

  constructor(
    private fusionAuthorizationService: FusionAuthorizationService,
    public store$: Store<RootState>,
    public dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    combineLatest([
      this.encodedClaimNumber$,
      this.encodedCustomerId$
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

  addDocuments() {
    return this.dialog
      .open(AddDocumentsModalComponent, {
        disableClose: true,
        autoFocus: false,
        width: '900px',
        height: '421px',
        data: this.documentsToUpload
      })
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((addedDocs) => {
        if (addedDocs) {
          this.documentsToUpload = addedDocs;
        }
      });
  }
}
