import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  SimpleChanges
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { HealtheControlValueAccessor } from '@healthe/vertice-library/src/app/lib/interface/control-value-accessor.interface';
import { select, Store } from '@ngrx/store';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { noop, of, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';
import { RootState } from '../../../../../../store/models/root.models';
import {
  ReferralVendor,
  VendorSelectionMode
} from '../../../store/models/make-a-referral.models';
import {
  getVendorAutoPopulation,
  getVendors,
  getVendorSelectionMode
} from '../../../store/selectors/makeReferral.selectors';
import { ServiceType } from '../../make-a-referral-shared';
import { isEmpty } from 'lodash';

interface CheckboxList {
  checkbox: FormControl;
  value: ReferralVendor;
}

@Component({
  selector: 'healthe-vendors-selector',
  templateUrl: './vendors-selector.component.html',
  styleUrls: ['./vendors-selector.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: VendorsSelectorComponent }
  ]
})
export class VendorsSelectorComponent extends DestroyableComponent
  implements
    MatFormFieldControl<ReferralVendor[]>,
    HealtheControlValueAccessor<ReferralVendor[]>,
    OnInit,
    OnChanges,
    OnDestroy {
  static nextInstanceID = 0;
  @Input()
  sectionName: string;
  @Input()
  vendorsSelected: { code: string; name: string }[];
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  checkedList: CheckboxList[] = [];
  instanceID = 0;
  stateChanges = new Subject<void>();
  REORDER_SELECT = VendorSelectionMode.REORDER_SELECT;
  REORDER_ONLY = VendorSelectionMode.REORDER_ONLY;
  READ_ONLY = VendorSelectionMode.READ_ONLY;
  // Get the service type, transportation is default if not provided
  @Input()
  serviceType: ServiceType;
  public vendorSelectionMode$ = of(null);
  public vendors$ = of([]);
  public vendorAutoPopulation$ = of(true);
  @HostBinding()
  id = `healthe-vendors-selector-${this.instanceID}`;
  @HostBinding('attr.aria-describedby') describedBy = '';
  controlType = 'healthe-vendors-selector';
  errorState = false;
  focused = false;
  public _onChange: (value: any) => void = noop;
  public _onTouched = noop;
  checkboxFormArray = new FormArray([]);

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    fb: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    public store$: Store<RootState>
  ) {
    super();
    this.instanceID = VendorsSelectorComponent.nextInstanceID++;

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  _value: ReferralVendor[] = [];

  get value(): ReferralVendor[] {
    return this._value;
  }

  set value(val: ReferralVendor[]) {
    if (val instanceof Array) {
      this.buildAndSetValueList(val, undefined, undefined);
    }
  }

  _placeholder = '';

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
  }

  get empty() {
    if (this._value == null) {
      return true;
    }
    return this._value.length > 0;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  _required = false;

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  _disabled = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    this.stateChanges.next();
  }

  onContainerClick(event: MouseEvent) {}

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  writeValue(value: ReferralVendor[]) {
    if (value instanceof Array) {
      this.buildAndSetValueList(value, undefined, undefined);
    }
  }

  setValue(value: ReferralVendor[]) {}

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  ngOnInit() {
    // Init the observables from the store, we need the serviceType Input for this.
    this.vendorSelectionMode$ = this.store$.pipe(
      takeUntil(this.onDestroy$),
      select(getVendorSelectionMode(this.serviceType))
    );
    this.vendors$ = this.store$.pipe(
      takeUntil(this.onDestroy$),
      select(getVendors(this.serviceType)),
      filter((vendors) => !isEmpty(vendors)),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
    this.vendorAutoPopulation$ = this.store$.pipe(
      takeUntil(this.onDestroy$),
      select(getVendorAutoPopulation(this.serviceType))
    );
    this.vendors$
      .pipe(
        withLatestFrom(this.vendorAutoPopulation$, this.vendorSelectionMode$)
      )
      .subscribe(([vendors, vendorAutoPopulation, vendorSelectionMode]) => {
        this.buildAndSetValueList(
          vendors,
          vendorAutoPopulation,
          vendorSelectionMode
        );
      });
    this.checkboxFormArray.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.notifyValueChange());
  }

  buildAndSetValueList(
    vendorOptions: ReferralVendor[],
    autoPopulation: boolean,
    vendorSelectionMode: VendorSelectionMode
  ) {
    if (null == vendorOptions) {
      return;
    }
    // If loading from draft, the ngControl value should be pre-populated
    this.buildUserInputList(vendorOptions, autoPopulation, vendorSelectionMode);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes.vendorsSelected &&
      changes.vendorsSelected.currentValue
    ) {
      this.checkedList.forEach((control) => {
        const selected = this.isInVendorsSelectedList(
          control.value.code.toLocaleLowerCase()
        );
        control.checkbox.patchValue(selected);
      });
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  array_move(arr: CheckboxList[], old_index: number, new_index: number) {
    if (new_index >= arr.length) {
      let k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  }

  moveUp(index: number) {
    if (index === 0) {
      return;
    }

    this.array_move(this.checkedList, index, index - 1);
    this.notifyValueChange();
  }

  moveDown(index: number) {
    if (index === this.checkedList.length - 1) {
      return;
    }

    this.array_move(this.checkedList, index, index + 1);
    this.notifyValueChange();
  }

  notifyValueChange() {
    const newValue: ReferralVendor[] = this.getValue();
    this._value = newValue;
    this._onChange(newValue);
    this.stateChanges.next();
  }

  getValue(): ReferralVendor[] {
    return this.checkedList
      .filter((obj) => obj.checkbox.value)
      .map((obj) => obj.value);
  }

  private buildUserInputList(
    vendorOptions: ReferralVendor[],
    autoPopulation: boolean,
    vendorSelectionMode: VendorSelectionMode
  ) {
    if (vendorSelectionMode === VendorSelectionMode.REORDER_SELECT) {
      this.checkboxFormArray.clear();
    }
    const previousSelection = this.ngControl.value;
    this.checkedList = vendorOptions.map((value, i) => {
      let isChecked =
        !!autoPopulation ||
        vendorSelectionMode !== VendorSelectionMode.REORDER_SELECT ||
        (!autoPopulation && !vendorSelectionMode);

      if (
        previousSelection.length > 0 &&
        vendorSelectionMode !== VendorSelectionMode.REORDER_ONLY
      ) {
        isChecked =
          previousSelection.map((v) => v.code).indexOf(value.code) > -1;
      }

      const checkbox: FormControl = new FormControl(isChecked);
      if (vendorSelectionMode === VendorSelectionMode.REORDER_SELECT) {
        this.checkboxFormArray.setControl(i, checkbox);
      }
      return { checkbox: checkbox, value: value };
    });
    this.notifyValueChange();
  }

  private isInVendorsSelectedList(value: string): boolean {
    if (null == this.vendorsSelected) {
      return false;
    }
    const index = this.vendorsSelected.findIndex(
      (vendorSelected) => vendorSelected.code.toLowerCase() === value
    );
    return index >= 0;
  }
}
