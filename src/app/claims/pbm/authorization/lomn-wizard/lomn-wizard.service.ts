import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateLOMNSubmitMessage } from '../store/models/create-lomn.models';
import { Observable } from 'rxjs';
import { getApiUrl } from '@shared/lib/http';

@Injectable({
  providedIn: 'root'
})
export class LomnWizardService {
  constructor(public http: HttpClient) {}

  createLOMN(submitMessage: CreateLOMNSubmitMessage[]): Observable<any> {
    return this.http.post<any>(getApiUrl('createLOMN'), submitMessage);
  }
}
