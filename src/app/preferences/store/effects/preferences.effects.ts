import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  mergeMap,
  switchMap
} from 'rxjs/operators';
import { RootState } from '../../../store/models/root.models';
import { PreferenceService } from '../../preference.service';
import * as RootPrefActions from '../actions/preferences.actions';
import {
  ActionType,
  DeleteAllPreferencesFail,
  DeleteAllPreferencesSuccess,
  DeletePreferences,
  DeletePreferencesFail,
  DeletePreferencesSuccess,
  SavePreferences,
  SavePreferencesFail,
  SavePreferencesSuccess
} from '../actions/preferences.actions';
import { Preference } from '../models/preferences.models';
import { ResetPrefsViewStateToPristine } from '../actions/preferences-screen.actions';

@Injectable()
export class PreferencesEffects {
  public getAllPreferences$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(
        RootPrefActions.ActionType.GET_ALL_PREFERENCES,
        RootPrefActions.ActionType.DELETE_ALL_PREFERENCES_SUCCESS,
        RootPrefActions.ActionType.DELETE_PREFERENCES_SUCCESS
      ),
      mergeMap(() => {
        return this.preferenceService.getAllPreferences().pipe(
          map((response: Preference<any>[]) => {
            return new RootPrefActions.GetAllPreferencesSuccess(response);
          }),
          catchError((err) =>
            of(new RootPrefActions.GetAllPreferencesFail(err))
          )
        );
      })
    )
  );

  public deletePreferences$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(RootPrefActions.ActionType.DELETE_PREFERENCES),
      mergeMap(({ payload: preferences }: DeletePreferences) =>
        this.preferenceService.deletePreferences(preferences).pipe(
          map(() => new DeletePreferencesSuccess({})),
          catchError((err) => of(new DeletePreferencesFail(err)))
        )
      )
    )
  );

  public savePreferences$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(RootPrefActions.ActionType.SAVE_PREFERENCES),
      mergeMap(({ payload }: SavePreferences) =>
        this.preferenceService.batchSavePreferences(payload).pipe(
          switchMap((preferences: Preference<any>[]) => [
            new SavePreferencesSuccess(preferences),
            new ResetPrefsViewStateToPristine(null)
          ]),
          catchError((err) => of(new SavePreferencesFail(err)))
        )
      )
    )
  );

  public deleteAllPreferences$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(RootPrefActions.ActionType.DELETE_ALL_PREFERENCES),
      mergeMap(() =>
        this.preferenceService.deleteAllPreferences().pipe(
          map(() => new DeleteAllPreferencesSuccess({})),
          catchError((err) => of(new DeleteAllPreferencesFail(err)))
        )
      )
    )
  );

  public preferenceSaveSuccess$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ActionType.SAVE_PREFERENCES_SUCCESS,
        ActionType.DELETE_PREFERENCES_SUCCESS,
        ActionType.DELETE_ALL_PREFERENCES_SUCCESS
      ),
      debounceTime(1000),
      map(() => {
        /**
         * TODO: Replace with some sort of confirmation of save.
         */
        this.snackbar.open('Preferences Saved!', 'OK', { duration: 1500 });
        return { type: 'NO_ACTION' };
      })
    )
  );

  constructor(
    public preferenceService: PreferenceService,
    public actions$: Actions,
    public snackbar: MatSnackBar,
    public store$: Store<RootState>
  ) {}
}
