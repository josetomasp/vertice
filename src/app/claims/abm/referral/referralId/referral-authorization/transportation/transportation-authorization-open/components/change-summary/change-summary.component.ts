import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';

@Component({
  selector: 'healthe-change-summary',
  templateUrl: './change-summary.component.html',
  styleUrls: ['./change-summary.component.scss']
})
export class ChangeSummaryComponent
  extends DestroyableComponent
  implements OnInit
{
  @Input()
  originalValues: any;

  @Input()
  undoConfirmationModalData;

  @Input()
  formGroup: FormGroup;
  changeSummaryText: SafeHtml[] = [];

  @Output()
  resetForm: EventEmitter<void> = new EventEmitter<void>();

  faSyncAlt = faSyncAlt;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private datePipe: DatePipe,
    public confirmationModalService: ConfirmationModalService
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$), debounceTime(200))
      .subscribe(() => {
        this.rebuildSummary();
      });
  }

  undoChanges() {
    // This is safe to do all the time because the undo button will not show up unless there are changes.
    this.confirmationModalService
      .displayModal(this.undoConfirmationModalData, '260px')
      .afterClosed()
      .pipe(filter((confirmed) => confirmed))
      .subscribe(() => {
        this.resetForm.next();
        this.changeDetector.detectChanges();
      });
  }

  // Our basic object structure
  //   AuthAction_ApprovalReason: null
  //   AuthAction_ApprovalType: null
  //   approvedLocations:
  //     Doctor: {1: {…}, 2: {…}, 3: {…}}
  //        Home:
  //           0: {locationSelected: false, locationTripCount: 0}
  //
  // Other: {7: {…}, 8: {…}, 9: {…}, 10: {…}, 11: {…}}
  // Pharmacy: {6: {…}, 12: {…}}
  // Physical Therapy: {5: {…}}
  // Work: {30: {…}, 31: {…}}
  //
  // endDate: Thu Feb 03 2022 00:00:00 GMT-0500 (Eastern Standard Time) {}
  // noLocationRestrictions: false
  // notes: "need to add existing notes to auth data call somewhere?"
  // specifyTripsByLocation: false
  // startDate: Thu Feb 02 2017 00:00:00 GMT-0500 (Eastern Standard Time)
  // tripsAuthorized: 15
  // unlimitedTrips: false

  private rebuildSummary() {
    this.changeSummaryText = [];
    if (!this.formGroup.pristine) {
      this.buildDatesSummary();
      this.buildTripCountSummary();
      this.buildLocationsSummary();
    }

    this.changeDetector.detectChanges();
  }

  private buildDatesSummary() {
    let delta = false;
    if (
      (this.originalValues['endDate'] as Date).getTime() !==
      (this.formGroup.value['endDate'] as Date).getTime()
    ) {
      delta = true;
    }
    if (
      (this.originalValues['startDate'] as Date).getTime() !==
      (this.formGroup.value['startDate'] as Date).getTime()
    ) {
      delta = true;
    }

    if (delta) {
      this.changeSummaryText.push(
        'The date range has been changed to ' +
          this.datePipe.transform(
            this.formGroup.value['startDate'],
            'MM/dd/yyyy'
          ) +
          ' and ' +
          this.datePipe.transform(
            this.formGroup.value['endDate'],
            'MM/dd/yyyy'
          ) +
          '.'
      );
    }
  }

  private buildTripCountSummary() {
    let delta: boolean = false;
    let tripCountString: string = 'unlimited';

    let originalUnlimitedTrips: boolean = this.originalValues['unlimitedTrips'];
    let originalTripsAuthorized: number =
      this.originalValues['tripsAuthorized'];
    let currentUnlimitedTrips: boolean = this.formGroup.value['unlimitedTrips'];
    let currentTripsAuthorized: number =
      this.formGroup.value['tripsAuthorized'];

    // For some reason these values are getting set to undefined (possibly because it's disabled?)
    if (currentUnlimitedTrips === undefined) {
      currentUnlimitedTrips = false;
    }
    if (originalUnlimitedTrips === undefined) {
      originalUnlimitedTrips = false;
    }

    if (originalUnlimitedTrips !== currentUnlimitedTrips) {
      delta = true;

      // If we switched FROM unlimited TO limited, we need to display the new tripsAuthorized value
      if (
        originalUnlimitedTrips &&
        !currentUnlimitedTrips &&
        !!currentTripsAuthorized
      ) {
        tripCountString = currentTripsAuthorized.toString();
      }
    }

    // Only check for a change in trips auth if we are not in unlimited mode.
    if (false === currentUnlimitedTrips) {
      if (originalTripsAuthorized !== currentTripsAuthorized) {
        delta = true;
        tripCountString = currentTripsAuthorized.toString();
      }
    }

    if (delta) {
      this.changeSummaryText.push(
        'Total Trips have been changed to <b>' +
          tripCountString +
          ' trips(s)</b>.'
      );
    }
  }

  private buildLocationsSummary() {
    const deltaInLocationItemSelections =
      this.doLocationItemsSelectionsDiffer();
    const noLocationRestrictions =
      this.formGroup.value['noLocationRestrictions'];
    if (noLocationRestrictions) {
      if (
        this.originalValues['noLocationRestrictions'] !== noLocationRestrictions
      ) {
        this.changeSummaryText.push(
          'No location restrictions has been selected.'
        );
      }
    } else {
      if (deltaInLocationItemSelections) {
        if (this.areAllLocationsSelected()) {
          this.changeSummaryText.push('All locations have been selected.');
        } else {
          this.changeSummaryText.push(
            'One or more locations has been changed.'
          );
        }
      }
    }
  }

  private doLocationItemsSelectionsDiffer() {
    let delta = false;
    const originalLocationItems = this.originalValues['approvedLocations'];
    const fgLocationItems = this.formGroup.value['approvedLocations'];

    // In No restrictions mode, these items will not exist.
    if (null == fgLocationItems) {
      if (null != originalLocationItems) {
        delta = true;
      }
    } else {
      Object.keys(fgLocationItems).forEach((locationKey) => {
        if (false === delta) {
          const originalSet = originalLocationItems[locationKey];
          const fgSet = fgLocationItems[locationKey];
          if (null == originalSet) {
            // A new location was added and it was also in a new category.
            delta = true;
          } else {
            Object.keys(fgSet).forEach((locationItemKey) => {
              const originalLocationItem = originalSet[locationItemKey];
              if (null == originalLocationItem) {
                // a new location was added in an existing category.
                delta = true;
              } else {
                if (
                  fgSet[locationItemKey]['locationSelected'] !==
                  originalLocationItem['locationSelected']
                ) {
                  delta = true;
                }
              }
            });
          }
        }
      });
    }

    return delta;
  }

  private areAllLocationsSelected() {
    let allSelected = true;
    const fgLocationItems = this.formGroup.value['approvedLocations'];
    Object.values(fgLocationItems).forEach((locationItemSet) => {
      if (true === allSelected) {
        Object.values(locationItemSet).forEach((locationItem) => {
          allSelected = allSelected && locationItem['locationSelected'];
        });
      }
    });

    return allSelected;
  }
}
