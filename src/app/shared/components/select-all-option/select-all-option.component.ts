import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatOption, MatPseudoCheckboxState } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { takeWhile } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  selector: 'healthe-select-all-option',
  templateUrl: './select-all-option.component.html'
})
export class SelectAllOptionComponent implements OnInit, OnDestroy {
  @Input()
  set select(select: MatSelect) {
    this._select = select;
    if (!this._select.multiple) {
      console.warn(
        '[ Warning ] This component needs to be used with a multi select component!'
      );
    }
  }

  private alive = false;
  private _select: MatSelect;
  state: MatPseudoCheckboxState = 'unchecked';

  constructor() {}

  ngOnInit() {
    this.alive = true;
    merge(
      this._select.valueChange,
      this._select.openedChange,
      this._select.optionSelectionChanges
    )
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.evaluateCheckboxState();
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  toggle() {
    if (this.state !== 'checked') {
      this._select.options.forEach((option) => option.select());
    } else {
      this._select.options.forEach((option) => option.deselect());
    }
  }

  private evaluateCheckboxState() {
    const options = this._select.options.toArray();
    if (this.allChecked(options)) {
      this.state = 'checked';
    } else {
      this.state = 'unchecked';
    }
  }

  private allChecked(options: Array<MatOption>) {
    for (let i = 0; i < options.length; ++i) {
      if (!options[i].selected) {
        return false;
      }
    }
    return true;
  }
}
