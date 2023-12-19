import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faStickyNote } from '@fortawesome/pro-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import * as _moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { SetSpecificDateNote } from 'src/app/claims/abm/referral/store/actions/make-a-referral.actions';
import { HomeHealthCommonForm } from 'src/app/claims/abm/referral/store/models/fusion/fusion-make-a-referral.models';
import {
  getApprovedLocations,
  getFormStateByName
} from 'src/app/claims/abm/referral/store/selectors/makeReferral.selectors';
import { RootState } from 'src/app/store/models/root.models';
import { environment } from 'src/environments/environment';
import { MakeAReferralService } from '../../../make-a-referral.service';
import { HOMEHEALTH_ARCH_TYPE } from '../../home-health-step-definitions';
import { ClaimLocation } from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import { find } from 'lodash';

const moment = _moment;

interface HomeHealthReviewSchedulingDisplayData {
  subType: string;
  address: string;
  startAndEndDates: string;
  specificDate: string;
  numberOfVisits: number;
  notes: string;
}

interface HomeHealthReviewDisplayData {
  rush: string;
  schedulingForms: HomeHealthReviewSchedulingDisplayData[];
}

@Component({
  selector: 'healthe-home-health-review-details',
  templateUrl: './home-health-review-details.component.html',
  styleUrls: ['./home-health-review-details.component.scss']
})
export class HomeHealthReviewDetailsComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  stepName: string;
  @Input()
  stepNameForId: string;
  @Input()
  subServiceLabel: string;
  @Input()
  inReferralReviewMode: boolean;
  @Input()
  stepNameLabel: string;
  @Input()
  columnCount: number;

  public locations$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getApprovedLocations(HOMEHEALTH_ARCH_TYPE))
  );
  locations: ClaimLocation[] = [];

  columnSpacing: number;
  public values$;

  faStickyNote = faStickyNote;

  displayData: Partial<HomeHealthReviewDisplayData>;
  sectionTitle: string;

  constructor(
    public dialog: MatDialog,
    public store$: Store<RootState>,
    public makeAReferralService: MakeAReferralService
  ) {
    super();
  }

  ngOnInit() {
    this.locations$.subscribe((locations) => (this.locations = locations));

    this.columnSpacing = 100 / this.columnCount;
    this.values$ = this.store$.pipe(
      takeUntil(this.onDestroy$),
      select(
        getFormStateByName({
          formStateChild: this.stepName,
          useReturnedValues: this.inReferralReviewMode
        })
      )
    );

    this.values$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((values: HomeHealthCommonForm) => {
        try {
          this.displayData = this.buildDisplayData(values);
          this.sectionTitle = this.subServiceLabel;
          if (this.inReferralReviewMode && values.referralId) {
            this.sectionTitle = `${this.subServiceLabel} - Referral #${
              values.referralId
            }`;
          }
        } catch (e) {
          console.error(e);
        }
      });
  }

  addNotes(index: number, note: string) {
    this.makeAReferralService
      .displayReferralNoteModalEditModeClosed(
        'Add notes to this '.concat(this.stepNameLabel).concat(' request '),
        note,
        this.inReferralReviewMode
      )
      .subscribe((newNote) => {
        this.store$.dispatch(
          new SetSpecificDateNote({
            ngrxStepName: this.stepName,
            index: index,
            note: newNote
          })
        );
      });
  }

  private buildDisplayData(
    stepFormData: HomeHealthCommonForm
  ): Partial<HomeHealthReviewDisplayData> {
    let displayData: Partial<HomeHealthReviewDisplayData> = {};
    if (stepFormData && stepFormData.schedulingForm) {
      displayData.rush = stepFormData.rush ? 'Yes' : 'No';

      displayData.schedulingForms = stepFormData.schedulingForm.map(
        (schedulingData) => {
          let schedulingDisplayData: HomeHealthReviewSchedulingDisplayData = {
            subType: schedulingData.serviceType
              ? schedulingData.serviceType.subTypeDescription
              : '',
            address: this.repairApprovedLocation(schedulingData.serviceAddress),
            specificDate:
              schedulingData.dynamicDateMode === 'singleDate'
                ? `${moment(schedulingData.appointmentDate).format(
                    environment.dateFormat
                  )}`
                : '',
            startAndEndDates:
              schedulingData.dynamicDateMode === 'dateRange'
                ? `${moment(schedulingData.startDate).format(
                    environment.dateFormat
                  )} - ${moment(schedulingData.endDate).format(
                    environment.dateFormat
                  )}`
                : '',
            numberOfVisits:
              schedulingData.dynamicDateMode === 'dateRange'
                ? schedulingData.numberOfVisits
                : 1,
            notes: schedulingData.notes
          };
          return schedulingDisplayData;
        }
      );
    }

    return displayData;
  }

  private repairApprovedLocation(location: ClaimLocation): string {
    let displayLocation: string;
    if (location && location.type && location.address) {
      displayLocation = location.type.concat(' - '.concat(location.address));
    } else {
      if (location && location.id) {
        const id = location.id;
        const chosenLocation: ClaimLocation = find(this.locations, {
          id
        });
        if (chosenLocation) {
          displayLocation = chosenLocation.type.concat(
            ' - '.concat(chosenLocation.address)
          );
        }
      } else {
        displayLocation = '';
      }
    }
    return displayLocation;
  }
}
