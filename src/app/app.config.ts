import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { zip } from 'rxjs';
import { CustomerConfigs } from './customer-configs/customer-configs';
import { CustomerConfigsService } from './customer-configs/customer-configs.service';
import { PreferenceService } from './preferences/preference.service';
import { GetAllPreferencesSuccess } from './preferences/store/actions/preferences.actions';
import { Preference } from './preferences/store/models/preferences.models';
import { RootState } from './store/models/root.models';
import { datadogRum } from '@datadog/browser-rum';
@Injectable()
export class AppConfig {
  static customerConfigs: CustomerConfigs;

  constructor(
    private customerConfigsService: CustomerConfigsService,
    private preferencesService: PreferenceService,
    private store$: Store<RootState>
  ) {}

  load() {
    return new Promise<void>((resolve, reject) => {
      zip(
        this.customerConfigsService.getCustomerConfigs(),
        this.preferencesService.getAllPreferences()
      )
        .toPromise()
        .then(
          ([response, preferences]: [CustomerConfigs, Preference<any>[]]) => {
            AppConfig.customerConfigs = <CustomerConfigs>response;
            this.store$.dispatch(new GetAllPreferencesSuccess(preferences));
            resolve();
          }
        )
        .catch((response: any) => {
          reject(`[app.config.ts] - Could not load Customer Configs`);
        });
    });
  }
}
