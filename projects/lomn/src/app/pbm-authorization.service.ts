import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AuthorizationDetails,
  RxAuthorizationInformationQuery
} from './store/models/pbm-authorization-information.model';
import { Observable } from 'rxjs';
import { getApiUrl } from './getApiUrl';
import { generateQueryParams } from './generateQueryParams';
import { Store } from '@ngrx/store';
import {
  loadPaperAuthInfo,
  loadRxAuthInfo,
  loadLOMNPaperAuthorizationData
} from './store/actions/pbm-authorization-information.actions';
import { VerticeResponse } from './store/models/VerticeResponse';

@Injectable()
export class PbmAuthorizationService {
  constructor(public http: HttpClient, public store$: Store<any>) {}

  getRxAuthorizationInformation(
    query: RxAuthorizationInformationQuery
  ): Observable<VerticeResponse<AuthorizationDetails>> {
    return this.http.get<VerticeResponse<AuthorizationDetails>>(
      getApiUrl('rxAuthorizationInformation', generateQueryParams(query))
    );
  }

  getPaperAuthorizationInformation(
    query: RxAuthorizationInformationQuery
  ): Observable<AuthorizationDetails> {
    return this.http.get<AuthorizationDetails>(
      getApiUrl('paperAuthorizationInformation', generateQueryParams(query))
    );
  }

  getLOMNPaperAuthorizationData(
    query: RxAuthorizationInformationQuery
  ): Observable<VerticeResponse<AuthorizationDetails>> {
    return this.http.get<VerticeResponse<AuthorizationDetails>>(
      getApiUrl('lomnPaperAuthorizationData')+'/'+query.authorizationId
    );
  }

  unlockAuthorization(authorizationId: string): Observable<boolean> {
    return this.http.post<boolean>(
      getApiUrl('rxAuthorizationInformationUnlock'),
      authorizationId
    );
  }

  dispatchLoadAuthorizationAction(
    serviceType: string,
    authorizationId: string
  ) {
    switch (serviceType) {
      case 'paper':
        this.store$.dispatch(loadLOMNPaperAuthorizationData({authorizationId}))
        break;
      case 'pos':
        this.store$.dispatch(loadRxAuthInfo({ authorizationId }));
        break;
    }
  }
}
