import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import {
  MAT_SELECT_SCROLL_STRATEGY,
  MatSelectModule
} from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  HealtheCardInfoModule,
  HealtheSelectModule,
  HealtheTableModule,
  NgxMatDrpModule
} from '@healthe/vertice-library';
import { EffectsModule } from '@ngrx/effects';

import { StoreModule } from '@ngrx/store';
import { CustomerConfigsModule } from '../customer-configs/customer-configs.module';
import { ClaimActivityTableColumnSettingsService } from './claim-table-list-settings/claim-activity-table-column-settings.service';
import { ClaimTableListSettingsComponent } from './claim-table-list-settings/claim-table-list-settings.component';
import { ClaimViewBannerSettingsComponent } from './claim-view-banner-settings/claim-view-banner-settings.component';

import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { PrefDirective } from './pref.directive';

import { PreferencesComponent } from './preferences.component';
import { PreferencesEffects } from './store/effects/preferences.effects';
import { preferencesInitialState } from './store/models/preferences.models';
import { preferencesStateFeatureKey, reducer } from './store/reducers';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatRadioModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatExpansionModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatCheckboxModule,
    HealtheSelectModule,
    HealtheTableModule,
    HealtheCardInfoModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    StoreModule.forFeature(preferencesStateFeatureKey, reducer, {
      initialState: preferencesInitialState
    }),
    NgxMatDrpModule,
    EffectsModule.forFeature([PreferencesEffects]),
    CustomerConfigsModule,
    MatDialogModule
  ],
  providers: [
    ClaimActivityTableColumnSettingsService,
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay]
    }
  ],
  declarations: [
    PreferencesComponent,
    PrefDirective,
    GeneralSettingsComponent,
    ClaimViewBannerSettingsComponent,
    ClaimTableListSettingsComponent
  ]
})
export class PreferencesModule {}
