import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LomnWrapperComponent } from './lomn-wrapper/lomn-wrapper.component';
import { createSelector, select, Store, StoreModule } from '@ngrx/store';
import {
  routerReducer,
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { LomnPreviewSubmitComponent } from './lomn-wizard/lomn-wizard-steps/lomn-preview-submit/lomn-preview-submit.component';
import { LomnSubmitModalComponent } from './lomn-wizard/lomn-wizard-steps/lomn-preview-submit/components/lomn-submit-modal/lomn-submit-modal.component';
import { LomnMedicationPreviewCardComponent } from './lomn-wizard/lomn-wizard-steps/lomn-preview-submit/components/lomn-medication-preview-card/lomn-medication-preview-card.component';
import { LomnMedicationListComponent } from './lomn-wizard/lomn-wizard-steps/lomn-medication-list/lomn-medication-list.component';
import { LomnAttorneyAndClaimantComponent } from './lomn-wizard/lomn-wizard-steps/lomn-attorney-and-claimant/lomn-attorney-and-claimant.component';
import { LomnWizardComponent } from './lomn-wizard/lomn-wizard.component';
import { PrescriberLookupModalComponent } from './prescriber-lookup-modal/prescriber-lookup-modal.component';
import { MatStepperModule } from '@angular/material/stepper';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule
} from '@angular/material/dialog';
import { StepStateDirective } from './step-state.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ErrorBannerComponent } from './error-banner/error-banner.component';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule
} from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { AlertInfoModalComponent } from './alert-info-banner/alert-info-modal/alert-info-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskModule } from 'ngx-mask';
import { AlertInfoBannerComponent } from './alert-info-banner/alert-info-banner.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { claimV2InitialState } from './store/models/claim.models';
import { claimReducer } from './store/reducers/claim.reducers';
import { ClaimEffects } from './store/effects/claim.effects';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { HealtheRouterSerialize } from './router-serializer.service';
import { RequestClaimV2 } from './store/actions/claim.actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { pbmAuthRootReducer } from './store/reducers/pbm-authorization-information.reducers';
import { PBM_AUTHORIZATION_INITIAL_STATE } from './store/models/pbm-authorization-initial-state';
import { CreateLomnEffects } from './store/effects/create-lomn.effects';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PbmAuthorizationEffects } from './store/effects/pbm-authorization.effects';
import { PbmAuthorizationService } from './pbm-authorization.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { loadExparteCopiesRequired } from './store/actions/create-lomn.actions';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HealtheSelectModule } from '@healthe/vertice-library';
import { ClaimV3Service } from './claim-v3.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
const getRouteParameters = createSelector(
  (state: any) => state.router,

  (routerState) => {
    if (routerState) {
      const {
        state: { params }
      } = routerState as any;
      return params;
    } else {
      return {};
    }
  }
);

@NgModule({
  declarations: [
    AppComponent,
    LomnWrapperComponent,
    LomnPreviewSubmitComponent,
    LomnSubmitModalComponent,
    LomnMedicationPreviewCardComponent,
    LomnMedicationListComponent,
    LomnAttorneyAndClaimantComponent,
    LomnWizardComponent,
    PrescriberLookupModalComponent,
    StepStateDirective,
    ErrorBannerComponent,
    AlertInfoModalComponent,
    AlertInfoBannerComponent,
    ConfirmationModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot(
      {
        router: routerReducer,
        pbmAuthorizationRootState: pbmAuthRootReducer,
        shared: (state = { claim: claimV2InitialState }, action) => {
          return claimReducer(state, action as any);
        }
      },
      {
        shared: { claim: claimV2InitialState },
        pbmAuthorizationRootState: PBM_AUTHORIZATION_INITIAL_STATE
      } as any
    ),
    EffectsModule.forRoot([
      ClaimEffects,
      CreateLomnEffects,
      PbmAuthorizationEffects
    ]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    environment.dev ? StoreDevtoolsModule.instrument({ maxAge: 20 }) : [],
    FontAwesomeModule,
    FlexLayoutModule,
    MatCardModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    NgxMaskModule.forRoot(),
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatOptionModule,
    HealtheSelectModule
  ],
  providers: [
    ClaimV3Service,
    PbmAuthorizationService,
    {
      provide: RouterStateSerializer,
      useClass: HealtheRouterSerialize
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'standard' }
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { disableClose: true, hasBackdrop: true }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    store$: Store<any>,
    pbmAuthorizationService: PbmAuthorizationService
  ) {
    store$
      .pipe(
        select(getRouteParameters),
        filter((params) => !isEmpty(params))
      )
      .subscribe(
        ({ claimNumber, customerId, authorizationId, serviceType }) => {
          pbmAuthorizationService.dispatchLoadAuthorizationAction(
            serviceType,
            authorizationId
          );
          store$.dispatch(
            new RequestClaimV2({
              claimNumber,
              customerId
            })
          );
          store$.dispatch(
            loadExparteCopiesRequired({
              encodedClaimNumber: claimNumber,
              encodedCustomerId: customerId
            })
          );
        }
      );
  }
}
