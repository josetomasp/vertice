import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HealtheSelectModule, NgxMatDrpModule } from '@healthe/vertice-library';
import { SharedModule } from '@shared';
import { CustomerConfigsGuardService } from '../customer-configs/customer-configs-guard.service';
import { CustomerConfigsModule } from '../customer-configs/customer-configs.module';
import { ClaimSearchFilterBoxComponent } from './claim-search/claim-search-filter-box/claim-search-filter-box.component';
import { ActionButtonComponent } from './claim-search/claim-search-results-table/action-button/action-button.component';
import { ClaimSearchCellSwitchComponent } from './claim-search/claim-search-results-table/claim-search-cell-switch/claim-search-cell-switch.component';
import { ClaimSearchResultTableComponent } from './claim-search/claim-search-results-table/claim-search-results-table.component';
import { InterventionsCellComponent } from './claim-search/claim-search-results-table/interventions-cell/interventions-cell.component';
import { PreviousActionsDisplayComponent } from './claim-search/claim-search-results-table/previous-actions-display/previous-actions-display.component';
import { ClaimSearchComponent } from './claim-search/claim-search.component';
import { SearchNavModule } from '../search-nav/search-nav.module';
import { ReactiveComponentModule } from '@ngrx/component';

const routes: Routes = [
  {
    path: 'claimSearch',
    component: ClaimSearchComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: ':customerId/:claimNumber/referral',
    loadChildren: () =>
      import('./abm/referral/referral.module').then((m) => m.ReferralModule)
  },
  {
    path: ':customerId/:claimNumber/pbm',
    loadChildren: () =>
      import('./pbm/ta-authorization/ta-authorization.module').then(
        (m) => m.TaAuthorizationModule
      )
  },
  {
    path: ':customerId/:claimNumber/pbm',
    loadChildren: () =>
      import('./pbm/authorization/pbm-authorization.module').then(
        (m) => m.PbmAuthorizationModule
      )
  },
  {
    path: 'riskQueue',
    component: ClaimSearchComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  { path: '**', redirectTo: 'claimSearch' }
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HealtheSelectModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule,
    MatSortModule,
    MatTooltipModule,
    NgxMatDrpModule,
    MatPaginatorModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedModule,
    RouterModule.forChild(routes),
    CustomerConfigsModule,
    MatTableModule,
    MatSnackBarModule,
    SearchNavModule,
    ReactiveComponentModule
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'standard' }
    }
  ],
  declarations: [
    ClaimSearchComponent,
    ClaimSearchFilterBoxComponent,
    ClaimSearchResultTableComponent,
    PreviousActionsDisplayComponent,
    ActionButtonComponent,
    InterventionsCellComponent,
    ClaimSearchCellSwitchComponent
  ]
})
export class ClaimsModule {}
