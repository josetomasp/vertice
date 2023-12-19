import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ClaimsService } from 'src/app/claims/claims.service';
import { DocumentExportColumnDTO } from '../../../../common/documentExporter/documentExportColumnDTO';
import { DocumentExportDTO } from '../../../../common/documentExporter/documentExportDTO';
import { environment } from '../../../../environments/environment';
import { VerbiageService } from '../../../verbiage.service';
import { ClaimActivityService } from '../../service/claim-activity.service';
import * as fromClaimActivityAction from '../actions/activity-tab.actions';
import {
  ExportDocumentFailure,
  ExportDocumentSuccess
} from '../actions/activity-tab.actions';
import { ClaimViewState, ExportParameters } from '../models/claim-view.models';

const moment = _moment;

@Injectable()
export class ClaimViewEffects {
  exportDocument$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(fromClaimActivityAction.ActionType.EXPORT_DOCUMENT_REQUEST),
      mergeMap(
        (exportAction: fromClaimActivityAction.ExportDocumentRequest) => {
          const exportParameters: ExportParameters = exportAction.payload;
          const columns = exportParameters.tableColumns.map((property) => {
            let exportCol: DocumentExportColumnDTO = new DocumentExportColumnDTO();
            exportCol.columnPropertyName = property;
            exportCol.columnTitle = _.find(
              exportParameters.columnOptions,
              (obj) => {
                return obj.name === property;
              }
            ).label;
            return exportCol;
          });

          const docExport: DocumentExportDTO = {
            exportType: exportParameters.exportType,
            productType: exportParameters.productType,
            claimNumber: exportParameters.claimNumber,
            customerId: exportParameters.customerId,
            fromDate: moment(exportParameters.dateRange.fromDate).format(
              environment.dateFormat
            ),
            toDate: moment(exportParameters.dateRange.toDate).format(
              environment.dateFormat
            ),
            activityType: exportParameters.activityTypeFilterPredicates,
            columns: columns,
            outcome: exportParameters.outcomeFilterPredicates,
            prescriberName: exportParameters.prescriberNameFilterPredicates,
            itemName: exportParameters.itemNameFilterPredicates
          };

          return this.claimViewService.exportDocument(docExport).pipe(
            map((response) => {
              if (
                response &&
                _.startsWith(response.toString(), 'SERVICE ERROR')
              ) {
                return new ExportDocumentFailure(response);
              } else {
                return new ExportDocumentSuccess({});
              }
            })
          );
        }
      )
    )
  );

  constructor(
    public actions$: Actions,
    public claimViewService: ClaimActivityService,
    public claimsService: ClaimsService,
    public store$: Store<ClaimViewState>,
    public verbiageService: VerbiageService
  ) {}
}
