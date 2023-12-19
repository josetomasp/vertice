import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AddFirstFillService,
  AddFirstFillTempMemberIdRequest,
  SaveFirstFillRequest
} from './add-first-fill.service';
import { debounceTime, first, skip, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  addFirstFillSsnValidator,
  dateOfInjuryMaxDaysValidator
} from './add-first-fill.validators';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { ConfirmationModalData, ModalData } from '@shared';
import { MatDialog } from '@angular/material/dialog';
import {
  NonParticipatingEmployersModalComponent,
  NonParticipatingEmployersModalData
} from './non-participating-employers-modal/non-participating-employers-modal.component';
import { PageTitleService } from '@shared/service/page-title.service';
import * as _moment from 'moment';
import { InformationModalService } from '@shared/components/information-modal/information-modal.service';

export interface AddFirstFillCustomerReferenceData {
  customerId: string;
  dateOfInjuryMaximumAgeInDays: number;
  nonParticipatingEmployers: string[];
  forbiddenStates: string[];
}

export interface AddFirstFillReferenceData {
  customerSpecificReferenceData: AddFirstFillCustomerReferenceData[];
  relationships: string[];
  states: string[];
}
const moment = _moment;

@Component({
  selector: 'healthe-add-first-fill',
  templateUrl: './add-first-fill.component.html',
  styleUrls: ['./add-first-fill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFirstFillComponent extends DestroyableComponent
  implements OnInit {
  referenceData: AddFirstFillReferenceData = {
    customerSpecificReferenceData: [],
    relationships: [],
    states: []
  };

  genders: string[] = ['Male', 'Female'];
  dateOfInjuryErrorText = '';
  showForbiddenStatesMessage = false;
  saveFirstFillButtonClickedOnce = false;
  nonParticipatingMatches: string[];
  addFirstfillErrors: string[];
  confirmModalData: ConfirmationModalData;

  currentCustomerReferenceData: AddFirstFillCustomerReferenceData = null;
  private defaultValues: any;

  formGroup: FormGroup;
  @ViewChild('customerIdDropDown', { static: false })
  customerIdDropDown: ElementRef;

  @ViewChild('firstFillErrorBanner', { static: false })
  private firstFillErrorBanner: ElementRef;
  constructor(
    public addFirstFillService: AddFirstFillService,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public confirmationModalService: ConfirmationModalService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private pageTitleService: PageTitleService,
    private informationModalService: InformationModalService
  ) {
    super();

    pageTitleService.setTitle('Add First Fill');
  }

  ngOnInit() {
    this.addFirstFillService
      .getFirstFillReferenceData()
      .pipe(first())
      .subscribe((success) => {
        this.referenceData = success;
      });

    this.buildFormGroup();
    this.bindFormControlEvents();
  }

  private buildFormGroup() {
    this.formGroup = new FormGroup({});
    this.formGroup.addControl(
      'customerId',
      new FormControl(null, Validators.required)
    );
    this.formGroup.addControl(
      'claimantSSN',
      new FormControl('', addFirstFillSsnValidator)
    );
    this.formGroup.addControl(
      'dateOfInjury',
      new FormControl(null, [Validators.required, dateOfInjuryMaxDaysValidator])
    );
    this.formGroup.addControl('unableToEnter15DigitId', new FormControl(false));

    this.formGroup.addControl('tempMemberId', new FormControl(null));

    this.formGroup.addControl(
      'claimantFirstname',
      new FormControl(null, Validators.required)
    );
    this.formGroup.addControl(
      'claimantLastname',
      new FormControl(null, Validators.required)
    );
    this.formGroup.addControl(
      'claimantDateOfBirth',
      new FormControl(null, Validators.required)
    );
    this.formGroup.addControl(
      'claimantGender',
      new FormControl(null, Validators.required)
    );
    this.formGroup.addControl('claimantStreetAddr1', new FormControl());
    this.formGroup.addControl('claimantStreetAddr2', new FormControl());
    this.formGroup.addControl('claimantCity', new FormControl());
    this.formGroup.addControl('claimantState', new FormControl());
    this.formGroup.addControl('claimantZip', new FormControl());
    this.formGroup.addControl('claimantPhone', new FormControl());

    this.formGroup.addControl(
      'employerName',
      new FormControl(null, Validators.required)
    );
    this.formGroup.addControl('employerStreetAddr1', new FormControl());
    this.formGroup.addControl('employerStreetAddr2', new FormControl());
    this.formGroup.addControl('employerCity', new FormControl());
    this.formGroup.addControl('employerState', new FormControl());
    this.formGroup.addControl('employerZip', new FormControl());
    this.formGroup.addControl('employerPhone', new FormControl());

    this.formGroup.addControl(
      'callerRelationship',
      new FormControl(null, Validators.required)
    );
    this.formGroup.addControl(
      'callerAllowDateOfInjuryOverride',
      new FormControl()
    );
    this.defaultValues = { ...this.formGroup.getRawValue() };
  }

  bindFormControlEvents() {
    // When this check box toggles, dateOfInjury will need to checked for validity.
    this.formGroup.controls['callerAllowDateOfInjuryOverride'].valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.formGroup.controls['dateOfInjury'].updateValueAndValidity();
      });

    // To help with form validation
    this.formGroup.addControl('dateOfInjuryMaxDays', new FormControl(15));

    // Limit the field length to 9 digits, the html attribute maxLength doesn't work because this is an number field.
    this.formGroup.controls['claimantSSN'].valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        value = '' + value;
        if (null != value && value.length > 9) {
          this.formGroup.controls['claimantSSN'].setValue(value.substr(0, 9), {
            emitEvent: false
          });
        }
      });

    this.formGroup.controls['customerId'].valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (value) {
          this.currentCustomerReferenceData = value;
          this.formGroup.controls['dateOfInjuryMaxDays'].setValue(
            this.currentCustomerReferenceData.dateOfInjuryMaximumAgeInDays
          );

          this.dateOfInjuryErrorText =
            'Required, MM/DD/YYYY, must be in the last ' +
            this.currentCustomerReferenceData.dateOfInjuryMaximumAgeInDays +
            ' days.';
        }
      });

    this.formGroup.controls['employerState'].valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((state) => {
        if (state && this.currentCustomerReferenceData) {
          if (
            this.currentCustomerReferenceData.forbiddenStates.indexOf(state) >
            -1
          ) {
            this.showForbiddenStatesMessage = true;
          } else {
            this.showForbiddenStatesMessage = false;
          }
        }
      });

    this.setupTempMemberIDLogic();
  }
  setupTempMemberIDLogic() {
    this.formGroup.controls['customerId'].valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        skip(1)
      )
      .subscribe(() => {
        this.generateTempMemberIdIfNeeded();
      });

    this.formGroup.controls['dateOfInjury'].valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(250)
      )
      .subscribe(() => {
        this.generateTempMemberIdIfNeeded();
      });

    this.formGroup.controls['claimantDateOfBirth'].valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(250)
      )
      .subscribe(() => {
        this.generateTempMemberIdIfNeeded();
      });

    this.formGroup.controls['claimantSSN'].valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(250)
      )
      .subscribe(() => {
        this.generateTempMemberIdIfNeeded();
      });

    this.formGroup.controls['unableToEnter15DigitId'].valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(250)
      )
      .subscribe((value) => {
        this.formGroup.controls['claimantSSN'].markAsTouched();
        this.formGroup.controls['claimantSSN'].updateValueAndValidity();
        this.generateTempMemberIdIfNeeded();
      });

    this.formGroup.controls['employerName'].valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (
          value &&
          this.currentCustomerReferenceData &&
          this.currentCustomerReferenceData.nonParticipatingEmployers &&
          value.length > 3
        ) {
          this.nonParticipatingMatches = this.currentCustomerReferenceData.nonParticipatingEmployers.filter(
            (x) => {
              return x.toLowerCase().indexOf(value.toLowerCase()) > -1;
            }
          );
        } else {
          this.nonParticipatingMatches = [];
        }
      });
  }

  generateTempMemberIdIfNeeded() {
    const customerId = this.formGroup.controls['customerId'] as FormControl;
    const dateOfInjury = this.formGroup.controls['dateOfInjury'] as FormControl;
    const claimantDateOfBirth = this.formGroup.controls[
      'claimantDateOfBirth'
    ] as FormControl;
    const claimantSSN = this.formGroup.controls['claimantSSN'] as FormControl;
    const unableToEnter15DigitId = this.formGroup.controls[
      'unableToEnter15DigitId'
    ] as FormControl;
    const tempMemberId = this.formGroup.controls['tempMemberId'] as FormControl;

    if (
      customerId.valid &&
      dateOfInjury.valid &&
      claimantDateOfBirth.valid &&
      claimantSSN.valid
    ) {
      const request: AddFirstFillTempMemberIdRequest = {
        customerId: customerId.value.customerId,
        dateOfInjury: dateOfInjury.value,
        dateOfBirth: claimantDateOfBirth.value,
        ssn: claimantSSN.value,
        unableToEnter15DigitId: unableToEnter15DigitId.value
      };

      this.addFirstFillService
        .getFirstFillTempMemberId(request)
        .pipe(first())
        .subscribe((response) => {
          if (response.httpStatusCode < 300) {
            tempMemberId.setValue(response.responseBody);
            this.changeDetectorRef.detectChanges();
          }
        });
    } else {
      tempMemberId.setValue(null);
      this.changeDetectorRef.detectChanges();
    }
  }

  goBackButton() {
    this.router.navigate(['../authorization-status-queue'], {
      relativeTo: this.activeRoute
    });
  }

  viewNonParticipatingList() {
    let modalData: NonParticipatingEmployersModalData = {
      selectedCustomer: this.currentCustomerReferenceData.customerId,
      nonParticipatingEmployers: this.currentCustomerReferenceData
        .nonParticipatingEmployers
    };
    this.matDialog.open(NonParticipatingEmployersModalComponent, {
      data: modalData,
      // autoFocus: false,
      width: '750px'
      // height: modalHeight,
      // minHeight: '220px',
      // disableClose: true
    });
  }

  isViewNonParticipatingListDisabled(): boolean {
    return (
      !this.currentCustomerReferenceData ||
      this.currentCustomerReferenceData.nonParticipatingEmployers.length === 0
    );
  }

  isSaveFirstFillButtonEnabled(): boolean {
    if (null == this.currentCustomerReferenceData) {
      return false;
    }
    if (false === this.saveFirstFillButtonClickedOnce) {
      return true;
    }

    return this.formGroup.valid;
  }
  saveFirstFill() {
    this.saveFirstFillButtonClickedOnce = true;
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
    } else {
      if (
        this.showForbiddenStatesMessage &&
        this.currentCustomerReferenceData.nonParticipatingEmployers.indexOf(
          this.formGroup.controls['employerName'].value
        ) > -1
      ) {
        this.confirmModalData = {
          titleString: 'Warning',
          bodyHtml:
            '<div><p> Prohibited Employer </p>  <p> First Fill Not Supported In ' +
            this.formGroup.controls['employerState'].value +
            ' </p> Are you sure you want to submit this request?  You will not be able to undo this action.</div>',
          affirmString: 'CONTINUE',
          affirmClass: 'success-button',
          denyString: 'CANCEL',
          headerClass: 'confirmationModalHeader',
          minHeight: '280px'
        };
      } else if (this.showForbiddenStatesMessage) {
        this.confirmModalData = {
          titleString: 'Warning',
          bodyHtml:
            '<div> <p> First Fill Not Supported In ' +
            this.formGroup.controls['employerState'].value +
            ' </p> Are you sure you want to submit this request?  You will not be able to undo this action.</div>',
          affirmString: 'CONTINUE',
          affirmClass: 'success-button',
          denyString: 'CANCEL',
          headerClass: 'confirmationModalHeader',
          minHeight: '280px'
        };
      } else if (
        this.currentCustomerReferenceData.nonParticipatingEmployers.indexOf(
          this.formGroup.controls['employerName'].value
        ) > -1
      ) {
        this.confirmModalData = {
          titleString: 'Warning',
          bodyHtml:
            '<div> <p> Prohibited Employer </p> Are you sure you want to submit this request?  You will not be able to undo this action.</div>',
          affirmString: 'CONTINUE',
          affirmClass: 'success-button',
          denyString: 'CANCEL',
          headerClass: 'confirmationModalHeader',
          minHeight: '280px'
        };
      } else {
        this.confirmModalData = {
          titleString: 'Submit',
          bodyHtml:
            '<div>Are you sure you want to submit this request?  You will not be able to undo this action.</div>',
          affirmString: 'CONTINUE',
          affirmClass: 'success-button',
          denyString: 'CANCEL',
          minHeight: '250px'
        };
      }

      this.confirmationModalService
        .displayModal(this.confirmModalData)
        .afterClosed()
        .pipe(first())
        .subscribe((confirmed) => {
          if (confirmed) {
            this.addFirstfillErrors = [];
            this.changeDetectorRef.detectChanges();
            let request: SaveFirstFillRequest = {
              customerId: this.currentCustomerReferenceData.customerId,
              memberId: this.formGroup.controls['tempMemberId'].value,
              tempMemberId: '',
              claimantGender: this.formGroup.controls['claimantGender'].value,
              claimantLastname: this.formGroup.controls['claimantLastname']
                .value,
              claimantFirstname: this.formGroup.controls['claimantFirstname']
                .value,
              claimantStreetAddr1: this.formGroup.controls[
                'claimantStreetAddr1'
              ].value,
              claimantStreetAddr2: this.formGroup.controls[
                'claimantStreetAddr2'
              ].value,
              claimantCity: this.formGroup.controls['claimantCity'].value,
              claimantState: this.formGroup.controls['claimantState'].value,
              claimantZip: this.formGroup.controls['claimantZip'].value,
              claimantDateOfBirth: moment(
                this.formGroup.controls['claimantDateOfBirth'].value
              ).format('YYYYMMDD'),
              claimantPhone: this.formGroup.controls['claimantPhone'].value,
              claimantSSN: this.formGroup.controls['claimantSSN'].value,
              employerName: this.formGroup.controls['employerName'].value,
              employerStreetAddr1: this.formGroup.controls[
                'employerStreetAddr1'
              ].value,
              employerStreetAddr2: this.formGroup.controls[
                'employerStreetAddr2'
              ].value,
              employerCity: this.formGroup.controls['employerCity'].value,
              employerState: this.formGroup.controls['employerState'].value,
              employerZip: this.formGroup.controls['employerZip'].value,
              employerPhone: this.formGroup.controls['employerPhone'].value,
              callerName: '',
              callerPhone: '',
              callerRelationship: this.formGroup.controls['callerRelationship']
                .value,
              callerAllowDateOfInjuryOverride: this.formGroup.controls[
                'callerAllowDateOfInjuryOverride'
              ].value,
              lob: 'WC   ',
              employer_state: this.formGroup.controls['employerState'].value,
              dateOfInjury: moment(
                this.formGroup.controls['dateOfInjury'].value
              ).format('YYYYMMDD')
            };

            this.addFirstFillService
              .saveFirstFill(request)
              .subscribe((response) => {
                if (response.errors && response.errors.length > 0) {
                  this.addFirstfillErrors = response.errors;
                  this.changeDetectorRef.detectChanges();
                  this.firstFillErrorBanner.nativeElement.scrollIntoView({
                    block: 'center',
                    behavior: 'smooth'
                  });
                } else {
                  const modalData: ModalData = {
                    titleString: 'Confirmation',
                    bodyHtml:
                      'First Fill Member with id ' +
                      response.responseBody +
                      ' has successfully been added to PHI.',
                    affirmString: 'CONTINUE',
                    affirmClass: 'success-button',
                    minHeight: '190px'
                  };
                  this.informationModalService
                    .displayModal(modalData)
                    .afterClosed()
                    .pipe(first())
                    .subscribe(() => {
                      this.formGroup.reset(this.defaultValues);
                      this.currentCustomerReferenceData = null;
                      this.showForbiddenStatesMessage = false;
                      this.customerIdDropDown.nativeElement.scrollIntoView({
                        block: 'center',
                        behavior: 'smooth'
                      });
                    });
                }
              });
          }
        });
    }
  }
}
