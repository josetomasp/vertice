import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { createSelector, select, Store } from '@ngrx/store';
import { isEqual } from 'lodash';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  first,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
import { RootState } from '../../../../../store/models/root.models';
import {
  AddValidFormState,
  RemoveValidFormState,
  requestRequestorInformationOptions,
  UpdateSectionForm
} from '../../store/actions/make-a-referral.actions';
import {
  REFERRAL_REQUESTOR_INFORMATION,
  RequestorInformationFormState,
  RequestorInformationOptions
} from '../../store/models/make-a-referral.models';
import {
  getReferralReviewMode,
  getRequestorInformationOptions,
  isLoadedFromDraft
} from '../../store/selectors/makeReferral.selectors';
import { RequestorInformationFormFieldNames } from './requestor-information.formFieldNames';
import { RequestorInformationCustomerConfigService } from './requestor-information-customer-config.service';
import { getDecodedCustomerId } from '../../../../../store/selectors/router.selectors';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { getAbmClaimStatus } from '@shared/store/selectors/claim.selectors';
import { ClaimStatusEnum } from '@healthe/vertice-library';
import { WizardBaseStepDirective } from '../components/wizard-base-step.directive';
import { Observable } from 'rxjs';

@Component({
  selector: 'healthe-requestor-information-form',
  templateUrl: './requestor-information-form.component.html',
  styleUrls: ['./requestor-information-form.component.scss'],
  providers: [RequestorInformationCustomerConfigService]
})
export class RequestorInformationFormComponent extends WizardBaseStepDirective
  implements OnInit {
  stepForm: AbstractControl;
  
  inReferralReviewMode: boolean = false;
  requestorInformationFormFieldNames = RequestorInformationFormFieldNames;
  isLoadedFromDraft$: Observable<boolean>;

  stepName: string = REFERRAL_REQUESTOR_INFORMATION;
  formOptions: RequestorInformationOptions = {
    roles: [],
    intakeMethods: [],
    providers: [],
    uros: []
  };

  faInfoCircle = faInfoCircle;
  requestorRoleToolTip: string = null;

  optionsCustomerIdAbmClaimStatus$ = createSelector(
    getRequestorInformationOptions,
    getDecodedCustomerId,
    getAbmClaimStatus,
    (options, decodedCustomerId, abmClaimStatus) => {
      return { options, decodedCustomerId, abmClaimStatus };
    }
  );

  requestorInformationFormGroup: FormGroup = new FormGroup({
    [RequestorInformationFormFieldNames.REQUESTOR_NAME]: new FormControl(null),
    [RequestorInformationFormFieldNames.REQUESTOR_PHONE]: new FormControl(null),
    [RequestorInformationFormFieldNames.REQUESTOR_EMAIL]: new FormControl(null),
    [RequestorInformationFormFieldNames.CUSTOMER_TRACKING_NUMBER]: new FormControl(
      null
    ),
    [RequestorInformationFormFieldNames.HEALTHE_TRACKING_NUMBER]: new FormControl(
      null
    )
  });

  constructor(
    public store$: Store<RootState>,
    private requestorInformationCustomerConfigService: RequestorInformationCustomerConfigService
  ) {
    super(REFERRAL_REQUESTOR_INFORMATION, store$);
    this.store$.dispatch(requestRequestorInformationOptions());

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(this.optionsCustomerIdAbmClaimStatus$),
        filter((data) => data.options.roles.length > 0),
        distinctUntilChanged(isEqual),
        tap((data) => {
          this.formOptions = data.options;
          this.generateOptionalRequestorFormControls(data.options);

          this.requestorInformationCustomerConfigService.prepareFormGroupValidations(
            this.requestorInformationFormGroup,
            data.decodedCustomerId,
            data.abmClaimStatus
          );

          switch (data.decodedCustomerId) {
            default:
              break;

            // State Fund
            case '6000SCIF':
              if (ClaimStatusEnum.TERMINATED === data.abmClaimStatus) {
                this.requestorRoleToolTip =
                  'Allowable Requestor Roles on Terminated Claims are Claims Adjuster, URO, URG, Claim User, Agreed Medical Examiner, Qualified Medical Examiner, SF CSC Telephonic Interp, Transitional Referrals, or Transportation Auto Auth';
              }
              break;
          }
        }),
        concatMap(() =>
          this.requestorInformationFormGroup.statusChanges.pipe(
            startWith(this.requestorInformationFormGroup.status),
            distinctUntilChanged(isEqual)
          )
        )
      )
      .subscribe((status) => {
        this.updateRequesterValidity(this.requestorInformationFormGroup.valid);
      });

    this.requestorInformationFormGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.store$.dispatch(
          new UpdateSectionForm({
            [this.stepName]: this.requestorInformationFormGroup.value
          })
        );
      });

    this.store$
      .pipe(
        takeUntil(this.onDestroy$),
        select(getReferralReviewMode)
      )
      .subscribe((value) => {
        if (this.inReferralReviewMode !== value) {
          this.inReferralReviewMode = value;
          // On a change to false, clear all form values
          if (false === value) {
            Object.keys(this.requestorInformationFormGroup.controls).forEach(
              (key) => {
                this.requestorInformationFormGroup.controls[key].setValue(
                  null,
                  { emitEvent: false }
                );
              }
            );
          }
        }
      });

    this.isLoadedFromDraft$ = this.store$.pipe(
      select(isLoadedFromDraft),
      takeUntil(this.onDestroy$)
    );
  }

  updateRequesterValidity(isValid: boolean) {
    if (isValid) {
      this.store$.dispatch(new AddValidFormState(this.stepName));
    } else {
      this.store$.dispatch(new RemoveValidFormState(this.stepName));
    }
  }

  loadForm(): void {
    this.stepForm$
      .pipe(
        first(),
        filter((initialState) => Object.keys(initialState).length > 0)
      )
      .subscribe(
        (requestorDraftInformation: RequestorInformationFormState) => {
          this.requestorInformationFormGroup
            .get(RequestorInformationFormFieldNames.REQUESTOR_NAME)?.setValue(requestorDraftInformation.requestorName);
          this.requestorInformationFormGroup
            .get(RequestorInformationFormFieldNames.REQUESTOR_PHONE)?.setValue(requestorDraftInformation.requestorPhoneNumber);
          this.requestorInformationFormGroup
            .get(RequestorInformationFormFieldNames.REQUESTOR_EMAIL)?.setValue(requestorDraftInformation.requestorEmail);
          this.requestorInformationFormGroup
            .get(RequestorInformationFormFieldNames.CUSTOMER_TRACKING_NUMBER)?.setValue(requestorDraftInformation.customerTrackingNumber);
          this.requestorInformationFormGroup
            .get(RequestorInformationFormFieldNames.HEALTHE_TRACKING_NUMBER)?.setValue(requestorDraftInformation.healtheTrackingNumber);
          this.requestorInformationFormGroup
            .get(RequestorInformationFormFieldNames.INTAKE_METHOD)?.setValue(requestorDraftInformation.intakeMethod);
          this.requestorInformationFormGroup
            .get(RequestorInformationFormFieldNames.REQUESTOR_ROLE)?.setValue(requestorDraftInformation.requestorRole);
          this.requestorInformationFormGroup
            .get(RequestorInformationFormFieldNames.PASSPORT_PROVIDER_TAX_ID)?.setValue(requestorDraftInformation.provider);
          this.requestorInformationFormGroup
            .get(RequestorInformationFormFieldNames.URO)?.setValue(requestorDraftInformation.uro);
        });
  }

  cancel(): void {}

  ngOnInit() {
    super.ngOnInit();
  }

  public hasRequiredValidator(formControlName: string): boolean {
    return this.requestorInformationFormGroup
      .get(formControlName)
      .hasValidator(Validators.required);
  }

  private generateOptionalRequestorFormControls(
    formOptions: RequestorInformationOptions
  ) {
    if (formOptions) {
      if (formOptions.roles.length > 0) {
        this.requestorInformationFormGroup.addControl(
          RequestorInformationFormFieldNames.REQUESTOR_ROLE,
          new FormControl(null)
        );
      }
      if (formOptions.intakeMethods.length > 0) {
        this.requestorInformationFormGroup.addControl(
          RequestorInformationFormFieldNames.INTAKE_METHOD,
          new FormControl(null)
        );
      }
      if (formOptions.providers.length > 0) {
        this.requestorInformationFormGroup.addControl(
          RequestorInformationFormFieldNames.PASSPORT_PROVIDER_TAX_ID,
          new FormControl(null)
        );
      }
      if (formOptions.uros.length > 0) {
        this.requestorInformationFormGroup.addControl(
          RequestorInformationFormFieldNames.URO,
          new FormControl(null)
        );
      }
    }
  }
}
