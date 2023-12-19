import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Preference } from './store/models/preferences.models';
import { getApiUrl } from '@shared/lib/http';

@Injectable({ providedIn: 'root' })
export class PreferenceService {
  constructor(public http: HttpClient) {}

  public getAllPreferences(): Observable<Preference<any>[]> {
    return this.http.get<Preference<any>[]>(getApiUrl('preferences'));
  }

  public batchSavePreferences(prefs: Preference<any>[]) {
    return this.http.post<Preference<any>[]>(
      getApiUrl('preferencesSave'),
      prefs
    );
  }

  public deletePreferences(prefs: Preference<any>[]) {
    return this.http.post<Preference<any>[]>(
      getApiUrl('preferencesDelete'),
      prefs
    );
  }

  public deleteAllPreferences() {
    return this.http.post<Preference<any>[]>(
      getApiUrl('preferencesDeleteAll'),
      {}
    );
  }
}
