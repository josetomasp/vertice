import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  HealtheAlertBannerModule,
  HealtheDatepickerModule,
  HealtheSelectModule
} from '@healthe/vertice-library';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared';
import { CustomerConfigsGuardService } from '../customer-configs/customer-configs-guard.service';
import { CustomerConfigsModule } from '../customer-configs/customer-configs.module';
import { SearchNavModule } from '../search-nav/search-nav.module';
import { AddFirstFillComponent } from './add-first-fill/add-first-fill.component';
import { AddFirstFillService } from './add-first-fill/add-first-fill.service';
import { NonParticipatingEmployersModalComponent } from './add-first-fill/non-participating-employers-modal/non-participating-employers-modal.component';
import { PosAuthorizationSearchRootComponent } from './authorization-search/authorization-search-root/pos-authorization-search-root.component';
import { AuthorizationStatusQueueRootComponent } from './authorization-status-queue/authorization-status-queue-root/authorization-status-queue-root.component';
import { CreateNewAuthModalComponent } from './authorization-status-queue/create-new-auth-modal/create-new-auth-modal.component';
import { CreateNewAuthModalService } from './authorization-status-queue/create-new-auth-modal/create-new-auth-modal.service';
import { ListOfPrescribersModalComponent } from './components/list-of-prescribers-modal/list-of-prescribers-modal.component';
import { CreatePosAuthPrescriptionComponent } from './create-pos-authorization/components/create-new-pos-auth/components/create-pos-auth-prescription/create-pos-auth-prescription.component';
import { OtherMedicationSearchModalComponent } from './create-pos-authorization/components/create-new-pos-auth/components/other-medication-search-modal/other-medication-search-modal.component';
import { CreateNewPosAuthComponent } from './create-pos-authorization/components/create-new-pos-auth/create-new-pos-auth.component';
import { CreateNewPosAuthService } from './create-pos-authorization/components/create-new-pos-auth/create-new-pos-auth.service';
import { CreatePosAuthorizationComponent } from './create-pos-authorization/create-pos-authorization.component';
import { FirstFillsQueueRootComponent } from './first-fills/first-fills-queue-root/first-fills-queue-root.component';
import { RealTimeRejectsQueueRootComponent } from './real-time-rejects-queue/real-time-rejects-queue-root/real-time-rejects-queue-root.component';

import { CscAdminEffects } from './store/effects/cscAdmin.effects';

import {
  cscAdminFeatureKey,
  cscAdminInitialState,
  cscAdminReducer
} from './store/reducers/cscAdmin.reducers';
import { ReportReturnedLomnComponent } from './report-returned-lomn/report-returned-lomn.component';
import { ReportReturnedLomnService } from './report-returned-lomn/report-returned-lomn.service';
import { ViewLogModalService } from '../claims/pbm/authorization/view-log-modal/view-log-modal.service';
import { NgxMaskModule } from 'ngx-mask';
import { HealtheGridModule } from '@modules/healthe-grid';
import { HealtheNotesModule } from '@modules/healthe-notes';
import { AssignFirstFillToClaimEffects } from './assign-first-fill-to-claim/store/assign-first-fill-to-claim.effects';
import { AssignFirstFillToClaimComponent } from './assign-first-fill-to-claim/assign-first-fill-to-claim.component';
import { AssignFirstFillMedicationHistoryTableComponent } from './assign-first-fill-to-claim/components/assign-first-fill-medication-history-table/assign-first-fill-medication-history-table.component';
import { AssignFirstFillClaimSearchFilterBoxComponent } from './assign-first-fill-to-claim/components/assign-first-fill-claim-search-filter-box/assign-first-fill-claim-search-filter-box.component';
import { AssignFirstFillClaimSearchResultsTableComponent } from './assign-first-fill-to-claim/components/assign-first-fill-claim-search-results-table/assign-first-fill-claim-search-results-table.component';
import { AssignFirstFillFooterComponent } from './assign-first-fill-to-claim/components/assign-first-fill-footer/assign-first-fill-footer.component';
import { ErrorCardModule } from '@modules/error-card';
import { AssignFirstFillNotesAndMoveComponent } from './assign-first-fill-to-claim/components/assign-first-fill-notes-and-move/assign-first-fill-notes-and-move.component';
import { FormValidationExtractorModule } from '@modules/form-validation-extractor';
import { DataResolverPipe } from './authorization-status-queue/authorization-status-queue-root/data-resolver.pipe';
import { GenerateUrlPipe } from './real-time-rejects-queue/real-time-rejects-queue-root/generate-url.pipe';
import { GeneralExporterModule } from '@modules/general-exporter';
import {
  PrescriberInformationLookupModule
} from '@modules/prescriber-information-lookup';

const routes: Routes = [
  {
    path: 'assign-first-fill-to-claim/:temporaryMemberId',
    component: AssignFirstFillToClaimComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: 'authorization-status-queue',
    component: AuthorizationStatusQueueRootComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: 'real-time-rejects-queue',
    component: RealTimeRejectsQueueRootComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: 'pos-authorization-search',
    component: PosAuthorizationSearchRootComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: 'first-fills-queue',
    component: FirstFillsQueueRootComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: 'add-first-fill',
    component: AddFirstFillComponent,
    canActivate: [CustomerConfigsGuardService],
    canDeactivate: [AddFirstFillService]
  },
  {
    path: 'report-returned-lomn',
    component: ReportReturnedLomnComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: 'create-pos-authorization/:customerId/:claimNumber/:memberId',
    component: CreatePosAuthorizationComponent,
    canActivate: [CustomerConfigsGuardService],
    canDeactivate: [CreateNewPosAuthService]
  }
];

@NgModule({
    declarations: [
        FirstFillsQueueRootComponent,
        PosAuthorizationSearchRootComponent,
        AuthorizationStatusQueueRootComponent,
        RealTimeRejectsQueueRootComponent,
        AddFirstFillComponent,
        CreateNewAuthModalComponent,
        CreatePosAuthorizationComponent,
        ReportReturnedLomnComponent,
        CreateNewPosAuthComponent,
        ListOfPrescribersModalComponent,
        CreatePosAuthPrescriptionComponent,
        OtherMedicationSearchModalComponent,
        NonParticipatingEmployersModalComponent,
        AssignFirstFillToClaimComponent,
        AssignFirstFillMedicationHistoryTableComponent,
        AssignFirstFillClaimSearchFilterBoxComponent,
        AssignFirstFillClaimSearchResultsTableComponent,
        AssignFirstFillFooterComponent,
        AssignFirstFillNotesAndMoveComponent,
        DataResolverPipe,
        GenerateUrlPipe
    ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(cscAdminFeatureKey, cscAdminReducer, {
      initialState: cscAdminInitialState
    }),
    EffectsModule.forFeature([CscAdminEffects, AssignFirstFillToClaimEffects]),
    SharedModule,
    MatCardModule,
    MatTabsModule,
    FontAwesomeModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDividerModule,
    FormsModule,
    MatInputModule,
    HealtheDatepickerModule,
    MatCheckboxModule,
    CustomerConfigsModule,
    HealtheSelectModule,
    MatDialogModule,
    MatTableModule,
    MatRadioModule,
    HealtheAlertBannerModule,
    MatSortModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatMenuModule,
    SearchNavModule,
    HealtheGridModule,
    NgxMaskModule,
    HealtheNotesModule,
    ErrorCardModule,
    FormValidationExtractorModule,
    GeneralExporterModule,
    PrescriberInformationLookupModule
  ],
    providers: [
        AddFirstFillService,
        ViewLogModalService,
        CreateNewAuthModalService,
        ReportReturnedLomnService
    ]
})
export class CscAdministrationModule {}
