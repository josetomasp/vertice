import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HealtheGridModule } from '@modules/healthe-grid';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  HealtheAlertBannerModule,
  HealtheDatepickerModule,
  HealtheSelectModule,
  HealtheTooltipAdvancedModule
} from '@healthe/vertice-library';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { CustomerConfigsGuardService } from '../../../customer-configs/customer-configs-guard.service';
import { CustomerConfigsModule } from '../../../customer-configs/customer-configs.module';
import { RootState } from '../../../store/models/root.models';
import { PbmAuthDetailsHeaderComponent } from './authorization-information/pbm-auth-details-header/pbm-auth-details-header.component';
import { AuthorizationAlertCardComponent } from './authorization-information/authorization-alert-card/authorization-alert-card.component';
import { AuthorizationAlertModalComponent } from './authorization-information/authorization-alert-modal/authorization-alert-modal.component';
import { PbmAuthorizationInformationComponent } from './authorization-information/pbm-authorization-information.component';
import { PrescriptionDetailsComponent } from './authorization-information/prescription-details/prescription-details.component';
import { ReassignClaimModalComponent } from './authorization-information/reassign-claim-modal/reassign-claim-modal.component';
import { LomnUnsavedChangesGuard } from './lomn-wizard/lomn-unsaved-changes.guard';
import { PbmAuthorizationTabBarComponent } from './pbm-authorization-tab-bar/pbm-authorization-tab-bar.component';
import { PbmAuthorizationComponent } from './pbm-authorization.component';
import { PbmAuthorizationService } from './pbm-authorization.service';
import { RiskInfoExpansionPanelComponent } from './risk-info-expansion-panel/risk-info-expansion-panel.component';
import { CreateLomnEffects } from './store/effects/create-lomn.effects';
import { PbmAuthorizationEffects } from './store/effects/pbm-authorization.effects';
import {
  authorizationReducer,
  authorizationReducerKey
} from './store/reducers/pbm-authorization.reducers';

import { PosAuthPrescriptionHistoryComponent } from './pos-auth-prescription-history/pos-auth-prescription-history.component';
import { PbmAuthClinicalHistoryComponent } from './pbm-auth-clinical-history/pbm-auth-clinical-history.component';
import { PbmAuthDocumentsComponent } from './pbm-auth-documents/pbm-auth-documents.component';
import { LomnWizardComponent } from './lomn-wizard/lomn-wizard.component';
import { PbmHeaderBarComponent } from './pbm-header-bar/pbm-header-bar.component';
import { LomnMedicationListComponent } from './lomn-wizard/lomn-wizard-steps/lomn-medication-list/lomn-medication-list.component';
import { PbmAuthDetailsInsetCardComponent } from './authorization-information/pbm-auth-details-inset-card/pbm-auth-details-inset-card.component';
import { LomnPreviewSubmitComponent } from './lomn-wizard/lomn-wizard-steps/lomn-preview-submit/lomn-preview-submit.component';
import { LomnAttorneyAndClaimantComponent } from './lomn-wizard/lomn-wizard-steps/lomn-attorney-and-claimant/lomn-attorney-and-claimant.component';
import { LomnMedicationPreviewCardComponent } from './lomn-wizard/lomn-wizard-steps/lomn-preview-submit/components/lomn-medication-preview-card/lomn-medication-preview-card.component';
import { LomnSubmitModalComponent } from './lomn-wizard/lomn-wizard-steps/lomn-preview-submit/components/lomn-submit-modal/lomn-submit-modal.component';
import { MmeModalComponent } from './authorization-information/mme-modal/mme-modal.component';
import { PbmAuthNotesComponent } from './authorization-information/pbm-auth-notes/pbm-auth-notes.component';
import { PbmAuthLineItemCardComponent } from './authorization-information/pbm-auth-line-item-card/pbm-auth-line-item-card.component';
import { AuthorizationActionsBannerComponent } from './authorization-information/authorization-actions-banner/authorization-actions-banner.component';
import { ReassignmentReferralBannerComponent } from './authorization-information/reassignment-referral-banner/reassignment-referral-banner.component';
import { RtrPromotionComponent } from './rtr-promotion/rtr-promotion.component';
import { RtrPromotionPrescriptionComponent } from './rtr-promotion/components/rtr-promotion-prescription/rtr-promotion-prescription.component';
import { ViewLogModalComponent } from './view-log-modal/view-log-modal.component';
import { ViewLogModalService } from './view-log-modal/view-log-modal.service';
import { LoadSamaritanDoseModalComponent } from './authorization-information/load-samaritan-dose-modal/load-samaritan-dose-modal.component';
import { ReassignClaimModalService } from './authorization-information/reassign-claim-modal/reassign-claim-modal.service';
import { PayeeInfoModalComponent } from './authorization-information/payee-info-modal/payee-info-modal.component';
import { NonActionableUserBannerComponent } from './authorization-information/non-actionable-user-banner/non-actionable-user-banner.component';
import { FormValidationExtractorModule } from '@modules/form-validation-extractor';
import { ErrorCardModule } from '@modules/error-card';
import { AuthorizationActionDenyIndefinitelyComponent } from './authorization-information/authorization-actions-banner/authorization-action-deny-indefinitely/authorization-action-deny-indefinitely.component';
import { PbmPaperFooterComponent } from './authorization-information/pbm-authorization-footer/pbm-paper-footer/pbm-paper-footer.component';
import { PbmPosFooterComponent } from './authorization-information/pbm-authorization-footer/pbm-pos-footer/pbm-pos-footer.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CopyToClipboardService } from '@shared/service/copy-to-clipboard.service';
import { PBM_AUTHORIZATION_INITIAL_STATE } from './store/models/pbm-authorization-initial-state';
import { PbmAuthLockedBannerModule } from '@modules/pbm-auth-locked-banner/pbm-auth-locked-banner.module';
import { ReactiveComponentModule } from '@ngrx/component';
import { PbmSuccessfulSubmissionModalComponent } from './authorization-information/pbm-successful-submission-modal/pbm-successful-submission-modal.component';
import { PbmTimePeriodModalComponent } from './authorization-information/pbm-time-period-modal/pbm-time-period-modal.component';
import { VerticeRumModule } from 'src/app/modules/rum';
import { SendEmailModalComponent} from './send-email-modal/send-email-modal.component';
import { AlertInfoModalComponent } from '../../../shared/components/alert-info-banner/alert-info-modal/alert-info-modal.component';
import {
  PrescriberInformationLookupModule
} from '@modules/prescriber-information-lookup';

const routes: Routes = [
  {
    path: ':authorizationId/:serviceType',
    component: PbmAuthorizationComponent,
    canActivate: [CustomerConfigsGuardService],
    children: [
      {
        path: 'authorizationInformation',
        component: PbmAuthorizationInformationComponent
      },
      { path: 'prescriptions', component: PosAuthPrescriptionHistoryComponent },
      { path: 'clinical', component: PbmAuthClinicalHistoryComponent },
      { path: 'documents', component: PbmAuthDocumentsComponent },
      {
        path: 'rtrPromotion',
        component: RtrPromotionComponent,
        canDeactivate: [PbmAuthorizationService]
      },
      {
        path: 'createLomn',
        component: LomnWizardComponent,
        canDeactivate: [LomnUnsavedChangesGuard],
        children: [
          {
            path: ':drugNdc',
            component: LomnWizardComponent
          }
        ]
      },
      { path: '**', redirectTo: 'authorizationInformation' }
    ]
  }
];

@NgModule({
    imports: [
        CommonModule,
        MatSnackBarModule,
        MatCardModule,
        MatDialogModule,
        MatExpansionModule,
        FlexLayoutModule,
        FontAwesomeModule,
        RouterModule.forChild(routes),
        SharedModule,
        CustomerConfigsModule,
        StoreModule.forFeature(authorizationReducerKey, authorizationReducer, {
            initialState: {
                pbmAuthorizationRootState: PBM_AUTHORIZATION_INITIAL_STATE
            }
        }),
        EffectsModule.forFeature([PbmAuthorizationEffects, CreateLomnEffects]),
        MatCardModule,
        MatTabsModule,
        MatExpansionModule,
        FlexLayoutModule,
        MatButtonModule,
        MatTooltipModule,
        MatChipsModule,
        MatRadioModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        HealtheDatepickerModule,
        HealtheTooltipAdvancedModule,
        HealtheSelectModule,
        MatDividerModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatStepperModule,
        MatCheckboxModule,
        NgxMaskModule,
        MatCheckboxModule,
        HealtheAlertBannerModule,
        MatProgressSpinnerModule,
        HealtheGridModule,
        FormValidationExtractorModule,
        ErrorCardModule,
        VerticeRumModule,
        PbmAuthLockedBannerModule,
        ReactiveComponentModule,
        PrescriberInformationLookupModule
    ],
    providers: [
        PbmAuthorizationEffects,
        PbmAuthorizationService,
        CopyToClipboardService,
        ViewLogModalService,
        ReassignClaimModalService
    ],
    declarations: [
        AuthorizationActionsBannerComponent,
        PbmAuthorizationComponent,
        PbmAuthorizationTabBarComponent,
        RiskInfoExpansionPanelComponent,
        PbmAuthorizationInformationComponent,
        PrescriptionDetailsComponent,
        AuthorizationAlertCardComponent,
        AuthorizationAlertModalComponent,
        PbmAuthDetailsHeaderComponent,
        ReassignClaimModalComponent,
        PosAuthPrescriptionHistoryComponent,
        PbmAuthClinicalHistoryComponent,
        PbmAuthDocumentsComponent,
        LomnWizardComponent,
        PbmHeaderBarComponent,
        LomnMedicationListComponent,
        PbmAuthDetailsInsetCardComponent,
        LomnMedicationListComponent,
        LomnPreviewSubmitComponent,
        LomnMedicationPreviewCardComponent,
        LomnAttorneyAndClaimantComponent,
        LomnSubmitModalComponent,
        MmeModalComponent,
        PbmAuthNotesComponent,
        PbmAuthLineItemCardComponent,
        ReassignmentReferralBannerComponent,
        ViewLogModalComponent,
        LoadSamaritanDoseModalComponent,
        RtrPromotionComponent,
        RtrPromotionPrescriptionComponent,
        PayeeInfoModalComponent,
        NonActionableUserBannerComponent,
        AuthorizationActionDenyIndefinitelyComponent,
        PbmPaperFooterComponent,
        PbmPosFooterComponent,
        PbmSuccessfulSubmissionModalComponent,
        PbmTimePeriodModalComponent,
        SendEmailModalComponent,
        AlertInfoModalComponent
    ]
})
export class PbmAuthorizationModule {
  constructor(
    public store$: Store<RootState>,
    public router: Router,
    public pbmAuthorizationService: PbmAuthorizationService
  ) {
    this.router.events
      .pipe(
        filter((event) => {
          return event instanceof NavigationEnd;
        }),
        map((evt: NavigationEnd) => {
          const inClaimContext = evt.url.indexOf('/claims/') > -1;
          const inPbmContext = evt.url.indexOf('/pbm/') > -1;

          return inPbmContext && inClaimContext;
        }),
        distinctUntilChanged(),
        filter((inAuthorizationContext) => inAuthorizationContext)
      )
      .subscribe(() => this.pbmAuthorizationService.dispatchLoadAuthData());
  }
}
