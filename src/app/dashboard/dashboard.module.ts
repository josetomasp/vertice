import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CustomerConfigsGuardService } from '../customer-configs/customer-configs-guard.service';
import { SharedModule } from '@shared';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardEffects } from './store/effects/dashboard.effects';
import { reducer } from './store/reducers/dashboard.reducers';
import { CustomerConfigsModule } from '../customer-configs/customer-configs.module';
import { PendingAuthorizationsGraphComponent } from './pending-authorizations-graph/pending-authorizations-graph.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [CustomerConfigsGuardService]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    SharedModule,
    RouterModule.forChild(routes),
    EffectsModule.forFeature([DashboardEffects]),
    StoreModule.forFeature('dashboard', reducer),
    CustomerConfigsModule,
    MatSelectModule,
    NgxChartsModule
  ],
  providers: [DashboardService],
  declarations: [DashboardComponent, PendingAuthorizationsGraphComponent]
})
export class DashboardModule {}
