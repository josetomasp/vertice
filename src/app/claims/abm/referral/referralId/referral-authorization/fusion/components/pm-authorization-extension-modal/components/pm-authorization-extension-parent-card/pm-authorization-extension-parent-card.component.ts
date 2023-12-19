import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { DateRangeValidators } from 'src/app/claims/abm/referral/make-a-referral/components/date-range-form/dateRangeValidators';
import {
  FusionAuthorization,
  FusionAuthorizationBodyPart
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import { environment } from 'src/environments/environment';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { takeUntil } from 'rxjs/operators';

const moment = _moment;

interface OriginalPMValues {
  startDate: _moment.Moment;
  endDate: _moment.Moment;
  additionalVisits: number;
  bodyParts: FusionAuthorizationBodyPart[];
}

@Component({
  selector: 'healthe-pm-authorization-extension-parent-card',
  templateUrl: './pm-authorization-extension-parent-card.component.html',
  styleUrls: ['./pm-authorization-extension-parent-card.component.scss']
})
export class PmAuthorizationExtensionParentCardComponent  extends DestroyableComponent implements OnInit {
  @Input()
  authorization: FusionAuthorization;

  @Input()
  index: number;

  @Input()
  authsFormArray: FormArray;

  @Input()
  bodyParts$: Observable<FusionAuthorizationBodyPart[]>;

  originalPMValues: OriginalPMValues = {
    startDate: null,
    endDate: null,
    additionalVisits: 0,
    bodyParts: []
  };

  // Single card FormGroup
  pmAuthFormGroup: FormGroup = new FormGroup({
    authorizationId: new FormControl(),
    startDate: new FormControl(null, [
      Validators.required,
      this.startDateOnlyInPast
    ]),
    originalStartDate: new FormControl(null),
    endDate: new FormControl(null, [
      Validators.required,
      DateRangeValidators.endDateValidation,
      this.endDateAfterLastServiceDateValidator,
      this.endDateTodayOrLaterValidator
    ]),
    lastServiceDate: new FormControl(null),
    totalApproved: new FormControl(null),
    additionalVisits: new FormControl(0, [Validators.required, Validators.min(0)]),
    priorApprovedQuantity: new FormControl(),
    completedQuantity: new FormControl(),
    icdCodes: new FormControl([]),
    bodyParts: new FormControl([], Validators.required),
    originalBodyParts: new FormControl([]),
    orderingProviderName: new FormControl(),
    orderingProviderPhone: new FormControl(),
    noteList: new FormControl([])
  },  this.isThereARelevantFormChangeValidator(this.originalPMValues));

  constructor() {
    super();
  }

  ngOnInit() {
    this.setFormGroupValuesFromAuth();
    this.authsFormArray.insert(this.index, this.pmAuthFormGroup);
  }

  compareBodyParts(
    bodyPart1: FusionAuthorizationBodyPart,
    bodyPart2: FusionAuthorizationBodyPart
  ): boolean {
    if (
      bodyPart1 &&
      bodyPart2 &&
      bodyPart1.id.toString() === bodyPart2.id.toString() &&
      bodyPart1.sideOfBody.trim() === bodyPart2.sideOfBody.trim()
    ) {
      return true;
    } else {
      return false;
    }
  }

  getBodyPartDisplayName(description: string, sideOfBody?: string) {
    if (
      sideOfBody &&
      sideOfBody.trim() !== '' &&
      description.indexOf(sideOfBody) < 0
    ) {
      return description.concat(' - ', sideOfBody.trim());
    }
    return description;
  }

  startDateOnlyInPast(ac: AbstractControl): ValidationErrors {
    if (
      ac.parent &&
      ac.value &&
      ac.value > ac.parent.get('originalStartDate').value
    ) {
      return {
        startDateOnlyInPast: true
      };
    }
    return {};
  }

  endDateAfterLastServiceDateValidator(ac: AbstractControl): ValidationErrors {
    if (
      ac.parent &&
      ac.value &&
      ac.parent.get('lastServiceDate').value &&
      moment(ac.value)
        .hours(12)
        .isBefore(moment(ac.parent.get('lastServiceDate').value).hours(12))
    ) {
      return {
        endDateAfterLastServiceDateValidator: true
      };
    }
    return {};
  }

  endDateTodayOrLaterValidator(ac: AbstractControl): ValidationErrors {
    if (
      ac.parent &&
      ac.value &&
      moment(ac.value)
        .startOf('day')
        .isBefore(moment().startOf('day'))
    ) {
      return {
        endDateTodayOrLaterValidator: true
      };
    }
    return {};
  }

  formatDate(date: Date) {
    return moment(date).format(environment.dateFormat);
  }

  private setFormGroupValuesFromAuth() {
    // Authorization ID
    if (this.authorization.authorizationUnderReview.authorizationId) {
      this.pmAuthFormGroup.controls['authorizationId'].setValue(
        this.authorization.authorizationUnderReview.authorizationId
      );
    }

    // Start Date
    if (this.authorization.authorizationUnderReview.startDate) {
      this.pmAuthFormGroup.controls['startDate'].setValue(
        moment(this.authorization.authorizationUnderReview.startDate)
          .hours(12)
          .toDate()
      );

      this.pmAuthFormGroup.controls['originalStartDate'].setValue(
        this.pmAuthFormGroup.controls['startDate'].value
      );

      this.originalPMValues.startDate = moment(
        this.authorization.authorizationUnderReview.startDate
      );
    }

    // End date
    if (this.authorization.authorizationUnderReview.endDate) {
      this.pmAuthFormGroup.controls['endDate'].setValue(
        moment(this.authorization.authorizationUnderReview.endDate)
          .hours(12)
          .toDate()
      );

      this.originalPMValues.endDate = moment(
        this.authorization.authorizationUnderReview.endDate
      );
    }

    // Total Approved
    if (this.authorization.authorizationUnderReview.quantity) {
      this.pmAuthFormGroup.controls['totalApproved'].setValue(
        this.authorization.authorizationUnderReview.quantity
      );
    }

    // additionalVisits
    this.pmAuthFormGroup.controls['additionalVisits'].valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (this.pmAuthFormGroup.controls['additionalVisits'].valid) {
          this.pmAuthFormGroup.controls['totalApproved'].setValue(
            this.authorization.authorizationUnderReview.quantity + value
          );
        }
      });

    // Prev Quantity
    if (this.authorization.narrativeTextList) {
      this.pmAuthFormGroup.controls['priorApprovedQuantity'].setValue(
        this.authorization.authorizationUnderReview.quantity
      );
    }

    // Completed Quantity
    if (this.authorization.narrativeTextList) {
      this.pmAuthFormGroup.controls['completedQuantity'].setValue(
        this.authorization.authorizationUnderReview.quantityCompleted
      );
    }

    // Body Parts
    if (this.authorization.authorizationUnderReview.bodyParts) {
      let selectedBodyParts: FusionAuthorizationBodyPart[] = this.authorization.authorizationUnderReview.bodyParts.map(
        ({ id, description, descOriginal, sideOfBody, lastActionDate, status }) => {
          return {
            id: id,
            description: description,
            descOriginal: descOriginal,
            sideOfBody: sideOfBody ? sideOfBody : '',
            lastActionDate: lastActionDate,
            status: status,
          };
        }
      );
      this.originalPMValues.bodyParts = selectedBodyParts;
      this.pmAuthFormGroup.get('originalBodyParts').setValue(selectedBodyParts);
      this.pmAuthFormGroup.get('bodyParts').setValue(selectedBodyParts);
      this.pmAuthFormGroup.markAllAsTouched();
    }

    // Last Service Date (Used for validation)
    if (this.authorization.authorizationUnderReview.lastServiceDate) {
      this.pmAuthFormGroup.get('lastServiceDate').setValue(
        moment(this.authorization.authorizationUnderReview.lastServiceDate)
          .hours(12)
          .toDate()
      );
    }

    // ICD Codes are handled inside the ICD Modal component
    if (this.authorization.authorizationUnderReview.icdCodes) {
      this.authorization.authorizationUnderReview.icdCodes.forEach(
        (icd) => (icd.isReadOnly = true)
      );
      this.pmAuthFormGroup
        .get('icdCodes')
        .setValue(this.authorization.authorizationUnderReview.icdCodes);
    }
  }

  isThereARelevantFormChangeValidator(originalPMValues: OriginalPMValues) {
    return (ac: AbstractControl): ValidationErrors => {
      let startDateCtrl = ac.get('startDate');
      let endDateCtrl = ac.get('endDate');
      let additionalVisitsCtrl = ac.get('additionalVisits');
      let bodyPartsCtrl = ac.get('bodyParts');

      if (
        !startDateCtrl ||
        !endDateCtrl ||
        !additionalVisitsCtrl ||
        !bodyPartsCtrl
      ) {
        return null;
      }

      let startDateIsUnchanged = false;
      if (
        startDateCtrl.valid &&
        moment(startDateCtrl.value).isSame(originalPMValues.startDate, 'day')
      ) {
        startDateIsUnchanged = true;
      }

      let endDateIsUnchanged = false;
      if (
        endDateCtrl.valid &&
        moment(endDateCtrl.value).isSame(originalPMValues.endDate, 'day')
      ) {
        endDateIsUnchanged = true;
      }

      let additionalVisitsUnchanged = false;
      if (additionalVisitsCtrl.valid && additionalVisitsCtrl.value === 0) {
        additionalVisitsUnchanged = true;
      }

      let bodyPartsUnchanged = false;
      let bodyParts: FusionAuthorizationBodyPart[] =
        bodyPartsCtrl.value as FusionAuthorizationBodyPart[];
      if (bodyParts && bodyParts.length === originalPMValues.bodyParts.length) {
        let count = bodyParts.length;
        bodyParts.forEach((ctrlPart) => {
          this.originalPMValues.bodyParts.forEach((part) => {
            if (part.id === +ctrlPart.id && part.sideOfBody.trim() === ctrlPart.sideOfBody.trim()) {
              count = count - 1;
            }
          });
        });
        if (count === 0) {
          bodyPartsUnchanged = true;
        }
      }

      if (
        startDateIsUnchanged &&
        endDateIsUnchanged &&
        additionalVisitsUnchanged &&
        bodyPartsUnchanged
      ) {
        return { formGroupUnchanged: true };
      }
      return null;
    };
  }
}
