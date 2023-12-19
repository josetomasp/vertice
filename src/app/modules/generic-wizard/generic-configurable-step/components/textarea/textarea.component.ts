import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'healthe-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ]
})
export class TextareaComponent implements ControlValueAccessor {
  @ViewChild(MatInput, { static: true, read: ElementRef })
  matInputElement: ElementRef;
  @Input()
  placeholder: string;
  @Input()
  formLabel: string;
  @Input()
  formControlName: string;
  onChange: (val: any) => void = noop;
  onTouched: () => void = noop;
  formControl: FormControl = new FormControl();
  @Input()
  maxLength: number;
  isRequired: boolean = false;

  constructor(
    @Inject(ErrorStateMatcher) public errorStateMatcher: ErrorStateMatcher,
    @Inject(ControlContainer) public controlContainer: ControlContainer,
    private elementRef: ElementRef
  ) {
    elementRef.nativeElement.focus = () => {
      this.onFocus();
    };
    elementRef.nativeElement.blur = () => {
      this.onBlur();
    };
  }

  onFocus() {
    this.matInputElement.nativeElement.focus();
  }

  onBlur() {
    this.matInputElement.nativeElement.blur();
  }
  ngOnInit(): void {
    this.formControl = this.controlContainer.control.get(
      this.formControlName
    ) as FormControl;
    // TODO: Make this work
    // this.isRequired = this.formControl
    //   .validator({} as AbstractControl)
    //   .hasOwnProperty('required');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  writeValue(obj: any): void {
  }
}
