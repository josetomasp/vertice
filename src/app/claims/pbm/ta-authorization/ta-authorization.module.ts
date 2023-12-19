import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TaAuthorizationComponent } from './ta-authorization.component';
import { TaAuthorizationInformationComponent } from './ta-letter-authorization-information/ta-authorization-information.component';
import { SharedModule } from '@shared';
import { CustomerConfigsModule } from '../../../customer-configs/customer-configs.module';
import { ReactiveComponentModule } from '@ngrx/component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { FormValidationExtractorModule } from '@modules/form-validation-extractor';
import { ErrorCardModule } from '@modules/error-card';
import { ServerErrorOverlayModule } from '@modules/server-error-overlay/server-error-overlay.module';

const routes: Routes = [
  {
    path: ':taAuthorizationId/ta/:subRoute',
    component: TaAuthorizationComponent
  }
];

@NgModule({
  providers: [DatePipe],
  declarations: [TaAuthorizationComponent, TaAuthorizationInformationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CustomerConfigsModule,
    ReactiveComponentModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    FontAwesomeModule,
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    FormValidationExtractorModule,
    ErrorCardModule,
    ServerErrorOverlayModule
  ]
})
export class TaAuthorizationModule {}
