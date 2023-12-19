import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  SkipSelf
} from '@angular/core';
import {
  ControlContainer,
  FormArrayName,
  FormControlName,
  FormGroupDirective,
  FormGroupName,
  NgControl
} from '@angular/forms';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { FormValidationExtractorService } from './form-validation-extractor.service';
import { getOrdinal } from './utils/get-ordinal';

@Directive({
  selector: '[healtheFormValidationExtractor]'
})
export class FormValidationExtractorDirective implements OnInit, OnDestroy {
  /**
   * If a formLabel isn't provided and a placeholder exists, the placeholder
   * will be used instead. If both aren't present, then the formControlName
   * will be used.
   */
  @Input() formLabel: string;
  @Input() placeholder: string;
  @Input() parentPath: string[];
  private readonly destroy$: Subject<void> = new Subject();

  constructor(
    @Optional()
    @SkipSelf()
    @Inject(FormValidationExtractorDirective)
    public readonly parentExtractor: FormValidationExtractorDirective,
    @Inject(NgControl) @Optional() @Self() public ngControl: NgControl,
    @Inject(FormControlName)
    @Optional()
    @Self()
    public readonly formControlName: FormControlName,
    @Inject(ControlContainer)
    @Optional()
    @Self()
    public readonly parent: ControlContainer,
    @Inject(FormGroupName)
    @Optional()
    @Self()
    public readonly formGroupName: FormGroupName,
    @Inject(FormArrayName)
    @Optional()
    @Self()
    public readonly formArrayName: FormArrayName,
    @Optional()
    @Self()
    @Inject(FormGroupDirective)
    public readonly formGroupDirective: FormGroupDirective,
    public readonly elementRef: ElementRef,
    public readonly errorExtractorService: FormValidationExtractorService
  ) {}

  // tslint:disable-next-line:variable-name
  private _ordinalIndex: string;

  /**
   * If an ordinal index is provided,
   * the ordinal representation will be appended to the beginning of the formLabel
   * @example component.html
   * <li *ngFor="let control of formArray.controls; index as $index" healtheFormValidationExtractor [ordinalIndex]="$index" [formLabel]="Item">
   *
   * // Represents form labels as "1st Item", "2nd Item", "3rd Item", etc...
   *
   */
  @Input()
  set ordinalIndex(index: number) {
    this._ordinalIndex = getOrdinal(index + 1);
  }

  ngOnInit() {
    if (this.formGroupDirective && !this.parentPath) {
      console.warn(
        `You are using this errorExtractor on just a formGroup! \n
        The intention is to use this on a formGroup only if you need to register a "parentPath"! \n
        Try to use a 'formGroupName' directive or, if it's a sub-component, use the 'FormGroupNamePassthrough' to pass in a 'parentPath'. `
      );
    } else if (this.parentExtractor && this.parentExtractor.parentPath) {
      this.parentPath = this.parentExtractor.parentPath;
    }
    /**
     * The logic for form error hook registration goes as follows:
     *  * Determine if it's a parent by checking if it has a ngControl
     *  * If it has an ngControl, then register a label to the formPath
     *  ( a unique identifier grabbed from the formControlName directive)
     *  * The label is grabbed in this priority formLabel || placeholder || formControlName
     *  *
     */
    if (!this.ngControl) {
      this.configureSelfAsParent();
    } else {
      this.configureSelfAsControl();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private getLabel(): string {
    if (this._ordinalIndex) {
      return `${this._ordinalIndex} ${this.formLabel || this.placeholder}`;
    } else {
      return this.formLabel || this.placeholder;
    }
  }

  private getPath(): string {
    if (this.formControlName) {
      if (this.parentPath) {
        return [...this.parentPath, ...this.formControlName.path].join('.');
      }
      return this.formControlName.path.join('.');
    }
  }

  private configureSelfAsParent() {
    if (this.formControlName) {
      console.error(
        'No ngControl Found on this formControl! Make sure that your form is properly hooked up.'
      );
    } else if (this.getLabel()) {
      if (this.formArrayName) {
        this.errorExtractorService.registerFormLabel(
          this.formArrayName.path.join('.'),
          this.getLabel()
        );
      }
      if (this.formGroupName) {
        this.errorExtractorService.registerFormLabel(
          this.formGroupName.path.join('.'),
          this.getLabel()
        );
      }
    }
  }

  private configureSelfAsControl() {
    if (this.formControlName) {
      this.errorExtractorService.registerElement(
        this.getPath(),
        this.elementRef.nativeElement
      );
    } else {
      console.warn(
        'Use of the errorHook directive isnt supported for ngModel!'
      );
    }

    if (this.getLabel() || this.placeholder) {
      this.errorExtractorService.registerFormLabel(
        this.getPath(),
        this.getLabel() || this.placeholder
      );
    } else {
      this.errorExtractorService.registerFormLabel(
        this.getPath(),
        this.formControlName.name
      );
      console.warn(
        `There is no label for "${
          this.formControlName.name
        }", Using the formControlName instead.`
      );
    }

    this.ngControl.statusChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.ngControl.valid ? 'VALID' : 'INVALID')
      )
      .subscribe(
        (status) => {
          if (status === 'INVALID') {
            if (this.ngControl.control.errors) {
              this.errorExtractorService.issueErrors(
                this.getPath(),
                Object.keys(this.ngControl.control.errors)
              );
            } else {
              console.warn(
                `The control ${this.getPath()} is invalid, but has no errors attached to it!`
              );
            }
          } else {
            this.errorExtractorService.revokeAllErrors(this.getPath());
          }
        },
        (error) => {
          console.error(`Error within ${this.getPath()}`, error);
        },
        () => {
          this.errorExtractorService.revokeAllErrors(this.getPath());
        }
      );
  }
}
