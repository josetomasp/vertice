import { Component, Input, OnInit } from '@angular/core';
import { faInfoCircle, faStickyNote } from '@fortawesome/pro-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import { MakeAReferralService } from '../../../make-a-referral.service';
import { takeUntil } from 'rxjs/operators';
import { DiagnosticsFormState } from 'src/app/claims/abm/referral/store/models/fusion/fusion-make-a-referral.models';
import { FormatType, generalFormat } from '../../../make-a-referral-shared';
import { SetSpecificDateNote } from 'src/app/claims/abm/referral/store/actions/make-a-referral.actions';
import { getFormStateByName } from 'src/app/claims/abm/referral/store/selectors/makeReferral.selectors';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import {
  ReferralBodyPart
} from '../../../../store/models/make-a-referral.models';

const moment = _moment;

@Component({
  selector: 'healthe-diagnostics-review',
  templateUrl: './diagnostics-review.component.html',
  styleUrls: ['./diagnostics-review.component.scss']
})
export class DiagnosticsReviewComponent extends DestroyableComponent
  implements OnInit {
  displayData = {};
  columnCount = 4;
  columnSpacing: number;
  faStickyNote = faStickyNote;
  faInfoCircle = faInfoCircle;
  isContrastTypeEnabled = false;
  isServiceTypeEnabled = false;
  sectionName = 'Diagnostics';

  @Input()
  stepName: string;

  @Input()
  stepNameForId: string;

  @Input()
  stepNameSpelledOut: string;

  @Input()
  subServiceLabel: string;

  @Input()
  inReferralReviewMode = false;

  @Input()
  sharedForm;
  sectionTitle: string;

  constructor(
    public dialog: MatDialog,
    public store$: Store<RootState>,
    public makeAReferralService: MakeAReferralService
  ) {
    super();
    this.columnSpacing = 100 / this.columnCount;
  }

  ngOnInit() {
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
      .subscribe((values: DiagnosticsFormState) => {
        /*
        Added this because sometimes the functions deep within the call stack error but don't log out
        Those errors close the observable causing the review screen to stop updating*/

        try {
          this.buildDisplayData(values);
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

  buildDisplayData(values: DiagnosticsFormState) {
    if (values) {
      this.displayData['postSurgical'] = this.sharedForm.controls[
        'postSurgical'
      ].value
        ? 'Yes'
        : 'No';
      this.displayData['rush'] = values.rush;
      if (this.sharedForm.controls['scheduleNear']) {
        this.displayData['scheduleNear'] = {
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
        this.displayData['surgeryDate'] = `${moment(
          this.sharedForm.controls['surgeryDate'].value
        ).format(environment.dateFormat)}`;
      }

      if (values.schedulingForm) {
        this.displayData['schedulingForm'] = this.buildDxSchedulingForm(
          values.schedulingForm
        );
      }

      this.displayData['notes'] = values.notes;
    }
  }

  buildDxSchedulingForm(schedulingFormList): any[] {
    const formattedList = [];
    schedulingFormList.forEach((schedulingForm) => {
      const formattedObj = {};

      if (schedulingForm.bodyParts) {
        formattedObj['bodyParts'] = generalFormat(
          this.getDisplayBodyParts(schedulingForm.bodyParts),
          '',
          FormatType.NONE
        );
      }

      if (schedulingForm.serviceDate) {
        formattedObj['serviceDate'] = generalFormat(
          schedulingForm.serviceDate,
          '',
          FormatType.DATE
        );
      }
      if (schedulingForm.notes) {
        formattedObj['notes'] = generalFormat(
          schedulingForm.notes,
          '',
          FormatType.NONE
        );
      }

      if (!schedulingForm.subType) {
        if (schedulingForm.otherTypes) {
          this.isServiceTypeEnabled = true;
          formattedObj['serviceType'] = generalFormat(
            schedulingForm.otherTypes.subTypeDescription,
            '',
            FormatType.NONE
          );
        }
        if (schedulingForm.contrastType) {
          this.isContrastTypeEnabled = true;
          formattedObj['contrastType'] = generalFormat(
            schedulingForm.contrastType.subTypeDescription,
            '',
            FormatType.NONE
          );
        }
      } else {
        if (this.stepNameSpelledOut === 'Other') {
          this.isServiceTypeEnabled = true;
          formattedObj['serviceType'] = generalFormat(
            schedulingForm.subType.subTypeDescription,
            '',
            FormatType.NONE
          );
        } else {
          this.isContrastTypeEnabled = true;
          formattedObj['contrastType'] = generalFormat(
            schedulingForm.subType.subTypeDescription,
            '',
            FormatType.NONE
          );
        }
      }

      formattedList.push(formattedObj);
    });

    return formattedList;
  }

  addNotes(index: number, note: string) {
    this.makeAReferralService
      .displayReferralNoteModalEditModeClosed(
        'Add notes to this '.concat(this.stepNameSpelledOut).concat(' request'),
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

  loadForm() {
    console.warn('Unimplemented');
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
