import { ModuleWithProviders, NgModule } from '@angular/core';
import { TrackIgnoredFeatureDirective } from '@modules/rum/track-ignored-feature.directive';
import { TrackIgnoredFeatureTriggerDirective } from '@modules/rum/track-ignored-feature-trigger.directive';
import { TrackFormValidationExtractionTriggerDirective } from '@modules/rum/track-form-validation-extraction-trigger.directive';
import { VerticeRumService } from '@modules/rum/vertice-rum.service';

@NgModule({
  declarations: [
    TrackIgnoredFeatureDirective,
    TrackIgnoredFeatureTriggerDirective,
    TrackFormValidationExtractionTriggerDirective
  ],
  exports: [
    TrackIgnoredFeatureDirective,
    TrackIgnoredFeatureTriggerDirective,
    TrackFormValidationExtractionTriggerDirective
  ]
})
export class VerticeRumModule {
  static forRoot(): ModuleWithProviders<VerticeRumModule> {
    return {
      ngModule: VerticeRumModule,
      providers: [VerticeRumService]
    };
  }
}
