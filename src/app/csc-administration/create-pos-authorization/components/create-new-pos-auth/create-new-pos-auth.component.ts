import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Location } from '@angular/common';
import { CscCreatePosAuthRouteParams } from '../../create-pos-authorization.component';
import { CreateNewPosAuthService } from './create-new-pos-auth.service';
import {
  catchError,
  debounceTime,
  filter,
  first,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  AddedPosAuthPrescriptions,
  AddLineItemPosAuthRequestBody,
  CreatePosAuthPrimaryRejectCode,
  CreatePosAuthRequestBody,
  PbmExistingAuthorization,
  PbmPrescriptionDetail,
  PbmPrescriptionHistory
} from './create-new-pos-auth.models';
import { TableCondition } from '../../../../verbiage.service';
import { CscAdministrationService } from '../../../csc-administration.service';
import { AlertType } from '@shared/components/confirmation-banner/confirmation-banner.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewAuthModalService } from '../../../authorization-status-queue/create-new-auth-modal/create-new-auth-modal.service';
import { OtherMedicationSearchModalComponent } from './components/other-medication-search-modal/other-medication-search-modal.component';
import { MemberIDInfo } from '../../../authorization-status-queue/create-new-auth-modal/create-new-auth-modal.component';
import { PageTitleService } from '@shared/service/page-title.service';
import { CompoundModalData, CompoundModalIngredient, VerticeResponse } from '@shared';
import { faFile, faExclamationCircle } from '@fortawesome/pro-light-svg-icons';
import * as _moment from 'moment';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { FormValidationExtractorService } from '@modules/form-validation-extractor';
import { LoadingModalComponent } from '@shared/components/loading-modal/loading-modal.component';
import { DrugLookup } from '@shared/components/info-lookup-launcher/info-lookup-launcher.component';
import { environment } from '../../../../../environments/environment';

const moment = _moment;

export interface CreateNewPosAuthComponentViewContext {
  hasData: boolean;
  rxHistoryRows: AddedPosAuthPrescriptions[];
  formGroupData: any;
  populatedPrescriptionDetails: AddedPosAuthPrescriptions[];
  rejectCodeOptions: CreatePosAuthPrimaryRejectCode[];
}

@Component({
  selector: 'healthe-create-new-pos-auth',
  templateUrl: './create-new-pos-auth.component.html',
  styleUrls: ['./create-new-pos-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormValidationExtractorService]
})
export class CreateNewPosAuthComponent
  extends DestroyableComponent
  implements OnInit, OnDestroy
{
  @Input()
  encodedRouteParams: CscCreatePosAuthRouteParams;

  @Input()
  decodedRouteParams: CscCreatePosAuthRouteParams;

  @Input()
  viewContext: CreateNewPosAuthComponentViewContext;

  @Output()
  memberSearchChange: EventEmitter<MemberIDInfo> = new EventEmitter<MemberIDInfo>();

  @Output()
  canDeactivate: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('healtheErrorCardScrollElement', { static: true })
  healtheErrorCardScrollElement;

  faExclamationTriangle = faExclamationTriangle;
  faExclamationCircle = faExclamationCircle;

  createNewAuthorizationFormGroup: FormGroup = this.formBuilder.group({
    pharmacyNabp: ['', [Validators.required, Validators.minLength(7)]],
    callerPhone: [''],
    callerName: ['', Validators.required],
    injuredWorkerWaiting: [false],
    authorizationLevelNotes: ['']
  });

  alertType = AlertType;
  alertText: string = null;

  addedPrescriptionsDetails: AddedPosAuthPrescriptions[] = [];
  existingPrescriptionsDetails: AddedPosAuthPrescriptions[] = [];
  rxHistoryRows: AddedPosAuthPrescriptions[] = [];
  rejectCodeOptions: CreatePosAuthPrimaryRejectCode[];
  rxHistoryTableColumns = [
    'selectedFC',
    'prescriptionDescription',
    'daysSupply',
    'quantity',
    'ndc',
    'dea',
    'rejectCodes',
    'dateFilled',
    'nabp',
    'dateSubmitted'
  ];

  isLoading = true;
  bannerErrors: string[] = [];
  pharmacyName: string = '';
  tableCondition = TableCondition;
  faFile = faFile;
  createAuthorizationClickedOnce: boolean = false;
  addedRowWorkingPharmacyNabp: string = null;
  isAnExistingAuth = false;
  totalSelectedRows = 0;
  existingAuths: PbmExistingAuthorization[];
  displayedExistingAuthStatusTitle: string;
  displayedExistingAuth: PbmExistingAuthorization;

  getCallerPhoneFormControl(): FormControl {
    return this.createNewAuthorizationFormGroup.get(
      'callerPhone'
    ) as FormControl;
  }

  getCallerNameFormControl(): FormControl {
    return this.createNewAuthorizationFormGroup.get(
      'callerName'
    ) as FormControl;
  }

  getPharmacyNabpFormControl(): FormControl {
    return this.createNewAuthorizationFormGroup.get(
      'pharmacyNabp'
    ) as FormControl;
  }

  constructor(
    protected formBuilder: FormBuilder,
    public createNewPosAuthService: CreateNewPosAuthService,
    private cscAdministrationService: CscAdministrationService,
    public createNewAuthModalService: CreateNewAuthModalService,
    public changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private matDialog: MatDialog,
    private pageTitleService: PageTitleService,
    private router: Router,
    private confirmationModalService: ConfirmationModalService,
    public fVES: FormValidationExtractorService
  ) {
    super();
    pageTitleService.setTitle('Create POS Authorization');
    fVES.registerErrorMessage({
      min: 'Minimum value must be 1 or greater!',
      futureDate: 'Date must not be in the future!',
      minlength: 'Please enter at least 7 characters!',
      mask: 'If entering a phone number it must contain 10 digits!',
      invalidPhoneNumber: 'A valid phone number is required.'
    });
  }

  ngOnInit() {
    if (this.viewContext.hasData) {
      this.createNewAuthorizationFormGroup.setValue(
        this.viewContext.formGroupData
      );
      this.rxHistoryRows = this.viewContext.rxHistoryRows;
      this.addedPrescriptionsDetails =
        this.viewContext.populatedPrescriptionDetails;
      this.rejectCodeOptions = this.viewContext.rejectCodeOptions;
      this.isLoading = false;
    } else {
      this.createNewPosAuthService
        .getRejectCodeOptions()
        .pipe(
          catchError(() => {
            let returnValue: VerticeResponse<CreatePosAuthPrimaryRejectCode[]> =
              {
                errors: [
                  'Something went wrong while getting selectable reject codes'
                ],
                httpStatusCode: 500,
                responseBody: []
              };
            return of(returnValue);
          }),
          first()
        )
        .subscribe((rejectCodeResponse) => {
          if (rejectCodeResponse.httpStatusCode !== 200) {
            this.bannerErrors.push(...rejectCodeResponse.errors);
          } else {
            this.rejectCodeOptions = rejectCodeResponse.responseBody;
          }
        });

      this.doPhiHistoryRefresh();
    }
    this.getPharmacyNabpFormControl()
      .valueChanges.pipe(takeUntil(this.onDestroy$), debounceTime(250))
      .subscribe((value) => {
        this.updateNabp(value);
      });
  }

  updateNabp(nabp: string) {
    if (this.getPharmacyNabpFormControl().valid) {
      this.enableOrDisableRxHistoryRows(nabp);
      this.displayExistingAuth(nabp);
    } else {
      // For an invalid nabp, all rows will end up being enabled.
      this.enableOrDisableRxHistoryRows(null);
    }
  }

  doPhiHistoryRefresh() {
    this.isLoading = true;
    this.rxHistoryRows = [];
    this.bannerErrors = [];
    this.createNewPosAuthService
      .getPosAuthRxHistoryRowData(this.encodedRouteParams.memberId)
      .subscribe(
        (authHistoryResponse: VerticeResponse<PbmPrescriptionHistory[]>) => {
          if (authHistoryResponse.httpStatusCode !== 200) {
            this.bannerErrors = authHistoryResponse.errors;
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
          } else {
            this.rxHistoryRows = authHistoryResponse.responseBody.map(
              (row: PbmPrescriptionHistory) => {
                const selectedFC = new FormControl(false);
                selectedFC.valueChanges
                  .pipe(takeUntil(this.onDestroy$), debounceTime(250))
                  .subscribe(() => {
                    this.rowSelectionChangeEvent(row.summary.nabp);
                  });
                return {
                  ...row,
                  selectedFC,
                  disabled: false
                };
              }
            );
            this.isLoading = false;
            if (this.rxHistoryRows && this.rxHistoryRows.length > 0) {
              this.getPharmacyNabpFormControl().setValue(
                this.rxHistoryRows[0].summary.nabp
              );
              this.doPharmacyFind(true);
            }
            this.changeDetectorRef.detectChanges();
          }
        }
      );
  }

  resetPharmacyInformation(nabp: string) {
    this.getCallerNameFormControl().setValue('');
    this.getCallerPhoneFormControl().setValue('');
    this.getPharmacyNabpFormControl().setValue(nabp, { emitEvent: false });
    this.doPharmacyFind(true);
  }

  enableOrDisableRxHistoryRows(nabp: string) {
    this.rxHistoryRows.forEach((row) => {
      if (null == nabp && null == this.addedRowWorkingPharmacyNabp) {
        row.selectedFC.enable({ emitEvent: false });
        row.disabled = false;
      } else {
        if (
          row.summary.nabp === nabp ||
          row.summary.nabp === this.addedRowWorkingPharmacyNabp
        ) {
          row.selectedFC.enable({ emitEvent: false });
          row.disabled = false;
        } else {
          row.selectedFC.disable({ emitEvent: false });
          row.disabled = true;
          row.selectedFC.setValue(false, { emitEvent: false });
        }
      }
    });
  }

  rowSelectionChangeEvent(nabp: string) {
    // If there is a pharamacy that is already having first fills, then even if no option is selected
    // in the 7 day history, we need to keep non-matching pharmacies disabled.
    if (null != this.addedRowWorkingPharmacyNabp) {
      return;
    }

    this.totalSelectedRows = 0;
    this.rxHistoryRows.forEach((row) => {
      if (row.selectedFC.value) {
        this.totalSelectedRows++;
      }
    });

    switch (this.totalSelectedRows) {
      default:
        break;

      case 0:
        this.rxHistoryRows.forEach((row) => {
          row.selectedFC.enable({ emitEvent: false });
          row.disabled = false;
        });
        if (nabp === this.rxHistoryRows[0].summary.nabp) {
          if (nabp !== this.getPharmacyNabpFormControl().value) {
            this.resetPharmacyInformation(this.rxHistoryRows[0].summary.nabp);
          }
        } else {
          this.resetPharmacyInformation(this.rxHistoryRows[0].summary.nabp);
        }
        break;

      case 1:
        this.enableOrDisableRxHistoryRows(nabp);

        if (nabp !== this.getPharmacyNabpFormControl().value) {
          this.resetPharmacyInformation(nabp);
        }

        break;
    }
  }

  redoMemberSearch() {
    this.createNewAuthModalService
      .navigateToCreatePosAuthFromCreateNewAuthModal()
      .pipe(first())
      .subscribe((value) => {
        this.addedPrescriptionsDetails = [];
        this.getPharmacyNabpFormControl().setValue('');
        this.pharmacyName = '';
        this.getCallerPhoneFormControl().setValue('');
        this.getCallerNameFormControl().setValue('');
        this.rxHistoryRows = [];
        this.bannerErrors = [];
        if (value) {
          this.memberSearchChange.next(value);

          // Need a short delay because the input encodedRouteParams needs
          // some time to update.
          setTimeout(() => {
            this.doPhiHistoryRefresh();
          }, 100);
        }
      });
  }

  doPharmacyFind(populateCallerPhoneNumber: boolean) {
    this.cscAdministrationService
      .getPharmacyData(this.getPharmacyNabpFormControl().value)
      .pipe(first())
      .subscribe((result) => {
        if (result.httpStatusCode === 200) {
          this.pharmacyName = result.responseBody.name;
          this.getAwaitingDecisionAuthSummariesByPhiMemberId(
            this.encodedRouteParams.memberId
          );
          if (populateCallerPhoneNumber) {
            this.getCallerPhoneFormControl().setValue(
              result.responseBody.phoneNumber
            );
          }
          this.alertText = null;
        } else if (result.httpStatusCode === 404) {
          this.alertText =
            'No pharmacy for the nabp you supplied could be found.';
        } else {
          this.alertText =
            'There was some internal error looking up the pharmacy.  Please try again later.';
        }

        this.changeDetectorRef.detectChanges();
      });
  }

  doAutoSelectedPrescriptionsFill() {
    this.rxHistoryRows.forEach((row) => {
      // For every selected rxHistoryRow, add populate the prescription details section
      //  if it's not already been populated (currently based on unique NDC match)
      if (
        row.selectedFC.value &&
        this.addedPrescriptionsDetails.findIndex(
          (prescription) => prescription.detail.ndc === row.detail.ndc
        ) < 0
      ) {
        this.addIndividualPrescriptionDetailForm(row, row.summary.nabp);
        this.displayExistingAuth(row.summary.nabp);
      }
    });
  }

  doSearchForOtherMedication() {
    const otherMedicationSearchDialogRef = this.matDialog.open(
      OtherMedicationSearchModalComponent,
      {
        autoFocus: true,
        width: '1000px',
        maxHeight: '60%'
      }
    );

    otherMedicationSearchDialogRef
      .afterClosed()
      .subscribe((selectedOtherMedication) => {
        if (!!selectedOtherMedication) {
          const addedMedication: PbmPrescriptionHistory = {
            summary: null,
            detail: {
              ndc: selectedOtherMedication.ndc,
              submittedLabelName:  selectedOtherMedication.prescriptionName,
              prescriptionName: selectedOtherMedication.prescriptionName,
              prescriptionNote: '',
              dateOfService: null,
              primaryRejectCode: null,
              secondaryRejectCode: null,
              daysSupply: 0,
              quantity: 0,
              prescriberId: '',
              prescriberFirstName: '',
              prescriberLastName: '',
              prescriberPhone: '',
              brandGeneric: selectedOtherMedication.brandGeneric,
              inFormulary: 'Not Available',
              deaDrugClass: selectedOtherMedication.deaDrugClass,
              previousDecision: 'Not Available',
              previousDecisionDate: 'Not Available',
              previousDecisionRequestedQuantity: 'Not Available',
              previousDecisionRequestedDaysSupply: 'Not Available',
              estimatedDaysSupplyOnHand: 'Not Available',
              awpUnitCost: selectedOtherMedication.awpUnitCost,
              isCompound: false,
              samaritanDoseApproved: false,
              compounds: []
            }
          };
          this.addIndividualPrescriptionDetailForm(addedMedication, null, true);
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  addIndividualPrescriptionDetailForm(
    prescriptionToAdd: AddedPosAuthPrescriptions,
    historicNabp?: string,
    manuallyAdded: boolean = false
  ) {
    prescriptionToAdd.manuallyAdded = manuallyAdded;
    this.addedPrescriptionsDetails.push(prescriptionToAdd);
    if (historicNabp) {
      this.addedRowWorkingPharmacyNabp = historicNabp;
    }
  }

  removeIndividualPrescriptionDetailForm(
    removedRow: AddedPosAuthPrescriptions
  ) {
    this.addedPrescriptionsDetails = this.addedPrescriptionsDetails.filter(
      (row) => row.detail.ndc !== removedRow.detail.ndc
    );
    // This if check handles one that were added from 'search for other medication'
    //  since only 'autofill selected prescriptions' are tracked in the history data
    if (removedRow.selectedFC) {
      // do we want to order in any particular way when added
      // change selectedFC to rxHistorySelectedFC
      removedRow.selectedFC.setValue(false, { emitEvent: false });
    }

    // If the last row was removed, then we need to unlock all prescription nabps
    if (this.addedPrescriptionsDetails.length === 0) {
      // The logic here is that if this was the last added prescription and now there are none left
      // Then if any rows are still checked in the 7 day history, that the disabled rows (that do not match the right pharmacy)
      // still remain disabled.  However, if there is nothing selected, then all rows must be enabled (rowSelectionChangeEvent).
      let totalSelectedRows = 0;
      this.rxHistoryRows.forEach((row) => {
        if (row.selectedFC.value) {
          totalSelectedRows++;
        }
      });

      let workingNabp = null;
      if (totalSelectedRows > 0) {
        workingNabp = this.addedRowWorkingPharmacyNabp;
      }

      this.addedRowWorkingPharmacyNabp = null;
      if (this.rxHistoryRows.length > 0) {
        this.rowSelectionChangeEvent(workingNabp);
      }
      this.isAnExistingAuth = false;
    }
  }

  ngOnDestroy(): void {
    this.viewContext.hasData = true;
    this.viewContext.rxHistoryRows = this.rxHistoryRows;
    this.viewContext.formGroupData = this.createNewAuthorizationFormGroup.value;
    this.viewContext.populatedPrescriptionDetails =
      this.addedPrescriptionsDetails;
    this.viewContext.rejectCodeOptions = this.rejectCodeOptions;
  }

  doGoBack() {
    // This is an odd behavior, perhaps its an angular bug.
    // If you a route and hit go back, the first time the CanDeactivate will be called in CreateNewPosAuthService.
    //  However, if you cancel out and then hit go back again, it will allow you to go back and will not call
    // the CanDeactivate method at all.  This only happens with this location.back() thing.  Other methods of
    // changing routes do not suffer this issue.
    this.location.back();
  }

  isEntireFormGroupValid(): boolean {
    return (
      this.createNewAuthorizationFormGroup.valid &&
      this.isPrescriptionFormValid()
    );
  }
  isPrescriptionFormValid(): boolean {
    return !this.addedPrescriptionsDetails.some((addedPrescriptionDetails) => {
      return null == addedPrescriptionDetails.addedPrescriptionsFG
        ? true
        : addedPrescriptionDetails.addedPrescriptionsFG.invalid;
    });
  }

  createAuthClicked() {
    if (this.isEntireFormGroupValid()) {
      const createNewAuthorizationFormValues =
        this.createNewAuthorizationFormGroup.value;

      const drugsWithTodaysServiceDate: AddedPosAuthPrescriptions[] =
        this.addedPrescriptionsDetails.filter((addedPrescriptionDetails) =>
          moment(
            addedPrescriptionDetails.addedPrescriptionsFG.value.dateOfService
          )
            .format('YYYYMMDD')
            .equalsIgnoreCase(moment().format('YYYYMMDD'))
        );

      if (
        drugsWithTodaysServiceDate != null &&
        drugsWithTodaysServiceDate.length > 0
      ) {
        this.confirmationModalService
          .displayModal(
            {
              titleString: 'Are you sure?',
              bodyHtml:
                `<p>The date of service for the following drugs is today. Are you sure this is valid?</p>` +
                `<ul>` +
                drugsWithTodaysServiceDate
                  .map(
                    (prescription) =>
                      '<li>' + prescription.detail.prescriptionName + '</li>'
                  )
                  .join('') +
                `</ul>`,
              affirmString: 'YES',
              denyString: 'NO'
            },
            '300px'
          )
          .afterClosed()
          .pipe(filter((confirmed) => confirmed))
          .subscribe(() => {
            this.doHttpRequest(createNewAuthorizationFormValues);
          });
      } else {
        this.doHttpRequest(createNewAuthorizationFormValues);
      }
    } else {
      this.createAuthorizationClickedOnce = true;
      this.addedPrescriptionsDetails.forEach((addedPrescriptionDetails) =>
        addedPrescriptionDetails.addedPrescriptionsFG.markAllAsTouched()
      );
      this.createNewAuthorizationFormGroup.markAllAsTouched();
      this.goToElement(this.healtheErrorCardScrollElement.nativeElement);
    }
  }

  doHttpRequest(createNewAuthorizationFormValues: any) {
    let requestBody: CreatePosAuthRequestBody = {
      callerName: createNewAuthorizationFormValues.callerName,
      callerNumber: createNewAuthorizationFormValues.callerPhone,
      internalNotes: createNewAuthorizationFormValues.authorizationLevelNotes,
      nabp: createNewAuthorizationFormValues.pharmacyNabp,
      patientWaiting: createNewAuthorizationFormValues.injuredWorkerWaiting,
      details: this.addedPrescriptionsDetails.map(
        (addedPrescriptionDetails) => {
          let currentPrescriptionValues =
            addedPrescriptionDetails.addedPrescriptionsFG.value;

          return {
            daysSupply: currentPrescriptionValues.daysSupply,
            prescriberId: currentPrescriptionValues.prescriberInfoFG.prescriberId,
            prescriberFirstName: currentPrescriptionValues.prescriberInfoFG.prescriberFirstName,
            prescriberLastName: currentPrescriptionValues.prescriberInfoFG.prescriberLastName,
            prescriberPhone: currentPrescriptionValues.prescriberInfoFG.prescriberPhone,
            primaryRejectCode:
              currentPrescriptionValues.primaryRejectCode.rejectCode,
            secondaryRejectCode: currentPrescriptionValues.secondaryRejectCode
              ? currentPrescriptionValues.secondaryRejectCode.rejectCode
              : null,
            ndc: addedPrescriptionDetails.detail.ndc,
            submittedLabelName: addedPrescriptionDetails.detail.prescriptionName,
            prescriptionNote: currentPrescriptionValues.prescriptionNote,
            quantity: currentPrescriptionValues.quantity,
            samaritanDoseApproved:
              currentPrescriptionValues.samaritanDoseApproved,
            dateOfService: moment(currentPrescriptionValues.dateOfService)
              .format('YYYY-MM-DDTHH:mm:ssZ')
              .toString(),
            isCompound: addedPrescriptionDetails.detail.isCompound,
            compounds: addedPrescriptionDetails.detail.compounds
          } as PbmPrescriptionDetail;
        }
      ),
      phiMemberId: this.decodedRouteParams.memberId
    };

    this.bannerErrors = [];
    this.changeDetectorRef.detectChanges();

    const spinnerRef = this.matDialog.open(LoadingModalComponent, {
      width: '700px',
      data: 'Creating Authorization'
    });

    this.createNewPosAuthService
      .createPosAuthorization(requestBody)
      .pipe(
        first(),
        tap(
          () => {
            spinnerRef.close();
          },
          () => {
            spinnerRef.close();
          }
        )
      )
      .subscribe((response) => {
        switch (response.httpStatusCode) {
          case 200:
            if (response.errors.length > 0) {
              this.bannerErrors = response.errors;
              this.changeDetectorRef.detectChanges();
            } else {
              this.canDeactivate.next(true);
              this.router.navigate([
                '/csc-administration/authorization-status-queue'
              ]);
            }
            break;
          case 500:
            this.bannerErrors = [
              'Unexpected error while creating authorization'
            ];
            this.changeDetectorRef.detectChanges();
        }
      });
  }

  goToElement(el: HTMLElement) {
    el.scrollIntoView({ block: 'center', inline: 'center' });
    el.focus();
  }

  getAwaitingDecisionAuthSummariesByPhiMemberId(nabp: string) {
    this.cscAdministrationService
      .getAwaitingDecisionAuthSummariesByPhiMemberId(nabp)
      .subscribe((x) => {
        this.existingAuths = x.responseBody;
        this.displayExistingAuth(this.getPharmacyNabpFormControl().value);
        this.changeDetectorRef.detectChanges();
      });
  }

  displayExistingAuth(nabp: string) {
    this.existingPrescriptionsDetails = [];
    this.isAnExistingAuth = false;
    this.displayedExistingAuth = null;
    if (
      this.existingAuths &&
      this.existingAuths != null &&
      this.existingAuths.length > 0
    ) {
      let existingAuthorizationsAtTheSamePharmacy = this.existingAuths.map(
        (currentExistingAuth) => {
          let auth: PbmExistingAuthorization;
          auth = {
            authorizationId: currentExistingAuth.authorizationId,
            authorizationType: currentExistingAuth.authorizationType,
            patientWaiting: currentExistingAuth.patientWaiting,
            readonly: true,
            lineItems: currentExistingAuth.lineItems.filter(
              (currentLineItem) => currentLineItem.summary.nabp === nabp
            )
          };
          return auth;
        }
      );
      existingAuthorizationsAtTheSamePharmacy =
        existingAuthorizationsAtTheSamePharmacy.filter(
          (x) => x.lineItems.length > 0
        );
      if (
        existingAuthorizationsAtTheSamePharmacy &&
        existingAuthorizationsAtTheSamePharmacy.length > 0 &&
        existingAuthorizationsAtTheSamePharmacy[0].lineItems.length > 0
      ) {
        // IMPORTANT: After having filtered down to authorizations that match by NABP,
        // we select just the first authorization to display the line item details of
        // so some authorizations may never be displayed.
        this.displayedExistingAuth = existingAuthorizationsAtTheSamePharmacy[0];
        this.displayedExistingAuthStatusTitle =
          this.generateDisplayedExistingAuthStatusTitle();
        this.existingPrescriptionsDetails =
          this.displayedExistingAuth.lineItems;
        this.isAnExistingAuth = true;
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  generateDisplayedExistingAuthStatusTitle(): string {
    let title: string = 'POS (ePAQ) Auth';

    if (this.displayedExistingAuth.patientWaiting) {
      title = title.concat(' - Pt. Waiting');
    } else {
      switch (this.displayedExistingAuth.authorizationType.toUpperCase()) {
        case 'PHARMACYCALL':
          title = title.concat(' - Pharmacy Call');
          break;
        case 'EXPIRINGAUTHORIZATION':
          title = title.concat(' - Expiring');
          break;
        case 'HISTORICAL':
          title = title.concat(' - Historical');
          break;
      }
    }

    title = title
      .concat(' - ')
      .concat(this.displayedExistingAuth.authorizationId.toString());

    return title;
  }

  addExistingLine() {
    if (this.isPrescriptionFormValid()) {
      let requestBody: AddLineItemPosAuthRequestBody = {
        authorizationId: this.displayedExistingAuth.authorizationId.toString(),
        linesItems: this.addedPrescriptionsDetails.map(
          (addedPrescriptionDetails) => {
            let currentPrescriptionValues =
              addedPrescriptionDetails.addedPrescriptionsFG.value;

            return {
              daysSupply: currentPrescriptionValues.daysSupply,
              prescriberId: currentPrescriptionValues.prescriberInfoFG.prescriberId,
              prescriberPhone: currentPrescriptionValues.prescriberInfoFG.prescriberPhone,
              prescriberFirstName: currentPrescriptionValues.prescriberInfoFG.prescriberFirstName,
              prescriberLastName: currentPrescriptionValues.prescriberInfoFG.prescriberLastName,
              primaryRejectCode:
                currentPrescriptionValues.primaryRejectCode.rejectCode,
              secondaryRejectCode: currentPrescriptionValues.secondaryRejectCode
                ? currentPrescriptionValues.secondaryRejectCode.rejectCode
                : null,
              ndc: addedPrescriptionDetails.detail.ndc,
              prescriptionNote: currentPrescriptionValues.prescriptionNote,
              quantity: currentPrescriptionValues.quantity,
              samaritanDoseApproved:
                currentPrescriptionValues.samaritanDoseApproved,
              dateOfService: moment(currentPrescriptionValues.dateOfService)
                .format('YYYY-MM-DDTHH:mm:ssZ')
                .toString(),
              isCompound: addedPrescriptionDetails.detail.isCompound,
              compounds: addedPrescriptionDetails.detail.compounds
            } as PbmPrescriptionDetail;
          }
        )
      };

      this.bannerErrors = [];
      this.changeDetectorRef.detectChanges();

      const spinnerRef = this.matDialog.open(LoadingModalComponent, {
        width: '700px',
        data: 'Adding lines to existing POS (ePAQ) Authorization'
      });

      this.createNewPosAuthService
        .addExistingLine(requestBody)
        .pipe(
          first(),
          tap(
            () => {
              spinnerRef.close();
            },
            () => {
              spinnerRef.close();
            }
          )
        )
        .subscribe((response) => {
          switch (response.httpStatusCode) {
            case 200:
              if (response.errors.length > 0) {
                this.bannerErrors = response.errors;
                this.healtheErrorCardScrollElement.nativeElement.scrollIntoView(
                  {
                    block: 'center',
                    behavior: 'smooth'
                  }
                );
              } else {
                this.canDeactivate.next(true);
                this.router.navigate([
                  '/csc-administration/authorization-status-queue'
                ]);
              }
              break;
            case 500:
              this.bannerErrors = [
                'Unexpected error while creating authorization'
              ];
          }
          this.changeDetectorRef.detectChanges();
        });
    } else {
      this.createAuthorizationClickedOnce = true;
      this.getCallerNameFormControl().clearValidators();
      this.getCallerNameFormControl().updateValueAndValidity();

      this.addedPrescriptionsDetails.forEach((addedPrescriptionDetails) =>
        addedPrescriptionDetails.addedPrescriptionsFG.markAllAsTouched()
      );

      this.goToElement(this.healtheErrorCardScrollElement.nativeElement);
      this.getCallerNameFormControl().setValidators([Validators.required]);
      this.getCallerNameFormControl().updateValueAndValidity();
    }
  }

  getDrugLookupParameters(row: AddedPosAuthPrescriptions): DrugLookup {
    if (row.detail.isCompound) {
      return undefined;
    } else {
      return {
        drugID: row.detail.ndc,
        quantity: row.detail.quantity,
        drugDate: moment().format('MM/DD/YYYY').toString()
      } as DrugLookup;
    }
  }

  getCompoundModalDetails(row: AddedPosAuthPrescriptions): CompoundModalData {
    if (row.detail.isCompound) {
      return {
        ingredients: row.detail.compounds.map((ingredient) => {
          return {
            drugName: ingredient.drugName,
            ndc: ingredient.ndc,
            quantity: +ingredient.quantity,
            createdDate: moment(row.summary.dateFilled).format(
              environment.dateFormat
            ),
            rejectReason: {
              description: '',
              ncpdpRejectCode: row.detail.primaryRejectCode
            }
          } as CompoundModalIngredient;
        })
      } as CompoundModalData;
    } else {
      return undefined;
    }
  }
}
