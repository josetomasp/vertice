import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { FeatureFlagService } from './feature-flag.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerConfigsGuardService implements CanActivate {
  constructor(
    private router: Router,
    private featureFlagService: FeatureFlagService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const splitUrl = state.url.split('/');
    let fullUrl = state.url;
    if (splitUrl[1] === 'claimview') {
      if (splitUrl.length === 6) {
        fullUrl = `/${splitUrl[1]}/${splitUrl[4]}/${splitUrl[5]}`;
      } else {
        fullUrl = `/${splitUrl[1]}/${splitUrl[4]}`;
      }
    }

    if (!this.featureFlagService.disableRouteIfTrue(fullUrl)) {
      return true;
    } else {
      this.router.navigate(['/403'], {
        queryParams: { redirectTo: fullUrl }
      });
      return false;
    }
  }
}
