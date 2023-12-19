import {
  Component,
  Input,
  OnInit,
  Inject,
  ViewChild,
  ApplicationRef
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/pro-solid-svg-icons/faChevronUp';
import { MatMenu } from '@angular/material/menu';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SingleDatePickerControlComponent } from '@shared/components/single-date-picker-control/single-date-picker-control.component';
import {
  PbmPreparePaperAuthorizationResponse,
  PbmPaperAuthorizationPrepareMessage,
  PbmPaperAuthorizationSubmitMessage,
  PbmSubmitDateLimit,
  PbmPriorAuthlimits,
  PbmPaperDateItem
} from '../../store/models/pbm-authorization-information.model';
import { generateSingleDatePickerConfig } from '../../pbm-authorization-date.config';
import { NgxDrpOptions } from '@healthe/vertice-library';
import * as moment from 'moment';
import { HealtheMenuOption } from '@shared';
import { DateRangeValidators } from 'src/app/claims/abm/referral/make-a-referral/components/date-range-form/dateRangeValidators';
import { DatePipe } from '@angular/common';
import { PbmTimePeriodModalService } from './pbm-time-period-modal.service';
import { PbmAuthorizationDatePickerPreset } from '../../store/models/pbm-authorization-information/authorization-line-item.models';

@Component({
  selector: 'healthe-pbm-time-period-modal',
  templateUrl: './pbm-time-period-modal.component.html',
  styleUrls: ['./pbm-time-period-modal.component.scss']
})
export class PbmTimePeriodModalComponent implements OnInit {
  constructor(
    public matDialogRef: MatDialogRef<PbmTimePeriodModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      encodedAuthorizationId: string;
      request: PbmPaperAuthorizationPrepareMessage;
      data: PbmPreparePaperAuthorizationResponse;
    },
    public matDialog: MatDialog,
    private applicationRef: ApplicationRef,
    private datePipe: DatePipe,
    private timePeriodModalService: PbmTimePeriodModalService
  ) {}

  @ViewChild(SingleDatePickerControlComponent, { static: false })
  effectiveToDatePicker: SingleDatePickerControlComponent;
  dateConfigOptions: NgxDrpOptions;
  approvalActionAllMenuIcon = faChevronDown;
  denialsActionAllMenuIcon = faChevronDown;
  _timePeriodForm: FormGroup = new FormGroup({});
  positiveDoctorDatePickerControlName: string =
    'priorAuthlimits-positiveDoctor-date-picker--';
  negativeDoctorDatePickerControlName: string =
    'priorAuthlimits-negativeDoctors-date-picker--';
  positiveDrugDatePickerControlName: string =
    'priorAuthlimits-positiveDrugs-date-picker--';
  negativeDrugDatePickerControlName: string =
    'priorAuthlimits-negativeDrug-date-picker--';
  yearDate: Date = moment(new Date().setHours(23, 59, 59))
    .add(1, 'year')
    .toDate();
  todaysDate: string = new Date().toString();

  get timePeriodForm(): FormGroup {
    return this._timePeriodForm;
  }
  approvalDrugActionAllDropdownOptions: Array<HealtheMenuOption> = [];
  denialsDrugActionAllDropdownOptions: Array<HealtheMenuOption> = [];
  approvalDoctorActionAllDropdownOptions: Array<HealtheMenuOption> = [];
  denialsDoctorActionAllDropdownOptions: Array<HealtheMenuOption> = [];

  ngOnInit() {
    //Creating Modal Sections
    this.buildModalSections(
      this.data.data.positiveDrugs,
      this.positiveDrugDatePickerControlName,
      this.approvalDrugActionAllDropdownOptions,
      false
    );
    this.buildModalSections(
      this.data.data.negativeDrugs,
      this.negativeDrugDatePickerControlName,
      this.denialsDrugActionAllDropdownOptions,
      true
    );
    this.buildModalSections(
      this.data.data.positiveDoctors,
      this.positiveDoctorDatePickerControlName,
      this.approvalDoctorActionAllDropdownOptions,
      false
    );
    this.buildModalSections(
      this.data.data.negativeDoctors,
      this.negativeDoctorDatePickerControlName,
      this.denialsDoctorActionAllDropdownOptions,
      true
    );
  }

  buildModalSections(
    itemDate: PbmPaperDateItem,
    idPrefix: string,
    dropdownOptions: Array<HealtheMenuOption>,
    isDeny: boolean
  ) {
    if (itemDate) {
      if (itemDate.priorAuthlimits) {
        //Creating FormControls
        this.createPriorAuthLimitsFormControls(
          itemDate.priorAuthlimits,
          idPrefix,
          isDeny
        );
      }
      if (itemDate.commonLimits) {
        //Creating Action all options
        this.createCommonListActionAllPresets(
          itemDate,
          idPrefix,
          dropdownOptions
        );
      }
    }
  }

  createPriorAuthLimitsFormControls(
    priorAuthlimits: PbmPriorAuthlimits[],
    idPrefix: string,
    isDeny: boolean
  ) {
    if (priorAuthlimits) {
      priorAuthlimits.forEach((authLimit, index) => {
        const validators = [
          Validators.required,
          DateRangeValidators.dateMustBeGreaterThan(authLimit.dateFilled)
        ];
        if (isDeny) {
          validators.push(
            DateRangeValidators.denyIndefinitelyDateMustBeLowerThan(
              this.yearDate.toString()
            )
          );
        } else {
          validators.push(
            DateRangeValidators.dateMustBeLowerThan(this.yearDate.toString())
          );
        }
        this._timePeriodForm.addControl(
          idPrefix + index,
          new FormControl(undefined, validators)
        );
      });
    }
  }

  createCommonListActionAllPresets(
    itemDate: PbmPaperDateItem,
    idPrefix: string,
    dropdownOptions: Array<HealtheMenuOption>
  ) {
    if (itemDate && itemDate.commonLimits) {
      itemDate.commonLimits.forEach((commonLimit) => {
        dropdownOptions.push({
          text: commonLimit.displayString,
          action: () => {
            itemDate.priorAuthlimits.forEach((auth, index) => {
              this.setPresetToDatePicker(
                commonLimit.numberOfDays,
                idPrefix + index,
                this.todaysDate
              );
            });
          }
        });
      });
    }
  }

  close() {
    this.matDialog.closeAll();
    this.applicationRef.tick();
  }
  setPresetToDatePicker(
    days: number,
    formControlName: string,
    fromDate: string
  ) {
    this.timePeriodForm
      .get(formControlName)
      .setValue(moment(fromDate).add(days, 'day').toDate());
  }

  generatePickerConfig(
    presets: PbmAuthorizationDatePickerPreset[],
    fromDate: string
  ) {
    const date = moment(fromDate).toDate();
    return {
      ...generateSingleDatePickerConfig(
        date,
        presets,
        moment(fromDate).add(1, 'year').toDate(),
        true
      ),
      placeholder: 'Enter Date'
    };
  }
  approvalSetOpenUntilClose(approvalActionAllMenu: MatMenu) {
    this.approvalActionAllMenuIcon = faChevronUp;
    approvalActionAllMenu.closed.subscribe(() => {
      this.approvalActionAllMenuIcon = faChevronDown;
    });
  }
  denialsSetOpenUntilClose(denialsActionAllMenuIcon: MatMenu) {
    this.denialsActionAllMenuIcon = faChevronUp;
    denialsActionAllMenuIcon.closed.subscribe(() => {
      this.denialsActionAllMenuIcon = faChevronDown;
    });
  }

  buildPaperSubmitMessage(): PbmPaperAuthorizationSubmitMessage {
    const submitMessage: PbmPaperAuthorizationSubmitMessage = {
      ...this.data.request
    };

    submitMessage.positiveDrugs = this.buildItemDateSubmitMessages(
      this.data.data.positiveDrugs,
      this.positiveDrugDatePickerControlName,
      false
    );
    submitMessage.negativeDrugs = this.buildItemDateSubmitMessages(
      this.data.data.negativeDrugs,
      this.negativeDrugDatePickerControlName,
      false
    );
    submitMessage.positiveDoctors = this.buildItemDateSubmitMessages(
      this.data.data.positiveDoctors,
      this.positiveDoctorDatePickerControlName,
      true
    );
    submitMessage.negativeDoctors = this.buildItemDateSubmitMessages(
      this.data.data.negativeDoctors,
      this.negativeDoctorDatePickerControlName,
      true
    );

    return submitMessage;
  }

  buildItemDateSubmitMessages(
    dateItems: PbmPaperDateItem,
    idPrefix: string,
    isDoctors: boolean
  ): PbmSubmitDateLimit[] {
    const dateLimits: PbmSubmitDateLimit[] = [];
    if (dateItems && dateItems.priorAuthlimits) {
      dateItems.priorAuthlimits.forEach((priorAuthLimit, index) => {
        const dateLimit: PbmSubmitDateLimit = {
          actionUntilDate: this.datePipe.transform(
            this.timePeriodForm.get(idPrefix + index).value,
            'yyyy-MM-dd'
          ),
          itemName: priorAuthLimit.itemName,
          authType: priorAuthLimit.authType
        };
        if (isDoctors) {
          dateLimit.dea = priorAuthLimit.dea;
        } else {
          dateLimit.ndc = priorAuthLimit.ndc;
        }
        dateLimits.push(dateLimit);
      });
    }
    return dateLimits;
  }

  submit() {
    this.timePeriodForm.markAllAsTouched();
    if (this.timePeriodForm.valid) {
      const submitMessage: PbmPaperAuthorizationSubmitMessage =
        this.buildPaperSubmitMessage();
      this.timePeriodModalService.submitPaperAuthorization(
        submitMessage,
        this.data.encodedAuthorizationId
      );
    }
  }
}
