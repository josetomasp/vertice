import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatExpansionPanel } from '@angular/material/expansion';
import { replaceAllWhiteSpaces } from '@shared';
import { ClaimLocation } from '../../../store/models/make-a-referral.models';
import { referralLocationToFullString } from '../../make-a-referral-shared';

@Component({
  selector: 'healthe-checkbox-expansion',
  templateUrl: './checkbox-expansion.component.html',
  styleUrls: ['./checkbox-expansion.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxExpansionComponent),
      multi: true
    }
  ]
})
export class CheckboxExpansionComponent implements OnInit {
  replaceAllWhiteSpaces = replaceAllWhiteSpaces;
  Object = Object;
  selectAllCheckbox: MatCheckbox;

  expansionGroupDisabled = false;
  expandWidgetHidden = false;

  primaryCheckbox: FormControl;

  @ViewChild('selectAllCheckbox', { static: true })
  set content(content: MatCheckbox) {
    this.selectAllCheckbox = content;
  }

  @ViewChild(MatExpansionPanel, { static: true })
  expansionPanel: MatExpansionPanel;

  @Input()
  formGroup = new FormGroup({});

  @Input()
  headerText: string;

  @Input()
  serviceActionType: string = '';

  @Input()
  locations: ClaimLocation[] = [];

  showExpansion: boolean = false;

  constructor() {}

  ngOnInit() {
    this.setOptionListState();
    this.formGroup.valueChanges.subscribe((values) => {
      this.setOptionListState();
    });
  }

  setOptionListState() {
    this.primaryCheckbox = this.formGroup.get(
      Object.keys(this.formGroup.controls)[0]
    ) as FormControl;
    Object.keys(this.formGroup.controls).length > 1
      ? (this.showExpansion = true)
      : (this.showExpansion = false);
    // values doesn't contain whether the form is disabled, but appears to
    // emit when the disabled state toggles so close the panel if the controls
    // are currently disabled
    this.expansionGroupDisabled = false;
    this.expandWidgetHidden = false;
    if (this.primaryCheckbox.disabled) {
      this.expansionPanel.close();
      this.expansionGroupDisabled = true;
    }
    if (Object.keys(this.formGroup.controls).length === 1) {
      this.expansionGroupDisabled = true;
      this.expandWidgetHidden = true;
    }

    let allChecked = true;
    let someChecked = false;
    let someUnchecked = false;

    Object.keys(this.formGroup.controls).forEach((controlKey) => {
      if (this.formGroup.controls[controlKey].value === false) {
        allChecked = false;
        someUnchecked = true;
      } else {
        someChecked = true;
      }
    });

    if (someChecked && someUnchecked) {
      this.selectAllCheckbox.indeterminate = true;
      this.selectAllCheckbox.checked = false;
    } else {
      this.selectAllCheckbox.checked = allChecked;
      this.selectAllCheckbox.indeterminate = false;
    }
  }

  toggleAll(event) {
    if (!this.formGroup.get(Object.keys(this.formGroup.controls)[0]).disabled) {
      // This is to stop some outer components click event from firing, ie: the expand / collapse in the header of an expansion panel.
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.selectAllCheckbox.checked = !this.selectAllCheckbox.checked;

      let shouldSelectAll = false;
      Object.keys(this.formGroup.controls).forEach((controlKey) => {
        if (this.formGroup.controls[controlKey].value === false) {
          shouldSelectAll = true;
        }
      });

      Object.keys(this.formGroup.controls).forEach((controlKey) => {
        this.formGroup.controls[controlKey].patchValue(shouldSelectAll);
      });
    }
  }

  getBodyControlDisplayText(text: string) {
    if (text && text.startsWith(this.headerText)) {
      // Remove leading non-word characters after trimming the headerText
      return text.substr(this.headerText.length).replace(/(^\W+)/g, '');
    }
    return text;
  }

  getAddressDisplayFromID(id) {
    const location = this.locations.find((l) => {
      return l.id.toString() === id;
    });
    return referralLocationToFullString(location);
  }

  getFormControlByLocationId(locationId: string): FormControl {
    return this.formGroup.get(locationId) as FormControl;
  }
}
