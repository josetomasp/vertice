import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { RootState } from '../../../../../../store/models/root.models';
import { ClaimLocation } from '../../../store/models/make-a-referral.models';
import { getApprovedLocations } from '../../../store/selectors/makeReferral.selectors';
import { ServiceType } from '../../make-a-referral-shared';
import { MakeAReferralService } from '../../make-a-referral.service';
import { TRANSPORTATION_ARCH_TYPE } from '../../transportation/transportation-step-definitions';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

// TODO: Eventually this component and the old ApprovedLocationsFormComponent should be merged
@Component({
  selector: 'healthe-approved-locations-with-location-limits',
  templateUrl: './approved-locations-with-location-limits-form.component.html',
  styleUrls: ['./approved-locations-with-location-limits-form.component.scss'],
  providers: []
})
export class ApprovedLocationsWithLocationLimitsFormComponent
  extends DestroyableComponent
  implements OnInit {
  Object = Object;
  @ViewChild('selectAllCheckbox', { static: true })
  selectAllCheckbox: MatCheckbox;
  @ViewChild('noLocationRestrictionsCheckbox', { static: true })
  noRestrictionsCheckbox: MatCheckbox;

  // We need to provide the parent service type.
  // Transportation is the default value.
  @Input()
  selectedService: ServiceType = TRANSPORTATION_ARCH_TYPE;
  @Input()
  isReadOnlyForm: boolean = false;

  public approvedLocations$: Observable<ClaimLocation[]> = of([]);

  allLocationsFormGroup: FormGroup = new FormGroup({});

  constructor(
    public store$: Store<RootState>,
    private makeAReferralService: MakeAReferralService
  ) {
    super();
  }

  _openAuthFormGroup: FormGroup = new FormGroup({});

  get openAuthFormGroup(): FormGroup {
    return this._openAuthFormGroup;
  }

  @Input()
  set openAuthFormGroup(parentFormGroup: FormGroup) {
    if (parentFormGroup.get('approvedLocations')) {
      this.allLocationsFormGroup = parentFormGroup.get(
        'approvedLocations'
      ) as FormGroup;
      this._openAuthFormGroup = parentFormGroup;
    }
  }

  ngOnInit() {
    this.approvedLocations$ = this.store$.pipe(
      select(getApprovedLocations(this.selectedService))
    );

    this._openAuthFormGroup
      .get('noLocationRestrictions')
      .valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe((noLocationRestrictions) =>
        this.toggleSectionDisable(noLocationRestrictions)
      );

    if (this.isReadOnlyForm) {
      this._openAuthFormGroup.disable();
    }

    // Update the 'select all' properly when one of the children forms are updated
    // distinctUntilChanged to make sure that the selected locations themselves are
    // changing and not something like the 'no location selections' box
    this.allLocationsFormGroup.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        filter((values) => values),
        distinctUntilChanged(
          (valuesA, valuesB) =>
            JSON.stringify(valuesA) === JSON.stringify(valuesB)
        )
      )
      .subscribe((values) => {
        let allChecked = true;
        Object.keys(values).forEach((type) => {
          Object.keys(values[type]).forEach((location) => {
            if (values[type][location]['locationSelected'] === false) {
              allChecked = false;
            }
          });
        });
        this.selectAllCheckbox.checked = allChecked;
      });
  }

  showAddLocationModal() {
    this.makeAReferralService.displayAddLocationModal({
      selectedServiceType: this.selectedService,
      enablePhysicianSpecialtyDropdown:
        this.selectedService === TRANSPORTATION_ARCH_TYPE
    });
  }

  toggleAllCheckboxes(checked: boolean) {
    if (checked) {
      this.selectAllCheckbox.checked = checked;
      this.noRestrictionsCheckbox.writeValue(false);
      this.toggleSectionDisable(false);
    }

    let shouldSelectAll = false;
    // If any value is not selected then when choosing select all it should select all boxes
    // In any other case, we should deselect all boxes
    Object.keys(this.allLocationsFormGroup.controls).forEach((type) => {
      let typedGroup: FormGroup = this.allLocationsFormGroup.controls[
        type
      ] as FormGroup;

      Object.keys(typedGroup.controls).forEach((controlKey) => {
        if (
          typedGroup.controls[controlKey].get('locationSelected').value ===
          false
        ) {
          shouldSelectAll = true;
        }
      });
    });

    // After determining if we're selected or deselecting all, go do that
    Object.keys(this.allLocationsFormGroup.controls).forEach((type) => {
      let typedGroup: FormGroup = this.allLocationsFormGroup.controls[
        type
      ] as FormGroup;

      Object.keys(typedGroup.controls).forEach((controlKey) => {
        typedGroup.controls[controlKey]
          .get('locationSelected')
          .patchValue(shouldSelectAll);
      });
    });

    this.allLocationsFormGroup.markAsDirty();
  }

  toggleSectionDisable(checked: boolean) {
    if (this.selectAllCheckbox !== undefined) {
      if (checked || this.isReadOnlyForm) {
        this.selectAllCheckbox.setDisabledState(true);
        this.allLocationsFormGroup.disable();
      } else {
        this.selectAllCheckbox.setDisabledState(false);
        this.allLocationsFormGroup.enable();
      }
    }
  }
}
