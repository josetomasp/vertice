import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { NgxDrpOptions } from '@healthe/vertice-library';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import {
  AuthorizationSearchFormField,
  AuthorizationSearchFormFieldType
} from '../../authorizations-models';

@Component({
  selector: 'healthe-authorizations-search-form-field-switch-standalone',
  templateUrl: './authorizations-search-form-field-switch-standalone.component.html',
  styleUrls: ['./authorizations-search-form-field-switch-standalone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationsSearchFormFieldSwitchStandaloneComponent
  extends DestroyableComponent
  implements OnInit {
  @Input()
  searchFormFieldConfig: AuthorizationSearchFormField<any, any>;
  @Input()
  searchFormFieldControl: FormControl;
  AuthorizationSearchFormFieldType = AuthorizationSearchFormFieldType;
  defaultDateRangerPickerOptions: NgxDrpOptions = {
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

  infoI = faInfoCircle;

  constructor() {
    super();
  }

  ngOnInit() {
    if (
      this.searchFormFieldConfig.type ===
      AuthorizationSearchFormFieldType.Select
    ) {
      (this.searchFormFieldControl as FormControl).valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
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

  // ngOnChanges(changes: ComponentChanges<AuthorizationsSearchFormFieldSwitchStandaloneComponent>) {
  //   // Needed for when API driven defaults are populated on top of the initial state
  //   console.log('changes: ', changes.searchFormFieldConfig);
  //   console.log('current value: ', this.searchFormFieldControl.value);
  //   // if(changes.searchFormFieldConfig.)
  //   this.searchFormFieldControl.setValue(changes.searchFormFieldConfig.currentValue.defaultValue);
  // }

  getErrorMessage(errorMessages: { [key: string]: string }) {
    let errorKeys = Object.keys(errorMessages);
    for (let i = 0; i < errorKeys.length; i++) {
      if (this.searchFormFieldControl.hasError(errorKeys[i])) {
        return errorMessages[errorKeys[i]];
      }
    }
    return '';
  }

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
    let startsWithIndex = this.searchFormFieldConfig.options.findIndex((option) =>
      (option.value as string)
        .toLowerCase()
        .startsWith($event.key.toLowerCase())
    );
    if (startsWithIndex >= 0) {
      this.cdkVirtualScrollViewPort.scrollToIndex(startsWithIndex);
    }
  }

  getSelectedIndex(): number {
    return this.searchFormFieldConfig.options.findIndex(
      (option) =>
        option.value === this.searchFormFieldControl.value
    );
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
