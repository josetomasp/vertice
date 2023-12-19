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
import { first, map, tap } from 'rxjs/operators';
import { RootState } from 'src/app/store/models/root.models';
import {
  getRxAuthorizationSubmitResponse
} from '../../store/selectors/pbm-authorization-information.selectors';

@Injectable({
  providedIn: 'root'
})
export class PbmAuthorizationPostSubmitGuard implements CanActivate {
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
      select(getRxAuthorizationSubmitResponse),
      first(),
      tap((submit) => {
        if (!submit.response.successful) {
          let parentUrl = state.url.slice(
            0,
            state.url.indexOf(route.url[route.url.length - 1].path)
          );
          this.router.navigate([parentUrl, 'authorization']);
        }
      }),
      map((submit) => submit.response.successful)
    );
  }
}
