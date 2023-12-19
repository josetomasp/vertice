import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatNativeDateModule,
  MatOptionModule,
  MatPseudoCheckboxModule
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HealtheSelectModule, NgxMatDrpModule } from '@healthe/vertice-library';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ClinicalHistoryComponent } from '@shared/components/clinical-history/clinical-history.component';
import { ClinicalHistoryService } from '@shared/components/clinical-history/clinical-history.service';
import { PrescriptionHistoryService } from '@shared/components/prescription-history/prescription-history.service';
import { StepStateDirective } from '@shared/directives/step-state.directive';
import { PageTitleService } from '@shared/service/page-title.service';
import { ClaimEffects } from '@shared/store/effects/claim.effects';
import { ClinicalHistoryEffects } from '@shared/store/effects/clinicalHistory.effects';
import { PrescriptionHistoryEffects } from '@shared/store/effects/prescriptionHistory.effects';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxMaskModule } from 'ngx-mask';

import { CustomerConfigsModule } from '../customer-configs/customer-configs.module';
import { VerbiageService } from '../verbiage.service';
import { ActiveReferralsModalComponent } from './components/active-referrals-modal/active-referrals-modal.component';
import { ActiveReferralsModalService } from './components/active-referrals-modal/active-referrals-modal.service';
import { ClaimDocumentsTableFilterBoxComponent } from './components/claim-documents-table/claim-documents-table-filter-box/claim-documents-table-filter-box.component';
import { ClaimDocumentsTableComponent } from './components/claim-documents-table/claim-documents-table.component';
import { ClaimOverviewBarComponent } from './components/claim-overview-bar/claim-overview-bar.component';
import { ClaimTrendingModalComponent } from './components/claim-trending-modal/claim-trending-modal.component';
import { RiskDetailsExpansionComponent } from './components/claim-trending-modal/risk-details-expansion/risk-details-expansion.component';
import { RiskLevelOverTimeGraphComponent } from './components/claim-trending-modal/risk-level-over-time-graph/risk-level-over-time-graph.component';
import { RiskTableComponent } from './components/claim-trending-modal/risk-table/risk-table.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { DrugInfoModalComponent } from './components/drug-info-modal/drug-info-modal.component';
import { DrugInfoModalService } from './components/drug-info-modal/drug-info-modal.service';
import { ErrorSnackbarComponent } from './components/error-snackbar/error-snackbar.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { ClaimStatusTagComponent } from './components/header-tag/claim-status-tag.component';
import { InfoLookupLauncherComponent } from './components/info-lookup-launcher/info-lookup-launcher.component';
import { InformationModalComponent } from './components/information-modal/information-modal.component';
import { PharmacyLookupModalComponent } from './components/pharmacy-lookup-modal/pharmacy-lookup-modal.component';
import { PlacesAutocompleteComponent } from './components/places-autocomplete/places-autocomplete.component';
import { PrescriberLookupModalComponent } from './components/prescriber-lookup-modal/prescriber-lookup-modal.component';
import { PrescriberModalService } from './components/prescriber-lookup-modal/prescriber-modal.service';
import { PrescriptionHistoryComponent } from './components/prescription-history/prescription-history.component';
import { RiskGraphCategoryHeaderComponent } from './components/risk-graph/risk-graph-category-header/risk-graph-category-header.component';
import { RiskGraphComponent } from './components/risk-graph/risk-graph.component';
import { RiskLevelIndicatorComponent } from './components/risk-level-indicator/risk-level-indicator.component';
import { RxcardModalComponent } from './components/rxcard-modal/rxcard-modal.component';
import { SelectAllOptionComponent } from './components/select-all-option/select-all-option.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { BytesToMbPipe } from './pipes/bytes-to-mb.pipe';
import { SharedEffects } from './store/effects';
import { reducer } from './store/reducers';
import { ErrorBannerComponent } from './components/error-banner/error-banner.component';
import { ClaimEditEligibilityLinkComponent } from './components/claim-edit-eligibility-link/claim-edit-eligibility-link.component';
import { DataTableCellComponent } from '@shared/components/data-table/data-table-cell/data-table-cell.component';
import { DataTableComponent } from '@shared/components/data-table/data-table-component/data-table.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { SingleDatePickerControlComponent } from './components/single-date-picker-control/single-date-picker-control.component';
import { SingleDateOverlayComponent } from './components/single-date-picker-control/components/single-date-overlay/single-date-overlay.component';
import { SingleDateCalendarWrapperComponent } from './components/single-date-picker-control/components/single-date-calendar-wrapper/single-date-calendar-wrapper.component';
import { SingleDatePresetsComponent } from './components/single-date-picker-control/components/single-date-presets/single-date-presets.component';
import { ReasonsBannerComponent } from './components/reasons-banner/reasons-banner.component';
import { ClaimViewEffects } from '@shared/store/effects/claim-view.effects';
import { SsnMakePipe } from './pipes/ssn-mask.pipe';
import { LoadingModalComponent } from './components/loading-modal/loading-modal.component';
import { CompoundModalComponent } from './components/compound-modal/compound-modal.component';
import { PhoneNumberPipe } from '@shared/pipes/phone-number.pipe';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ConfirmationBannerComponent } from './components/confirmation-banner/confirmation-banner.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { ServerErrorModalComponent } from './components/error-modal/server-error-modal.component';
import { MatListModule } from '@angular/material/list';
import {
  AlertInfoBannerComponent
} from '@shared/components/alert-info-banner/alert-info-banner.component';

@NgModule({
    imports: [
        HealtheSelectModule,
        MatDividerModule,
        MatSelectModule,
        MatButtonModule,
        MatOptionModule,
        MatPseudoCheckboxModule,
        MatTooltipModule,
        FormsModule,
        MatCardModule,
        NgxChartsModule,
        FlexLayoutModule,
        MatDialogModule,
        MatSortModule,
        MatButtonModule,
        MatExpansionModule,
        MatSelectModule,
        MatFormFieldModule,
        HealtheSelectModule,
        MatOptionModule,
        MatRadioModule,
        MatTableModule,
        MatProgressSpinnerModule,
        EffectsModule.forFeature([
            SharedEffects,
            ClaimEffects,
            PrescriptionHistoryEffects,
            ClinicalHistoryEffects,
            ClaimViewEffects
        ]),
        StoreModule.forFeature('shared', reducer),
        MatButtonToggleModule,
        CustomerConfigsModule,
        MatMenuModule,
        FontAwesomeModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        FontAwesomeModule,
        CustomerConfigsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatInputModule,
        NgxMaskModule,
        RouterModule,
        MatPaginatorModule,
        NgxMatDrpModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressBarModule,
        ClipboardModule,
        ReactiveComponentModule,
        MatListModule
    ],
    declarations: [
        PhoneNumberPipe,
        StepStateDirective,
        SelectAllOptionComponent,
        RiskGraphComponent,
        RiskGraphCategoryHeaderComponent,
        ClaimTrendingModalComponent,
        RiskDetailsExpansionComponent,
        RiskLevelOverTimeGraphComponent,
        RiskTableComponent,
        RiskLevelIndicatorComponent,
        RxcardModalComponent,
        PrescriberLookupModalComponent,
        DrugInfoModalComponent,
        ActiveReferralsModalComponent,
        PlacesAutocompleteComponent,
        HeaderBarComponent,
        ClaimStatusTagComponent,
        ClaimOverviewBarComponent,
        InfoLookupLauncherComponent,
        ConfirmationModalComponent,
        LoadingModalComponent,
        PharmacyLookupModalComponent,
        ClaimDocumentsTableComponent,
        ClaimDocumentsTableFilterBoxComponent,
        PrescriptionHistoryComponent,
        ClinicalHistoryComponent,
        ErrorSnackbarComponent,
        BytesToMbPipe,
        SsnMakePipe,
        InformationModalComponent,
        UserMenuComponent,
        ErrorBannerComponent,
        ReasonsBannerComponent,
        ClaimEditEligibilityLinkComponent,
        DataTableCellComponent,
        DataTableComponent,
        LoadingSpinnerComponent,
        SingleDatePickerControlComponent,
        SingleDateOverlayComponent,
        SingleDateCalendarWrapperComponent,
        SingleDatePresetsComponent,
        CompoundModalComponent,
        ConfirmationBannerComponent,
        ServerErrorModalComponent,
        AlertInfoBannerComponent
    ],
    providers: [
        VerbiageService,
        PrescriberModalService,
        DrugInfoModalService,
        ActiveReferralsModalService,
        PrescriptionHistoryService,
        ClinicalHistoryService,
        PageTitleService,
        BytesToMbPipe,
        SsnMakePipe
    ],
    exports: [
        StepStateDirective,
        SelectAllOptionComponent,
        RiskGraphComponent,
        RiskLevelIndicatorComponent,
        PrescriberLookupModalComponent,
        DrugInfoModalComponent,
        ActiveReferralsModalComponent,
        PlacesAutocompleteComponent,
        HeaderBarComponent,
        ClaimStatusTagComponent,
        ClaimOverviewBarComponent,
        InfoLookupLauncherComponent,
        PharmacyLookupModalComponent,
        PrescriptionHistoryComponent,
        ClinicalHistoryComponent,
        ClaimDocumentsTableComponent,
        ErrorSnackbarComponent,
        UserMenuComponent,
        BytesToMbPipe,
        SsnMakePipe,
        ErrorBannerComponent,
        ReasonsBannerComponent,
        AlertInfoBannerComponent,
        DataTableComponent,
        ClaimEditEligibilityLinkComponent,
        LoadingSpinnerComponent,
        SingleDatePickerControlComponent,
        ConfirmationBannerComponent
    ]
})
export class SharedModule {}
