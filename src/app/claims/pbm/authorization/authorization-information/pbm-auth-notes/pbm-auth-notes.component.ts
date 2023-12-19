import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  PbmAuthFormMode,
  PbmAuthNotesConfig
} from '../../store/models/pbm-authorization-information.model';
import { faFile } from '@fortawesome/pro-light-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import {
  ConfirmationModalService
} from '@shared/components/confirmation-modal/confirmation-modal.service';
import { ConfirmationModalData } from '@shared';
import { filter, takeUntil } from 'rxjs/operators';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { PbmAuthorizationNote } from '../../store/models/pbm-authorization-information/pbm-authorization-note.models';

@Component({
  selector: 'healthe-pbm-auth-notes',
  templateUrl: './pbm-auth-notes.component.html',
  styleUrls: ['./pbm-auth-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PbmAuthNotesComponent extends DestroyableComponent
  implements OnInit, AfterViewInit {
  pbmAuthFormMode = PbmAuthFormMode;
  @Input()
  notes: PbmAuthorizationNote[] = [];

  @Input()
  index: number = 0;

  @Input()
  parentFormGroup: FormGroup = new FormGroup({});

  @Input()
  noteFormControlName: string;

  @Input()
  notesConfig: PbmAuthNotesConfig;

  @ViewChild('banner')
  private expansionPanel: MatExpansionPanel;

  @ViewChild('notesInput')
  private notesInput: ElementRef;

  @ViewChild('lastElement')
  private last: ElementRef;

  @Output()
  addNote: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  addPaperAuthNote: EventEmitter<string> = new EventEmitter<string>();

  get expansionPanelComponent() {
    return this.expansionPanel;
  }

  get notesInputElement() {
    return this.notesInput?.nativeElement;
  }

  get lastElement() {
    return this.last.nativeElement;
  }

  get noteFormControl() {
    return (
      this.parentFormGroup.get(this.noteFormControlName) ?? new FormControl()
    );
  }

  faFile = faFile;
  disableSubmit: boolean = false;

  constructor(
    public confirmationModalService: ConfirmationModalService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    if (this.notesConfig.avoidSubmitOriginalValue) {
      this.validateCurrentVsOriginalValue(this.noteFormControl.value);
      this.noteFormControl.valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((notesValue) => {
          this.validateCurrentVsOriginalValue(notesValue);
        });
    }
  }

  ngAfterViewInit(): void {
    if (
      (this.notesConfig.autoExpandWhenNotesPresent &&
        this.notes &&
        this.notes.length > 0) ||
      this.notesConfig.autoExpandOnLoad ||
      !this.notesConfig.isAnExpandableSection
    ) {
      this.expansionPanel.open();
      this.changeDetectionRef.detectChanges();
    }
  }

  addNewNote() {
    if (this.noteFormControl.value) {
      if (this.notesConfig.warnAboutSavingNote) {
        let config: ConfirmationModalData = {
          affirmString: 'YES',
          denyString: 'NO',
          titleString: 'Confirmation',
          bodyHtml:
            '<p>This ' +
            this.notesConfig.confirmServiceName +
            ' will not be processed. Only entered comments will be saved. Do you want to continue?</p>'
        };

        this.confirmationModalService
          .displayModal(config, '230px')
          .afterClosed()
          .pipe(filter((confirmed) => confirmed))
          .subscribe(() => {
            if (this.notesConfig.historyNotes) {
              this.addNote.next(this.noteFormControl.value);
              this.noteFormControl.setValue(null);
            } else {
              this.addPaperAuthNote.next(this.noteFormControl.value);
              if (this.notesConfig.avoidSubmitOriginalValue) {
                this.notesConfig.orginalValue = this.noteFormControl.value;
                this.noteFormControl.updateValueAndValidity();
              }
            }
          });
      } else {
        if (this.notesConfig.historyNotes) {
          this.addNote.next(this.noteFormControl.value);
          this.noteFormControl.setValue(null);
        } else {
          if (this.notesConfig.avoidSubmitOriginalValue) {
            this.notesConfig.orginalValue = this.noteFormControl.value;
            this.addNote.next(this.noteFormControl.value);
            this.noteFormControl.updateValueAndValidity();
          }
        }
      }
    }
  }

  validateCurrentVsOriginalValue(currentValue: string) {
    if (
      currentValue &&
      this.notesConfig &&
      this.notesConfig.orginalValue &&
      currentValue.replace(/(\r\n|\n|\r)/gm, '') ===
        this.notesConfig.orginalValue.replace(/(\r\n|\n|\r)/gm, '')
    ) {
      this.disableSubmit = true;
    } else {
      this.disableSubmit = false;
    }
  }
}
