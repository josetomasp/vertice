import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { BehaviorSubject, noop } from 'rxjs';
import { skip, startWith } from 'rxjs/operators';

@Component({
  selector: 'healthe-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ]
})
export class AutocompleteComponent implements ControlValueAccessor, OnInit {
  searchInputControl: FormControl = new FormControl();
  @Input()
  internalFilter = true;
  @Input('class')
  classList: string | string[];
  @Input()
  placeholder: string = '';
  @Input()
  maxOptions = 12;
  public overlayOpen: boolean;
  public panelHeight = 500;
  optionClicked = false;
  filteredOptions$: BehaviorSubject<{ value: string; label: string }[]> =
    new BehaviorSubject([]);
  private onChange: any = noop;
  private onTouched: any = noop;

  constructor(public elementRef: ElementRef) {
    this.searchInputControl.valueChanges
      .pipe(skip(1))
      .subscribe((searchValue) => {
        this.onChange(searchValue);
      });
  }

  _options: { value: string; label: string }[] = [];
  @Input() style: any;

  get options() {
    return this._options;
  }

  @Input()
  set options(value: { value: string; label: string }[]) {
    this._options = value;
    if (!this.internalFilter) {
      this.filteredOptions$.next(value);
    }
  }

  @HostListener('click', ['$event'])
  click() {
    this.onTouched();
  }
  ngOnInit() {
    this.filteredOptions$.subscribe((options) => {
      const len = options?.length ?? 0;
      if (len < this.maxOptions) {
        this.panelHeight = 40 * len;
      } else {
        this.panelHeight = 40 * this.maxOptions;
      }
    });
    this.searchInputControl.valueChanges
      .pipe(startWith(this.searchInputControl.value))
      .subscribe((filterValue) => {
        if (this.internalFilter) {
          this.filteredOptions$.next(
            this.options?.filter(
              (option) =>
                option.label
                  .toLowerCase()
                  .includes(filterValue?.toLowerCase()) ||
                option.value.toLowerCase().includes(filterValue?.toLowerCase())
            ) ?? []
          );
        }
      });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this.searchInputControl.setValue(obj);
  }

  onFocus() {
    if (!this.overlayOpen) {
      this.overlayOpen = true;
    }
  }

  onBlur(event) {
    const tagName = (event.relatedTarget as HTMLElement)?.tagName;
    if (!tagName || tagName !== 'MAT-OPTION') {
      this.overlayOpen = false;
    }
  }

  selectValue($event: MouseEvent, value: string) {
    this.optionClicked = true;
    this.overlayOpen = false;
    this.searchInputControl.setValue(value);
  }
}
