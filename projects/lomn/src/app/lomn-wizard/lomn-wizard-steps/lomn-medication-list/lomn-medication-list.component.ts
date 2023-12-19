import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { LOMNLineItemFormValue } from '../../../store/models/create-lomn.models';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';

@Component({
  selector: 'healthe-lomn-medication-list',
  templateUrl: './lomn-medication-list.component.html',
  styleUrls: ['../../lomn-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LomnMedicationListComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject();

  @Input()
  showValidationMessage: boolean;
  @Input()
  medicationListOptions$: Observable<
    {
      value: LOMNLineItemFormValue;
      label: string;
      elementName?: string;
      isDisabled?: boolean;
    }[]
  >;
  @Input()
  medicationListFormControl: FormArray;
  @Input()
  selectedDrugNdc$: Observable<string> = of(null);
  allSelected = false;
  medicationListFormArray = new FormArray([]);
  medicationListOptions = [];

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.medicationListFormArray.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        withLatestFrom(this.medicationListOptions$),
        filter(
          ([, medicationListOptions]) =>
            medicationListOptions && medicationListOptions.length > 0
        )
      )
      .subscribe(([values, medicationListOptions]) => {
        this.medicationListFormControl.clear();
        values
          .map((isSelected, i) => {
            if (medicationListOptions[i].value.compound) {
              medicationListOptions[i].label = 'Compound';
            }
            if (isSelected) {
              const {
                prescriberFax,
                ndc,
                prescriber,
                drugDisplayName
              } = medicationListOptions[i].value;
              return new FormGroup({
                drugDisplayName: new FormControl(drugDisplayName),
                prescriberFax: new FormControl(
                  prescriberFax,
                  Validators.required
                ),
                displayNotes: new FormControl(''),
                ndc: new FormControl(ndc),
                prescriber: new FormControl(prescriber)
              });
            } else {
              return false;
            }
          })
          .filter((value) => !!value)
          .forEach((med) => this.medicationListFormControl.push(med));

        this.allSelected =
          this.medicationListFormControl.length ===
          medicationListOptions.length;
      });

    combineLatest([this.medicationListOptions$, this.selectedDrugNdc$])
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged((x, y) => x[0].length === y[0].length)
      )
      .subscribe(([options, selectedOption]) => {
        if (options && options.length > 0) {
          let selectedOptionIndex = -1;
          this.medicationListFormArray.clear();
          this.medicationListOptions = options.map((option, index) => {
            if (
              selectedOption !== null &&
              option.value.ndc === selectedOption
            ) {
              selectedOptionIndex = index;
            }
            this.medicationListFormArray.push(new FormControl(false));
            return option;
          });
          this.allSelected = false;
          this.changeDetectorRef.detectChanges();
          this.checkIfPreSelected(selectedOptionIndex);
        }
      });
  }

  checkIfPreSelected(selectedOptionIndex: number) {
    if (selectedOptionIndex >= 0) {
      let preSelectedControl = this.medicationListFormArray.controls[
        selectedOptionIndex
      ];
      preSelectedControl.markAsTouched();
      preSelectedControl.setValue(true);
    }
  }

  toggleAll(event: any) {
    const currentValue = this.medicationListFormArray.value;
    this.medicationListFormArray.setValue(
      currentValue.map(() => event.checked)
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
