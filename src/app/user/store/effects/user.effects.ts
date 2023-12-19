import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { UserService } from '../../user.service';
import {
  ActionTypes,
  UserInfoFail,
  UserInfoSuccess
} from '../actions/user.actions';
import { VerticeRumService } from '@modules/rum/vertice-rum.service';

@Injectable()
export class UserEffects {
  getUserInfo: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.USER_INFO_REQUEST),
      mergeMap((action) => {
        return this.userService.getUserInfo().pipe(
          map((userDoc) => new UserInfoSuccess(userDoc)),
          catchError((err) => {
            console.error(err);
            return of(new UserInfoFail(err));
          })
        );
      })
    )
  );
  // TODO: Remove this if we don't get pendo. Add it back if we do
  userAnalyticsSetup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ActionTypes.USER_INFO_SUCCESS),
        tap((action: UserInfoSuccess) => {
          const { username, email, customerID, internal, firstName, lastName } =
            action.payload;
          this.rumService.init({
            userData: {
              userName: username,
              email,
              customerID: customerID.toUpperCase(),
              internal,
              firstName,
              lastName
            }
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    public actions$: Actions,
    public userService: UserService,
    public rumService: VerticeRumService
  ) {}
}
