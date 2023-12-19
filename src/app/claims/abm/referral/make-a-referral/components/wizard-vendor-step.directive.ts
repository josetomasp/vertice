import {
  Directive,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { select, Store } from '@ngrx/store';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { cloneDeep, includes, isEmpty } from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, first, take, takeUntil } from 'rxjs/operators';

import { RootState } from '../../../../../store/models/root.models';
import {
  AddValidFormState,
  RemoveValidFormState
} from '../../store/actions/make-a-referral.actions';
import {
  ReferralVendor,
  VendorSelectionMode
} from '../../store/models/make-a-referral.models';
import {
  getFormStateByName,
  getSelectedServiceDetailTypes,
  getServiceOptions,
  getVendors
} from '../../store/selectors/makeReferral.selectors';
import {
  MakeAReferralOptionsType,
  ServiceType,
  translateServiceName
} from '../make-a-referral-shared';
import { TRANSPORTATION_ARCH_TYPE } from '../transportation/transportation-step-definitions';
import { WizardBaseStepDirective } from './wizard-base-step.directive';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from 'src/app/store/selectors/router.selectors';

interface FormGroupItem {
  name: string;
  label: string;
  control: FormControl;
}

@Directive()
export abstract class WizardVendorStepDirective extends WizardBaseStepDirective
  implements OnInit, OnDestroy {
  //#region   Public Properties
  @Output() vendorsForm: EventEmitter<FormGroup> = new EventEmitter();
  formGroupItems: FormGroupItem[] = [];
  multiSelectFCPreviousValue: String = 'all';
  multiSelectFC: FormControl = new FormControl(this.multiSelectFCPreviousValue);
  abstract sectionName: string;
  stepForm: FormGroup = null;
  vendorsMode: VendorSelectionMode;
  vendorsSelected: { [key: string]: { code: string; name: string }[] } = {};
  vendorsText = '';
  vendorsSelectorServiceType: string;
  //#claim and customer id
  claimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  customerId$ = this.store$.pipe(select(getEncodedCustomerId));
  //#region   Observables
  formState$: Observable<{ [key: string]: any }> = this.store$.pipe(
    select(
      getFormStateByName({
        formStateChild: this.stepName,
        useReturnedValues: false
      })
    ),
    takeUntil(this.onDestroy$)
  );
  //#endregion
  get selectedTransportationServiceTypes$(): Observable<string[]> {
    return this.store$.pipe(
      select(getSelectedServiceDetailTypes(this.vendorsSelectorServiceType))
    );
  }
  // Will call the transportation selector by default
  serviceOptions$: Observable<MakeAReferralOptionsType> = this.store$.pipe(
    select(getServiceOptions(this.serviceType)),
    takeUntil(this.onDestroy$)
  );
  vendors$: Observable<ReferralVendor[]> = this.store$.pipe(
    select(getVendors(this.serviceType)),
    takeUntil(this.onDestroy$)
  );

  //#endregion

  constructor(
    public stepName: string,
    public store$: Store<RootState>,
    public confirmationModalService: ConfirmationModalService,
    public serviceType: ServiceType = TRANSPORTATION_ARCH_TYPE
  ) {
    super(stepName, store$);
  }

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    // Vendors does not currently call super.ngOnInt() as the status/value changes
    this.initFormGroup();
    this.serviceOptions$
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged()
      )
      .subscribe((options) => {
        if (this.serviceType === TRANSPORTATION_ARCH_TYPE) {
          this.vendorsMode = options.vendorMode as VendorSelectionMode;
        } else {
          const vendorMode = (options.vendorMode as Array<{
            serviceType: ServiceType;
            mode: VendorSelectionMode;
          }>).find((f) => f.serviceType === this.serviceType);
          this.vendorsMode = vendorMode ? vendorMode.mode : null;
        }
        switch (this.vendorsMode) {
          case VendorSelectionMode.REORDER_SELECT:
            this.vendorsText =
              'Check vendors you wish to select and order them in your preferred servicing order.';
            break;
          case VendorSelectionMode.READ_ONLY:
            this.vendorsText =
              'This is the default vendor preference order. Vendor order is not editable.';
            break;
          case VendorSelectionMode.REORDER_ONLY:
            this.vendorsText =
              'Change the order of the vendors by clicking the arrows.';
            break;
        }
      });
  }

  //#region   Public Methods
  constructFormGroup(
    services: string[],
    formState?: any,
    firstBuild?: boolean
  ) {
    this.vendors$.pipe(take(1)).subscribe((vendors) => {
      let formGroupItems: FormGroupItem[] = [];
      let formObj = {};
      if (!formState) {
        formObj = this.buildFormObj(
          [...services],
          [...vendors],
          formGroupItems
        );
      } else {
        formObj = this.buildFormObj(
          Object.keys(formState),
          [...vendors],
          formGroupItems,
          formState
        );
      }
      this.stepForm = new FormGroup(formObj);
      this.stepForm.setValidators(
        this.validateAtLeastOneVendorIsSelected.bind(this)
      );
      this.formGroupItems = formGroupItems;
      this.vendorsSelected = formState ? { ...formState } : {};
      this.save();
      if (!firstBuild) {
        this.vendorsForm.emit(this.stepForm);
      }
    });

    this.stepForm.statusChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.onDestroy$)
      )
      .subscribe((value) => {
        if (value === 'VALID') {
          this.store$.dispatch(new AddValidFormState(this.stepName));
        } else {
          this.store$.dispatch(new RemoveValidFormState(this.stepName));
        }
      });

    this.stepForm.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.save();
      });
  }

  //#endregion

  cancel(): void {}

  selectChange(event: MatSelectChange) {
    if (event.value === 'all') {
      this.confirmationModalService
        .displayModal({
          titleString: 'Service Selection',
          bodyHtml:
            'The selections that you have made will be reset to default setting. Are you sure you want to continue?',
          affirmString: 'Yes',
          denyString: 'No'
        })
        .afterClosed()

        .subscribe((confirmed) => {
          if (true === confirmed) {
            this.multiSelectFCPreviousValue = event.value;
            this.constructFormGroup(['all']);
          } else {
            this.multiSelectFC.setValue(this.multiSelectFCPreviousValue, {
              emitEvent: true
            });
          }
        });
    } else {
      this.multiSelectFCPreviousValue = event.value;
      this.selectedTransportationServiceTypes$
        .pipe(first())
        .subscribe((services) => {
          this.constructFormGroup(services);
        });
    }
  }

  loadForm() {}

  private initFormGroup() {
    // combineLatest won't work until after the form has been initialized below
    combineLatest([
      this.store$.pipe(
        select(getSelectedServiceDetailTypes(this.vendorsSelectorServiceType)),
        takeUntil(this.onDestroy$)
      ),
      this.formState$.pipe(first())
    ])
      .pipe(first())
      .subscribe(([selectedDetailTypes, formState]) => {
        if (Object.keys(formState).length > 0) {
          formState = this.checkFormStateForAddedOrRemovedDetailTypes(
            selectedDetailTypes,
            formState
          );

          if (formState['all'] === undefined) {
            this.multiSelectFCPreviousValue = 'individual';
            this.multiSelectFC.setValue('individual', { emitEvent: true });
          } else {
          }
          this.constructFormGroup(Object.keys(formState), formState, true);
        } else {
          // First time use
          this.constructFormGroup(['all'], null, true);
          this.store$.dispatch(new AddValidFormState(this.stepName));
        }
      });
  }

  //#endregion

  private checkFormStateForAddedOrRemovedDetailTypes(
    selectedDetailTypes: string[],
    formState: { [key: string]: any }
  ) {
    // If we are in all mode, there is no work to do.  Only individual modes need to be cleaned up.
    if (formState == null || formState['all'] !== undefined) {
      return formState;
    }

    // First we check for services that have been removed and then remove them from the formState
    const keysToDelete: string[] = [];
    let formKeys = Object.keys(formState);
    formKeys.forEach((key) => {
      if (false === includes(selectedDetailTypes, key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      delete formState[key];
    });

    // Next add vendors for new services
    const keysToAdd: string[] = [];
    selectedDetailTypes.forEach((key) => {
      if (false === includes(formKeys, key)) {
        keysToAdd.push(key);
      }
    });
    if (keysToAdd.length > 0) {
      let vendorSet: ReferralVendor[] = [];
      this.vendors$.pipe(take(1)).subscribe((vendors) => {
        vendorSet = vendors;
      });
      keysToAdd.forEach((key) => {
        formState[key] = cloneDeep(vendorSet);
      });
    }

    // Lastly, if there is just one service left, then we need to be in all mode (currently we are individual mode otherwise we would not get here).
    formKeys = Object.keys(formState);
    if (formKeys.length === 1) {
      let keyName = '';
      formKeys.forEach((key) => {
        keyName = key;
      });
      formState['all'] = formState[keyName];
      delete formState[keyName];
    }

    return formState;
  }

  //#region   Private Methods
  private buildFormObj(
    services: string[],
    vendors: ReferralVendor[],
    formGroupItems: FormGroupItem[],
    formState?
  ): { [key: string]: AbstractControl } {
    let formObj: { [key: string]: AbstractControl } = {};
    services.forEach((serviceName) => {
      let formControlState;

      if (formState && formState[serviceName]) {
        formControlState = formState[serviceName];
      } else {
        formControlState = [...vendors];
      }

      const formGroupItem: FormGroupItem = {
        name: serviceName,
        label: translateServiceName(serviceName),
        control: new FormControl(formControlState)
      };

      formGroupItems.push(formGroupItem);
      formObj[serviceName] = formGroupItem.control;
    });
    return { ...formObj };
  }

  private validateAtLeastOneVendorIsSelected(
    group: FormGroup
  ): ValidationErrors {
    Object.getOwnPropertyNames(group.controls).forEach((section) => {
      if (
        isEmpty(group.controls[section].value) &&
        this.vendorsMode === VendorSelectionMode.REORDER_SELECT
      ) {
        return group.controls[section].setErrors({ noneSelected: true });
      }
    });
    return;
  }

  //#endregion
}
