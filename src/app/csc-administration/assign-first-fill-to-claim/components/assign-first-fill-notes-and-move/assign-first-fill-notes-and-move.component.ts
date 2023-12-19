import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { faFile } from '@fortawesome/pro-light-svg-icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'healthe-assign-first-fill-notes-and-move',
  templateUrl: './assign-first-fill-notes-and-move.component.html',
  styleUrls: ['./assign-first-fill-notes-and-move.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignFirstFillNotesAndMoveComponent implements OnInit {
  maxNoteLength: number = 100;
  faFile = faFile;
  noteFormControl: FormControl = new FormControl();

  @Input()
  initialNote$: Observable<string>;

  @Output()
  saveNotesClick = new EventEmitter<string>();

  @Output()
  moveToNextQueueClick = new EventEmitter<void>();

  @Output()
  saveNotesAndMoveToNextQueueClick = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    this.initialNote$.subscribe((note) => {
      if (note) {
        this.noteFormControl.setValue(note.substring(0, this.maxNoteLength));
      }
    });
  }

  areNotesEmpty(): boolean {
    return (
      !this.noteFormControl.value || this.noteFormControl.value.trim() === ''
    );
  }

  saveNotes() {
    this.saveNotesClick.emit(this.noteFormControl.value);
  }

  moveToNextQueue() {
    this.moveToNextQueueClick.emit();
  }

  saveNotesAndMoveToNextQueue() {
    this.saveNotesAndMoveToNextQueueClick.emit(this.noteFormControl.value);
  }
}
