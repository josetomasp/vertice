import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadPaperAuthInfo,
  loadPaperAuthInfoFail,
  loadPaperAuthInfoSuccess,
  loadRxAuthInfo,
  loadRxAuthInfoFail,
  loadRxAuthInfoSuccess,
  loadLOMNPaperAuthorizationData,
  loadLOMNPaperAuthorizationDataSuccess,
  loadLOMNPaperAuthorizationDataFail
} from '../actions/pbm-authorization-information.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AuthorizationDetails } from '../models/pbm-authorization-information.model';
import { of } from 'rxjs';
import { LomnWizardService } from '../../lomn-wizard/lomn-wizard.service';
import { PbmAuthorizationService } from '../../pbm-authorization.service';
import { VerticeResponse } from '../models/VerticeResponse';

@Injectable()
export class PbmAuthorizationEffects {
  loadRxAuthInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRxAuthInfo),
      mergeMap(({ authorizationId }) =>
        this.authorizationService
          .getRxAuthorizationInformation({ authorizationId })
          .pipe(
            map((payload: VerticeResponse<AuthorizationDetails>) => {
              if (payload.httpStatusCode < 300) {
                return loadRxAuthInfoSuccess(payload.responseBody);
              } else {
                return loadRxAuthInfoFail({ errors: payload.errors });
              }
            }),
            catchError((error) => {
              return of(
                loadRxAuthInfoFail({
                  errors: ['The System Returned Unexpected Data']
                })
              );
            })
          )
      )
    )
  );

  loadPaperAuthInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPaperAuthInfo),
      mergeMap(({ authorizationId }) =>
        this.authorizationService
          .getPaperAuthorizationInformation({ authorizationId })
          .pipe(
            map((payload: AuthorizationDetails) => {
              return loadPaperAuthInfoSuccess(payload);
            }),
            catchError((error) => {
              return of(loadPaperAuthInfoFail({ errors: [error] }));
            })
          )
      )
    )
  );

  loadLomnPaperAuthData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLOMNPaperAuthorizationData),
      mergeMap(({ authorizationId }) =>
        this.authorizationService
          .getLOMNPaperAuthorizationData({ authorizationId })
          .pipe(
            map((payload: VerticeResponse<AuthorizationDetails>) => {
              return loadLOMNPaperAuthorizationDataSuccess(
                payload.responseBody
              );
            }),
            catchError((error) => {
              return of(
                loadLOMNPaperAuthorizationDataFail({ errors: [error] })
              );
            })
          )
      )
    )
  );

  constructor(
    public authorizationService: PbmAuthorizationService,
    public lomnService: LomnWizardService,
    public actions$: Actions
  ) {}
}
