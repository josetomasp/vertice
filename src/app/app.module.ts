import { DatePipe } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ErrorHandler,
  Injectable,
  NgModule
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  PreloadingStrategy,
  Route,
  Router,
  RouterModule,
  Routes
} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  AccessDeniedComponent,
  CoreModule,
  LoggerService,
  PageNotFoundComponent
} from '@healthe/core';
import { HealtheAlertModule } from '@healthe/vertice-library';
import { EffectsModule } from '@ngrx/effects';
import {
  routerReducer,
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SharedModule } from '@shared';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { Observable, of } from 'rxjs';
import { DocumentExporterService } from '../common/documentExporter/document-exporter.service';
import { environment } from '../environments/environment';
import { AppConfig } from './app.config';
import { MakeAReferralEffects } from './claims/abm/referral/store/effects/make-a-referral.effects';
import { ClaimSearchEffects, reducer } from './claims/store';
import { CustomerConfigsModule } from './customer-configs/customer-configs.module';
import { HealtheNavigationWrapperComponent } from './healthe-navigation-wrapper.component';
import { HttpErrorInterceptorService } from './http-error-interceptor.service';
import { HealtheInMemoryDataService } from './in-memory-data.service';
import { PowerBIReportComponent } from './power-bireport/power-bireport.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { PreferencesModule } from './preferences/preferences.module';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { ReportsListService } from './reports-list/reports-list.service';
import { clearClaimView } from './store/reducers/meta.reducers';
import { HealtheRouterSerialize } from './store/router-serializer.service';
import { UserModule } from './user/user.module';
import { VerticeHelpComponent } from './vertice-help/vertice-help.component';
import { UncaughtExceptionHandler } from './uncaught-exception.handler';
import { SearchNavEffects } from './search-nav/store/effects/search-nav.effects';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { ServerErrorOverlayModule } from '@modules/server-error-overlay/server-error-overlay.module';
import { AllAuthorizationsStore } from './search-nav/authorizations/all-authorizations/all-authorizations.store';
import { NgxMaskModule } from 'ngx-mask';
import { VerticeRumModule } from '@modules/rum';
import { GenericWizardModule } from '@modules/generic-wizard/generic-wizard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenericWizardTestHarnessComponent } from '@modules/generic-wizard/generic-wizard-test-harness.component';
import {
  GenericFormFieldType,
  GenericStepType
} from '@modules/generic-wizard/generic-wizard.models';
import { provideMockAsyncConfig } from '@modules/generic-wizard/generic-wizard-service-config-map.token';

const ADRUM: any = (<any>window).ADRUM;

@Injectable()
export class PreloadSelectedModulesList implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    return route.data && route.data['preload'] ? load() : of(null);
  }
}

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'claims' },
  { path: 'kinect', component: GenericWizardTestHarnessComponent },
  {
    path: 'claimview/:customerId/:claimNumber',
    loadChildren: () =>
      import('./claim-view/claim-view.module').then((m) => m.ClaimViewModule)
  },
  {
    path: 'referralActivity/:customerId/:claimNumber/:referralId/details/currentActivity/table',
    redirectTo:
      '/claims/:customerId/:claimNumber/referral/:referralId/activity/table'
  },
  {
    path: 'referralActivity/:customerId/:claimNumber/:referralId/details/currentActivity/grid',
    redirectTo:
      '/claims/:customerId/:claimNumber/referral/:referralId/activity/grid'
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: 'referrals',
    loadChildren: () =>
      import('./claims/abm/referral/referral.module').then(
        (m) => m.ReferralModule
      ),
    data: { preload: true }
  },
  {
    path: 'search-nav',
    loadChildren: () =>
      import('./search-nav/search-nav.module').then((m) => m.SearchNavModule)
  },
  {
    path: 'csc-administration',
    loadChildren: () =>
      import('./csc-administration/csc-administration.module').then(
        (m) => m.CscAdministrationModule
      )
  },
  {
    path: 'claims',
    loadChildren: () =>
      import('./claims/claims.module').then((m) => m.ClaimsModule),
    data: { preload: true }
  },
  {
    path: 'reports',
    component: ReportsListComponent
  },
  {
    path: 'preferences',
    component: PreferencesComponent
  },
  {
    path: 'powerBi/:reportId',
    redirectTo: `power-bi/groups/${environment.powerBiGroupId}/reports/:reportId`
  },
  {
    path: 'power-bi/groups/:groupId/:powerBiType/:reportId',
    component: PowerBIReportComponent
  },
  {
    path: '403',
    pathMatch: 'full',
    component: AccessDeniedComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent
  }
];
/**
 * This is to rollback the logger from the CoreModule if not in a production-esque env
 */
const defaultLoggerProvider = environment.dev
  ? [
      {
        provide: 'JSNLOG',
        useValue: {}
      },
      { provide: LoggerService, useValue: {} },
      {
        provide: ErrorHandler,
        useClass: ErrorHandler
      }
    ]
  : [];

@NgModule({
  declarations: [
    HealtheNavigationWrapperComponent,
    PowerBIReportComponent,
    ReportsListComponent,
    VerticeHelpComponent
  ],
  imports: [
    CoreModule.forRoot(environment, 'vertice-ui'),
    VerticeRumModule.forRoot(),
    GenericWizardModule.forRoot(provideMockAsyncConfig()),
    ServerErrorOverlayModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    MatMenuModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatOptionModule,
    NgxMaskModule.forRoot(),
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadSelectedModulesList,
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'legacy'
    }),
    HttpClientModule,
    HttpClientInMemoryWebApiModule,
    HealtheAlertModule,
    PreferencesModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    environment.dev
      ? HttpClientInMemoryWebApiModule.forRoot(HealtheInMemoryDataService, {
          passThruUnknownUrl: true,
          dataEncapsulation: false,
          delay: 1000
        })
      : [],
    UserModule,
    StoreModule.forRoot(
      {
        router: routerReducer,
        claims: reducer
      } as any,
      { metaReducers: [clearClaimView] }
    ),
    EffectsModule.forRoot([
      ClaimSearchEffects,
      MakeAReferralEffects,
      SearchNavEffects
    ]),
    environment.dev ? StoreDevtoolsModule.instrument({ maxAge: 20 }) : [],
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    FontAwesomeModule,
    CustomerConfigsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    PreloadSelectedModulesList,
    {
      provide: 'env',
      useValue: environment
    },
    {
      provide: ErrorHandler,
      useClass: UncaughtExceptionHandler
    },
    DocumentExporterService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'standard' }
    },
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function (router: Router, http: HttpClient) {
        return new HttpErrorInterceptorService(router, http);
      },
      multi: true,
      deps: [Router, HttpClient]
    },
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true
    },
    {
      provide: RouterStateSerializer,
      useClass: HealtheRouterSerialize
    },
    ...defaultLoggerProvider,
    ReportsListService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { disableClose: true, hasBackdrop: true }
    },
    AllAuthorizationsStore
  ],
  bootstrap: [HealtheNavigationWrapperComponent],
  exports: []
})
export class AppModule {
  constructor() {}
}
