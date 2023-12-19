import { ObserversModule } from '@angular/cdk/observers';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  HealtheAlertBannerModule,
  HealtheDatepickerModule,
  HealtheSelectModule,
  HealtheTooltipAdvancedModule,
  HealtheTooltipAdvancedService,
  NgxMatDrpModule
} from '@healthe/vertice-library';
import { select, Store, StoreModule } from '@ngrx/store';
import { NgxMaskModule } from 'ngx-mask';
import { filter, first } from 'rxjs/operators';

import { AddNoteModalComponent } from '../claims/abm/referral/make-a-referral/transportation/components/add-note-modal/add-note-modal.component';
import { CustomerConfigsModule } from '../customer-configs/customer-configs.module';
import { RootState } from '../store/models/root.models';
import { ClaimResolutionAuthorizationsComponent } from './authorizations/authorization-configs/claim-resolution-authorizations.component';
import { ClinicalAuthorizationsComponent } from './authorizations/authorization-configs/clinical-authorizations.component';
import { EpaqAuthorizationsComponent } from './authorizations/authorization-configs/epaq-authorizations.component';
import { MailOrderAuthorizationsComponent } from './authorizations/authorization-configs/mail-order-authorizations.component';
import { PaperBillRosterAuthorizationsComponent } from './authorizations/authorization-configs/paperBillRoster-authorizations.component';
import { ReferralAuthorizationsComponent } from './authorizations/authorization-configs/referral-authorizations.component';
import { AuthorizationsSearchContainerComponent } from './authorizations/authorizations-search-container.component';
import { AuthorizationsSearchBaseComponent } from './authorizations/components/authorizations-search-base/authorizations-search-base.component';
import { AuthorizationsSearchFormFieldSwitchComponent } from './authorizations/components/authorizations-search-form-field-switch/authorizations-search-form-field-switch.component';
import { AuthorizationsSearchFormComponent } from './authorizations/components/authorizations-search-form/authorizations-search-form.component';
import { AuthorizationsSearchResultsCellComponent } from './authorizations/components/authorizations-search-results-cell/authorizations-search-results-cell.component';
import { AuthorizationsSearchResultsComponent } from './authorizations/components/authorizations-search-results/authorizations-search-results.component';
import { ReferralSearchBoxComponent } from './referrals/activity/components/referral-search-box/referral-search-box.component';
import { ReferralSearchTableComponent } from './referrals/activity/components/referral-search-table/referral-search-table.component';
import { ReferralTableCellSwitchComponent } from './referrals/activity/components/referral-table-cell-switch/referral-table-cell-switch.component';
import { DraftReferralsComponent } from './authorizations/authorization-configs/draft-referrals.component';
import { PendingReferralsComponent } from './referrals/activity/pending-referrals/pending-referrals.component';
import { ReferralActivityComponent } from './referrals/activity/referral-activity/referral-activity.component';
import { SearchNavRoutingModule } from './search-nav-routing.module';
import { loadSearchOptionsRequest } from './store/actions';
import {
  navSearchInitialState,
  navSearchReducer,
  navSearchStateKey
} from './store/reducers/nav-search.reducers';
import { getSearchOptions } from './store/selectors';
import { SearchResultsCountComponent } from './components/search-results-count/search-results-count.component';
import { ReferralDraftSearchComponent } from './referrals/activity/referral-draft-search/referral-draft-search.component';
import { ExternalLinkModalComponent } from './shared/external-link-modal/external-link-modal.component';
import { SafePipePipe } from './shared/safe-pipe.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PosAuthorizationSearchComponent } from './authorizations/authorization-configs/pos-authorization-search.component';
import { SharedModule } from '@shared';
import { HealtheGridModule } from '@modules/healthe-grid';
import { GeneralExporterModule } from '@modules/general-exporter';
import { AuthorizationsSearchFormStandaloneComponent } from './authorizations/components/authorizations-search-form-standalone/authorizations-search-form-standalone.component';
import {
  AllAuthorizationsComponent
} from './authorizations/all-authorizations/all-authorizations.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { AuthorizationsSearchFormFieldSwitchStandaloneComponent } from './authorizations/components/authorizations-search-form-field-switch-standalone/authorizations-search-form-field-switch-standalone.component';
import { AuthorizationsSearchResultsStandaloneComponent } from './authorizations/components/authorizations-search-results-standalone/authorizations-search-results-standalone.component';
import {
  ServerErrorOverlayModule
} from '@modules/server-error-overlay/server-error-overlay.module';
import { PharmacySearchContainerComponent } from './pharmacy-search/pharmacy-search-container.component';
import { PharmacySearchModule } from 'pharmacy-search-lib';
import { API_SERVER } from '../../environments/environment';

@NgModule({
    declarations: [
        AuthorizationsSearchContainerComponent,
        ReferralActivityComponent,
        PendingReferralsComponent,
        ReferralSearchTableComponent,
        ReferralSearchBoxComponent,
        DraftReferralsComponent,
        ReferralDraftSearchComponent,
        ReferralTableCellSwitchComponent,
        ReferralAuthorizationsComponent,
        AllAuthorizationsComponent,
        EpaqAuthorizationsComponent,
        PaperBillRosterAuthorizationsComponent,
        ClinicalAuthorizationsComponent,
        AuthorizationsSearchResultsComponent,
        AuthorizationsSearchResultsCellComponent,
        AuthorizationsSearchFormFieldSwitchComponent,
        AuthorizationsSearchBaseComponent,
        AuthorizationsSearchFormComponent,
        MailOrderAuthorizationsComponent,
        AddNoteModalComponent,
        ClaimResolutionAuthorizationsComponent,
        SearchResultsCountComponent,
        ExternalLinkModalComponent,
        SafePipePipe,
        PosAuthorizationSearchComponent,
        AuthorizationsSearchFormStandaloneComponent,
        AuthorizationsSearchFormFieldSwitchStandaloneComponent,
        AuthorizationsSearchResultsStandaloneComponent,
        PharmacySearchContainerComponent
    ],
    imports: [
      PharmacySearchModule.forRoot({ apiBaseUrl: API_SERVER + '/pharmacyLookup/v1' }),
        CommonModule,
        SearchNavRoutingModule,
        StoreModule.forFeature(navSearchStateKey, navSearchReducer, {
            initialState: navSearchInitialState
        }),
        FontAwesomeModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
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
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        HealtheAlertBannerModule,
        HealtheDatepickerModule,
        HealtheSelectModule,
        HealtheTooltipAdvancedModule,
        ObserversModule,
        PortalModule,
        SharedModule,
        NgxMatDrpModule,
        NgxMaskModule,
        CustomerConfigsModule,
        ScrollingModule,
        GeneralExporterModule,
        HealtheGridModule,
        ReactiveComponentModule,
        ServerErrorOverlayModule
    ],
    exports: [
        ReferralAuthorizationsComponent,
        SearchResultsCountComponent,
        PosAuthorizationSearchComponent
    ],
    providers: [
        HealtheTooltipAdvancedService,
        {
            provide: MAT_SELECT_SCROLL_STRATEGY,
            useFactory: scrollFactory,
            deps: [Overlay]
        }
    ]
})
export class SearchNavModule {
  constructor(store$: Store<RootState>) {
    store$
      .pipe(
        select(getSearchOptions),
        first(),
        filter((options) => !options.hasSearchOptionsAttemptedToLoadOnce)
      )
      .subscribe(() => store$.dispatch(loadSearchOptionsRequest()));
  }
}

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}
