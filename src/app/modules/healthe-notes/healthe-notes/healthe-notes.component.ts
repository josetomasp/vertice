import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { faFile } from '@fortawesome/pro-light-svg-icons';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { HealtheNote } from '../healthe-notes.model';
import { takeUntil } from 'rxjs/operators';
import { noop } from 'rxjs';

@Component({
  selector: 'healthe-notes',
  templateUrl: './healthe-notes.component.html',
  styleUrls: ['./healthe-notes.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HealtheNotesComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HealtheNotesComponent extends DestroyableComponent
  implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input()
  sectionTitle: string;

  @Input()
  existingNotes: HealtheNote[] = [];

  @Input()
  textAreaPlaceholder: string = 'Please enter notes here';

  @Input()
  showSubmitButton: boolean = false;

  @Input()
  submitButtonLabel: string = 'ADD NOTE';

  @Output()
  submitButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  htmlIdIndex: number = 0; // add something else to the HTML ID

  @ViewChild(MatExpansionPanel)
  private expansionPanel: MatExpansionPanel;

  faFile = faFile;
  newNotesFormControl = new FormControl();

  // Save the callbacks, make sure to have a default so your app
  // doesn't crash when one isn't (yet) registered
  private onChange: (input: string) => void = noop;
  private onTouched = noop;

  // @Inject(NgControl) public newNotesFormControl: NgControl
  constructor() {
    super();
  }

  ngOnInit() {
    this.newNotesFormControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      });
  }

  ngAfterViewInit(): void {
    if (this.existingNotes.length > 0) {
      this.expansionPanel.open();
    }
  }

  submit() {
    this.submitButtonClicked.next();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.newNotesFormControl.patchValue(value);
  }

  // This has been tested briefly, but if needed for an actual use-case it should be tested thoroughly
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.newNotesFormControl.disable();
    } else {
      this.newNotesFormControl.enable();
    }
  }
}
