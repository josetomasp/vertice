import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertType
} from '@shared/components/confirmation-banner/confirmation-banner.component';
import { createSelector, select, Store } from '@ngrx/store';
import {
  ConfirmationModalService
} from '@shared/components/confirmation-modal/confirmation-modal.service';
import {
  DestroyableComponent
} from '@shared/components/destroyable/destroyable.component';
import { ClaimV3 } from '@shared/store/models/claim.models';
import { getClaimV3 } from '@shared/store/selectors/claim.selectors';
import { uniq } from 'lodash';
import { combineLatest, Observable, zip } from 'rxjs';
import { filter, first, map, takeUntil, tap } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';

import {
  getDecodedClaimNumber,
  getDecodedCustomerId,
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../store/selectors/router.selectors';
import {
  isUserInternal
} from '../../../../../user/store/selectors/user.selectors';
import {
  resetFusionMakeAReferral
} from '../../store/actions/fusion/fusion-make-a-referral.actions';
import {
  GetServiceSelectionValues,
  GetTransportationOptions,
  GetTransportationTypes,
  ResetMakeAReferral,
  SetSectionStatus,
  UpdateReferralLevelNote
} from '../../store/actions/make-a-referral.actions';
import {
  resetSharedMakeAReferral,
  resetSharedMakeAReferralErrors
} from '../../store/actions/shared-make-a-referral.actions';
import {
  FusionServiceName
} from '../../store/models/fusion/fusion-make-a-referral.models';
import {
  REFERRAL_REQUESTOR_INFORMATION,
  ReferralManagementTransportationTypes,
  SelectableService
} from '../../store/models/make-a-referral.models';
import {
  ErrorSharedMakeAReferral
} from '../../store/models/shared-make-a-referral.models';
import {
  getDraftReferralId,
  getFormState,
  getReferralLevelNotes,
  getSectionDirtyByType,
  getSectionStatusByType,
  getSelectableServices,
  getSelectedServiceTypes,
  getServiceOptions,
  getSubmissionErrors,
  getTransportationTypes,
  getValidFormStates,
  isReferralServiceCompleteByServiceName
} from '../../store/selectors/makeReferral.selectors';
import {
  getSharedErrorsResponse,
  getSuccessfulServices,
  isSubmittingReferrals
} from '../../store/selectors/shared-make-a-referral.selectors';
import {
  SubmitConfirmationModalComponent
} from '../components/submit-confirmation-modal/submit-confirmation-modal.component';
import { MakeAReferralHelperService } from '../make-a-referral-helper.service';
import { MakeAReferralService } from '../make-a-referral.service';

const areAllServicesSuccessfullySubmitted = createSelector(
  getSelectedServiceTypes,
  getSuccessfulServices,
  (serviceTypes, successfulServices) => {
    return (
      serviceTypes?.length === successfulServices?.length &&
      (serviceTypes?.length > 0 || successfulServices?.length > 0)
    );
  }
);

@Component({
  selector: 'healthe-make-referral-wizard',
  templateUrl: './make-a-referral-wizard.component.html',
  styleUrls: ['./make-a-referral-wizard.component.scss']
})
export class MakeAReferralWizardComponent
  extends DestroyableComponent
  implements OnInit, OnDestroy
{
  public selectedServiceTypes$ = this.store$.pipe(
    select(getSelectedServiceTypes),
    takeUntil(this.onDestroy$),
    tap((services) =>
      services.length === 1 ? this.beginSection(services[0]) : null
    )
  );

  areAllServicesSubmitted$ = this.store$.pipe(
    select(areAllServicesSuccessfullySubmitted)
  );

  formData$ = this.store$.pipe(select(getFormState));

  validFormStates$ = this.store$.pipe(select(getValidFormStates));

  alertType = AlertType;

  isSubmitDisabled = true;
  referralNotes: string = '';
  claimV2$: Observable<ClaimV3> = this.store$.pipe(select(getClaimV3));
  claimNumber$ = this.store$.pipe(first(), select(getDecodedClaimNumber));
  customerId$ = this.store$.pipe(first(), select(getDecodedCustomerId));
  formState$ = this.store$.pipe(first(), select(getFormState));
  draftReferralId$ = this.store$.pipe(first(), select(getDraftReferralId));
  errors$: Observable<ErrorSharedMakeAReferral[]> = this.store$.pipe(
    select(getSharedErrorsResponse)
  );
  referralErrors$ = this.store$.pipe(
    select(getSubmissionErrors),
    takeUntil(this.onDestroy$)
  );

  referralLevelNotes$ = this.store$.pipe(select(getReferralLevelNotes()));
  userIsInternal$ = this.store$.pipe(select(isUserInternal));
  isSaveAsDraftDisabled = true;
  submitMessage$ = zip(
    this.customerId$,
    this.claimNumber$,
    this.draftReferralId$,
    this.formState$,
    this.referralLevelNotes$.pipe(first())
  );
  private isSaveAsDraftDisabled$ = this.formData$.pipe(
    map((formState) => Object.keys(formState).length === 0)
  );
  private isSubmitDisabled$ = combineLatest([
    this.formData$,
    this.validFormStates$,
    this.selectedServiceTypes$,
    this.userIsInternal$
  ]).pipe(
    takeUntil(this.onDestroy$),
    map(([formData, validFormState, selectedServiceTypes, userIsInternal]) => {
      let selectedServiceTypesCopy = [...selectedServiceTypes];
      // Adding requester information as a synthetic selected service
      if (userIsInternal) {
        selectedServiceTypesCopy.push(REFERRAL_REQUESTOR_INFORMATION);
      }

      const formDataKeyLength = Object.keys(formData).length;
      const uniqueFormKeysByService = uniq(
        Object.keys(formData).map((key) => key.split('-')[0])
      );
      // Disabled if there are any unstarted services
      // by matching unique formstate archetypes to selected service types
      if (selectedServiceTypesCopy.length !== uniqueFormKeysByService.length) {
        return true;
      }
      const vfsLength = validFormState.length;
      if (formDataKeyLength === 0 || vfsLength === 0) {
        return true;
      }
      return formDataKeyLength !== vfsLength;
    })
  );

  getSelectableServices$ = this.store$.pipe(
    select(getSelectableServices),
    takeUntil(this.onDestroy$)
  );
  serviceToSelectableServiceMap: Map<string, SelectableService> = new Map<
    string,
    SelectableService
  >();
  encodedCustomerId$: Observable<string> = this.store$.pipe(
    select(getEncodedCustomerId)
  );
  encodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getEncodedClaimNumber)
  );

  constructor(
    public store$: Store<RootState>,
    public router: Router,
    public matDialog: MatDialog,
    private confirmationModalService: ConfirmationModalService,
    private makeAReferralService: MakeAReferralService,
    public activatedRoute: ActivatedRoute,
    public makeAReferralHelperService: MakeAReferralHelperService
  ) {
    super();
    combineLatest([this.selectedServiceTypes$, this.getSelectableServices$])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([selectedServiceTypes, selectableServices]) => {
        this.serviceToSelectableServiceMap.clear();
        selectedServiceTypes.forEach((serviceType) => {
          selectableServices.forEach((selectableService) => {
            if (selectableService.serviceType === serviceType) {
              this.serviceToSelectableServiceMap.set(
                serviceType,
                selectableService
              );
            }
          });
        });
      });
  }

  isKinectService( service: string): boolean {
    return this.serviceToSelectableServiceMap.get(service)?.domain === 'KINECT';
  }

  getSectionStatus$(type) {
    return this.store$.pipe(select(getSectionStatusByType(type)), first());
  }

  getSectionDirty$(type) {
    return this.store$.pipe(select(getSectionDirtyByType(type)), first());
  }

  isServiceSuccessfullySubmitted$(serviceName: string) {
    return this.store$.pipe(
      select(getSuccessfulServices),
      map((services) => services.includes(serviceName))
    );
  }

  getIsReferralServiceComplete$(type: string) {
    return this.store$.pipe(
      select(isReferralServiceCompleteByServiceName(type.toLowerCase()))
    );
  }

  getSectionStatusVerbiage(
    dirtyStatus: any,
    sectionComplete: boolean,
    isSubmitted: boolean
  ) {
    if (isSubmitted) {
      return 'Section Submitted';
    }

    if (sectionComplete) {
      return 'Section Complete';
    } else if (dirtyStatus) {
      return 'Section In Progress';
    } else {
      return 'Section Not Started';
    }
  }

  beginSectionAndToggle(service: string, expansionPanel: MatExpansionPanel) {
    expansionPanel.expanded = !expansionPanel.expanded;
    this.beginSection(service);
  }

  beginSection(service) {
    this.getSectionStatus$(service).subscribe((status) => {
      if (!status) {
        this.setSectionIntro(service);
      }
    });
  }

  ngOnInit() {
    this.store$.dispatch(resetSharedMakeAReferralErrors());
    combineLatest([
      this.claimV2$.pipe(filter((claimv2) => !!claimv2.stateOfVenue)),
      this.store$.pipe(select(getServiceOptions()))
    ])
      .pipe(first())
      .subscribe(([claimv2, transOptions]) => {
        this.store$.dispatch(new GetTransportationOptions(null));
      });

    this.store$
      .pipe(select(getTransportationTypes), first())
      .subscribe((options: ReferralManagementTransportationTypes) => {
        if (false === options.isLoaded) {
          this.store$.dispatch(new GetTransportationTypes(null));
        }
      });

    this.store$
      .pipe(select(getReferralLevelNotes()), takeUntil(this.onDestroy$))
      .subscribe((notes) => (this.referralNotes = notes));

    this.isSubmitDisabled$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.isSubmitDisabled = value;
      });
    this.isSaveAsDraftDisabled$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isDisabled) => {
        this.isSaveAsDraftDisabled = isDisabled;
      });
  }

  getButtonText(expansionPanel: MatExpansionPanel, dirty) {
    if (expansionPanel.expanded) {
      return 'CLOSE';
    } else if (!dirty) {
      return 'BEGIN';
    } else {
      return 'EDIT';
    }
  }

  addService() {
    this.makeAReferralService.displayAddServiceModal();
  }

  removeService(type: string) {
    this.makeAReferralService.removeService(type, this.activatedRoute);
  }

  cancel() {
    this.confirmationModalService
      .displayModal(
        {
          titleString: 'Cancel Referral',
          bodyHtml:
            'Do you want to cancel the entire referral? You will lose the entire referral data by cancelling and this is not reversible. Please press "Continue" to confirm cancellation?',
          affirmString: 'Continue',
          denyString: 'Cancel'
        },
        '225px'
      )
      .afterClosed()
      .subscribe((isSure) => {
        if (isSure) {
          this.router.navigate(['../serviceSelection'], {
            relativeTo: this.activatedRoute
          });

          // This needs a delay because the navigation above will call the various wizard components to destroy, which causes a save action.
          // We need a delay to make sure this reset happens after all those lifecycles finish.
          setTimeout(() => {
            this.store$.dispatch(new ResetMakeAReferral(null));
            this.store$.dispatch(resetFusionMakeAReferral());
          }, 100);
        }
      });
  }

  submit() {
    this.submitMessage$
      .pipe(first())
      .subscribe(
        ([
          customerId,
          claimNumber,
          referralId,
          formState,
          referralLevelNotes
        ]) => {
          this.matDialog.open(SubmitConfirmationModalComponent, {
            autoFocus: false,
            width: '750px',
            height: '225px',
            minHeight: '220px',
            disableClose: true,
            data: {
              submitMessage: {
                saveAsDraft: false,
                claimNumber,
                referralId,
                customerId,
                formValues: { ...formState },
                referralLevelNotes
              },
              submittingReferral$: this.store$.pipe(
                select(isSubmittingReferrals)
              )
            }
          });
        }
      );
  }

  openReferralNotes(existingNotes: any) {
    this.makeAReferralService
      .displayReferralNoteModalEditModeClosed(
        'Add notes to this referral',
        existingNotes
      )
      .subscribe((newNote) => {
        this.store$.dispatch(new UpdateReferralLevelNote(newNote));
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private setSectionIntro(service) {
    switch (service) {
      case FusionServiceName.Transportation:
      case FusionServiceName.Language:
      case FusionServiceName.Diagnostics:
      case FusionServiceName.PhysicalMedicine:
      case FusionServiceName.HomeHealth:
        this.store$.dispatch(
          new SetSectionStatus({ [service]: 'detailSelection' })
        );
        break;
      case FusionServiceName.DME:
      default:
        this.store$.dispatch(new SetSectionStatus({ [service]: 'wizard' }));
    }
  }

  makeAnotherReferral() {
    combineLatest([
      this.store$.pipe(select(getEncodedCustomerId)),
      this.store$.pipe(select(getEncodedClaimNumber))
    ])
      .pipe(first())
      .subscribe(([eCustomerId, eClaimNumber]) =>
        this.store$.dispatch(
          new GetServiceSelectionValues({
            encodedCustomerId: eCustomerId,
            encodedClaimNumber: eClaimNumber
          })
        )
      );

    this.router.navigate(['../serviceSelection'], {
      relativeTo: this.activatedRoute
    });

    // This needs a delay because the navigation above will call the various wizard components to destroy, which causes a save action.
    // We need a delay to make sure this reset happens after all those lifecycles finish.
    setTimeout(() => {
      this.store$.dispatch(new ResetMakeAReferral(null));
      this.store$.dispatch(resetFusionMakeAReferral());
      this.store$.dispatch(resetSharedMakeAReferral());
    }, 100);
  }
}
