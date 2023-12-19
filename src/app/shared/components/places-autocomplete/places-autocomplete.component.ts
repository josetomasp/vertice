import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  NgControl,
  NgForm
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { HealtheControlValueAccessor } from '@healthe/vertice-library/src/app/lib/interface/control-value-accessor.interface';
import {
  AutocompleteOption,
  LocationService
} from '@shared/service/location.service';
import { noop, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  finalize,
  map,
  startWith,
  switchMap
} from 'rxjs/operators';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'healthe-places-autocomplete',
  templateUrl: './places-autocomplete.component.html',
  styleUrls: ['./places-autocomplete.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: PlacesAutocompleteComponent }
  ]
})
export class PlacesAutocompleteComponent
  implements
    OnInit,
    AfterViewInit,
    OnDestroy,
    DoCheck,
    HealtheControlValueAccessor<any>,
    MatFormFieldControl<PlacesAutocompleteComponent> {
  @ViewChild('placesMenuAutocompleteTrigger', { static: true })
  placesAutocompleteTrigger: MatMenuTrigger;
  @ViewChild('placesAutocompleteMenu')
  placesAutocompleteMenu: MatMenu;
  @Input()
  id: string;
  @Input()
  type: 'AIRPORT' | 'CITY' | 'BOTH' | 'ALL' | 'ADDRESS';
  isAlive = true;
  public _onChange: (value: any) => void = noop;
  public _onTouched = noop;
  focused = false;
  formControl: FormControl = new FormControl();
  ids: string[];
  errorState = false;
  controlType = 'healthe-places-autocomplete';
  placesSuggestions$: Observable<
    AutocompleteOption[]
  > = this.formControl.valueChanges.pipe(
    this.getOptions(() => this.placesAutocompleteTrigger)
  );
  @Input()
  errorStateMatcher: ErrorStateMatcher;
  stateChanges = new Subject<void>();

  constructor(
    private locationService: LocationService,
    private cd: ChangeDetectorRef,
    fb: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() private _parentForm: NgForm,
    @Optional() private _parentFormGroup: FormGroupDirective
  ) {
    this.errorStateMatcher = defaultErrorStateMatcher;
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    this.stateChanges.subscribe(() => {
      this.checkErrorState();
    });
  }

  private _placeholder: string;

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  get empty() {
    return this.formControl.value == null || this.formControl.value !== '';
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  private _required = false;

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _disabled = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.formControl.disable() : this.formControl.enable();
    this.stateChanges.next();
  }

  get value() {
    return this.formControl.value;
  }

  set value(val) {
    this.formControl.setValue(val);
    this.stateChanges.next();
  }

  ngOnInit() {
    if (!this.id) {
      console.warn('Please set @Input() id for place-autocomplete');
    }
    // This was added because we want to accept any user input as well as picked values.
    this.formControl.valueChanges.subscribe((value) => {
      this._onChange(value);
    });
  }

  ngDoCheck(): void {
    this.checkErrorState();
  }

  checkErrorState() {
    const form = this._parentForm || this._parentFormGroup;
    const control = this.ngControl
      ? (this.ngControl.control as FormControl)
      : null;
    const oldState = this.errorState;
    const newState = this.errorStateMatcher.isErrorState(control, form);
    if (oldState !== newState) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }

  ngAfterViewInit(): void {
    if (this.ngControl != null) {
      this.ngControl.control.statusChanges.subscribe((status) => {
        this.stateChanges.next();
      });
    }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  setValue(value: any) {
    this.formControl.setValue(value);
  }

  writeValue(value: any) {
    this.formControl.setValue(value, { emitEvent: false });
  }

  getValue() {
    return this.formControl.value;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDescribedByIds(ids: string[]) {
    this.ids = ids;
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  getOptions(
    trigger: () => MatMenuTrigger
  ): (o: Observable<any>) => Observable<AutocompleteOption[]> {
    return (o: Observable<any>): Observable<AutocompleteOption[]> =>
      o.pipe(
        debounceTime(250),
        switchMap((value) => {
          return this.setCityCompleteValue(value, trigger()).pipe(
            finalize(() => {
              this.cd.detectChanges();
            }),
            map((options) => options.slice(0, 10))
          );
        }),
        startWith([])
      );
  }

  setCityCompleteValue(input: any, trigger: MatMenuTrigger) {
    switch (this.type) {
      case 'BOTH':
        return this.locationService.getCitiesAndAirportsOptions(input).pipe(
          finalize(() => {
            trigger.openMenu();
          })
        );
      case 'AIRPORT':
        return this.locationService.getAirportOptions(input).pipe(
          finalize(() => {
            trigger.openMenu();
          })
        );
      case 'CITY':
        return this.locationService.getCityOptions(input).pipe(
          finalize(() => {
            trigger.openMenu();
          })
        );

      case 'ALL':
        return this.locationService.getAllOptions(input).pipe(
          finalize(() => {
            trigger.openMenu();
          })
        );

      case 'ADDRESS':
        return this.locationService.getOptionsWithAddresses(input).pipe(
          finalize(() => {
            trigger.openMenu();
          })
        );
    }
  }

  selectOption(value: string, trigger: MatMenuTrigger) {
    this.formControl.setValue(value, { emitEvent: false });
    trigger.closeMenu();
    this.cd.detectChanges();
    this.stateChanges.next();
    this._onChange(value);
  }

  onBlur() {
    if (this.ngControl) {
      this.ngControl.control.markAsTouched();
      this.ngControl.control.updateValueAndValidity();
    }
  }
}
