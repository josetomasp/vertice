import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import { select, Store } from '@ngrx/store';
import { hexEncode } from '@shared';
import { takeWhileRouteActive } from '@shared/lib/operators/takeWhileRouteActive';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { StepStateDirective } from '@shared/directives/step-state.directive';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { getClaimV3 } from '@shared/store/selectors/claim.selectors';
import { combineLatest, Observable } from 'rxjs';
import { filter, first, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import {
  getDecodedClaimNumber,
  getDecodedCustomerId,
  getEncodedAuthorizationId,
  getEncodedClaimNumber,
  getEncodedCustomerId,
  getPbmLomnSelectedNdc
} from 'src/app/store/selectors/router.selectors';
import { RootState } from '../../../../store/models/root.models';
import {
  loadExparteCopiesRequired,
  loadLetterTypes,
  previewLOMN,
  resetCreateLOMNState,
  updateCreateLOMNForm
} from '../store/actions/create-lomn.actions';
import {
  LOMNSubmitContactInfo,
  LOMNSubmitMessage
} from '../store/models/create-lomn.models';
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
import {
  LomnSubmitModalComponent
} from './lomn-wizard-steps/lomn-preview-submit/components/lomn-submit-modal/lomn-submit-modal.component';
import {
  FusionClinicalAlert
} from 'src/app/claims/abm/referral/store/models/fusion/fusion-authorizations.models';
import {
  STEPPER_GLOBAL_OPTIONS,
  StepperSelectionEvent
} from '@angular/cdk/stepper';
import { uniqBy } from 'lodash';
import { AuthorizationLineItem } from '../store/models/pbm-authorization-information/authorization-line-item.models';

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
export class LomnWizardComponent
  extends DestroyableComponent
  implements OnInit
{
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
    map((medicationList) => {
      return uniqBy(this.createMedicationsLabels(medicationList), 'uniqueKey');
    })
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
  claimNumber$ = this.store$.pipe(
    takeWhileRouteActive('pbm'),
    select(getDecodedClaimNumber)
  );
  encodedClaimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));

  selectedDrugNdc$ = this.store$.pipe(select(getPbmLomnSelectedNdc));

  customerId$ = this.store$.pipe(first(), select(getDecodedCustomerId));
  encodedCustomerId$ = this.store$.pipe(select(getEncodedCustomerId));
  areExparteCopiesRequired = false;
  areExparteCopiesRequired$ = this.store$.pipe(
    takeUntil(this.onDestroy$),
    select(areExparteCopiesRequired)
  );
  authorizationId$: Observable<string> = this.store$.pipe(
    first(),
    select(getEncodedAuthorizationId)
  );
  submitMessage$ = this.store$.pipe(
    select(getSubmitMessageWithoutFormData),
    map(({ customerId, claimNumber, authorizationId }) => ({
      customerId,
      claimNumber,
      authorizationId,
      formState: this.lomnFormGroup.getRawValue()
    }))
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

  constructor(
    private fb: FormBuilder,
    public store$: Store<RootState>,
    public matDialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    protected router: Router,
    private renderer: Renderer2
  ) {
    super();
  }

  get medListForm(): FormArray {
    return this.lomnFormGroup.get('medicationList') as FormArray;
  }

  get attorneyAndClaimantInformationForm(): FormGroup {
    return this.lomnFormGroup.get(
      'attorneyAndClaimantInformation'
    ) as FormGroup;
  }

  ngOnInit() {
    combineLatest([this.areExparteCopiesRequired$, this.claimInfo$])
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
    combineLatest([
      this.encodedCustomerId$.pipe(first()),
      this.encodedClaimNumber$.pipe(first())
    ]).subscribe(([encodedCustomerId, encodedClaimNumber]) => {
      this.store$.dispatch(
        loadExparteCopiesRequired({ encodedCustomerId, encodedClaimNumber })
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
        combineLatest([
          this.claimNumber$,
          this.customerId$,
          this.authorizationId$
        ]).subscribe(
          ([decodedClaimNumber, decodedCustomerId, authorizationId]) => {
            this.router.navigate([
              `/claims/${hexEncode(decodedCustomerId)}/${hexEncode(
                decodedClaimNumber
              )}/pbm/${authorizationId}/pos/authorizationInformation`
            ]);
          }
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
    if(!this.isFormInvalid()){
      this.submitMessage$
        .pipe(first(), withLatestFrom(this.ndcToLineItemMap$))
        .subscribe(([submitMessage, ndcToLineItemMap]) => {
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
              ndcToLineItemMap,
              submittingLOMN$: this.submittingLOMN$,
              claimantContactInfo: this.claimantContactInfo,
              attorneyContactInfo: this.attorneyContactInfo
            }
          });
        });
    }
    else{
      this.medListForm.controls.forEach((form: FormGroup)=>{
        Object.keys(form.controls).forEach(key => {
          form.get(key).markAllAsTouched();
          form.get(key).updateValueAndValidity();
        });
      });
    }
  }

  private buildClaimantAndAttorneyData(
    attAndClaimantInfo,
    claimData: ClaimV3
  ): void {
    this.claimantContactInfo = {
      firstName: claimData.claimant.firstName,
      lastName: claimData.claimant.lastName,
      middle: claimData.claimant.middleName,
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

  isFormInvalid() {
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

  // This always returns an empty string, the ngClass (which originally was the way I was intending to do this, but mat-steps ignore classes added to them,
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

  private createMedicationsLabels(medicationList) {
    return medicationList.map((medication) => {
      let label = medication.value.drugItemName + ' - Prescribed by ';
      if (
        medication.value?.prescriber.lastName &&
        medication.value?.prescriber.lastName.trim().length > 0
      ) {
        const middleInitial =
          medication.value.prescriber.middleName &&
          medication.value.prescriber.middleName.length > 0
            ? medication.value.prescriber.middleName
                .substr(0, 1)
                .toUpperCase() + ' '
            : '';
        label =
          label +
          medication.value.prescriber.lastName +
          ', ' +
          medication.value.prescriber.name +
          ' ' +
          middleInitial +
          medication.value.prescriber.credential;
      } else {
        label = label + medication.value.prescriber.npi;
      }
      return {
        ...medication,
        label: label
      };
    });
  }
}
