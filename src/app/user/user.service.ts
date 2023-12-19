import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from './store/models/user.models';
import { getApiUrl } from '@shared/lib';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(getApiUrl('user'));
  }

  constructor(public http: HttpClient) {}
}
