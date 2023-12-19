import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { EMPTY, Observable, Subject } from 'rxjs';
import { first, mergeMap, skip, withLatestFrom } from 'rxjs/operators';
import { getUsername } from 'src/app/user/store/selectors/user.selectors';

import { RootState } from '../../../../../../../store/models/root.models';
import {
  getAuthorizationArchetype,
  getEncodedReferralId
} from '../../../../../../../store/selectors/router.selectors';
import { PostReferralNoteRequest } from '../../../../store/actions/referral-notes.actions';
import { NoteOriginator, ReferralNote } from '../../../../store/models';
import {
  getReferralNotes,
  getReferralNotesCount
} from '../../../../store/selectors/referral-notes.selectors';
import { ReferralActivityService } from '../../referral-activity.service';
import { ReferralAuthorizationArchetype } from '../../../referral-authorization/referral-authorization.models';

@Component({
  selector: 'healthe-referral-notes-widget',
  templateUrl: './referral-notes-widget.component.html',
  styleUrls: ['./referral-notes-widget.component.scss']
})
export class ReferralNotesWidgetComponent implements OnInit, AfterViewInit {
  @Input()
  showSubmitButton: boolean = true;

  @Input()
  autoFocusNoteTextArea: boolean = false;

  @ViewChild('noteTextArea', { static: true })
  noteTextArea: ElementRef;

  NoteOriginator = NoteOriginator;
  isSavingNote = false;
  noteFormControl = new FormControl('');
  getReferralNotes$: Observable<ReferralNote[]> = this.store$.pipe(
    select(getReferralNotes)
  );

  getReferralNotesCount$: Observable<number> = this.store$.pipe(
    select(getReferralNotesCount)
  );

  getEncodedReferralId$: Observable<string> = this.store$.pipe(
    select(getEncodedReferralId)
  );

  getUsername$: Observable<string> = this.store$.pipe(select(getUsername));

  authorizationArchType$: Observable<ReferralAuthorizationArchetype> =
    this.store$.pipe(select(getAuthorizationArchetype));

  public addNoteEvent = new Subject();
  submitNote$ = this.addNoteEvent.asObservable().pipe(
    withLatestFrom(
      this.getEncodedReferralId$,
      this.getUsername$,
      this.authorizationArchType$
    ),
    mergeMap(([event, encodedReferralId, username, archType]) => {
      this.isSavingNote = true;
      this.store$.dispatch(
        new PostReferralNoteRequest({
          note: this.noteFormControl.value,
          referralId: encodedReferralId,
          username: username,
          archType
        })
      );
      return EMPTY;
    })
  );

  constructor(
    public store$: Store<RootState>,
    public referralActivityService: ReferralActivityService
  ) {}

  ngOnInit() {
    // I don't even know why this works, but it won't without this subscription...
    // I tried to do something within the submitNote$ subscription to handle the new note and clear the form,
    // but the body is never executed so I created a selector on the note length with a skip so it doesn't fire when initializing...
    this.submitNote$.subscribe();
    this.getReferralNotesCount$.pipe(skip(1)).subscribe(() => {
      this.noteFormControl.reset();
      this.isSavingNote = false;
    });

    this.authorizationArchType$.pipe(first()).subscribe((archType) => {
      if (archType === ReferralAuthorizationArchetype.Kinect) {
        this.noteFormControl.disable();
      }
    });
  }

  ngAfterViewInit() {
    if (this.autoFocusNoteTextArea) {
      this.noteTextArea?.nativeElement?.focus();
    }
  }

  isInvalid() {
    return (
      this.noteFormControl.pristine ||
      this.noteFormControl.value.length === 0 ||
      this.isSavingNote
    );
  }
}
