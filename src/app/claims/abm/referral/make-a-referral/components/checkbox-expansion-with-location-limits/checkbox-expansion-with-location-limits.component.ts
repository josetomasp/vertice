import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatExpansionPanel } from '@angular/material/expansion';
import { replaceAllWhiteSpaces } from '@shared';
import { ClaimLocation } from '../../../store/models/make-a-referral.models';
import { referralLocationToFullString } from '../../make-a-referral-shared';
import { takeUntil } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { AuthorizationInformationService } from '../../../referralId/referral-authorization/authorization-information.service';

// TODO: Eventually this component and the old CheckboxExpansionComponent should be merged
@Component({
  selector: 'healthe-checkbox-expansion-with-location-limits',
  templateUrl: './checkbox-expansion-with-location-limits.component.html',
  styleUrls: ['./checkbox-expansion-with-location-limits.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(
        () => CheckboxExpansionWithLocationLimitsComponent
      ),
      multi: true
    }
  ]
})
export class CheckboxExpansionWithLocationLimitsComponent
  extends DestroyableComponent
  implements OnInit {
  replaceAllWhiteSpaces = replaceAllWhiteSpaces;
  Object = Object;
  selectAllCheckbox: MatCheckbox;
  @ViewChild(MatExpansionPanel, { static: true })
  expansionPanel: MatExpansionPanel;
  @Input()
  locationsFormGroup = new FormGroup({});
  @Input()
  specifyTripsByLocationControl: FormControl;
  @Input()
  headerText: string;
  @Input()
  serviceActionType: string = '';
  @Input()
  locations: ClaimLocation[] = [];

  expansionGroupDisabled = false;
  expandWidgetHidden = false;

  primaryCheckbox: FormControl;
  primaryCheckBoxId = '';

  subItemCheckBoxIDs = {};

  constructor(
    private authorizationActionsService: AuthorizationInformationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  @ViewChild('selectAllCheckbox', { static: true })
  set content(content: MatCheckbox) {
    this.selectAllCheckbox = content;
  }

  ngOnInit() {
    this.primaryCheckbox = this.locationsFormGroup
      .get(Object.keys(this.locationsFormGroup.controls)[0])
      .get('locationSelected') as FormControl;

    this.setSelectAllAndIndeterminate(true);

    this.locationsFormGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.setSelectAllAndIndeterminate(false));

    this.authorizationActionsService.showValidationErrors
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.changeDetectorRef.detectChanges());

    this.primaryCheckBoxId =
      this.serviceActionType +
      '_singleLocationSelected_' +
      this.headerText +
      '-' +
      replaceAllWhiteSpaces(
        this.getBodyControlDisplayText(
          Object.keys(this.locationsFormGroup.controls)[0]
        ),
        '_'
      ) +
      '_checkbox';

    Object.keys(this.locationsFormGroup.controls).forEach((key) => {
      this.subItemCheckBoxIDs[key] =
        this.serviceActionType +
        '_locationSelected_' +
        replaceAllWhiteSpaces(this.getBodyControlDisplayText(key), '_') +
        '_checkbox';
    });
  }

  setSelectAllAndIndeterminate(firstInit: boolean): void {
    // values doesn't contain whether the form is disabled, but appears to
    // emit when the disabled state toggles so close the panel if the controls
    // are currently disabled
    this.expansionGroupDisabled = false;
    this.expandWidgetHidden = false;
    if (this.primaryCheckbox.disabled) {
      this.expansionPanel.close();
      this.expansionGroupDisabled = true;
    }
    if (Object.keys(this.locationsFormGroup.controls).length === 1) {
      this.expansionGroupDisabled = true;
      this.expandWidgetHidden = true;
    }

    let allChecked = true;
    let someChecked = false;
    let someUnchecked = false;

    Object.keys(this.locationsFormGroup.controls).forEach((controlKey) => {
      if (
        this.locationsFormGroup.controls[controlKey].get('locationSelected')
          .value === false
      ) {
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

    if (
      firstInit &&
      false === this.expansionGroupDisabled &&
      (allChecked || someChecked)
    ) {
      this.expansionPanel.open();
    }
  }

  toggleAll(event) {
    if (
      !this.locationsFormGroup.get(
        Object.keys(this.locationsFormGroup.controls)[0]
      ).disabled
    ) {
      // This is to stop some outer components click event from firing, ie: the expand / collapse in the header of an expansion panel.
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.selectAllCheckbox.checked = !this.selectAllCheckbox.checked;

      let shouldSelectAll = false;
      Object.keys(this.locationsFormGroup.controls).forEach((controlKey) => {
        if (
          this.locationsFormGroup.controls[controlKey].get('locationSelected')
            .value === false
        ) {
          shouldSelectAll = true;
        }
      });

      Object.keys(this.locationsFormGroup.controls).forEach((controlKey) => {
        if (
          this.locationsFormGroup.controls[controlKey].get('locationSelected')
            .value !== shouldSelectAll
        ) {
          this.locationsFormGroup.controls[controlKey]
            .get('locationSelected')
            .markAsDirty();
        }

        this.locationsFormGroup.controls[controlKey]
          .get('locationSelected')
          .patchValue(shouldSelectAll);
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

  toggleCheckBox(locationSelected: AbstractControl) {
    if (!locationSelected.disabled) {
      locationSelected.setValue(!locationSelected.value);
    }
  }

  getLocationTripCountFormControl(controlKey: string): FormControl {
    return this.locationsFormGroup
      .get(controlKey)
      .get('locationTripCount') as FormControl;
  }

  getLocationSelectedFormControl(controlKey: string): FormControl {
    return this.locationsFormGroup
      .get(controlKey)
      .get('locationSelected') as FormControl;
  }
}
