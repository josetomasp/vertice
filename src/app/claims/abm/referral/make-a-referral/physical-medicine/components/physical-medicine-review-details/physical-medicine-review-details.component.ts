import { Component, Input, OnInit } from '@angular/core';
import { faStickyNote } from '@fortawesome/pro-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../../../../../environments/environment';
import { RootState } from '../../../../../../../store/models/root.models';
import { SetSpecificDateNote } from '../../../../store/actions/make-a-referral.actions';
import { PhysicalMedicineCommonForm } from '../../../../store/models/fusion/fusion-make-a-referral.models';
import { getFormStateByName } from '../../../../store/selectors/makeReferral.selectors';
import { MakeAReferralService } from '../../../make-a-referral.service';
import { PHYSICALMEDICINE_OTHER_STEP_NAME } from '../../physical-medicine-step-definitions';
import * as _moment from 'moment';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { takeUntil } from 'rxjs/operators';
import {
  ReferralBodyPart
} from '../../../../store/models/make-a-referral.models';

const moment = _moment;

interface PhysicalMedicineReviewSchedulingDisplayData {
  subType?: string;
  bodyParts?: string;
  startAndEndDates: string;
  numberOfVisits: number;
  notes: string;
}

interface PhysicalMedicineReviewDisplayData {
  scheduleNear: { name: string; address: string };
  surgeryDate: string;
  rush: string;
  postSurgical: string;
  diagnosisCode: string[];
  schedulingForm: PhysicalMedicineReviewSchedulingDisplayData[];
}
@Component({
  selector: 'healthe-physical-medicine-review-details',
  templateUrl: './physical-medicine-review-details.component.html',
  styleUrls: ['./physical-medicine-review-details.component.scss']
})
export class PhysicalMedicineReviewDetailsComponent extends DestroyableComponent
  implements OnInit {
  @Input()
  stepName: string;
  @Input()
  stepNameForId: string;
  @Input()
  subServiceLabel: string;
  @Input()
  isServiceTypeEnabled: boolean;
  @Input()
  inReferralReviewMode: boolean;
  @Input()
  isOtherStep: boolean;
  @Input()
  stepNameLabel: string;
  @Input()
  sharedForm;
  @Input()
  columnCount: number;
  columnSpacing: number;

  sectionTitle: string;
  isOtherService: boolean = false;

  faStickyNote = faStickyNote;
  displayData: Partial<PhysicalMedicineReviewDisplayData>;
  sectionName = 'Physical Medicine';
  constructor(
    public store$: Store<RootState>,
    public makeAReferralService: MakeAReferralService
  ) {
    super();
  }

  ngOnInit() {
    this.columnSpacing = 100 / this.columnCount;

    this.isOtherService = this.stepName === PHYSICALMEDICINE_OTHER_STEP_NAME;

    this.store$
      .pipe(
        select(
          getFormStateByName({
            formStateChild: this.stepName,
            useReturnedValues: this.inReferralReviewMode
          })
        ),
        takeUntil(this.onDestroy$)
      )
      .subscribe((stepFormData: PhysicalMedicineCommonForm) => {
        try {
          this.displayData = this.buildDisplayData(stepFormData);
          this.sectionTitle = this.subServiceLabel;
          if (this.inReferralReviewMode) {
            this.sectionTitle = `${this.subServiceLabel} - Referral #${
              stepFormData.referralId
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
        'Add notes to this '.concat(this.stepNameLabel).concat(' request'),
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
    stepFormData: PhysicalMedicineCommonForm
  ): Partial<PhysicalMedicineReviewDisplayData> {
    const displayData: Partial<PhysicalMedicineReviewDisplayData> = {};

    displayData.rush = stepFormData.rush ? 'Yes' : 'No';
    displayData.postSurgical = this.sharedForm.controls['postSurgical'].value
      ? 'Yes'
      : 'No';

    const scheduleNear = this.sharedForm.controls['scheduleNear'];
    if (scheduleNear && scheduleNear.value.type && scheduleNear.value.address) {
      displayData.scheduleNear = {
        address: this.sharedForm.controls['scheduleNear'].value.type.concat(
          ' - '.concat(this.sharedForm.controls['scheduleNear'].value.address)
        ),
        name: this.sharedForm.controls['scheduleNear'].value.name
      };
    }
    if (
      this.sharedForm.controls['surgeryDate'] &&
      this.sharedForm.controls['surgeryDate'].value
    ) {
      displayData.surgeryDate = `${moment(
        this.sharedForm.controls['surgeryDate'].value
      ).format(environment.dateFormat)}`;
    }

    displayData.schedulingForm = stepFormData.schedulingForm.map(
      (schedulingData) => {
        const schedulingDisplayData: PhysicalMedicineReviewSchedulingDisplayData = {
          bodyParts: this.getDisplayBodyParts(schedulingData.bodyParts),
          startAndEndDates: `${moment(schedulingData.startDate).format(
            environment.dateFormat
          )} - ${moment(schedulingData.endDate).format(
            environment.dateFormat
          )}`,
          numberOfVisits: schedulingData.numberOfVisits,
          notes: schedulingData.notes
        };

        if (this.isOtherService && schedulingData.subType) {
          schedulingDisplayData.subType =
            schedulingData.subType.subTypeDescription;
        }
        return schedulingDisplayData;
      }
    );

    return displayData;
  }

  getDisplayBodyParts(bodyParts: ReferralBodyPart[]): string {
    let displayBodyParts: string = '';
    if (bodyParts) {
      displayBodyParts = bodyParts?.map((bodyPart) => {
        if (bodyPart.sideOfBody && bodyPart.desc && !bodyPart.desc.includes(' - ' + bodyPart.sideOfBody)) {
          return bodyPart.desc + ' - ' + bodyPart.sideOfBody;
        } else {
          return bodyPart.desc;
        }
      }).join(', ');
    }
    return displayBodyParts;
  }
}
