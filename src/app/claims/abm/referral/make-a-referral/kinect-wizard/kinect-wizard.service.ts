import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl, getApiUrlWithPathSegment, hexEncode } from '@shared';
import {
  KinectCreateReferralRequest,
  KinectCreateReferralResponse
} from './kinect-wizard.models';

@Injectable({
  providedIn: 'root'
})
export class KinectWizardService {
  constructor(public http: HttpClient) {
  }

  createKinectReferral(
    kinectCreateReferralRequest: KinectCreateReferralRequest
  ): Observable<KinectCreateReferralResponse> {
    return this.http.post<KinectCreateReferralResponse>(
      getApiUrl(
        'kinectReferralAPI'
      ),
      kinectCreateReferralRequest
    );
  }

  submitKinectReferral(
    referralID: string,
    formData: FormData
  ): Observable<any> {
    return this.http.post(
      getApiUrlWithPathSegment(
        'kinectReferralAPI',
        '/' + hexEncode(referralID) + '/finalize'
      ),
      formData
    );
  }

  deleteKinectReferral(referralId: string) {
    this.http
      .delete<void>(
        getApiUrlWithPathSegment(
          'kinectReferralAPI',
          '/' + hexEncode(referralId)
        )
      )
      .subscribe();
  }
}
