import { ObserversModule } from '@angular/cdk/observers';
import { Overlay } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import {
  MAT_SELECT_SCROLL_STRATEGY,
  MatSelectModule
} from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  HealtheAlertBannerModule,
  HealtheDatepickerModule,
  HealtheSelectModule,
  HealtheTooltipAdvancedModule,
  HealtheTooltipAdvancedService,
  NgxMatDrpModule
} from '@healthe/vertice-library';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared';
import {
  referralStateKey
} from '@shared/store/selectors/makeAReferral.selectors';
import { NgxMaskModule } from 'ngx-mask';

import { scrollFactory } from '../../../claim-view/claim-view.module';
import {
  CustomerConfigsGuardService
} from '../../../customer-configs/customer-configs-guard.service';
import {
  CustomerConfigsModule
} from '../../../customer-configs/customer-configs.module';
import {
  MakeAReferralCellSwitchComponent
} from '../../../search-nav/referrals/make-a-referral-search/make-a-referral-cell-switch/make-a-referral-cell-switch.component';
import {
  MakeAReferralSearchBoxComponent
} from '../../../search-nav/referrals/make-a-referral-search/make-a-referral-search-box/make-a-referral-search-box.component';
import {
  MakeAReferralSearchComponent
} from '../../../search-nav/referrals/make-a-referral-search/make-a-referral-search.component';
import {
  MakeAReferralTableComponent
} from '../../../search-nav/referrals/make-a-referral-search/make-a-referral-table/make-a-referral-table.component';
import { SearchNavModule } from '../../../search-nav/search-nav.module';
import {
  MakeAReferralSearchEffects
} from '../../../search-nav/store/effects/make-a-referral-search.effects';
import {
  DocumentPickerModalComponent
} from './components/document-picker-modal/document-picker-modal.component';
import {
  DocumentPickerComponent
} from './components/document-picker/document-picker.component';
import {
  AddLocationModalComponent
} from './make-a-referral/components/add-location-modal/add-location-modal.component';
import {
  ApprovedLocationsWithLocationLimitsFormComponent
} from './make-a-referral/components/approved-locations-form-with-location-limits/approved-locations-with-location-limits-form.component';
import {
  ApprovedLocationsFormComponent
} from './make-a-referral/components/approved-locations-form/approved-locations-form.component';
import {
  CheckboxExpansionWithLocationLimitsComponent
} from './make-a-referral/components/checkbox-expansion-with-location-limits/checkbox-expansion-with-location-limits.component';
import {
  CheckboxExpansionComponent
} from './make-a-referral/components/checkbox-expansion/checkbox-expansion.component';
import {
  DateRangeFormComponent
} from './make-a-referral/components/date-range-form/date-range-form.component';
import {
  IcdCodesFusionEditModalComponent
} from './make-a-referral/components/icd-codes-fusion-display/components/icd-codes-fusion-edit-modal/icd-codes-fusion-edit-modal.component';
import {
  IcdCodesFusionDisplayComponent
} from './make-a-referral/components/icd-codes-fusion-display/icd-codes-fusion-display.component';
import {
  MarNavExitConfirmModalComponent
} from './make-a-referral/components/mar-nav-exit-confirm-moodal/mar-nav-exit-confirm-modal.component';
import {
  OrderingPrescriberInformationComponent
} from './make-a-referral/components/ordering-prescriber-information/ordering-prescriber-information.component';
import {
  ReviewSectionHeaderComponent
} from './make-a-referral/components/review/review-section-header/review-section-header.component';
import {
  SpecificDateFormArrayComponent
} from './make-a-referral/components/specific-date-form-array/specific-date-form-array.component';
import {
  DmeSingleOrRangeSwitchComponent
} from './make-a-referral/components/specific-date-form-array/specific-date-trip-information-form/components/dme-single-or-range-switch/dme-single-or-range-switch.component';
import {
  HcpcAndProductSelectSwitchComponent
} from './make-a-referral/components/specific-date-form-array/specific-date-trip-information-form/components/hcpc-and-product-select-switch/hcpc-and-product-select-switch.component';
import {
  HhSingleOrRangeSwitchComponent
} from './make-a-referral/components/specific-date-form-array/specific-date-trip-information-form/components/hh-single-or-range-switch/hh-single-or-range-switch.component';
import {
  SpecificDateTripInformationFormComponent
} from './make-a-referral/components/specific-date-form-array/specific-date-trip-information-form/specific-date-trip-information-form.component';
import {
  StepAdvancerComponent
} from './make-a-referral/components/step-advancer/step-advancer.component';
import {
  StepperStepLabelComponent
} from './make-a-referral/components/stepper-step-label/stepper-step-label.component';
import {
  SubmitConfirmationModalComponent
} from './make-a-referral/components/submit-confirmation-modal/submit-confirmation-modal.component';
import {
  SurgicalInformationWithLocationComponent
} from './make-a-referral/components/surgical-information-with-location/surgical-information-with-location.component';
import {
  UploadFilesProgressModalComponent
} from './make-a-referral/components/upload-files-progress-modal/upload-files-progress-modal.component';
import {
  VendorsSelectorComponent
} from './make-a-referral/components/vendors-selector/vendors-selector.component';
import {
  DiagnosticsReviewComponent
} from './make-a-referral/diagnostics/components/diagnostics-review/diagnostics-review.component';
import {
  DiagnosticsCtScanComponent
} from './make-a-referral/diagnostics/diagnostics-ct-scan/diagnostics-ct-scan.component';
import {
  DiagnosticsDocumentsComponent
} from './make-a-referral/diagnostics/diagnostics-documents/diagnostics-documents.component';
import {
  DiagnosticsEmgComponent
} from './make-a-referral/diagnostics/diagnostics-emg/diagnostics-emg.component';
import {
  DiagnosticsMriComponent
} from './make-a-referral/diagnostics/diagnostics-mri/diagnostics-mri.component';
import {
  DiagnosticsOtherComponent
} from './make-a-referral/diagnostics/diagnostics-other/diagnostics-other.component';
import {
  DiagnosticsReviewWizardComponent
} from './make-a-referral/diagnostics/diagnostics-review-wizard/diagnostics-review-wizard.component';
import {
  DiagnosticsSelectionComponent
} from './make-a-referral/diagnostics/diagnostics-selection/diagnostics-selection.component';
import {
  DiagnosticsUltrasoundComponent
} from './make-a-referral/diagnostics/diagnostics-ultrasound/diagnostics-ultrasound.component';
import {
  DiagnosticsVendorsWizardFormComponent
} from './make-a-referral/diagnostics/diagnostics-vendors-wizard-form/diagnostics-vendors-wizard-form.component';
import {
  DiagnosticsWizardComponent
} from './make-a-referral/diagnostics/diagnostics-wizard/diagnostics-wizard.component';
import {
  DiagnosticsXrayComponent
} from './make-a-referral/diagnostics/diagnostics-xray/diagnostics-xray.component';
import {
  DmeReviewDetailsComponent
} from './make-a-referral/dme/components/dme-review-details/dme-review-details.component';
import {
  DmeDocumentsComponent
} from './make-a-referral/dme/dme-documents/dme-documents.component';
import {
  DmeEquipmentComponent
} from './make-a-referral/dme/dme-equipment/dme-equipment.component';
import {
  DmeReviewComponent
} from './make-a-referral/dme/dme-review/dme-review.component';
import {
  DmeVendorsWizardFormComponent
} from './make-a-referral/dme/dme-vendors-wizard-form/dme-vendors-wizard-form.component';
import {
  DmeWizardComponent
} from './make-a-referral/dme/dme-wizard/dme-wizard.component';
import {
  HomeHealthReviewDetailsComponent
} from './make-a-referral/home-health/components/home-health-review-details/home-health-review-details.component';
import {
  HomeHealthAidesComponent
} from './make-a-referral/home-health/home-health-aides/home-health-aides.component';
import {
  HomeHealthDocumentsComponent
} from './make-a-referral/home-health/home-health-documents/home-health-documents.component';
import {
  HomeHealthInHomeTherapyComponent
} from './make-a-referral/home-health/home-health-in-home-therapy/home-health-in-home-therapy.component';
import {
  HomeHealthInfusionComponent
} from './make-a-referral/home-health/home-health-infusion/home-health-infusion.component';
import {
  HomeHealthNursingComponent
} from './make-a-referral/home-health/home-health-nursing/home-health-nursing.component';
import {
  HomeHealthOtherComponent
} from './make-a-referral/home-health/home-health-other/home-health-other.component';
import {
  HomeHealthReviewComponent
} from './make-a-referral/home-health/home-health-review/home-health-review.component';
import {
  HomeHealthSelectionComponent
} from './make-a-referral/home-health/home-health-selection/home-health-selection.component';
import {
  HomeHealthVendorsWizardFormComponent
} from './make-a-referral/home-health/home-health-vendors-wizard-form/home-health-vendors-wizard-form.component';
import {
  HomeHealthWizardComponent
} from './make-a-referral/home-health/home-health-wizard/home-health-wizard.component';
import {
  InterpretationReviewComponent
} from './make-a-referral/language/components/review/interpretation-review/interpretation-review.component';
import {
  LanguageVendorReviewComponent
} from './make-a-referral/language/components/review/language-vendor-review/language-vendor-review.component';
import {
  TranslationReviewComponent
} from './make-a-referral/language/components/review/translation-review/translation-review.component';
import {
  InterpretationWizardFormComponent
} from './make-a-referral/language/interpretation-wizard-form/interpretation-wizard-form.component';
import {
  LanguageDocumentsWizardFormComponent
} from './make-a-referral/language/language-documents/language-documents-wizard-form.component';
import {
  LanguageReviewWizardComponent
} from './make-a-referral/language/language-review-wizard/language-review-wizard.component';
import {
  LanguageSelectionComponent
} from './make-a-referral/language/language-selection/language-selection.component';
import {
  LanguageVendorsWizardFormComponent
} from './make-a-referral/language/language-vendors-wizard-form/language-vendors-wizard-form.component';
import {
  LanguageWizardComponent
} from './make-a-referral/language/language-wizard/language-wizard.component';
import {
  TranslationWizardFormComponent
} from './make-a-referral/language/translation-wizard-form/translation-wizard-form.component';
import {
  MakeAReferralGuardService
} from './make-a-referral/make-a-referral-guard.service';
import {
  MakeAReferralHelperService
} from './make-a-referral/make-a-referral-helper.service';
import {
  MakeAReferralReviewSectionComponent
} from './make-a-referral/make-a-referral-review/make-a-referral-review-section/make-a-referral-review-section.component';
import {
  MakeAReferralReviewComponent
} from './make-a-referral/make-a-referral-review/make-a-referral-review.component';
import {
  RetryBannerComponent
} from './make-a-referral/make-a-referral-review/retry-banner/retry-banner.component';
import {
  MarSubmitErrorBannerComponent
} from './make-a-referral/make-a-referral-review/submit-error-banner/mar-submit-error-banner.component';
import {
  MakeAReferralWizardComponent
} from './make-a-referral/make-a-referral-wizard/make-a-referral-wizard.component';
import {
  MakeAReferralComponent
} from './make-a-referral/make-a-referral.component';
import {
  MakeAReferralService
} from './make-a-referral/make-a-referral.service';
import {
  PhysicalMedicineReviewDetailsComponent
} from './make-a-referral/physical-medicine/components/physical-medicine-review-details/physical-medicine-review-details.component';
import {
  PhysicalMedicineDocumentsComponent
} from './make-a-referral/physical-medicine/physical-medicine-documents/physical-medicine-documents.component';
import {
  PhysicalMedicineFceComponent
} from './make-a-referral/physical-medicine/physical-medicine-fce/physical-medicine-fce.component';
import {
  PhysicalMedicineOccupationalTherapyComponent
} from './make-a-referral/physical-medicine/physical-medicine-occupational-therapy/physical-medicine-occupational-therapy.component';
import {
  PhysicalMedicineOtherComponent
} from './make-a-referral/physical-medicine/physical-medicine-other/physical-medicine-other.component';
import {
  PhysicalMedicinePhysicalTherapyComponent
} from './make-a-referral/physical-medicine/physical-medicine-physical-therapy/physical-medicine-physical-therapy.component';
import {
  PhysicalMedicineReviewWizardComponent
} from './make-a-referral/physical-medicine/physical-medicine-review/physical-medicine-review-wizard.component';
import {
  PhysicalMedicineSelectionComponent
} from './make-a-referral/physical-medicine/physical-medicine-selection/physical-medicine-selection.component';
import {
  PhysicalMedicineVendorsWizardFormComponent
} from './make-a-referral/physical-medicine/physical-medicine-vendors-wizard-form/physical-medicine-vendors-wizard-form.component';
import {
  PhysicalMedicineWizardComponent
} from './make-a-referral/physical-medicine/physical-medicine-wizard/physical-medicine-wizard.component';
import {
  RequestorInformationFormComponent
} from './make-a-referral/requestor-information-form/requestor-information-form.component';
import {
  ServiceSelectionModalComponent
} from './make-a-referral/service-selection-modal/service-selection-modal.component';
import {
  ServiceSelectionComponent
} from './make-a-referral/service-selection/service-selection.component';
import {
  DateRangeReviewComponent
} from './make-a-referral/transportation/components/review/date-range-review/date-range-review.component';
import {
  DatesAndRangeCompositeReviewComponent
} from './make-a-referral/transportation/components/review/dates-and-range-composite-review/dates-and-range-composite-review.component';
import {
  FlightReviewComponent
} from './make-a-referral/transportation/components/review/flight-review/flight-review.component';
import {
  LodgingReviewComponent
} from './make-a-referral/transportation/components/review/lodging-review/lodging-review.component';
import {
  OtherReviewComponent
} from './make-a-referral/transportation/components/review/other-review/other-review.component';
import {
  SedanReviewComponent
} from './make-a-referral/transportation/components/review/sedan-review/sedan-review.component';
import {
  SpecificDatesReviewComponent
} from './make-a-referral/transportation/components/review/specific-dates-review/specific-dates-review.component';
import {
  TransportationVendorReviewComponent
} from './make-a-referral/transportation/components/review/vendor-review/transportation-vendor-review.component';
import {
  WheelchairReviewComponent
} from './make-a-referral/transportation/components/review/wheelchair-review/wheelchair-review.component';
import {
  FlightWizardFormComponent
} from './make-a-referral/transportation/flight-wizard-form/flight-wizard-form.component';
import {
  LodgingWizardFormComponent
} from './make-a-referral/transportation/lodging-wizard-form/lodging-wizard-form.component';
import {
  OtherWizardFormComponent
} from './make-a-referral/transportation/other-wizard-form/other-wizard-form.component';
import {
  SedanWizardFormComponent
} from './make-a-referral/transportation/sedan-wizard-form/sedan-wizard-form.component';
import {
  TransportationDocumentsWizardFormComponent
} from './make-a-referral/transportation/transportation-documents-wizard-form/transportation-documents-wizard-form.component';
import {
  TransportationReviewWizardComponent
} from './make-a-referral/transportation/transportation-review-wizard/transportation-review-wizard.component';
import {
  TransportationSelectionComponent
} from './make-a-referral/transportation/transportation-selection/transportation-selection.component';
import {
  TransportationVendorsWizardFormComponent
} from './make-a-referral/transportation/transportation-vendors-wizard-form/transportation-vendors-wizard-form.component';
import {
  TransportationWizardComponent
} from './make-a-referral/transportation/transportation-wizard/transportation-wizard.component';
import {
  WheelchairSupportWizardFormComponent
} from './make-a-referral/transportation/wheelchair-support-wizard-form/wheelchair-support-wizard-form.component';
import {
  WizardPortalComponent
} from './make-a-referral/wizard-portal/wizard-portal.component';
import {
  ReferralAuthorizationSearchComponent
} from './referral-authorization-search/referral-authorization-search.component';
import { ReferralComponent } from './referral.component';
import {
  AuthHistoryGroupTableComponent
} from './referralId/authorization-history/auth-history-group-table/auth-history-group-table.component';
import {
  AuthorizationHistoryComponent
} from './referralId/authorization-history/authorization-history.component';
import {
  ReasonsModalComponent
} from './referralId/authorization-history/reasons-modal/reasons-modal.component';
import {
  ClinicalHistoryFooterComponent
} from './referralId/clinical-history/clinical-history-footer/clinical-history-footer.component';
import {
  DetailIconComponent
} from './referralId/clinical-history/detail-icon/detail-icon.component';
import {
  FusionClinicalHistoryComponent
} from './referralId/clinical-history/fusion-clinical-history.component';
import {
  AuthRelatedAppointmentsModalComponent
} from './referralId/components/auth-related-appointments-modal/auth-related-appointments-modal.component';
import {
  AuthRelatedAppointmentsModalService
} from './referralId/components/auth-related-appointments-modal/auth-related-appointments-modal.service';
import {
  IcdCodesEditModalComponent
} from './referralId/components/icd-codes-edit-modal/icd-codes-edit-modal.component';
import {
  ReferralActivityTabBarComponent
} from './referralId/components/referral-activity-tab-bar/referral-activity-tab-bar.component';
import {
  BodyPartsHistoryModalComponent
} from './referralId/components/referral-authorization-body-parts-history/components/body-parts-history-modal/body-parts-history-modal.component';
import {
  ReferralAuthorizationBodyPartsHistoryComponent
} from './referralId/components/referral-authorization-body-parts-history/referral-authorization-body-parts-history.component';
import {
  ReferralAuthorizationFooterComponent
} from './referralId/components/referral-authorization-footer/referral-authorization-footer.component';
import {
  ReferralOverviewCardComponent
} from './referralId/components/referral-overview-card/referral-overview-card.component';
import {
  GridCardComponent
} from './referralId/referral-activity/components/grid-of-cards/grid-card/grid-card.component';
import {
  GridOfCardsComponent
} from './referralId/referral-activity/components/grid-of-cards/grid-of-cards.component';
import {
  BillingModalComponent
} from './referralId/referral-activity/components/modals/billing-modal/billing-modal.component';
import {
  AuthorizationActionsBarComponent
} from './referralId/referral-activity/components/modals/components/authorization-actions-bar/authorization-actions-bar.component';
import {
  AuthorizationOverviewComponent
} from './referralId/referral-activity/components/modals/components/authorization-overview/authorization-overview.component';
import {
  FlightTripsInformationComponent
} from './referralId/referral-activity/components/modals/components/flight-trips-information/flight-trips-information.component';
import {
  GroundTripsInformationComponent
} from './referralId/referral-activity/components/modals/components/ground-trips-information/ground-trips-information.component';
import {
  LodgingStaysInformationComponent
} from './referralId/referral-activity/components/modals/components/lodging-stays-information/lodging-stays-information.component';
import {
  StarsComponent
} from './referralId/referral-activity/components/modals/components/stars/stars.component';
import {
  ReferralNotesAndDocumentsModalComponent
} from './referralId/referral-activity/components/modals/fusion/referral-notes-documents-modal/referral-notes-documents-modal.component';
import {
  ResultsFusionModalComponent
} from './referralId/referral-activity/components/modals/fusion/results-fusion-modal/results-fusion-modal.component';
import {
  SchedulingStatusFusionModalComponent
} from './referralId/referral-activity/components/modals/fusion/scheduling-status-fusion-modal/scheduling-status-fusion-modal.component';
import {
  ServiceScheduledFusionModalComponent
} from './referralId/referral-activity/components/modals/fusion/service-scheduled-fusion-modal/service-scheduled-fusion-modal.component';
import {
  ResultsModalComponent
} from './referralId/referral-activity/components/modals/results-modal/results-modal.component';
import {
  ServiceScheduledModalComponent
} from './referralId/referral-activity/components/modals/service-scheduled-modal/service-scheduled-modal.component';
import {
  ActivityTableComponent
} from './referralId/referral-activity/components/referral-activity-table/activity-table.component';
import {
  FilterBoxComponent
} from './referralId/referral-activity/components/referral-activity-table/filter-box/filter-box.component';
import {
  ReferralDocumentsComponent
} from './referralId/referral-activity/components/referral-documents/referral-documents.component';
import {
  ReferralInformationRequestButtonComponent
} from './referralId/referral-activity/components/referral-information-request-button/referral-information-request-button.component';
import {
  ReferralNotesWidgetComponent
} from './referralId/referral-activity/components/referral-notes-widget/referral-notes-widget.component';
import {
  SummaryBarComponent
} from './referralId/referral-activity/components/summary-bar/summary-bar.component';
import {
  ReferralActivityComponent
} from './referralId/referral-activity/referral-activity.component';
import {
  ActiveAuthorizationGuardService
} from './referralId/referral-authorization/active-authorization-guard.service';
import {
  AuthorizationInformationService
} from './referralId/referral-authorization/authorization-information.service';
import {
  AddDocumentsModalComponent
} from './referralId/referral-authorization/components/add-documents-modal/add-documents-modal.component';
import {
  AuthorizationActionsComponent
} from './referralId/referral-authorization/components/authorization-actions/authorization-actions.component';
import {
  AuthorizationDocumentsPickerComponent
} from './referralId/referral-authorization/components/authorization-documents-picker/authorization-documents-picker.component';
import {
  AuthorizationImportantNoteComponent
} from './referralId/referral-authorization/components/authorization-important-note/authorization-important-note.component';
import {
  LockedClaimBannerComponent
} from './referralId/referral-authorization/components/locked-claim-banner/locked-claim-banner.component';
import {
  LockedReferralBannerComponent
} from './referralId/referral-authorization/components/locked-referral-banner/locked-referral-banner.component';
import {
  NoPendingAuthorizationsComponent
} from './referralId/referral-authorization/components/no-pending-authorizations/no-pending-authorizations.component';
import {
  ReferralReasonForReviewComponent
} from './referralId/referral-authorization/components/referral-reason-for-review/referral-reason-for-review.component';
import {
  ViewDocumentsModalComponent
} from './referralId/referral-authorization/components/view-documents-modal/view-documents-modal.component';
import {
  ActionFormComponent
} from './referralId/referral-authorization/fusion/components/action-form/action-form.component';
import {
  AuthBodyPartsComponent
} from './referralId/referral-authorization/fusion/components/auth-body-parts/auth-body-parts.component';
import {
  BodyPartSectionComponent
} from './referralId/referral-authorization/fusion/components/auth-body-parts/body-part-section/body-part-section.component';
import {
  BodyPartsModalComponent
} from './referralId/referral-authorization/fusion/components/auth-body-parts/body-parts-modal/body-parts-modal.component';
import {
  AuthDetailsTableComponent
} from './referralId/referral-authorization/fusion/components/auth-details-table/auth-details-table.component';
import {
  AuthIcdCodesDisplayComponent
} from './referralId/referral-authorization/fusion/components/auth-icd-codes-display/auth-icd-codes-display.component';
import {
  AuthIcdCodesModalComponent
} from './referralId/referral-authorization/fusion/components/auth-icd-codes-display/auth-icd-codes-modal/auth-icd-codes-modal.component';
import {
  AuthorizationSubmitConfirmationModalComponent
} from './referralId/referral-authorization/fusion/components/authorization-submit-confirmation-modal/authorization-submit-confirmation-modal.component';
import {
  DmeAuthorizationDataComponent
} from './referralId/referral-authorization/fusion/components/dme-authorization-data/dme-authorization-data.component';
import {
  DmeEditDateComponent
} from './referralId/referral-authorization/fusion/components/dme-authorization-data/dme-edit-date/dme-edit-date.component';
import {
  DmeSubstitutionTabComponent
} from './referralId/referral-authorization/fusion/components/dme-substitution-tab/dme-substitution-tab.component';
import {
  DiagnosticsAuthorizationCardComponent
} from './referralId/referral-authorization/fusion/components/fusion-authorization-card/diagnostics-authorization-card/diagnostics-authorization-card.component';
import {
  DmeAuthorizationCardComponent
} from './referralId/referral-authorization/fusion/components/fusion-authorization-card/dme-authorization-card/dme-authorization-card.component';
import {
  FusionAuthorizationCardComponent
} from './referralId/referral-authorization/fusion/components/fusion-authorization-card/fusion-authorization-card.component';
import {
  HomeHealthAuthorizationCardComponent
} from './referralId/referral-authorization/fusion/components/fusion-authorization-card/home-health-authorization-card/home-health-authorization-card.component';
import {
  LanguageAuthorizationCardComponent
} from './referralId/referral-authorization/fusion/components/fusion-authorization-card/language-authorization-card/language-authorization-card.component';
import {
  PhysicalMedicineAuthorizationCardComponent
} from './referralId/referral-authorization/fusion/components/fusion-authorization-card/physical-medicine-authorization-card/physical-medicine-authorization-card.component';
import {
  FusionNarrativeTextComponent
} from './referralId/referral-authorization/fusion/components/fusion-narrative-text/fusion-narrative-text.component';
import {
  FusionReferralActivityFooterComponent
} from './referralId/referral-authorization/fusion/components/fusion-referral-activity-footer/fusion-referral-activity-footer.component';
import {
  PmAuthorizationExtensionParentCardComponent
} from './referralId/referral-authorization/fusion/components/pm-authorization-extension-modal/components/pm-authorization-extension-parent-card/pm-authorization-extension-parent-card.component';
import {
  PmAuthorizationExtensionModalComponent
} from './referralId/referral-authorization/fusion/components/pm-authorization-extension-modal/pm-authorization-extension-modal.component';
import {
  DiagnosticsAuthorizationInformationComponent
} from './referralId/referral-authorization/fusion/diagnostics/diagnostics-authorization/diagnostics-authorization-information.component';
import {
  SummaryDetailsComponent
} from './referralId/referral-authorization/fusion/diagnostics/diagnostics-authorization/summary-details/summary-details.component';
import {
  DmeAuthorizationInformationComponent
} from './referralId/referral-authorization/fusion/dme/dme-authorization/dme-authorization-information.component';
import {
  FusionAuthorizationService
} from './referralId/referral-authorization/fusion/fusion-authorization.service';
import {
  HomeHealthAuthorizationInformationComponent
} from './referralId/referral-authorization/fusion/home-health/home-health-authorization-information/home-health-authorization-information.component';
import {
  InterpretationDetailsEditorComponent
} from './referralId/referral-authorization/fusion/language/language-authorization/interpretation-details-editor/interpretation-details-editor.component';
import {
  LanguageAuthorizationInformationComponent
} from './referralId/referral-authorization/fusion/language/language-authorization/language-authorization-information.component';
import {
  PhysicalMedicineAuthorizationInformationComponent
} from './referralId/referral-authorization/fusion/physical-medicine/physical-medicine-authorization-information.component';
import {
  AuthorizationPostSubmitComponent
} from './referralId/referral-authorization/fusion/submitted-authorization/authorization-post-submit.component';
import {
  AuthorizationPostSubmitGuard
} from './referralId/referral-authorization/fusion/submitted-authorization/authorization-post-submit.guard';
import {
  ActionReasonDisplayComponent
} from './referralId/referral-authorization/fusion/submitted-authorization/components/action-reason-display/action-reason-display.component';
import {
  DiagnosticsPostSubmitComponent
} from './referralId/referral-authorization/fusion/submitted-authorization/components/diagnostics-post-submit/diagnostics-post-submit.component';
import {
  DmePostSubmitComponent
} from './referralId/referral-authorization/fusion/submitted-authorization/components/dme-post-submit/dme-post-submit.component';
import {
  HomeHealthPostSubmitComponent
} from './referralId/referral-authorization/fusion/submitted-authorization/components/home-health-post-submit/home-health-post-submit.component';
import {
  LanguagePostSubmitComponent
} from './referralId/referral-authorization/fusion/submitted-authorization/components/language-post-submit/language-post-submit.component';
import {
  PhysicalMedicinePostSubmitComponent
} from './referralId/referral-authorization/fusion/submitted-authorization/components/physical-medicine-post-submit/physical-medicine-post-submit.component';
import {
  ReferralAuthorizationComponent
} from './referralId/referral-authorization/referral-authorization.component';
import {
  OpenAuthorizationDetailsEditorComponent
} from './referralId/referral-authorization/transportation-authorization-open/open-authorization-details-editor/open-authorization-details-editor.component';
import {
  TransportationAuthorizationDetailedListComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-detailed-list/transportation-authorization-detailed-list.component';
import {
  ChangeSummaryComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/components/change-summary/change-summary.component';
import {
  NarrativeDateRangeChangeComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/components/narrative-text/components/narrative-date-range-change/narrative-date-range-change.component';
import {
  NarrativeLimitAndDateChangeComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/components/narrative-text/components/narrative-limit-and-date-change/narrative-limit-and-date-change.component';
import {
  NarrativeLimitChangeComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/components/narrative-text/components/narrative-limit-change/narrative-limit-change.component';
import {
  NarrativeLocationLimitComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/components/narrative-text/components/narrative-location-limit/narrative-location-limit.component';
import {
  NarrativeNewOpenAuthComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/components/narrative-text/components/narrative-new-open-auth/narrative-new-open-auth.component';
import {
  NarrativeQuantityUsedComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/components/narrative-text/components/narrative-quantity-used/narrative-quantity-used.component';
import {
  NarrativeTextComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/components/narrative-text/narrative-text.component';
import {
  TransportationAuthorizationOpenComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/transportation-authorization-open.component';
import {
  AppointmentInfoComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/appointment-info/appointment-info.component';
import {
  CreateNewAuthorizationAppointmentComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/createNewAuthorization/create-new-authorization-appointment/create-new-authorization-appointment.component';
import {
  CreateNewAuthorizationFlightComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/createNewAuthorization/create-new-authorization-flight/create-new-authorization-flight.component';
import {
  CreateNewAuthorizationLodgingComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/createNewAuthorization/create-new-authorization-lodging/create-new-authorization-lodging.component';
import {
  CreateNewAuthorizationModalComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/createNewAuthorization/create-new-authorization-modal/create-new-authorization-modal.component';
import {
  CreateNewAuthorizationModalService
} from './referralId/referral-authorization/transportation/transportation-authorization/components/createNewAuthorization/create-new-authorization-modal/create-new-authorization-modal.service';
import {
  CreateNewAuthorizationOtherComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/createNewAuthorization/create-new-authorization-other/create-new-authorization-other.component';
import {
  CreateNewAuthorizationSedanComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/createNewAuthorization/create-new-authorization-sedan/create-new-authorization-sedan.component';
import {
  CreateNewAuthorizationSpecificDateComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/createNewAuthorization/create-new-authorization-specific-date/create-new-authorization-specific-date.component';
import {
  CreateNewAuthorizationWheelchairComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/createNewAuthorization/create-new-authorization-wheelchair/create-new-authorization-wheelchair.component';
import {
  CreateNewAuthorizationService
} from './referralId/referral-authorization/transportation/transportation-authorization/components/createNewAuthorization/create-new-authorization.service';
import {
  TransportationDetailedPostSubmitApprovalStatusComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/postSubmit/transportation-detailed-post-submit/components/transportation-detailed-post-submit-approval-status/transportation-detailed-post-submit-approval-status.component';
import {
  TransportationDetailedPostSubmitFlightComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/postSubmit/transportation-detailed-post-submit/components/transportation-detailed-post-submit-flight/transportation-detailed-post-submit-flight.component';
import {
  TransportationDetailedPostSubmitHeaderComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/postSubmit/transportation-detailed-post-submit/components/transportation-detailed-post-submit-header/transportation-detailed-post-submit-header.component';
import {
  TransportationDetailedPostSubmitLodgingComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/postSubmit/transportation-detailed-post-submit/components/transportation-detailed-post-submit-lodging/transportation-detailed-post-submit-lodging.component';
import {
  TransportationDetailedPostSubmitSedanLikeComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/postSubmit/transportation-detailed-post-submit/components/transportation-detailed-post-submit-sedan-like/transportation-detailed-post-submit-sedan-like.component';
import {
  TransportationDetailedPostSubmitComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/postSubmit/transportation-detailed-post-submit/transportation-detailed-post-submit.component';
import {
  TransportationOpenPostSubmitComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/postSubmit/transportation-open-post-submit/transportation-open-post-submit.component';
import {
  TransportationAuthorizationDetailedBaseComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/transportation-authorization-detailed-base/transportation-authorization-detailed-base.component';
import {
  TransportationAuthorizationDetailedFlightComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/transportation-authorization-detailed-flight/transportation-authorization-detailed-flight.component';
import {
  TransportationAuthorizationDetailedLodgingComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/transportation-authorization-detailed-lodging/transportation-authorization-detailed-lodging.component';
import {
  TransportationAuthorizationDetailedOtherComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/transportation-authorization-detailed-other/transportation-authorization-detailed-other.component';
import {
  TransportationAuthorizationDetailedSedanComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/transportation-authorization-detailed-sedan/transportation-authorization-detailed-sedan.component';
import {
  TransportationAuthorizationDetailedWheelchairComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/components/transportation-authorization-detailed-wheelchair/transportation-authorization-detailed-wheelchair.component';
import {
  LocationLabel
} from './referralId/referral-authorization/transportation/transportation-authorization/pipes/locations.pipe';
import {
  TransportationAuthorizationComponent
} from './referralId/referral-authorization/transportation/transportation-authorization/transportation-authorization.component';
import {
  TransportationAuthorizationFormBuilderService
} from './referralId/referral-authorization/transportation/transportation-authorization/transportation-authorization-form-builder.service';
import { ReferralIdComponent } from './referralId/referral-id.component';
import {
  FusionAuthorizationHistoryEffects
} from './store/effects/fusion/fusion-authorization-history.effects';
import {
  FusionAuthorizationsEffects
} from './store/effects/fusion/fusion-authorizations.effects';
import {
  FusionClinicalHistoryEffects
} from './store/effects/fusion/fusion-clinical-history.effects';
import {
  FusionMakeAReferralEffects
} from './store/effects/fusion/fusion-make-a-referral.effects';
import { MakeAReferralEffects } from './store/effects/make-a-referral.effects';
import {
  ReferralActivityEffects
} from './store/effects/referral-activity.effects';
import { ReferralIdEffects } from './store/effects/referral-id.effects';
import { ReferralNotesEffects } from './store/effects/referral-notes.effects';
import { ReferralEffects } from './store/effects/referral.effects';
import {
  ReferralAuthorizationEffects
} from './store/effects/referral-authorization.effects';
import {
  SharedMakeAReferralEffects
} from './store/effects/shared-make-a-referral.effects';
import { referralInitialState } from './store/models';
import { ReferralRoutes } from './store/models/referral.models';
import { reducer } from './store/reducers';
import {
  AuthorizationCancelModalComponent
} from './referralId/referral-authorization/fusion/components/authorization-cancel-modal/authorization-cancel-modal.component';
import {
  AllContactsTableComponent
} from './referralId/referral-activity/components/all-contacts-table/all-contacts-table.component';
import {
  AllContactsAlertComponent
} from './referralId/referral-activity/components/all-contacts-alert/all-contacts-alert.component';
import {
  AuthNotesListComponent
} from './referralId/referral-authorization/fusion/components/auth-notes-list/auth-notes-list.component';
import {
  ReferralLocationsModalComponent
} from './referralId/components/referral-locations-modal/referral-locations-modal.component';
import {
  TransportationReferralLocationsModalComponent
} from './referralId/components/transportation-referral-locations-modal/transportation-referral-locations-modal.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  NarrativeNewLocationsAddedComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/components/narrative-text/components/narrative-new-locations-added/narrative-new-locations-added.component';
import {
  PbmAuthLockedBannerModule
} from '@modules/pbm-auth-locked-banner/pbm-auth-locked-banner.module';
import {
  CancelTransportationReferralModalComponent
} from './referralId/components/cancel-transportation-referral-modal/cancel-transportation-referral-modal.component';
import {
  NarrativeAuthorizedDatesComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/components/narrative-text/components/narrative-authorized-dates/narrative-authorized-dates.component';
import {
  NarrativeAdditionalQuantityComponent
} from './referralId/referral-authorization/transportation/transportation-authorization-open/components/narrative-text/components/narrative-additional-quantity/narrative-additional-quantity.component';
import {
  ServerErrorOverlayModule
} from '@modules/server-error-overlay/server-error-overlay.module';
import {
  FormValidationExtractorModule
} from '@modules/form-validation-extractor';
import { ErrorCardModule } from '@modules/error-card';
import {
  GenericWizardModule
} from '@modules/generic-wizard/generic-wizard.module';
import {
  provideMockAsyncConfig
} from '@modules/generic-wizard/generic-wizard-service-config-map.token';
import { KinectWizardComponent } from './make-a-referral/kinect-wizard/kinect-wizard.component';
import {
  GenericFormFieldType,
  GenericStepType
} from '@modules/generic-wizard/generic-wizard.models';
import { vendorStep } from '@modules/generic-wizard/compose/step/vendor-step.function';

const routes: Routes = [
  {
    path: 'make-a-referral-search',
    component: MakeAReferralSearchComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: 'authorizations',
    component: ReferralAuthorizationSearchComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: '',
    component: ReferralComponent,
    canActivate: [CustomerConfigsGuardService],
    children: [
      {
        path: '',
        component: MakeAReferralComponent,
        canActivate: [CustomerConfigsGuardService],
        canDeactivate: [MakeAReferralGuardService],
        children: [
          {
            path: ReferralRoutes.ServiceSelection,
            component: ServiceSelectionComponent,
            canActivate: [CustomerConfigsGuardService]
          },
          {
            path: ReferralRoutes.Create,
            component: MakeAReferralWizardComponent,
            canActivate: [
              CustomerConfigsGuardService,
              MakeAReferralGuardService
            ]
          },
          {
            path: ReferralRoutes.Review,
            component: MakeAReferralReviewComponent,
            canActivate: [
              CustomerConfigsGuardService,
              MakeAReferralGuardService
            ]
          }
        ]
      },
      // Legacy Links
      // TODO: See if we can have the external links updated so we can move towards one navigation strategy
      {
        path: ':referralId',
        component: ReferralIdComponent,
        children: [
          {
            path: ReferralRoutes.Activity,
            component: ReferralActivityComponent,
            children: [
              { path: 'grid', component: GridOfCardsComponent },
              { path: 'table', component: ActivityTableComponent },
              { path: '**', redirectTo: 'grid' }
            ]
          },
          {
            path: ReferralRoutes.Authorization,
            component: ReferralAuthorizationComponent
          },
          {
            path: ReferralRoutes.AuthorizationHistory,
            component: AuthorizationHistoryComponent
          }
        ],
        canActivate: [CustomerConfigsGuardService]
      },
      {
        path: ':referralId/:authArchetype',
        component: ReferralIdComponent,
        children: [
          {
            path: ReferralRoutes.AllContactAttempts,
            component: AllContactsTableComponent
          },
          {
            path: ReferralRoutes.Activity,
            component: ReferralActivityComponent,
            children: [
              { path: 'grid', component: GridOfCardsComponent },
              { path: 'table', component: ActivityTableComponent },
              { path: '**', redirectTo: 'grid' }
            ]
          },
          {
            path: ReferralRoutes.Authorization,
            component: ReferralAuthorizationComponent,
            canActivate: [ActiveAuthorizationGuardService]
          },
          {
            path: ReferralRoutes.AuthorizationHistory,
            component: AuthorizationHistoryComponent
          },
          {
            path: ReferralRoutes.ClinicalHistory,
            component: FusionClinicalHistoryComponent
          },
          {
            path: ReferralRoutes.AuthorizationReview,
            component: AuthorizationPostSubmitComponent,
            canActivate: [AuthorizationPostSubmitGuard]
          }
        ],
        canActivate: [CustomerConfigsGuardService]
      },
      { path: '**', redirectTo: ReferralRoutes.ServiceSelection }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(referralStateKey, reducer, {
      initialState: referralInitialState
    }),
    EffectsModule.forFeature([
      ReferralEffects,
      ReferralIdEffects,
      ReferralActivityEffects,
      ReferralNotesEffects,
      ReferralAuthorizationEffects,
      MakeAReferralEffects,
      SharedMakeAReferralEffects,
      FusionMakeAReferralEffects,
      MakeAReferralSearchEffects,
      FusionAuthorizationsEffects,
      FusionAuthorizationHistoryEffects,
      FusionClinicalHistoryEffects
    ]),
    CustomerConfigsModule,
    FlexLayoutModule,
    FontAwesomeModule,
    FormsModule,
    HealtheAlertBannerModule,
    HealtheDatepickerModule,
    HealtheSelectModule,
    HealtheTooltipAdvancedModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    NgxMaskModule,
    NgxMatDrpModule,
    ObserversModule,
    PortalModule,
    ReactiveFormsModule,
    SharedModule,
    MatSortModule,
    SearchNavModule,
    ReactiveComponentModule,
    MatDatepickerModule,
    PbmAuthLockedBannerModule,
    ServerErrorOverlayModule,
    GenericWizardModule.forRoot({
      DENTAL: {
        serviceType: 'Dental',
        serviceDisplayName: 'Dental',
        referralOnly: true,
        steps: [
          {
            stepType: GenericStepType.ConfigurableStep,
            stepName: 'Dental',
            stepTitle: 'Dental',
            formSections: [
              {
                formSectionTitle: 'Dental Details',
                formFieldConfigs: [
                  [
                    {
                      formFieldType: GenericFormFieldType.TextArea,
                      formControlName: 'notes',
                      label: 'NOTES (OPTIONAL)',
                      reviewLabel: 'Notes',
                      placeholder: 'Enter a note...',
                      options: {
                        maxLength: 500
                      }
                    }
                  ]
                ]
              }
            ]
          },
          vendorStep(true, true, true),
          {
            stepType: GenericStepType.DocumentStep,
            stepName: 'documents',
            stepTitle: 'Documents'
          },
          {
            stepType: GenericStepType.ReviewStep,
            stepName: 'review',
            stepTitle: 'Review'
          }
        ]
      },
      PSYCHOSOCIAL_SERVICES: {
        serviceType: 'Psychosocial Services',
        serviceDisplayName: 'Psychosocial Services',
        referralOnly: true,
        steps: [
          {
            stepType: GenericStepType.ConfigurableStep,
            stepName: 'Psychosocial Services',
            stepTitle: 'Psychosocial Services',
            formSections: [
              {
                formSectionTitle: 'Psychosocial Services Details',
                formFieldConfigs: [
                  [
                    {
                      formFieldType: GenericFormFieldType.TextArea,
                      formControlName: 'notes',
                      label: 'NOTES (OPTIONAL)',
                      reviewLabel: 'Notes',
                      placeholder: 'Enter a note...',
                      options: {
                        maxLength: 500
                      }
                    }
                  ]
                ]
              }
            ]
          },
          vendorStep(true, true, true),
          {
            stepType: GenericStepType.DocumentStep,
            stepName: 'documents',
            stepTitle: 'Documents'
          },
          {
            stepType: GenericStepType.ReviewStep,
            stepName: 'review',
            stepTitle: 'Review'
          }
        ]
      },
      INDEPENDENT_MEDICAL_EXAMINATION: {
        serviceType: 'IME (Independent Medical Examination)',
        serviceDisplayName: 'IME (Independent Medical Examination)',
        referralOnly: true,
        steps: [
          {
            stepType: GenericStepType.ConfigurableStep,
            stepName: 'IME (Independent Medical Examination)',
            stepTitle: 'IME (Independent Medical Examination)',
            formSections: [
              {
                formSectionTitle: 'IME (Independent Medical Examination) Details',
                formFieldConfigs: [
                  [
                    {
                      formFieldType: GenericFormFieldType.TextArea,
                      formControlName: 'notes',
                      label: 'NOTES (OPTIONAL)',
                      reviewLabel: 'Notes',
                      placeholder: 'Enter a note...',
                      options: {
                        maxLength: 500
                      }
                    }
                  ]
                ]
              }
            ]
          },
          vendorStep(true, true, true),
          {
            stepType: GenericStepType.DocumentStep,
            stepName: 'documents',
            stepTitle: 'Documents'
          },
          {
            stepType: GenericStepType.ReviewStep,
            stepName: 'review',
            stepTitle: 'Review'
          }
        ]
      }
    }),
  PbmAuthLockedBannerModule,
        FormValidationExtractorModule,
        ErrorCardModule],
  providers: [
    ActiveAuthorizationGuardService,
    HealtheTooltipAdvancedService,
    MakeAReferralService,
    AuthRelatedAppointmentsModalService,
    AuthorizationInformationService,
    MakeAReferralHelperService,
    CreateNewAuthorizationModalService,
    CreateNewAuthorizationService,
    TransportationAuthorizationFormBuilderService,
    FusionAuthorizationService,
    MakeAReferralGuardService,
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay]
    },
    CurrencyPipe,

  ],
  declarations: [
    ActivityTableComponent,
    AddLocationModalComponent,
    ApprovedLocationsFormComponent,
    ApprovedLocationsWithLocationLimitsFormComponent,
    CheckboxExpansionWithLocationLimitsComponent,
    CheckboxExpansionComponent,
    DateRangeFormComponent,
    DateRangeReviewComponent,
    DatesAndRangeCompositeReviewComponent,
    DiagnosticsEmgComponent,
    DiagnosticsSelectionComponent,
    DiagnosticsUltrasoundComponent,
    DiagnosticsXrayComponent,
    DocumentPickerComponent,
    FilterBoxComponent,
    FlightReviewComponent,
    FlightWizardFormComponent,
    GridCardComponent,
    GridOfCardsComponent,
    IcdCodesEditModalComponent,
    ReferralLocationsModalComponent,
    IcdCodesFusionEditModalComponent,
    IcdCodesFusionDisplayComponent,
    InterpretationReviewComponent,
    InterpretationWizardFormComponent,
    LanguageDocumentsWizardFormComponent,
    LanguageReviewWizardComponent,
    LanguageSelectionComponent,
    LanguageVendorReviewComponent,
    LanguageVendorsWizardFormComponent,
    LanguageWizardComponent,
    LodgingReviewComponent,
    LodgingWizardFormComponent,
    MakeAReferralWizardComponent,
    MakeAReferralReviewComponent,
    MakeAReferralReviewSectionComponent,
    OtherReviewComponent,
    OtherWizardFormComponent,
    ReferralActivityComponent,
    ReferralActivityTabBarComponent,
    ReferralComponent,
    ReferralDocumentsComponent,
    ReferralIdComponent,
    ReferralInformationRequestButtonComponent,
    ReferralNotesWidgetComponent,
    ReferralOverviewCardComponent,
    ResultsFusionModalComponent,
    ReviewSectionHeaderComponent,
    SchedulingStatusFusionModalComponent,
    SedanReviewComponent,
    SedanWizardFormComponent,
    ServiceScheduledFusionModalComponent,
    ServiceSelectionComponent,
    ServiceSelectionModalComponent,
    SpecificDateFormArrayComponent,
    SpecificDatesReviewComponent,
    SpecificDateTripInformationFormComponent,
    StepAdvancerComponent,
    SummaryBarComponent,
    TranslationReviewComponent,
    TranslationWizardFormComponent,
    TransportationDocumentsWizardFormComponent,
    TransportationReviewWizardComponent,
    LanguageVendorReviewComponent,
    DiagnosticsWizardComponent,
    DiagnosticsSelectionComponent,
    DiagnosticsEmgComponent,
    DiagnosticsUltrasoundComponent,
    DiagnosticsXrayComponent,
    DiagnosticsCtScanComponent,
    DiagnosticsMriComponent,
    IcdCodesEditModalComponent,
    ReferralLocationsModalComponent,
    DiagnosticsOtherComponent,
    TransportationSelectionComponent,
    TransportationVendorsWizardFormComponent,
    TransportationWizardComponent,
    ReferralNotesAndDocumentsModalComponent,
    TransportationVendorReviewComponent,
    VendorsSelectorComponent,
    WheelchairReviewComponent,
    WheelchairSupportWizardFormComponent,
    WizardPortalComponent,
    AuthorizationHistoryComponent,
    AuthRelatedAppointmentsModalComponent,
    TransportationAuthorizationComponent,
    ReferralAuthorizationFooterComponent,
    PhysicalMedicineSelectionComponent,
    PhysicalMedicineWizardComponent,
    AuthorizationActionsComponent,
    TransportationAuthorizationDetailedFlightComponent,
    TransportationAuthorizationDetailedLodgingComponent,
    TransportationAuthorizationDetailedBaseComponent,
    DiagnosticsDocumentsComponent,
    DiagnosticsVendorsWizardFormComponent,
    OrderingPrescriberInformationComponent,
    PhysicalMedicineDocumentsComponent,
    PhysicalMedicineVendorsWizardFormComponent,
    TransportationAuthorizationDetailedSedanComponent,
    TransportationAuthorizationDetailedOtherComponent,
    TransportationAuthorizationDetailedWheelchairComponent,
    ReferralAuthorizationComponent,
    PhysicalMedicinePhysicalTherapyComponent,
    PhysicalMedicineOtherComponent,
    PhysicalMedicineFceComponent,
    PhysicalMedicineOccupationalTherapyComponent,
    UploadFilesProgressModalComponent,
    SubmitConfirmationModalComponent,
    DiagnosticsReviewComponent,
    DiagnosticsReviewWizardComponent,
    StepperStepLabelComponent,
    PhysicalMedicineReviewWizardComponent,
    PhysicalMedicineReviewDetailsComponent,
    HomeHealthSelectionComponent,
    HomeHealthWizardComponent,
    HomeHealthVendorsWizardFormComponent,
    HomeHealthNursingComponent,
    HomeHealthInHomeTherapyComponent,
    HomeHealthAidesComponent,
    HomeHealthInfusionComponent,
    HomeHealthOtherComponent,
    HomeHealthDocumentsComponent,
    DocumentPickerModalComponent,
    AppointmentInfoComponent,
    HomeHealthReviewDetailsComponent,
    HomeHealthReviewComponent,
    DmeSingleOrRangeSwitchComponent,
    HhSingleOrRangeSwitchComponent,
    HcpcAndProductSelectSwitchComponent,
    CreateNewAuthorizationModalComponent,
    CreateNewAuthorizationSedanComponent,
    DmeWizardComponent,
    DmeEquipmentComponent,
    RequestorInformationFormComponent,
    DmeEquipmentComponent,
    DmeDocumentsComponent,
    DmeVendorsWizardFormComponent,
    CreateNewAuthorizationLodgingComponent,
    CreateNewAuthorizationFlightComponent,
    CreateNewAuthorizationOtherComponent,
    CreateNewAuthorizationWheelchairComponent,
    TransportationAuthorizationDetailedListComponent,
    TransportationAuthorizationOpenComponent,
    CreateNewAuthorizationSpecificDateComponent,
    CreateNewAuthorizationAppointmentComponent,
    CreateNewAuthorizationWheelchairComponent,
    MakeAReferralComponent,
    TransportationAuthorizationDetailedSedanComponent,
    DmeReviewComponent,
    DmeReviewDetailsComponent,
    MakeAReferralSearchComponent,
    FusionNarrativeTextComponent,
    ReferralReasonForReviewComponent,
    LanguageAuthorizationInformationComponent,
    NarrativeTextComponent,
    OpenAuthorizationDetailsEditorComponent,
    LanguageAuthorizationInformationComponent,
    InterpretationDetailsEditorComponent,
    ActionFormComponent,
    LockedClaimBannerComponent,
    ViewDocumentsModalComponent,
    MakeAReferralTableComponent,
    MakeAReferralCellSwitchComponent,
    MakeAReferralSearchBoxComponent,
    NarrativeQuantityUsedComponent,
    NarrativeDateRangeChangeComponent,
    NarrativeLimitChangeComponent,
    NarrativeNewLocationsAddedComponent,
    AuthHistoryGroupTableComponent,
    NarrativeNewOpenAuthComponent,
    FusionReferralActivityFooterComponent,
    AuthHistoryGroupTableComponent,
    DiagnosticsAuthorizationInformationComponent,
    BodyPartsModalComponent,
    ReasonsModalComponent,
    MarSubmitErrorBannerComponent,
    PhysicalMedicineAuthorizationInformationComponent,
    NarrativeLocationLimitComponent,
    SurgicalInformationWithLocationComponent,
    NarrativeLimitAndDateChangeComponent,
    RetryBannerComponent,
    LanguageAuthorizationCardComponent,
    SummaryDetailsComponent,
    AuthIcdCodesDisplayComponent,
    AuthIcdCodesModalComponent,
    AuthBodyPartsComponent,
    BodyPartSectionComponent,
    AuthDetailsTableComponent,
    TransportationOpenPostSubmitComponent,
    TransportationDetailedPostSubmitComponent,
    MarNavExitConfirmModalComponent,
    ChangeSummaryComponent,
    ReferralAuthorizationSearchComponent,
    AuthorizationSubmitConfirmationModalComponent,
    DmeAuthorizationInformationComponent,
    AuthorizationPostSubmitComponent,
    LocationLabel,
    LanguagePostSubmitComponent,
    ActionReasonDisplayComponent,
    DiagnosticsAuthorizationCardComponent,
    DiagnosticsPostSubmitComponent,
    FusionAuthorizationCardComponent,
    TransportationDetailedPostSubmitHeaderComponent,
    TransportationDetailedPostSubmitApprovalStatusComponent,
    TransportationDetailedPostSubmitSedanLikeComponent,
    TransportationDetailedPostSubmitFlightComponent,
    TransportationDetailedPostSubmitLodgingComponent,
    NoPendingAuthorizationsComponent,
    PhysicalMedicineAuthorizationCardComponent,
    HomeHealthAuthorizationInformationComponent,
    HomeHealthAuthorizationCardComponent,
    DmeAuthorizationCardComponent,
    DmeSubstitutionTabComponent,
    DmeAuthorizationDataComponent,
    PhysicalMedicinePostSubmitComponent,
    HomeHealthPostSubmitComponent,
    DmePostSubmitComponent,
    ServiceScheduledModalComponent,
    ResultsModalComponent,
    BillingModalComponent,
    AuthorizationActionsBarComponent,
    AuthorizationOverviewComponent,
    DmePostSubmitComponent,
    AddDocumentsModalComponent,
    FusionClinicalHistoryComponent,
    DetailIconComponent,
    ClinicalHistoryFooterComponent,
    GroundTripsInformationComponent,
    FlightTripsInformationComponent,
    LodgingStaysInformationComponent,
    AuthorizationDocumentsPickerComponent,
    PmAuthorizationExtensionModalComponent,
    PmAuthorizationExtensionParentCardComponent,
    ReferralAuthorizationBodyPartsHistoryComponent,
    BodyPartsHistoryModalComponent,
    StarsComponent,
    DmeEditDateComponent,
    LockedReferralBannerComponent,
    AuthorizationImportantNoteComponent,
    AuthorizationCancelModalComponent,
    AllContactsTableComponent,
    AllContactsAlertComponent,
    AuthNotesListComponent,
    ReferralLocationsModalComponent,
    TransportationReferralLocationsModalComponent,
    CancelTransportationReferralModalComponent,
    NarrativeAuthorizedDatesComponent,
    NarrativeAdditionalQuantityComponent,
    KinectWizardComponent
  ],
  exports: [PmAuthorizationExtensionModalComponent, LockedClaimBannerComponent, VendorsSelectorComponent]
})
export class ReferralModule {}
