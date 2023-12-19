import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { RootState } from '../../../../../../../store/models/root.models';
import { isAuthorizationSubmitted } from '../../../../store/selectors/fusion/fusion-authorization.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationPostSubmitGuard implements CanActivate {
  constructor(public store$: Store<RootState>, public router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store$.pipe(
      select(isAuthorizationSubmitted),
      first(),
      tap((isSubmitted) => {
        if (!isSubmitted) {
          let parentUrl = state.url.slice(
            0,
            state.url.indexOf(route.url[route.url.length - 1].path)
          );
          this.router.navigate([parentUrl, 'authorization']);
        }
      })
    );
  }
}
