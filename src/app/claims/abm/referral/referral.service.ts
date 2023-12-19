import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { generateQueryParams, getApiUrl } from '@shared';
import { InformationModalService } from '@shared/components/information-modal/information-modal.service';
import { Observable } from 'rxjs';
import { RootState } from '../../../store/models/root.models';
import { removeFailedDocument } from './store/actions/make-a-referral.actions';
import { SelectableService } from './store/models/make-a-referral.models';

@Injectable({ providedIn: 'root' })
export class ReferralService {
  private failedToUploadDocuments: string[] = [];
  private failedServiceDocuments: string;
  constructor(
    public http: HttpClient,
    public snackBar: MatSnackBar,
    public store$: Store<RootState>,
    public informationModalService: InformationModalService
  ) {}

  public clearFailedDocuments() {
    this.failedToUploadDocuments = [];
  }

  public addFailedDocument(documentName: string, service: string) {
    this.failedToUploadDocuments.push(documentName);
    this.failedServiceDocuments = service;
  }

  public showFailedDocuments() {
    if (this.failedToUploadDocuments.length > 0) {
      let bodyHtml =
        '<div style="height: 140px"><div> Please try attaching the document(s) again at a later time.</div><br><ul>';
      this.failedToUploadDocuments.forEach((value) => {
        bodyHtml += '<li>' + value + '</li>';
      });
      bodyHtml += '</ul></div>';

      this.informationModalService.displayModal(
        {
          titleString: 'The document upload has failed.',
          bodyHtml,
          affirmString: 'OK'
        },
        '300px'
      );

      this.store$.dispatch(
        removeFailedDocument({
          documents: this.failedToUploadDocuments,
          service: this.failedServiceDocuments
        })
      );
    }
  }

  getMakeReferralServices(
    encodedCustomerId: string,
    encodedClaimNumber
  ): Observable<SelectableService[]> {
    return this.http.get<any>(
      getApiUrl(
        'makeReferralServices',
        generateQueryParams({
          customerId: encodedCustomerId,
          claimNumber: encodedClaimNumber
        })
      )
    );
  }
}
