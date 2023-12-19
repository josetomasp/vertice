import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateLOMNSubmitMessage } from '../store/models/create-lomn.models';
import { getApiUrl } from '../getApiUrl';
@Injectable({
  providedIn: 'root'
})
export class LomnWizardService {
  constructor(public http: HttpClient) {}

  createLOMN(submitMessage: CreateLOMNSubmitMessage[]): Observable<any> {
    return this.http.post<any>(getApiUrl('createLOMN'), submitMessage);
  }
}
