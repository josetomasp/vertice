import {
  AfterViewInit,
  Component,
  forwardRef,
  Inject,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatStep } from '@angular/material/stepper';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, skip, takeUntil } from 'rxjs/operators';

import { RootState } from '../../../../../../store/models/root.models';
import { ClaimLocation } from '../../../store/models/make-a-referral.models';
import {
  getApprovedLocations,
  isSavingNewTransportationLocation
} from '../../../store/selectors/makeReferral.selectors';
import { ServiceType } from '../../make-a-referral-shared';
import { MakeAReferralService } from '../../make-a-referral.service';
import { TRANSPORTATION_ARCH_TYPE } from '../../transportation/transportation-step-definitions';
import {
  LoadingModalComponent
} from '@shared/components/loading-modal/loading-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';

@Component({
  selector: 'healthe-approved-locations-form',
  templateUrl: './approved-locations-form.component.html',
  styleUrls: ['./approved-locations-form.component.scss'],
  providers: []
})
export class ApprovedLocationsFormComponent extends DestroyableComponent implements OnInit, AfterViewInit {
  Object = Object;
  @ViewChild('selectAllCheckbox')
  selectAllCheckbox: MatCheckbox;
  @ViewChild('noLocationRestrictionsCheckbox')
  noRestrictionsCheckbox: MatCheckbox;

  // We need to provide the parent service type.
  // Transportation is the default value.
  @Input()
  selectedService: ServiceType = TRANSPORTATION_ARCH_TYPE;

  @Input()
  idPrefix = '';
  @Input()
  withTwoLocations: boolean;
  faPlus = faPlus;

  public approvedLocations$: Observable<ClaimLocation[]> = of([]);
  isSavingTransportationLocation$: Observable<boolean> = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(isSavingNewTransportationLocation)
  );
  isSavingTransportationLocation: boolean = false;
  loadingDialog: MatDialogRef<LoadingModalComponent, any>;

  allLocationsFormGroup: FormGroup = new FormGroup({});
  @Input()
  serviceActionType: string = '';

  constructor(
    public store$: Store<RootState>,
    private makeAReferralService: MakeAReferralService,
    private dialog: MatDialog,
    @Inject(forwardRef(() => MatStep)) public step: MatStep
  ) {
    super();
  }

  _parentFormGroup: FormGroup = new FormGroup({
    noLocationRestrictions: new FormControl(false)
  });

  get parentFormGroup(): FormGroup {
    return this._parentFormGroup;
  }

  @Input()
  set parentFormGroup(parentFormGroup: FormGroup) {
    this._parentFormGroup = parentFormGroup;
  }

  ngOnInit() {
    this.approvedLocations$ = this.store$.pipe(
      select(getApprovedLocations(this.selectedService))
    );

    // Populate form group - adding new control only if it doesn't exist
    // this.allLocationsFormGroup contains FormGroups with control names of the
    // location types ('Doctor', 'Pharmacy', etc.) and these FormGroups
    // contain FormControls for each individual location.
    this.approvedLocations$.subscribe((referralLocations) => {
      const selectedLocationIds =
        this.parentFormGroup.get('approvedLocations').value || [];
      referralLocations.forEach((location: ClaimLocation) => {
        let typedLocationsFormGroup: FormGroup = this.allLocationsFormGroup.get(
          location.type
        ) as FormGroup;
        if (!typedLocationsFormGroup) {
          typedLocationsFormGroup = new FormGroup({});
          typedLocationsFormGroup.addControl(
            location.id,
            new FormControl({
              value: selectedLocationIds.includes(Number(location.id)),
              disabled:
                this.parentFormGroup.get('noLocationRestrictions') &&
                this.parentFormGroup.get('noLocationRestrictions').value
            })
          );
          this.allLocationsFormGroup.addControl(
            location.type,
            typedLocationsFormGroup
          );
        } else {
          typedLocationsFormGroup.addControl(
            location.id,
            new FormControl({
              value: selectedLocationIds.includes(Number(location.id)),
              disabled:
                this.parentFormGroup.get('noLocationRestrictions') &&
                this.parentFormGroup.get('noLocationRestrictions').value
            })
          );
        }
        this.parentFormGroup.get('noLocationRestrictions') &&
        this.parentFormGroup.get('noLocationRestrictions').value
          ? typedLocationsFormGroup.disable()
          : typedLocationsFormGroup.enable();
      });
    });

    // Update the 'select all' properly when one of the children forms are updated
    // distinctUntilChanged to make sure that the selected locations themselves are
    // changing and not something like the 'no location selections' box
    this.allLocationsFormGroup.valueChanges
      .pipe(
        filter((values) => values),
        skip(1),
        distinctUntilChanged(
          (valuesA, valuesB) =>
            JSON.stringify(valuesA) === JSON.stringify(valuesB)
        )
      )
      .subscribe((values) => {
        let allChecked = true;
        const selectedLocations = [];
        if (values) {
          Object.keys(values).forEach((type) => {
            Object.keys(values[type]).forEach((location) => {
              if (values[type][location] === false) {
                allChecked = false;
              } else {
                selectedLocations.push(location);
              }
            });
          });
        }
        this.selectAllCheckbox.checked = allChecked;
        try {
          if (this.parentFormGroup.get('approvedLocations')) {
            this.parentFormGroup
              .get('approvedLocations')
              .patchValue(selectedLocations);
          } else {
            this.parentFormGroup.setControl(
              'approvedLocations',
              new FormControl(selectedLocations)
            );
          }
        } catch (e) {
          console.error(e);
        }
      });

    this.isSavingTransportationLocation$.subscribe((isSavingTransportationLocation) => {
      this.isSavingTransportationLocation = isSavingTransportationLocation;
      if (isSavingTransportationLocation) {
        this.loadingDialog = this.dialog.open(LoadingModalComponent, {
          width: '700px',
          height: 'auto',
          data: 'Submitting Request...'
        });
      } else {
        if (this.loadingDialog) {
          this.loadingDialog.close();
        }
      }
    });
  }

  ngAfterViewInit() {
    this.toggleSectionDisable(
      this.parentFormGroup.get('noLocationRestrictions') &&
        this.parentFormGroup.get('noLocationRestrictions').value
    );
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
        if (typedGroup.controls[controlKey].value === false) {
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
        typedGroup.controls[controlKey].patchValue(shouldSelectAll);
      });
    });
  }

  toggleSectionDisable(checked: boolean) {
    if (checked) {
      this.selectAllCheckbox.setDisabledState(true);
      this.allLocationsFormGroup.disable();
    } else {
      this.selectAllCheckbox.setDisabledState(false);
      this.allLocationsFormGroup.enable();
    }
  }
}
