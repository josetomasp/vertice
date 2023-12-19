import { VerticeRumConfig } from '@modules/rum/vertice-rum.models';
import { datadogRum } from '@datadog/browser-rum';

export class VerticeRumService {
  constructor() {
    if (!window.pendo) {
      console.warn('Pendo wasn\'t found! VerticeRumService needs pendo!');
    }
  }

  /**
   * Sends a custom event/action to RUM services
   * @param eventName
   * @param data
   * @param options {{sendToDataDog: boolean, sendToPendo: boolean}}
   */
  emitEvent(
    eventName: string,
    data: any,
    { sendToPendo, sendToDataDog } = { sendToPendo: true, sendToDataDog: true }
  ) {
    if (sendToDataDog) {
      datadogRum.addAction(eventName, data);
    }
    if (window.pendo) {
      window.pendo.track(eventName, data);
    } else if (sendToPendo) {
      if (sendToPendo) {
        console.warn(
          'Pendo wasn\'t found! Can\'t call track event...',
          eventName,
          data
        );
      }
    }
  }

  init({ userData }: VerticeRumConfig) {
    if (window.pendo) {
      if (!userData.userName) {
        return console.warn('Cant Initialize Pendo! No username');
      }
      console.log('initializing and registering data to pendo');
      window.pendo.initialize({
        visitor: {
          id: userData.userName,
          ...userData
        },
        account: {
          id: userData.customerID
        }
      });
    }
    let env;
    switch (document.domain) {
      case 'corp.healthesystems.com':
        env = 'prod';
        break;
      case 'int.hestest.com':
        env = 'dev';
        break;
      case 'uat.healthesystems.com':
        env = 'uat';
        break;
      case 'pqa.hestest.com':
        env = 'stage';
        break;
      default:
        env = null;
    }
    let version = document?.body?.attributes['vertice-ui-version']?.value;
    datadogRum.init({
      applicationId: 'f5225ca5-31ba-4716-8ccd-d53aa17d52cc',
      clientToken: 'pub222d77e43a27e0c56b5005beb06c4eee',
      site: 'us3.datadoghq.com',
      service: 'test',
      enableExperimentalFeatures: ['feature_flags'],
      env,
      version: version ?? undefined,
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackFrustrations: true,
      trackResources: true,
      trackLongTasks: true
    });
    datadogRum.setUser({
      id: userData.userName,
      ...userData
    });
    datadogRum.startSessionReplayRecording();
  }
}
