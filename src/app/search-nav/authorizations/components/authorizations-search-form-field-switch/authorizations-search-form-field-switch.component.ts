import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { NgxDrpOptions } from '@healthe/vertice-library';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import * as _moment from 'moment';
import { first, takeUntil } from 'rxjs/operators';

import { SpecificDateFormFieldType } from '../../../../claims/abm/referral/make-a-referral/components/specific-date-form-array/specific-date-form-config';
import { SearchNavFormField } from '../../../shared/SearchNavTypes';

const moment = _moment;

@Component({
  selector: 'healthe-authorizations-search-form-field-switch',
  templateUrl: './authorizations-search-form-field-switch.component.html',
  styleUrls: ['./authorizations-search-form-field-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationsSearchFormFieldSwitchComponent
  extends DestroyableComponent
  implements OnInit {
  @Input()
  searchFormFieldConfig: SearchNavFormField;
  SpecificDateFormFieldType = SpecificDateFormFieldType;
  dateRangerPickerOptions: NgxDrpOptions = {
    calendarOverlayConfig: {
      panelClass: 'ngx-mat-drp-overlay',
      hasBackdrop: true,
      backdropClass: 'ngx-mat-drp-overlay-backdrop',
      shouldCloseOnBackdropClick: true
    },
    presets: [
      {
        presetLabel: 'Past Month',
        range: {
          fromDate: moment()
            .subtract(1, 'month')
            .toDate(),
          toDate: moment().toDate()
        }
      },
      {
        presetLabel: 'Past 3 Months',
        range: {
          fromDate: moment()
            .subtract(3, 'month')
            .toDate(),
          toDate: moment().toDate()
        }
      },
      {
        presetLabel: 'Past 6 Months',
        range: {
          fromDate: moment()
            .subtract(6, 'month')
            .toDate(),
          toDate: moment().toDate()
        }
      },
      {
        presetLabel: 'Past Year',
        range: {
          fromDate: moment()
            .subtract(1, 'year')
            .toDate(),
          toDate: moment().toDate()
        }
      }
    ],
    format: 'mediumDate'
  };

  // Used to enable virtual scrolling support for the select menu since we had some lists of over 4000 options
  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewPort: CdkVirtualScrollViewport;
  // Helper method just so we don't need to see the subscribe in the logic
  infoI = faInfoCircle;

  constructor() {
    super();
  }

  ngOnInit() {
    if (
      this.searchFormFieldConfig.type ===
      SpecificDateFormFieldType.SelectVirtualScroll
    ) {
      (this.searchFormFieldConfig.formState as FormControl).valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((value) => {
          let selectedIndex = this.getSelectedIndex();

          // When the cdk virtual scroll enabled select menu is set programmatically to one that is outside of the rendered range.
          //  it doesn't reset the range to one that includes the currently selected item.
          this.cdkVirtualScrollViewPort.setRenderedRange({
            start: selectedIndex,
            end: selectedIndex + 3
          });
        });
    }
  }

  getErrorMessage(errorMessages: { [key: string]: string }) {
    let ctrl = this.searchFormFieldConfig.formState;
    let errorKeys = Object.keys(errorMessages);
    for (let i = 0; i < errorKeys.length; i++) {
      if (ctrl.hasError(errorKeys[i])) {
        return errorMessages[errorKeys[i]];
      }
    }
    return '';
  }

  // This is a simple implementation to get the user in the right

  selectOpenChange($event: boolean) {
    const selectedIndex = this.getSelectedIndex();
    if ($event) {
      // When the cdk virtual scroll enabled select menu opens, it doesn't
      //  automatically 'virtually scroll' to the correct spot so we need to do that here
      this.cdkVirtualScrollViewPort.scrollToIndex(selectedIndex);
      this.cdkVirtualScrollViewPort.checkViewportSize();
    } else {
      // When the cdk virtual scroll enabled select menu closes after the user
      //  scrolls past the rendered range it doesn't reset the range to one that
      //  includes the previously selected item. In my tested I saw the range
      //  close to only cover 4 indices so I'm mimicking that when I set it here
      this.cdkVirtualScrollViewPort.setRenderedRange({
        start: selectedIndex,
        end: selectedIndex + 3
      });
    }
  }

  // spot if list contains a value that starts with the key they press
  selectKeyPressed($event: KeyboardEvent) {
    let startsWithIndex = this.getStartsWithIndex($event.key);
    if (startsWithIndex >= 0) {
      this.cdkVirtualScrollViewPort.scrollToIndex(startsWithIndex);
    }
  }

  // Helper method just so we don't need to see the subscribe in the logic
  getSelectedIndex(): number {
    let selectedIndex: number = -1;

    this.searchFormFieldConfig.options
      .pipe(first())
      .subscribe((selectOptions) => {
        selectedIndex = selectOptions.findIndex(
          (option) =>
            option.value === this.searchFormFieldConfig.formState.value
        );
      });

    return selectedIndex;
  }

  getStartsWithIndex(startsWithString: string): number {
    let startsWithIndex: number = -1;

    this.searchFormFieldConfig.options
      .pipe(first())
      .subscribe((selectOptions) => {
        startsWithIndex = selectOptions.findIndex((option) =>
          (option.value as string)
            .toLowerCase()
            .startsWith(startsWithString.toLowerCase())
        );
      });

    return startsWithIndex;
  }

  compareOptions(
    option: { label: string; value: any },
    selection: { label: string; value: any }
  ) {
    return (
      option !== null && selection !== null && option.value === selection.value
    );
  }
}
