import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { RootState } from '../../../../../../store/models/root.models';
import { WizardBaseDirective } from '../../components/wizard-base.directive';
import { MAT_EXPANSION_PANEL_REF } from '../../make-a-referral-shared';
import {
  TRANSPORTATION_ARCH_TYPE,
  TRANSPORTATION_DOCUMENTS_STEP_NAME,
  TRANSPORTATION_FLIGHT_STEP_NAME,
  TRANSPORTATION_LODGING_STEP_NAME,
  TRANSPORTATION_OTHER_STEP_NAME,
  TRANSPORTATION_REVIEW_STEP_NAME,
  TRANSPORTATION_SEDAN_STEP_NAME,
  TRANSPORTATION_STEP_DEFINITIONS,
  TRANSPORTATION_VENDOR_STEP_NAME,
  TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME
} from '../transportation-step-definitions';
import {
  getServiceOptions,
  getTransportationTypes
} from '../../../store/selectors/makeReferral.selectors';
import { MatDialog } from '@angular/material/dialog';
import { FusionServiceName } from '../../../store/models/fusion/fusion-make-a-referral.models';
import { MakeAReferralHelperService } from '../../make-a-referral-helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AlertType
} from '@shared/components/confirmation-banner/confirmation-banner.component';

@Component({
  selector: 'healthe-transportation-wizard',
  templateUrl: './transportation-wizard.component.html',
  styleUrls: ['./transportation-wizard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransportationWizardComponent
  extends WizardBaseDirective
  implements OnInit, OnDestroy
{
  //#region   Public Properties
  sedanStepName = TRANSPORTATION_SEDAN_STEP_NAME;
  wheelchairStepName = TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME;
  flightStepName = TRANSPORTATION_FLIGHT_STEP_NAME;
  lodgingStepName = TRANSPORTATION_LODGING_STEP_NAME;
  otherStepName = TRANSPORTATION_OTHER_STEP_NAME;
  documentsName = TRANSPORTATION_DOCUMENTS_STEP_NAME;
  vendorsName = TRANSPORTATION_VENDOR_STEP_NAME;
  reviewName = TRANSPORTATION_REVIEW_STEP_NAME;
  alertType = AlertType;

  isReferralOptionsLoaded$ = this.store$.pipe(
    select(getServiceOptions(TRANSPORTATION_ARCH_TYPE)),
    map((options) => options.isLoaded)
  );
  isTransportationTypesLoaded$ = this.store$.pipe(
    select(getTransportationTypes),
    map((options) => options.isLoaded)
  );

  //#endregion
  constructor(
    public store$: Store<RootState>,
    public matDialog: MatDialog,
    public makeAReferralHelperService: MakeAReferralHelperService,
    public snackbar: MatSnackBar,
    @Inject(MAT_EXPANSION_PANEL_REF) public expansionPanel: MatExpansionPanel
  ) {
    super(
      TRANSPORTATION_STEP_DEFINITIONS,
      {
        serviceName: TRANSPORTATION_ARCH_TYPE,
        vendorsName: TRANSPORTATION_VENDOR_STEP_NAME,
        reviewName: TRANSPORTATION_REVIEW_STEP_NAME,
        documentsName: TRANSPORTATION_DOCUMENTS_STEP_NAME
      },
      { Transportation: 'detailSelection' },
      FusionServiceName.Transportation,
      store$,
      expansionPanel,
      matDialog,
      makeAReferralHelperService,
      snackbar
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  currentVendorsForm(form: any): void {
    this.stepper.selected.stepControl = form;
  }
}
