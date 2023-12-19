import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStep, MatStepHeader, MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { createSelector, select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import {
  filter,
  first,
  map,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';
import {
  areExparteCopiesRequired,
  getCreateLOMNResponse,
  getLetterTypes,
  getLomnMedList,
  getNdcArrayList,
  getNdcToAlertMap,
  getNdcToLineItemMap,
  getSubmitMessageWithoutFormData,
  isSubmittingLOMN
} from '../store/selectors/create-lomn.selectors';
import { addClaimantValuesToFormGroup } from './addClaimantValuesToFormGroup';
import { LomnSubmitModalComponent } from './lomn-wizard-steps/lomn-preview-submit/components/lomn-submit-modal/lomn-submit-modal.component';
import {
  STEPPER_GLOBAL_OPTIONS,
  StepperSelectionEvent
} from '@angular/cdk/stepper';
import { AuthorizationLineItem } from '../store/models/pbm-authorization-information.model';
import {
  LOMNSubmitContactInfo,
  LOMNSubmitMessage
} from '../store/models/create-lomn.models';
import {
  loadLetterTypes,
  previewLOMN,
  resetCreateLOMNState,
  updateCreateLOMNForm
} from '../store/actions/create-lomn.actions';
import { ClaimV3 } from '../store/models/claim.models';
import { StepStateDirective } from '../step-state.directive';
import { FusionClinicalAlert } from '../store/models/fusion-authorizations.models';
import {
  getDecodedClaimNumber,
  getDecodedCustomerId,
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getPbmLomnSelectedNdc
} from '../store/selectors/router.selectors';
import { getClaimV3 } from '../store/selectors/claim.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';
import { uniqBy } from 'lodash';

enum LomnSteps {
  MedList,
  AttorneyAndClaimantInfo,
  PreviewAndSubmit
}
@Component({
  selector: 'healthe-lomn-wizard',
  templateUrl: './lomn-wizard.component.html',
  styleUrls: ['./lomn-wizard.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LomnWizardComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();

  @ViewChild(MatStepper, { static: true })
  matStepper: MatStepper;
  @ViewChild(StepStateDirective, { static: true })
  stepStateDirective: StepStateDirective;

  lomnSteps = LomnSteps;

  lomnFormGroup = this.fb.group({
    medicationList: this.fb.array(
      [],
      [
        (formArray: FormArray) => {
          const hasNoSelection = formArray.controls.length < 1;
          return hasNoSelection ? { hasNoSelection } : null;
        }
      ]
    ),
    attorneyAndClaimantInformation: this.fb.group({
      attorneyInvolvement: false,
      claimantInformation: this.fb.group({
        name: null,
        addressLine1: [null, [Validators.required, this.noWhitespaceValidator]],
        addressLine2: null,
        city: [null, [Validators.required, this.noWhitespaceValidator]],
        state: [null, [Validators.required]],
        zipCode: [
          null,
          [
            Validators.required,
            this.noWhitespaceValidator,
            this.zipCodeValidator
          ]
        ],
        phone: null
      }),
      attorneyInformation: this.fb.group({
        name: [null, [Validators.required, this.noWhitespaceValidator]],
        addressLine1: [null, [Validators.required, this.noWhitespaceValidator]],
        addressLine2: null,
        city: [null, [Validators.required, this.noWhitespaceValidator]],
        state: [null, [Validators.required]],
        zipCode: [
          null,
          [
            Validators.required,
            this.noWhitespaceValidator,
            this.zipCodeValidator
          ]
        ],
        phone: null,
        email: null,
        fax: null
      })
    })
  });
  medListOptions$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getLomnMedList),
    map((data) => uniqBy(data, 'uniqueKey'))
  );
  ndcToAlertMap$: Observable<{
    [ndc: string]: FusionClinicalAlert[];
  }> = this.store$.pipe(takeUntil(this.onDestroy$), select(getNdcToAlertMap));
  ndcToLineItemMap$: Observable<{
    [ndc: string]: AuthorizationLineItem;
  }> = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getNdcToLineItemMap)
  );
  ndcArray$: Observable<string[]> = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getNdcArrayList)
  );
  createLOMNResponse$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(getCreateLOMNResponse)
  );
  claimNumber$ = this.store$.pipe(first(), select(getDecodedClaimNumber));
  encodedClaimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));

  selectedDrugNdc$ = this.store$.pipe(select(getPbmLomnSelectedNdc));

  customerId$ = this.store$.pipe(first(), select(getDecodedCustomerId));
  encodedCustomerId$ = this.store$.pipe(select(getEncodedCustomerId));
  areExparteCopiesRequired = false;
  areExparteCopiesRequired$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(areExparteCopiesRequired)
  );

  getSubmitMessagePreliminaryData = createSelector(
    getSubmitMessageWithoutFormData,
    getNdcToLineItemMap,
    ({ customerId, claimNumber, authorizationId }, ndcToLineItemMap) => ({
      customerId,
      claimNumber,
      authorizationId,
      ndcToLineItemMap
    })
  );

  submitMessage$ = this.store$.pipe(
    select(this.getSubmitMessagePreliminaryData),
    map(({ customerId, claimNumber, authorizationId, ndcToLineItemMap }) => {
      return this.lomnFormGroup
        .getRawValue()
        .medicationList.map((medicationList: AuthorizationLineItem) => {
          return {
            ...ndcToLineItemMap[medicationList.ndc],
            comment: medicationList.displayNotes,
            attorney: this.attorneyContactInfo,
            claimNo: claimNumber,
            claimant: this.claimantContactInfo,
            customerID: customerId,
            prescriberFax: medicationList.prescriberFax,
            paperBillKey: this.isPosAuth
              ? null
              : authorizationId,
            authorizationKey: this.isPosAuth
              ? authorizationId
              : null
          };
        });
    })
  );
  submitErrors: string[] = [];
  claimInfo$: Observable<ClaimV3> = this.store$.pipe(select(getClaimV3));
  submittingLOMN$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(isSubmittingLOMN)
  );

  letterTypes$ = this.store$.pipe(select(getLetterTypes));
  showPrevious: boolean = false;
  lettersSended: boolean = false;
  isSubmitting: boolean = false;
  rawSubmitFormValues;
  claimantContactInfo: LOMNSubmitContactInfo;
  attorneyContactInfo: LOMNSubmitContactInfo;
  userClickedWithoutPrescriptionSelected: boolean = false;
  submissionSuccess: boolean = false;
  isPosAuth: boolean = true;

  constructor(
    private fb: FormBuilder,
    public store$: Store<any>,
    public matDialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    protected router: Router,
    private renderer: Renderer2,
    public snackbar: MatSnackBar
  ) {}

  get medListForm(): FormArray {
    return this.lomnFormGroup.get('medicationList') as FormArray;
  }

  get attorneyAndClaimantInformationForm(): FormGroup {
    return this.lomnFormGroup.get(
      'attorneyAndClaimantInformation'
    ) as FormGroup;
  }

  getClaimInfoForForm = createSelector(
    areExparteCopiesRequired,
    getClaimV3,
    (req, claimInfo) => [req, claimInfo]
  );

  ngOnInit() {
    
    if (-1 === this.router.url.indexOf('/pos/')) {
      this.isPosAuth = false;
    }

    this.store$
      .pipe(select(this.getClaimInfoForForm))
      .pipe(filter(([req, claimInfo]) => null != req && null != claimInfo))
      .subscribe(([req, claimInfo]) => {
        if (
          !req &&
          this.lomnFormGroup.get(
            'attorneyAndClaimantInformation.claimantInformation'
          )
        ) {
          addClaimantValuesToFormGroup(
            claimInfo,
            this.lomnFormGroup.get(
              'attorneyAndClaimantInformation.claimantInformation'
            ) as FormGroup
          );
          this.lomnFormGroup
            .get('attorneyAndClaimantInformation.attorneyInformation')
            .disable();
        }
        this.buildClaimantAndAttorneyData(
          this.attorneyAndClaimantInformationForm.value,
          claimInfo
        );
        this.changeDetectorRef.detectChanges();
      });
    this.medListForm.statusChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((status) => {
        if (this.userClickedWithoutPrescriptionSelected) {
          this.userClickedWithoutPrescriptionSelected =
            this.matStepper.selectedIndex === 0 &&
            this.medListForm.hasError('hasNoSelection');
          this.changeDetectorRef.detectChanges();
        }
      });
    this.matStepper.selectionChange.subscribe(
      (event: StepperSelectionEvent) => {
        this.showPrevious = event.selectedIndex !== LomnSteps.MedList;
        this.userClickedWithoutPrescriptionSelected =
          this.matStepper.selectedIndex === 0 &&
          this.medListForm.hasError('hasNoSelection');
        this.medListForm.updateValueAndValidity();
        this.changeDetectorRef.detectChanges();
      }
    );
    this.submittingLOMN$.subscribe(
      (isSubmittingLOMNFlag) => (this.isSubmitting = isSubmittingLOMNFlag)
    );
    this.store$.dispatch(resetCreateLOMNState());
    this.ndcArray$
      .pipe(first((ndcs) => ndcs != null && ndcs.length > 0))
      .subscribe((ndcs) => {
        this.store$.dispatch(loadLetterTypes({ ndcs }));
      });
    this.createLOMNResponse$.subscribe((response) => {
      this.submissionSuccess = response.successful;
      if (response.successful) {
        window.close();
        this.snackbar.open(
          'LOMN was sent successfully. Please close this window.',
          null,
          { panelClass: ['success', 'snackbar'] }
        );
      } else {
        if (this.lettersSended && !this.isSubmitting) {
          this.submitErrors =
            response.errors && response.errors.length > 0
              ? response.errors
              : ['Send Letter(s) of Medical Necessity Service Down'];

          this.changeDetectorRef.detectChanges();
        }
      }
    });
    this.lomnFormGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$), withLatestFrom(this.claimInfo$))
      .subscribe(([values, claimData]) => {
        this.buildClaimantAndAttorneyData(
          values.attorneyAndClaimantInformation,
          claimData
        );
        this.store$.dispatch(updateCreateLOMNForm({ formValues: values }));
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { required: true };
  }

  zipCodeValidator(control: FormControl) {
    if (
      control.value &&
      control.value.trim() !== '' &&
      !control.value.match(/^[0-9]{5}(?:-?[0-9]{4})?$/)
    ) {
      return { zipCodeWrongFormat: true };
    }
    return null;
  }

  nextStep() {
    this.userClickedWithoutPrescriptionSelected =
      this.matStepper.selectedIndex === 0 &&
      this.medListForm.hasError('hasNoSelection');
    if (!this.userClickedWithoutPrescriptionSelected) {
      this.matStepper.next();
    }
  }

  previousStep() {
    this.matStepper.previous();
  }

  submitLOMN() {
    this.submitMessage$.pipe(first()).subscribe((submitMessage) => {
      this.lettersSended = true;
      this.submitErrors = [];
      this.matDialog.open(LomnSubmitModalComponent, {
        autoFocus: false,
        width: '750px',
        height: '225px',
        minHeight: '220px',
        disableClose: false,
        data: {
          submitMessage,
          submittingLOMN$: this.submittingLOMN$
        }
      });
    });
  }

  closeWindow() {
    window.close();
  }

  private buildClaimantAndAttorneyData(
    attAndClaimantInfo,
    claimData: ClaimV3
  ): void {
    const { middleName, lastName, firstName } = claimData.claimant;
    this.claimantContactInfo = {
      firstName: firstName,
      lastName: lastName,
      middle: middleName,
      address1: attAndClaimantInfo.claimantInformation.addressLine1,
      address2: attAndClaimantInfo.claimantInformation.addressLine2,
      city: attAndClaimantInfo.claimantInformation.city,
      fax: attAndClaimantInfo.claimantInformation.fax,
      state: attAndClaimantInfo.claimantInformation.state,
      zip: attAndClaimantInfo.claimantInformation.zipCode,
      phone: attAndClaimantInfo.claimantInformation.phone
    };
    if (attAndClaimantInfo.attorneyInvolvement) {
      this.attorneyContactInfo = {
        firstName: claimData.attorney.firstName,
        lastName: claimData.attorney.lastName,
        middle: claimData.attorney.middleName,
        address1: attAndClaimantInfo.attorneyInformation.addressLine1,
        address2: attAndClaimantInfo.attorneyInformation.addressLine2,
        city: attAndClaimantInfo.attorneyInformation.city,
        fax: attAndClaimantInfo.attorneyInformation.fax,
        state: attAndClaimantInfo.attorneyInformation.state,
        zip: attAndClaimantInfo.attorneyInformation.zipCode,
        name: attAndClaimantInfo.attorneyInformation.name,
        email: attAndClaimantInfo.attorneyInformation.email,
        phone: attAndClaimantInfo.attorneyInformation.phone
      };
    } else {
      this.attorneyContactInfo = null;
    }
  }

  previewLomn(previewMessage: LOMNSubmitMessage) {
    this.store$.dispatch(
      previewLOMN(this.cleanLOMNSubmitMessage(previewMessage))
    );
  }

  isSubmitButtonDisabled() {
    return (
      (this.medListForm && this.medListForm.controls.length === 0) ||
      this.medListForm.invalid ||
      (this.lomnFormGroup.get('attorneyAndClaimantInformation') &&
        this.lomnFormGroup.get('attorneyAndClaimantInformation').invalid)
    );
  }

  cleanLOMNSubmitMessage(message: any): LOMNSubmitMessage {
    message = { ...message };
    const propertyNames = [
      'claimNo',
      'comment',
      'customerID',
      'dateFilled',
      'nabp',
      'ndc',
      'npi',
      'prescriberFax',
      'daysSupply',
      'paperLineItemKey',
      'posLineItemKey',
      'quantity',
      'compound',
      'attorney',
      'claimant',
      'paperBillKey'
    ];
    Object.keys(message).forEach(
      (k) =>
        (message[k] == null || !propertyNames.includes(k)) && delete message[k]
    );
    return message;
  }

  // This always returns an empty string, the ngClass (which originally was the
  // way I was intending to do this, but mat-steps ignore classes added to them,
  // will cause this to update for each mat step and pass in the correct mat-step instance into this function.
  getStepStatusClass(matStep: MatStep, stepType: LomnSteps) {
    // The following classes are not defined anywhere, they are just used for css selectors
    let selectedClass = '';

    if (this.matStepper.selected) {
      if (this.matStepper.selected.label === matStep.label) {
        selectedClass = 'stepperStateClass_activeStep';
      } else {
        if (matStep.interacted) {
          // The med list has some special logic because for whatever reason, the form array contains ALL of the
          // form controls for every step, so if there is an error anywhere, on any step, it shows up as this
          // step having an error.
          // What is actually desired is that this step to be valid if there is at least one selection.
          // So I just check the form array length > 0.  It was to do this or try and untangle the way the formgroup was made.
          // I chose this because of the potential bugs that I could introduce by 'fixing' the form group architecture.
          if (stepType === LomnSteps.MedList) {
            const fa: FormArray = matStep.stepControl as FormArray;
            if (fa.length > 0) {
              selectedClass = 'stepperStateClass_visitedValid';
            } else {
              selectedClass = 'stepperStateClass_visitedInvalid';
            }
          } else {
            if (matStep.stepControl.valid) {
              selectedClass = 'stepperStateClass_visitedValid';
            } else {
              selectedClass = 'stepperStateClass_visitedInvalid';
            }
          }
        } else {
          selectedClass = 'stepperStateClass_visitedNever';
        }
      }
    }

    this.applyClassToStepHeader(matStep, selectedClass);

    return '';
  }

  private applyClassToStepHeader(matStep: MatStep, someclass: string) {
    if (matStep._stepper._stepHeader) {
      matStep._stepper._stepHeader
        .toArray()
        .forEach((currentHeader: MatStepHeader, index, headersList) => {
          if (currentHeader.label === matStep.label) {
            this.removeOldStepperClasses(currentHeader._getHostElement());
            this.renderer.addClass(currentHeader._getHostElement(), someclass);
          }
        });
    }
  }

  private removeOldStepperClasses(htmlElement: HTMLElement) {
    const deleteList: string[] = [];
    htmlElement.classList.forEach((value, key, parent) => {
      if (value.startsWith('stepperStateClass_')) {
        deleteList.push(value);
      }
    });

    deleteList.forEach((value) => {
      this.renderer.removeClass(htmlElement, value);
    });
  }
}
