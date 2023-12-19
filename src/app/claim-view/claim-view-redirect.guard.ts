import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { ActivityProductType } from './store/models/activity-tab.models';

@Injectable({ providedIn: 'root' })
export class ClaimViewRedirectGuard implements CanActivate {
  constructor(public router: Router) {}

  activityRedirect() {
    const services: ActivityProductType[] = AppConfig.customerConfigs
      .services as ActivityProductType[];

    if (services.length > 1) {
      return 'all';
    } else if (_.includes(services, ActivityProductType.PHARMACY)) {
      return 'pharmacy';
    } else if (_.includes(services, ActivityProductType.CLINICAL)) {
      return 'clinical';
    } else {
      return 'ancillary';
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const view = _.get(route.url, 0);
    let action;
    if (view && view.path === 'activity') {
      action = [state.url, this.activityRedirect()];
    } else {
      action = [state.url, 'activity', this.activityRedirect()];
    }
    this.router.navigate(action, { preserveFragment: true });
    return true;
  }
}
