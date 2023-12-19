import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { generateQueryParams, getApiUrl, VerticeResponse } from '@shared';
import { first } from 'rxjs/operators';

export interface MemberIDInfo {
  memberID: string;
  claimNumber: string;
  customerID: string;

  encodedMemberID: string;
  encodedClaimNumber: string;
  encodedCustomerID: string;
}

@Component({
  selector: 'healthe-create-new-auth-modal',
  templateUrl: './create-new-auth-modal.component.html',
  styleUrls: ['./create-new-auth-modal.component.scss']
})
export class CreateNewAuthModalComponent implements OnInit {
  memberId: string = '';
  errorText = null;

  constructor(
    public dialogRef: MatDialogRef<CreateNewAuthModalComponent>,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  // Since we're just stubbing this out I don't know the full functionality behind
  // the clicking the next button, so please rename this accordingly when we do implement it
  newAuthNextButton() {
    this.lookupMemberIdData(this.memberId)
      .pipe(first())
      .subscribe((response) => {
        if (200 === response.httpStatusCode) {
          this.dialogRef.close(response.responseBody);
        } else if (204 === response.httpStatusCode) {
          this.errorText = 'Member ID not found';
        } else {
          this.errorText = 'Internal Error, please try again later.';
        }
      });
  }

  lookupMemberIdData(
    memberId: string
  ): Observable<VerticeResponse<MemberIDInfo[]>> {
    return this.http.get<VerticeResponse<MemberIDInfo[]>>(
      getApiUrl('cscMemberIdLookup', generateQueryParams({ memberId }))
    );
  }
}
