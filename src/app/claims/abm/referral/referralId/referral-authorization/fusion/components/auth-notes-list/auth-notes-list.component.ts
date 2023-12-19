import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { NoteList } from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { NoteOriginator } from 'src/app/claims/abm/referral/store/models';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'healthe-auth-notes-list',
  templateUrl: './auth-notes-list.component.html',
  styleUrls: ['./auth-notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthNotesListComponent implements OnInit {
  @Input()
  notes$: Observable<NoteList[]>;

  NoteOriginator = NoteOriginator;

  constructor() {}

  ngOnInit() {}

  getDateFromDateTime(note: NoteList) {
    if (note && note.createdDate) {
      return moment(note.createdDate).format('MM/DD/YYYY');
    }
    return '';
  }

  getTimeFromDateTime(note: NoteList) {
    if (note && note.createdDate) {
      return moment(note.createdDate).format('hh:mm a');
    }
    return '';
  }
}
