import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';
import {
  AbstractFormGroupNamePassThrough,
  getParentFormGroup,
  getParentPath
} from '@modules/form-validation-extractor';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormGroupName
} from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { VendorStepConfig } from '@modules/generic-wizard/generic-wizard.models';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { first, takeUntil } from 'rxjs/operators';
import { HealtheSelectOption } from '@shared';
import { GenericWizardStore } from '@modules/generic-wizard/generic-wizard.store';

interface CheckboxList {
  checkbox: FormControl;
  value: HealtheSelectOption<string>;
}

@Component({
  selector: 'healthe-vendors-step',
  templateUrl: './vendors-step.component.html',
  styleUrls: ['./vendors-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorsStepComponent
  implements AbstractFormGroupNamePassThrough, OnInit, OnDestroy
{
  static nextInstanceID = 0;

  @Input()
  config: VendorStepConfig;

  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  checkedList: CheckboxList[] = [];
  checkboxFormArray = new FormArray([]);
  instanceID = 0;

  public vendors$: Observable<HealtheSelectOption<string>[]> =
    this.store.getOptionByFormControlName('vendors');
  @HostBinding()
  id = `healthe-kinect-vendors-selector-${this.instanceID}`;

  vendorsSelectionOptionsNote =
    'place holder note to give the user some instructions.';
  something: HealtheSelectOption<string>;
  @HostBinding('click')
  onClick() {
    this.parentFormGroup.markAsTouched();
  }
  constructor(
    @Inject(ControlContainer) @Optional() public parent: FormGroupName,
    @Inject(FormGroupDirective)
    @Optional()
    public formGroupDirective: FormGroupDirective,
    public changeDetectorRef: ChangeDetectorRef,
    public store: GenericWizardStore<any>
  ) {
    this.instanceID = VendorsStepComponent.nextInstanceID++;
  }

  get parentFormGroup(): FormGroup | null {
    return getParentFormGroup(this.formGroupDirective, this.parent);
  }

  get parentPath(): string[] {
    return getParentPath(this.parent);
  }

  onDestroy$: Subject<void> = new Subject();

  ngOnInit(): void {
    this.vendors$
      .subscribe((vendors) => this.buildUserInputList(vendors));
    this.checkboxFormArray.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.updateVendorsValue();
      });

    // Set up the vendor note text
    if (this.config.vendorChangeAllowed && this.config.priorityChangeAllowed) {
      this.vendorsSelectionOptionsNote =
        'Check vendors you wish to select and order them in your preferred servicing order.';
    } else if (this.config.vendorChangeAllowed) {
      this.vendorsSelectionOptionsNote =
        'Check vendors you wish to select, you must select at least one vendor.';
    } else if (this.config.priorityChangeAllowed) {
      this.vendorsSelectionOptionsNote =
        'Change the order of the vendors by clicking the arrows.';
    } else {
      this.vendorsSelectionOptionsNote =
        'This is the default vendor preference order. Vendor order is not editable.';
    }
  }

  updateVendorsValue() {
    this.parentFormGroup.markAsTouched();
    let value = this.checkedList
      .filter((obj) => obj.checkbox.value)
      .map((obj) => obj.value.value);
    this.parentFormGroup.setValue(value);
    this.changeDetectorRef.detectChanges();
  }

  isReadOnly(): boolean {
    return (
      !this.config.vendorChangeAllowed && !this.config.priorityChangeAllowed
    );
  }

  private buildUserInputList(vendorOptions: HealtheSelectOption<string>[]) {
    this.checkedList = vendorOptions.map((value, i) => {
      // If it is auto populated OR if you can't check/uncheck vendors, then the starting state is checked.
      let isChecked =
        this.config.autoPopulation || !this.config.vendorChangeAllowed;

      const checkbox: FormControl = new FormControl(isChecked);
      this.checkboxFormArray.setControl(i, checkbox);
      return { checkbox: checkbox, value: value };
    });

    this.updateVendorsValue();
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
    this.updateVendorsValue();
  }

  moveDown(index: number) {
    if (index === this.checkedList.length - 1) {
      return;
    }

    this.array_move(this.checkedList, index, index + 1);
    this.updateVendorsValue();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
