import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReferralAuthorizationItem } from '../../referral-authorization/referral-authorization.models';
import {
  CancelTransportationReferralModalModelActionResultType,
  CancelTransportationReferralModalResult,
  CancelTransportationReferralResult
} from './cancel-transportation-referral-modal.model';

import { Observable, Subject } from 'rxjs';
import { CancelTransportationReferralModalComponent } from './cancel-transportation-referral-modal.component';
import { first } from 'rxjs/operators';
import { LoadingModalComponent } from '@shared/components/loading-modal/loading-modal.component';

import { InformationModalService } from '@shared/components/information-modal/information-modal.service';
import { HttpClient } from '@angular/common/http';
import { generateQueryParams, getApiUrl, VerticeResponse } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class CancelTransportationReferralModalService {
  constructor(
    public matDialog: MatDialog,
    private informationModalService: InformationModalService,
    private http: HttpClient
  ) {}

  cancelReasons: string[] = [];

  showModal(
    referralAuthItems: ReferralAuthorizationItem[],
    referralId: number
  ): Observable<CancelTransportationReferralResult> {
    let subject = new Subject<CancelTransportationReferralResult>();
    this.matDialog
      .open(CancelTransportationReferralModalComponent, {
        autoFocus: false,
        width: '800px',
        height: '340px',
        disableClose: true,
        data: {
          authData: referralAuthItems,
          cancelReasons: this.cancelReasons
        }
      })
      .afterClosed()
      .pipe(first())
      .subscribe((modalResult: CancelTransportationReferralModalResult) => {
        switch (modalResult.actionResult) {
          default:
          case CancelTransportationReferralModalModelActionResultType.Cancel:
            subject.next({
              actionResult:
                CancelTransportationReferralModalModelActionResultType.Cancel,
              errors: []
            });
            break;

          case CancelTransportationReferralModalModelActionResultType.Submit:
            const loadingDialogRef = this.matDialog.open(
              LoadingModalComponent,
              {
                width: '700px',
                data: 'Cancelling authorization...'
              }
            );

            this.http
              .post<VerticeResponse<void>>(
                getApiUrl(
                  'abmReferralCancelAuthorizations',
                  generateQueryParams({ referralId })
                ),
                modalResult.cancelRecords
              )
              .pipe(first())
              .subscribe(
                (response) => {
                  loadingDialogRef.close();
                  if (response.httpStatusCode > 299) {
                    subject.next({
                      actionResult:
                        CancelTransportationReferralModalModelActionResultType.Fail,
                      errors: response.errors
                    });
                  } else {
                    this.informationModalService.displayModal({
                      titleString: 'Referral cancelled successfully',
                      bodyHtml:
                        'The authorization was successfully cancelled. Click OK to view referral activity.',
                      affirmString: 'OK',
                      affirmClass: 'success-button',
                      minHeight: '190px'
                    });

                    subject.next({
                      actionResult:
                        CancelTransportationReferralModalModelActionResultType.Success,
                      errors: []
                    });
                  }
                },
                (error) => {
                  loadingDialogRef.close();
                  subject.next({
                    actionResult:
                      CancelTransportationReferralModalModelActionResultType.Fail,
                    errors: [
                      'A general error occurred, please contact HealheSystems.'
                    ]
                  });
                }
              );

            break;
        }
      });

    return subject;
  }
}
