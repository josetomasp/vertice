import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { hexEncode } from '@shared';
import { getApiUrl } from '@shared/lib/http';
import { ReferralDocument } from 'src/app/claims/abm/referral/store/models/referral-id.models';

@Injectable({
  providedIn: 'root'
})
export class ReferralDocumentsDownloadService {
  constructor(private http: HttpClient) {}

  getDocument(customerCode: string, attachmentUrl: string, archType: string) {
    attachmentUrl = hexEncode(attachmentUrl);
    window.open(
      getApiUrl(
        'downloadInlineDoc',
        `attachmentURL=${attachmentUrl}&customerCode=${customerCode}&archType=${archType}`
      ),
      '_blank'
    );
  }

  getDocuments(customerCode: string, referralId: string, claimNumber: string, archType: string) {
    return this.http.get<ReferralDocument[]>(
      getApiUrl(
        'referralDocumentDetails',
        `referralId=${referralId}&customerCode=${customerCode}&claimNumber=${claimNumber}&archType=${archType}`
      )
    );
  }
}
