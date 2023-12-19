import { Component, Inject, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { select, Store } from '@ngrx/store';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  withLatestFrom
} from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../../store/selectors/router.selectors';
import { loadFusionVendorAllocations } from '../../../store/actions/fusion/fusion-make-a-referral.actions';
import { SetSectionDirty } from '../../../store/actions/make-a-referral.actions';
import {
  DMEFormState,
  FusionServiceName
} from '../../../store/models/fusion/fusion-make-a-referral.models';
import { WizardBaseDirective } from '../../components/wizard-base.directive';
import {
  AncilliaryServiceCode,
  MAT_EXPANSION_PANEL_REF
} from '../../make-a-referral-shared';
import {
  DME_ARCH_TYPE,
  DME_DOCUMENTS_STEP_NAME,
  DME_EQUIPMENT_STEP_NAME,
  DME_REVIEW_STEP_NAME,
  DME_STEP_DEFINITIONS,
  DME_VENDOR_STEP_NAME
} from '../dme-step-definitions';
import { MatDialog } from '@angular/material/dialog';
import {
  MakeAReferralHelperService
} from '../../make-a-referral-helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AlertType
} from '@shared/components/confirmation-banner/confirmation-banner.component';

@Component({
  selector: 'healthe-dme-wizard',
  templateUrl: './dme-wizard.component.html',
  styleUrls: ['./dme-wizard.component.scss']
})
export class DmeWizardComponent extends WizardBaseDirective implements OnInit {
  equipmentStepName: string = DME_EQUIPMENT_STEP_NAME;
  alertType = AlertType;

  isPrevDisabled: boolean = false;
  encodedClaimNumber$ = this.store$.pipe(select(getEncodedClaimNumber));
  encodedCustomerId$ = this.store$.pipe(select(getEncodedCustomerId));
  constructor(
    public store$: Store<RootState>,
    public matDialog: MatDialog,
    public makeAReferralHelperService: MakeAReferralHelperService,
    public snackbar: MatSnackBar,
    @Inject(MAT_EXPANSION_PANEL_REF) public expansionPanel: MatExpansionPanel
  ) {
    super(
      DME_STEP_DEFINITIONS,
      {
        serviceName: DME_ARCH_TYPE,
        documentsName: DME_DOCUMENTS_STEP_NAME,
        vendorsName: DME_VENDOR_STEP_NAME,
        reviewName: DME_REVIEW_STEP_NAME
      },
      { [FusionServiceName.DME]: 'wizard' },
      FusionServiceName.DME,
      store$,
      expansionPanel,
      matDialog,
      makeAReferralHelperService,
      snackbar
    );
  }

  ngOnInit() {
    // Dispatch the interaction action.
    this.store$.dispatch(
      new SetSectionDirty({ [FusionServiceName.DME]: true })
    );

    // Second call the base ngOnInit to render the selected step.
    super.ngOnInit();

    // Look at the product category and call for new vendors
    this.stepWizardForm.valueChanges
      .pipe(
        debounceTime(250),
        filter((dmeFormState: DMEFormState) => {
          // tslint:disable-next-line:no-non-null-assertion
          const { productSelectionMode, product, category } = dmeFormState![
            'dme-equipment'
          ]!.schedulingForm[0];
          return productSelectionMode === 'category' && product && category;
        }),
        map((formState) => {
          const { product, category } = formState[
            'dme-equipment'
          ].schedulingForm[0];
          return product;
        }),
        distinctUntilChanged(
          (product1, product2) =>
            product1.customerSubTypeId === product2.customerSubTypeId
        ),
        withLatestFrom(this.encodedClaimNumber$, this.encodedCustomerId$)
      )
      .subscribe(([product, encodedClaimNumber, encodedCustomerId]) => {
        if (product) {
          this.store$.dispatch(
            loadFusionVendorAllocations({
              ancillaryServiceCode: AncilliaryServiceCode.DME,
              encodedClaimNumber,
              encodedCustomerId,
              serviceProductSubTypeId: product.customerSubTypeId,
              serviceProductTypeId: product.customerTypeId,
              serviceType: 'dme'
            })
          );
        }
      });
    this.setIsPrevDisabled(this.stepper.selectedIndex);
  }

  // override the base method
  previous() {
    if (this.stepper.selectedIndex !== 0) {
      this.stepper.previous();
      this.setIsPrevDisabled(this.stepper.selectedIndex);
    }
  }

  // override the base method
  continue() {
    this.stepper.next();
    this.setIsPrevDisabled(this.stepper.selectedIndex);
  }

  // in case step was change by the header
  onStepChange($event) {
    this.setIsPrevDisabled($event.selectedIndex);
  }

  private setIsPrevDisabled(index): boolean {
    if (index === 0) {
      this.isPrevDisabled = true;
    } else {
      this.isPrevDisabled = false;
    }
    return this.isPrevDisabled;
  }
}
