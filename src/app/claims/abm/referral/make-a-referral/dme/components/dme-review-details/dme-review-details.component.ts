import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faStickyNote } from '@fortawesome/pro-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { RootState } from 'src/app/store/models/root.models';
import { MakeAReferralService } from '../../../make-a-referral.service';
import {
  getApprovedLocations,
  getFormStateByName
} from 'src/app/claims/abm/referral/store/selectors/makeReferral.selectors';
import { take, takeUntil } from 'rxjs/operators';
import { DMECommonForm } from 'src/app/claims/abm/referral/store/models/fusion/fusion-make-a-referral.models';
import { SetSpecificDateNote } from 'src/app/claims/abm/referral/store/actions/make-a-referral.actions';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { ClaimLocation } from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import { DME_ARCH_TYPE } from '../../dme-step-definitions';
import { find } from 'lodash';

const moment = _moment;

interface DMEReviewSchedulingDisplayData {
  product: string;
  quantity: number;
  rental: string;
  dates: string;
  deliveryAddress: string;
  notes: string;
}

interface DMEReviewDisplayData {
  rush: string;
  schedulingForms: DMEReviewSchedulingDisplayData[];
}

@Component({
  selector: 'healthe-dme-review-details',
  templateUrl: './dme-review-details.component.html',
  styleUrls: ['./dme-review-details.component.scss']
})
export class DmeReviewDetailsComponent extends DestroyableComponent
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
  @Output()
  prescriberInformation: EventEmitter<any> = new EventEmitter<any>();
  sectionTitle: string;
  columnSpacing: number;
  public values$;
  public inReferralReviewModeValues$;
  public locations$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getApprovedLocations(DME_ARCH_TYPE))
  );
  locations: ClaimLocation[] = [];

  faStickyNote = faStickyNote;
  sectionName = 'DME';
  displayData: Partial<DMEReviewDisplayData>;
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

    this.sectionTitle = this.subServiceLabel;

    this.values$ = this.store$.pipe(
      takeUntil(this.onDestroy$),
      select(
        getFormStateByName({
          formStateChild: this.stepName,
          useReturnedValues: false
        })
      )
    );

    this.values$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((values: DMECommonForm) => {
        try {
          this.displayData = this.buildDisplayData(values);
        } catch (e) {
          console.error(e);
        }
      });

    /*
    The return model for the post submit page is only used to display the referral number.
    The equipment detail data is diplayed from the state because the specific data to display  (product's category) is not submited
     so the return model doesn't contain it.
    */
    if (this.inReferralReviewMode) {
      this.inReferralReviewModeValues$ = this.store$.pipe(
        takeUntil(this.onDestroy$),
        select(
          getFormStateByName({
            formStateChild: this.stepName,
            useReturnedValues: this.inReferralReviewMode
          })
        )
      );
      this.inReferralReviewModeValues$
        .pipe(
          takeUntil(this.onDestroy$),
          take(1)
        )
        .subscribe((values: DMECommonForm) => {
          this.sectionTitle = this.subServiceLabel;
          if (this.inReferralReviewMode && values.referralId) {
            this.sectionTitle = `${this.subServiceLabel} - Referral #${
              values.referralId
            }`;
          }
        });
    }
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
    stepFormData: DMECommonForm
  ): Partial<DMEReviewDisplayData> {
    let displayData: Partial<DMEReviewDisplayData> = {};
    if (stepFormData) {
      displayData.rush = stepFormData.rush ? 'Yes' : 'No';

      if (
        stepFormData.prescriberName ||
        stepFormData.prescriberPhone ||
        stepFormData.prescriberAddress
      ) {
        this.prescriberInformation.emit({
          name: stepFormData.prescriberName,
          phone: stepFormData.prescriberPhone,
          address: stepFormData.prescriberAddress
        });
      }

      if (stepFormData.schedulingForm) {
        displayData.schedulingForms = stepFormData.schedulingForm.map(
          (schedulingData) => {
            let schedulingDisplayData: DMEReviewSchedulingDisplayData = {
              product:
                schedulingData.productSelectionMode === 'hcpc'
                  ? 'HCPC - '.concat(schedulingData.hcpc)
                  : schedulingData.category && schedulingData.product
                  ? schedulingData.category.label
                    ? schedulingData.category.label.concat(
                        ' - '.concat(schedulingData.product.subTypeDescription)
                      )
                    : ''
                  : '',
              quantity: schedulingData.quantity,
              rental: schedulingData.rental ? 'Yes' : 'No',
              dates:
                schedulingData.dynamicDateMode === 'dateRange'
                  ? `${moment(schedulingData.startDate).format(
                      environment.dateFormat
                    )} - ${moment(schedulingData.endDate).format(
                      environment.dateFormat
                    )}`
                  : `${moment(schedulingData.deliveryDate).format(
                      environment.dateFormat
                    )}`,
              deliveryAddress: this.repairApprovedLocation(
                schedulingData.deliveryAddress
              ),
              notes: schedulingData.notes
            };
            return schedulingDisplayData;
          }
        );
      }
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
