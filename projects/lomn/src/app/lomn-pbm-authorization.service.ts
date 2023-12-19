import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmationModalService } from './confirmation-modal/confirmation-modal.service';
import { AuthorizationQuery } from './store/models/pbm-authorization.models';
import { generateQueryParams } from './generateQueryParams';
import { getApiUrl } from './getApiUrl';
import {
  AuthorizationDetails,
  RxAuthorizationInformationQuery
} from './store/models/pbm-authorization-information.model';

@Injectable()
export class LomnPbmAuthorizationService {
  constructor(
    public http: HttpClient,
    public confirmationModalService: ConfirmationModalService
  ) {}

  getAuthorization(query: AuthorizationQuery) {
    return this.http.get(
      getApiUrl('authorization', generateQueryParams(query))
    );
  }

  getRxAuthorizationInformation(
    query: RxAuthorizationInformationQuery
  ): Observable<AuthorizationDetails> {
    return this.http.get<AuthorizationDetails>(
      getApiUrl('rxAuthorizationInformation', generateQueryParams(query))
    );
  }

  unlockAuthorization(authorizationId: string): Observable<boolean> {
    return this.http.post<boolean>(
      getApiUrl('rxAuthorizationInformationUnlock'),
      authorizationId
    );
  }
}
