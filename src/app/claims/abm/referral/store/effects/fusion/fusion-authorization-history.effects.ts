import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { VerticeResponse } from '@shared';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { FusionAuthorizationService } from '../../../referralId/referral-authorization/fusion/fusion-authorization.service';
import {
  loadDiagnosticsAuthorizationHistory,
  loadDiagnosticsAuthorizationHistoryFail,
  loadDiagnosticsAuthorizationHistorySuccess,
  loadDmeAuthorizationHistory,
  loadDmeAuthorizationHistoryFail,
  loadDmeAuthorizationHistorySuccess,
  loadHomeHealthAuthorizationHistory,
  loadHomeHealthAuthorizationHistoryFail,
  loadHomeHealthAuthorizationHistorySuccess,
  loadLanguageAuthorizationHistory,
  loadLanguageAuthorizationHistoryFail,
  loadLanguageAuthorizationHistorySuccess,
  loadLegacyTransportationAuthorizationHistory,
  loadLegacyTransportationAuthorizationHistoryFail,
  loadLegacyTransportationAuthorizationHistorySuccess,
  loadPhysicalMedicineAuthorizationHistory,
  loadPhysicalMedicineAuthorizationHistoryFail,
  loadPhysicalMedicineAuthorizationHistorySuccess
} from '../../actions/authorization-history.actions';
import {
  AuthorizationHistoryResponse,
  DiagnosticsHistoryItem,
  DmeHistoryItem,
  HomeHealthHistoryItem, LanguageHistoryItem,
  LegacyTransportationHistoryItem, PhysicalMedicineHistoryItem
} from '../../models/authorization-history.models';

@Injectable({ providedIn: 'root' })
export class FusionAuthorizationHistoryEffects {
  loadLanguageAuthorizationHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLanguageAuthorizationHistory),
      mergeMap(({ encodedReferralId }) =>
        this.fusionAuthorizationService
          .loadFusionLanguageAuthorizationHistory({
            encodedReferralId
          })
          .pipe(
            map((response: VerticeResponse<AuthorizationHistoryResponse<LanguageHistoryItem>>) => {
                if (response.errors && response.errors.length > 0) {
                  return loadLanguageAuthorizationHistoryFail({ errors: response.errors });
                } else {
                  return loadLanguageAuthorizationHistorySuccess(response.responseBody);
                }
              }
            ),
            catchError((err) =>
              of(loadLanguageAuthorizationHistoryFail({ errors: [err] }))
            )
          )
      )
    )
  );
  loadDiagnosticsAuthorizationHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDiagnosticsAuthorizationHistory),
      mergeMap(({ encodedReferralId }) =>
        this.fusionAuthorizationService
          .loadFusionDiagnosticsAuthorizationHistory({
            encodedReferralId
          })
          .pipe(
            map((response: VerticeResponse<AuthorizationHistoryResponse<DiagnosticsHistoryItem>>) => {
                if (response.errors && response.errors.length > 0) {
                  return loadDiagnosticsAuthorizationHistoryFail({ errors: response.errors });
                } else {
                  return loadDiagnosticsAuthorizationHistorySuccess(response.responseBody);
                }
              }
            ),
            catchError((err) =>
              of(loadDiagnosticsAuthorizationHistoryFail({ errors: [err] }))
            )
          )
      )
    )
  );
  loadPhysicalMedicineAuthorizationHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPhysicalMedicineAuthorizationHistory),
      mergeMap(({ encodedReferralId, encodedCustomerCode }) =>
        this.fusionAuthorizationService
          .loadFusionPhysicalMedicineAuthorizationHistory({
            encodedCustomerCode,
            encodedReferralId
          })
          .pipe(
            map((response: VerticeResponse<AuthorizationHistoryResponse<PhysicalMedicineHistoryItem>>) => {
                if (response.errors && response.errors.length > 0) {
                  return loadPhysicalMedicineAuthorizationHistoryFail({ errors: response.errors });
                } else {
                  return loadPhysicalMedicineAuthorizationHistorySuccess(response.responseBody);
                }
              }
            ),
            catchError((err) =>
              of(
                loadPhysicalMedicineAuthorizationHistoryFail({ errors: [err] })
              )
            )
          )
      )
    )
  );

  // Home Health
  loadHomeHealthAuthorizationHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadHomeHealthAuthorizationHistory),
      mergeMap(({ encodedReferralId, encodedCustomerCode }) =>
        this.fusionAuthorizationService
          .loadFusionHomeHealthAuthorizationHistory({
            encodedCustomerCode,
            encodedReferralId
          })
          .pipe(
            map((response: VerticeResponse<AuthorizationHistoryResponse<HomeHealthHistoryItem>>) => {
                if (response.errors && response.errors.length > 0) {
                  return loadHomeHealthAuthorizationHistoryFail({ errors: response.errors });
                } else {
                  return loadHomeHealthAuthorizationHistorySuccess(response.responseBody);
                }
              }
            ),
            catchError((err) =>
              of(loadHomeHealthAuthorizationHistoryFail({ errors: [err] }))
            )
          )
      )
    )
  );

  // DME
  loadDmeAuthorizationHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDmeAuthorizationHistory),
      mergeMap(({ encodedReferralId, encodedCustomerCode }) =>
        this.fusionAuthorizationService
          .loadFusionDmeAuthorizationHistory({
            encodedCustomerCode,
            encodedReferralId
          })
          .pipe(
            map((response: VerticeResponse<AuthorizationHistoryResponse<DmeHistoryItem>>) => {
                if (response.errors && response.errors.length > 0) {
                  return loadDmeAuthorizationHistoryFail({ errors: response.errors });
                } else {
                  return loadDmeAuthorizationHistorySuccess(response.responseBody);
                }
              }
            ),
            catchError((err) =>
              of(loadDmeAuthorizationHistoryFail({ errors: [err] }))
            )
          )
      )
    )
  );

  // Legacy Transportation
  loadLegacyTransportationAuthorizationHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLegacyTransportationAuthorizationHistory),
      mergeMap(({ encodedReferralId, encodedCustomerCode }) =>
        this.fusionAuthorizationService
          .loadFusionLegacyTransportationAuthorizationHistory({
            encodedCustomerCode,
            encodedReferralId
          })
          .pipe(
            map((response: VerticeResponse<AuthorizationHistoryResponse<LegacyTransportationHistoryItem>>) => {
                if (response.errors && response.errors.length > 0) {
                  return loadLegacyTransportationAuthorizationHistoryFail({ errors: response.errors });
                } else {
                  return loadLegacyTransportationAuthorizationHistorySuccess(response.responseBody);
                }
              }
            ),
            catchError((err) =>
              of(
                loadLegacyTransportationAuthorizationHistoryFail({
                  errors: [err]
                })
              )
            )
          )
      )
    )
  );

  constructor(
    public actions$: Actions,
    public fusionAuthorizationService: FusionAuthorizationService
  ) {}
}
