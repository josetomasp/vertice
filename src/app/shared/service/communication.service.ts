import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { getApiUrl } from '@shared/lib/http';
//TODO: Remove this service for it is no longer needed
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  constructor(private http: HttpClient) {}

  sendRxCardTextMessage(phoneNumber: String) {
    if (environment.remote) {
      return this.http.get(
        `${getApiUrl('rxcard')}?phoneNumber=${phoneNumber}`,
        { responseType: 'text' }
      );
    } else {
      return this.http.get(`${getApiUrl('rxcard')}`, {
        responseType: 'text'
      });
    }
  }
}
