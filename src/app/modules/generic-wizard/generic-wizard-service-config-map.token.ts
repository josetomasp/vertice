import { InjectionToken } from '@angular/core';
import {
  GenericStepType,
  GenericWizardServiceConfigMap
} from '@modules/generic-wizard/generic-wizard.models';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { delay } from 'rxjs/operators';
import {
  vendorStep
} from '@modules/generic-wizard/compose/step/vendor-step.function';
import {
  documentsStep
} from '@modules/generic-wizard/compose/step/documents-step.function';
import {
  reviewStep
} from '@modules/generic-wizard/compose/step/review-step.function';
import {
  formSection,
  genericConfigurableStep,
  row,
  textArea
} from '@modules/generic-wizard/compose/step/generic-step.function';
import {
  wizardService
} from '@modules/generic-wizard/compose/service.function';
import {
  wizardConfigMap
} from '@modules/generic-wizard/compose/wizard-config.function';

const testConfig = wizardConfigMap(
  wizardService(
    'TEST_SERVICE',
    'Test Service',
    false,
    genericConfigurableStep(
      'genericService',
      'Generic Service',
      formSection(
        'Service Details',
        row(textArea('notes', 'Notes', 'Please enter some notes...', 200)),
        row(
          textArea(
            'serviceDescription',
            'Service Description',
            'Enter what will be performed as this service'
          ),
          textArea(
            'contacts',
            'Contacts',
            'Please enter the contacts involved',
            500,
            ['required']
          )
        )
      )
    ),
    vendorStep(true, true, true),
    documentsStep(),
    reviewStep()
  )
);

export const GenericWizardServiceConfigMapToken =
  new InjectionToken<GenericWizardServiceConfigMap>(
    'GenericWizardServiceConfigMapToken'
  );
export function provideMockAsyncConfig(delayTime = 0) {
  return {
    provide: GenericWizardServiceConfigMapToken,
    useFactory() {
      return of<GenericWizardServiceConfigMap>(testConfig).pipe(
        delay(delayTime)
      );
    }
  };
}
export function provideAsyncConfig(endpoint) {
  return {
    provide: GenericWizardServiceConfigMapToken,
    useFactory: (http: HttpClient) => {
      return http.get(`${environment.apiServer}${endpoint}`);
    },
    deps: [HttpClient]
  };
}
export function provideConfig(config: GenericWizardServiceConfigMap) {
  return {
    provide: GenericWizardServiceConfigMapToken,
    useValue: config
  };
}
