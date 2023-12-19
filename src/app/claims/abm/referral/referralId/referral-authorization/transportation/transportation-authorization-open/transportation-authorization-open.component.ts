import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import * as _ from 'lodash';
import { isEqual } from 'lodash';
import {
  distinctUntilChanged,
  filter,
  mergeMap,
  takeUntil
} from 'rxjs/operators';
import { RootState } from '../../../../../../../store/models/root.models';
import {
  clearReferralAuthorizationSet,
  setOpenAuthDetailsExpanded
} from '../../../../store/actions/referral-authorization.actions';
import { ClaimLocation } from '../../../../store/models/make-a-referral.models';
import {
  getApprovedLocations,
  isMakeReferralOptionsLoaded
} from '../../../../store/selectors/makeReferral.selectors';
import { isOpenAuthDetailsExpanded } from '../../../../store/selectors/referral-authorization.selectors';
import { AuthorizationInformationService } from '../../authorization-information.service';
import {
  AuthNarrativeConfig,
  AuthNarrativeMode,
  ReferralAuthorizationAction,
  ReferralAuthorizationSet
} from '../../referral-authorization.models';
import { TransportationAuthorizationFormBuilderService } from '../transportation-authorization/transportation-authorization-form-builder.service';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';

@Component({
  selector: 'healthe-transportation-authorization-open',
  templateUrl: './transportation-authorization-open.component.html',
  styleUrls: ['./transportation-authorization-open.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportationAuthorizationOpenComponent
  extends DestroyableComponent
  implements OnInit, OnDestroy {
  @Input()
  referralAuthorizationSet: ReferralAuthorizationSet;
  @Input()
  referralAuthorizationAction: ReferralAuthorizationAction;
  isOpenAuthDetailsExpanded: boolean = false;
  undoConfirmationModalData = {
    titleString: 'Are you sure?',
    bodyHtml: `<p>By choosing this action, all changes you have made will be lost and all data will be reset</p>`,
    affirmString: 'YES',
    denyString: 'NO'
  };

  @Input()
  generalTransportationAuthFormGroup: FormGroup;
  @Input()
  set isReadOnlyForm(readOnlyForm: boolean) {
    this._isReadOnlyForm = readOnlyForm;

    this.authNarrativeConfig.endDate.isDisabled = readOnlyForm;
    this.authNarrativeConfig.startDate.isDisabled = readOnlyForm;
    this.authNarrativeConfig.quantity.isDisabled = readOnlyForm;
  }
  get isReadOnlyForm(): boolean {
    return this._isReadOnlyForm;
  }
  _isReadOnlyForm: boolean = false;
  authNarrativeMode: AuthNarrativeMode = AuthNarrativeMode.EditNarrative;

  authNarrativeConfig: AuthNarrativeConfig = {
    startDate: { controlName: 'startDate' },
    endDate: { controlName: 'endDate' },
    quantity: { controlName: 'tripsAuthorized' },
    unlimitedQuantity: 'unlimitedTrips'
  };

  formGroup: FormGroup;
  narrativeCloneFormGroup: FormGroup;
  originalValues: any;

  transportationLocations$ = this.store$.pipe(
    select(getApprovedLocations('transportation'))
  );
  areLocationsLoaded$ = this.store$.pipe(select(isMakeReferralOptionsLoaded));
  formFinished: boolean = false;

  //#region   Icons
  exportMenuIcon = faChevronDown;

  //#endregion

  constructor(
    private transportationAuthorizationFormBuilderService: TransportationAuthorizationFormBuilderService,
    private authorizationInformationService: AuthorizationInformationService,
    public confirmationModalService: ConfirmationModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private store$: Store<RootState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.areLocationsLoaded$
      .pipe(
        filter((isLoaded) => isLoaded === true),
        mergeMap(() => this.transportationLocations$)
      )
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged(isEqual),
        filter(
          (locations) =>
            locations.length > 0 ||
            this.referralAuthorizationSet.referralAuthorization
              .authorizationItems[0].authData.noLocationRestrictions
        )
      )
      .subscribe((locations) => {
        if (!this.formFinished) {
          this.buildFormGroup(locations);
        } else {
          // Update form controls with new locations
          this.transportationAuthorizationFormBuilderService
            .addNewLocationControls(
              this.referralAuthorizationSet.referralAuthorization
                .authorizationItems[0].formGroup,
              locations[locations.length - 1]
            )
            .pipe(takeUntil(this.onDestroy$))
            .subscribe();

          // Generate a copy of the new location control, but don't bother with it's valueChanges
          this.transportationAuthorizationFormBuilderService.addNewLocationControls(
            this.referralAuthorizationSet.referralAuthorization
              .originalAuthorizationItems[0].formGroup,
            locations[locations.length - 1]
          );
        }
      });

    this.store$
      .pipe(
        select(isOpenAuthDetailsExpanded),
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (currentIsOpenAuthDetailsExpanded) =>
          (this.isOpenAuthDetailsExpanded = currentIsOpenAuthDetailsExpanded)
      );
  }

  promptUserForViewEditToggle(): void {
    if (
      (!this.narrativeCloneFormGroup.pristine &&
        !this.isOpenAuthDetailsExpanded) ||
      (!this.formGroup.pristine && this.isOpenAuthDetailsExpanded)
    ) {
      this.confirmationModalService
        .displayModal(this.undoConfirmationModalData, '260px')
        .afterClosed()
        .pipe(filter((confirmed) => confirmed))
        .subscribe(() => {
          this.toggleDetailsEditor();
          this.changeDetectorRef.detectChanges();
        });
    } else {
      this.toggleDetailsEditor();
      this.changeDetectorRef.detectChanges();
    }
  }

  resetFormValues() {
    this.formGroup.patchValue(
      this.referralAuthorizationSet.referralAuthorization
        .originalAuthorizationItems[0].formGroup.value
    );
    this.formGroup.markAsPristine();
    this.authorizationInformationService.resetFormEvent.next();
  }

  private toggleDetailsEditor(): void {
    let nowCollapsed: boolean = !this.isOpenAuthDetailsExpanded;

    this.resetNarrativeFormGroup();
    this.exportMenuIcon = nowCollapsed ? faChevronUp : faChevronDown;

    this.authNarrativeMode = nowCollapsed
      ? AuthNarrativeMode.EditDetails
      : AuthNarrativeMode.EditNarrative;

    this.store$.dispatch(
      setOpenAuthDetailsExpanded({
        isOpenAuthDetailsExpanded: nowCollapsed
      })
    );
  }

  private buildFormGroup(locations: ClaimLocation[]): void {
    this.formGroup = this.referralAuthorizationSet.referralAuthorization.authorizationItems[0].formGroup;

    // Initialize form controls
    const locations$ = this.transportationAuthorizationFormBuilderService.setTransportationOpenAuthFormState(
      this.formGroup,
      locations,
      this.referralAuthorizationSet.referralAuthorization.authorizationItems[0]
        .authData
    );
    locations$.forEach((location$) => {
      location$.pipe(takeUntil(this.onDestroy$)).subscribe();
    });
    let startDateFormControl: AbstractControl = this.formGroup.get('startDate');
    let endDateFormControl: AbstractControl = this.formGroup.get('endDate');
    startDateFormControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() =>
        endDateFormControl.updateValueAndValidity({ emitEvent: false })
      );
    endDateFormControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() =>
        startDateFormControl.updateValueAndValidity({ emitEvent: false })
      );
    // Backup the built formGroup so we can reset to it's original values
    this.referralAuthorizationSet.referralAuthorization.originalAuthorizationItems[0].formGroup = _.cloneDeep(
      this.formGroup
    );

    this.originalValues = this.referralAuthorizationSet.referralAuthorization.originalAuthorizationItems[0].formGroup.value;

    this.narrativeCloneFormGroup = _.cloneDeep(
      this.referralAuthorizationSet.referralAuthorization
        .originalAuthorizationItems[0].formGroup
    );

    this.narrativeCloneFormGroup.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((values) => {
        this.formGroup.patchValue(values, {
          onlySelf: false,
          emitEvent: false
        });
      });

    this.formFinished = true;
    if (this._isReadOnlyForm) {
      this.narrativeCloneFormGroup.disable();
    }
    this.changeDetectorRef.detectChanges();
  }

  private resetNarrativeFormGroup() {
    this.narrativeCloneFormGroup.patchValue(
      this.referralAuthorizationSet.referralAuthorization
        .originalAuthorizationItems[0].formGroup.value
    );

    this.narrativeCloneFormGroup.markAsPristine();
    this.changeDetectorRef.detectChanges();
  }

  public isAuthorizeMode(): boolean {
    return (
      this.referralAuthorizationAction === ReferralAuthorizationAction.AUTHORIZE
    );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    // This clearReferralAuthorizationSet set is a quick hack-fix to deal with several issues
    // happening when the user returns to an authorization page with the details editor
    // having been opened. Since we're close to PBM go live and don't have the time to
    // spend on ABM now, Jack and Scott were OK with not retaining user values for this
    // form if they navigate to referral activity so this was the solution.
    this.store$.dispatch(clearReferralAuthorizationSet());
  }
}
