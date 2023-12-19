import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import {
  MAT_SELECT_SCROLL_STRATEGY,
  MatSelectModule
} from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  HealtheAlertBannerModule,
  HealtheCardInfoModule,
  HealthePaginationModule,
  HealtheSelectModule,
  HealtheTableModule,
  NgxMatDrpModule
} from '@healthe/vertice-library';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared';
import { CustomerConfigsGuardService } from '../customer-configs/customer-configs-guard.service';
import { CustomerConfigsModule } from '../customer-configs/customer-configs.module';
// tslint:disable-next-line:max-line-length
import { ClaimActivityTableColumnSettingsService } from '../preferences/claim-table-list-settings/claim-activity-table-column-settings.service';
import { VerbiageService } from '../verbiage.service';
import { ActivityTableComponent } from './activity/activity-table/activity-table.component';
import { ActivityComponent } from './activity/activity.component';
import { PendingActivityTableComponent } from './activity/pending-activity-table/pending-activity-table.component';
import { BillingTableCellComponent } from './billing/billing-table-cell/billing-table-cell.component';
import { BillingComponent } from './billing/billing.component';
import { ClaimViewRedirectGuard } from './claim-view-redirect.guard';
import { ClaimViewComponent } from './claim-view.component';
import { ClaimantComponent } from './claimant/claimant.component';
import { ContactsComponent } from './contacts/contacts.component';
import { EligibilityComponent } from './eligibility/eligibility.component';
import { IcdCodesComponent } from './icd-codes/icd-codes.component';
import { IcdCodesService } from './icd-codes/icd-codes.service';
import { IncidentsComponent } from './incidents/incidents.component';
import { IncidentsService } from './incidents/incidents.service';
import { ClaimActivityService } from './service/claim-activity.service';
import { ActivityTabEffects } from './store/effects/activity-tab.effects';
import { ClaimViewEffects } from './store/effects/claim-view.effects';
import { EligibilityTabEffects } from './store/effects/eligibility-tab.effects';
import { IcdCodesTabEffects } from './store/effects/icd-codes-tab.effects';
import { IncidentsEffects } from './store/effects/incidents-tab.effects';
import { reducer } from './store/reducers/claim-view.reducers';
import { ClaimViewDocumentsComponent } from './claim-view-documents/claim-view-documents.component';
import { MobileInviteModule } from '@modules/mobile-invite/mobile-invite.module';
import { ReactiveComponentModule } from '@ngrx/component';
import { GeneralExporterModule } from '@modules/general-exporter';

const routes: Routes = [
  {
    path: '',
    component: ClaimViewComponent,
    children: [
      {
        path: 'activity/:tab',
        component: ActivityComponent,
        canActivate: [CustomerConfigsGuardService]
      },
      { path: 'claimant', component: ClaimantComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'eligibility', component: EligibilityComponent },
      { path: 'documents', component: ClaimViewDocumentsComponent },
      { path: 'billing', component: BillingComponent },
      {
        path: 'icdCodes',
        component: IcdCodesComponent,
        canActivate: [CustomerConfigsGuardService]
      },
      {
        path: 'incidents',
        component: IncidentsComponent,
        canActivate: [CustomerConfigsGuardService]
      },
      { path: '**', canActivate: [ClaimViewRedirectGuard] }
    ]
  }
];

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveComponentModule,
    MobileInviteModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatSortModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatRadioModule,
    MatSortModule,
    MatExpansionModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    HealthePaginationModule,
    MatDividerModule,
    HealtheCardInfoModule,
    HealtheSelectModule,
    HealtheTableModule,
    HealtheAlertBannerModule,
    NgxMatDrpModule,
    FlexLayoutModule,
    SharedModule,
    CustomerConfigsModule,
    StoreModule.forFeature('claimview', reducer),
    EffectsModule.forFeature([
      ActivityTabEffects,
      ClaimViewEffects,
      IcdCodesTabEffects,
      IncidentsEffects,
      EligibilityTabEffects
    ]),
    MatPaginatorModule,
    GeneralExporterModule,
    PortalModule
  ],
  providers: [
    ClaimActivityService,
    VerbiageService,
    IcdCodesService,
    IncidentsService,
    ClaimActivityTableColumnSettingsService,
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay]
    }
  ],
  declarations: [
    ClaimViewComponent,
    ActivityComponent,
    ClaimantComponent,
    ActivityTableComponent,
    EligibilityComponent,
    PendingActivityTableComponent,
    ContactsComponent,
    BillingComponent,
    BillingTableCellComponent,
    IncidentsComponent,
    IcdCodesComponent,
    ClaimViewDocumentsComponent
  ]
})
export class ClaimViewModule {}
