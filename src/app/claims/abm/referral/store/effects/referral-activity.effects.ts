import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, pluck, tap } from 'rxjs/operators';

import { ClaimsService } from '../../../../claims.service';
import { BillingModalComponent } from '../../referralId/referral-activity/components/modals/billing-modal/billing-modal.component';
import { ReferralNotesAndDocumentsModalComponent } from '../../referralId/referral-activity/components/modals/fusion/referral-notes-documents-modal/referral-notes-documents-modal.component';
import { ResultsFusionModalComponent } from '../../referralId/referral-activity/components/modals/fusion/results-fusion-modal/results-fusion-modal.component';
import { SchedulingStatusFusionModalComponent } from '../../referralId/referral-activity/components/modals/fusion/scheduling-status-fusion-modal/scheduling-status-fusion-modal.component';
import { ServiceScheduledFusionModalComponent } from '../../referralId/referral-activity/components/modals/fusion/service-scheduled-fusion-modal/service-scheduled-fusion-modal.component';
import { ResultsModalComponent } from '../../referralId/referral-activity/components/modals/results-modal/results-modal.component';
import { ServiceScheduledModalComponent } from '../../referralId/referral-activity/components/modals/service-scheduled-modal/service-scheduled-modal.component';
import { ReferralActivityService } from '../../referralId/referral-activity/referral-activity.service';
import {
  ActionType,
  ExportTableView,
  ExportTableViewFail,
  ExportTableViewSuccess,
  referralInformationRequest,
  RequestReferralCurrentActivity,
  RequestReferralCurrentActivityFail,
  RequestReferralCurrentActivitySuccess
} from '../actions/referral-activity.actions';
import {
  ReferralCurrentActivity,
  ReferralStage,
  ReferralTableDocumentExportRequest
} from '../models';
import { ReferralGenericQuery } from '../models/referral-id.models';
import { VerticeResponse } from '@shared';

@Injectable()
export class ReferralActivityEffects {
  requestForInformationSnackBarTranslator = {
    DOCUMENT: 'Documentation',
    BILLING: 'Billing'
  };

  public referralInformationRequest$: Observable<Action> = createEffect(
    () =>
      this.actions$.pipe(
        ofType(referralInformationRequest),
        tap((action) => {
          this.referralActivityService
            .requestForInformation(
              action.serviceRequest.encodedReferralID,
              action.serviceRequest.vendorCode,
              action.serviceRequest.requestType,
              action.serviceRequest.dateOfService,
              action.serviceRequest.encoodedCustomerID
            )
            .subscribe({
              next: () => {
                this.claimsService.showSnackBar(
                  this.requestForInformationSnackBarTranslator[
                    action.serviceRequest.requestType
                  ] + ' was requested successfully',
                  true
                );
              },
              error: () => {
                this.claimsService.showSnackBar(
                  this.requestForInformationSnackBarTranslator[
                    action.serviceRequest.requestType
                  ] + ' request failed',
                  false
                );
              }
            });
        })
      ),
    { dispatch: false }
  );

  requestCurrentActivity: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.REQUEST_REFERRAL_CURRENT_ACTIVITY),
      map((action: RequestReferralCurrentActivity) => action.payload),
      mergeMap((query: ReferralGenericQuery) => {
        return this.referralActivityService.getCurrentActivity(query).pipe(
          map(
            (response: VerticeResponse<ReferralCurrentActivity>) =>
              new RequestReferralCurrentActivitySuccess(response)
          ),
          catchError((error) =>
            of(new RequestReferralCurrentActivityFail(error))
          )
        );
      })
    )
  );

  exportTableActivity: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionType.EXPORT_TABLE_VIEW),
      map((action: ExportTableView) => action.payload),
      mergeMap((query: ReferralTableDocumentExportRequest) => {
        return this.referralActivityService.referralTableExport(query).pipe(
          map((response: string) => new ExportTableViewSuccess(response)),
          catchError((error) => of(new ExportTableViewFail(error)))
        );
      })
    )
  );

  openDetailModal: Observable<Action> = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ActionType.OPEN_DETAIL_MODAL),
        pluck('payload'),
        mergeMap(({ stage, modalData }) => {
          let modalComponent;
          // Having a modalType indicates that it's a future state service
          if (modalData['modalType']) {
            switch (stage) {
              case ReferralStage.SERVICE_SCHEDULED:
                modalComponent = ServiceScheduledModalComponent;
                break;
              case ReferralStage.RESULTS:
                modalComponent = ResultsModalComponent;
                break;
              case ReferralStage.BILLING:
                modalComponent = BillingModalComponent;
                break;
              default:
                return EMPTY;
            }

            this.dialog.open(modalComponent, {
              data: { ...new Object(modalData), stage: stage },
              autoFocus: false,
              width: '875px'
            });
          } else {
            switch (stage) {
              case ReferralStage.RESULTS:
                modalComponent = ResultsFusionModalComponent;
                break;
              case ReferralStage.SERVICE_SCHEDULED:
                modalComponent = ServiceScheduledFusionModalComponent;
                break;
              case ReferralStage.SCHEDULE_SERVICE:
                modalComponent = SchedulingStatusFusionModalComponent;
                break;
              case ReferralStage.VENDOR_ASSIGNMENT:
                modalComponent = ReferralNotesAndDocumentsModalComponent;
                break;
              default:
                return EMPTY;
            }

            this.dialog.open(modalComponent, {
              data: modalData,
              autoFocus: false,
              width: '702px'
            });
          }
          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private referralActivityService: ReferralActivityService,
    private claimsService: ClaimsService,
    private dialog: MatDialog
  ) {}
}
