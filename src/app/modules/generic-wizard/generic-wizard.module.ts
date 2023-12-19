import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { GenericWizardComponent } from './generic-wizard/generic-wizard.component';
import { GenericConfigurableStepComponent } from './generic-configurable-step/generic-configurable-step.component';
import { MatStepperModule } from '@angular/material/stepper';
import {
  provideAsyncConfig,
  provideConfig
} from '@modules/generic-wizard/generic-wizard-service-config-map.token';
import { ReactiveComponentModule } from '@ngrx/component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GenericWizardHeaderComponent } from '@modules/generic-wizard/generic-wizard-header/generic-wizard-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormValidationExtractorModule } from '@modules/form-validation-extractor';
import { TextareaComponent } from './generic-configurable-step/components/textarea/textarea.component';
import { GenericStepLabelComponent } from '@modules/generic-wizard/generic-step-label/generic-step-label.component';
import { GenericWizardTestHarnessComponent } from '@modules/generic-wizard/generic-wizard-test-harness.component';
import { HealtheTooltipAdvancedModule } from '@healthe/vertice-library';
import { GenericStepStateReporterDirective } from '@modules/generic-wizard/generic-step-label/generic-step-state-reporter.directive';
import { GenericWizardFooterComponent } from './generic-wizard-footer/generic-wizard-footer.component';
import { GenericReviewStepComponent } from './generic-review-step/generic-review-step.component';
import { SimpleReviewSectionComponent } from '@modules/generic-wizard/generic-review-step/simple-review-section.component';
import { CompositeReviewSectionComponent } from '@modules/generic-wizard/generic-review-step/composite-review-section.component';
import { VendorsStepComponent } from './vendors-step/vendors-step.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DocumentsStepComponent } from './documents-step/documents-step.component';
import { GenericDocumentPickerComponent } from '@modules/generic-wizard/generic-document-picker/generic-document-picker.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErrorCardModule } from '@modules/error-card';
import { MatSelectModule } from '@angular/material/select';
import { GenericWizardServiceConfigMap } from '@modules/generic-wizard/generic-wizard.models';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    ReactiveComponentModule,
    MatStepperModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatInputModule,
    FormValidationExtractorModule,
    HealtheTooltipAdvancedModule,
    ErrorCardModule,
    MatTableModule,
    MatTooltipModule,
    MatSelectModule
  ],
  declarations: [
    GenericWizardTestHarnessComponent,
    GenericStepLabelComponent,
    GenericStepStateReporterDirective,
    GenericWizardComponent,
    GenericConfigurableStepComponent,
    GenericWizardHeaderComponent,
    TextareaComponent,
    GenericWizardFooterComponent,
    GenericReviewStepComponent,
    SimpleReviewSectionComponent,
    CompositeReviewSectionComponent,
    VendorsStepComponent,
    GenericDocumentPickerComponent,
    DocumentsStepComponent
  ],
  exports: [GenericWizardComponent, GenericWizardTestHarnessComponent],
  providers: []
})
export class GenericWizardModule {
  static forRoot(
    configOrEndpoint: GenericWizardServiceConfigMap | string | Provider
  ): ModuleWithProviders<GenericWizardModule> {
    let provider;
    if (typeof configOrEndpoint == 'string') {
      provider = provideAsyncConfig(configOrEndpoint);
    } else if ('provide' in configOrEndpoint) {
      provider = configOrEndpoint;
    } else {
      provider = provideConfig(configOrEndpoint as any);
    }

    return {
      ngModule: GenericWizardModule,
      providers: [provider]
    };
  }
}
