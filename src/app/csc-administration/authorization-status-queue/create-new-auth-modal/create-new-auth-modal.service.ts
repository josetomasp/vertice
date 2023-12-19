import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateNewAuthModalComponent,
  MemberIDInfo
} from './create-new-auth-modal.component';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class CreateNewAuthModalService {
  didNavigate: Subject<MemberIDInfo> = new Subject<MemberIDInfo>();

  constructor(public dialog: MatDialog, protected router: Router) {}

  navigateToCreatePosAuthFromCreateNewAuthModal(): Observable<MemberIDInfo> {
    this.dialog
      .open(CreateNewAuthModalComponent, {
        autoFocus: true,
        width: '500px',
        height: '300px'
      })
      .afterClosed()
      .pipe(first())
      .subscribe((value) => {
        if ('' !== value) {
          let data: MemberIDInfo = value as MemberIDInfo;

          // This route is encoded encodedCustomerID/encodedClaimNumber/encodedMemberID
          this.router.navigate([
            '/csc-administration/create-pos-authorization/' +
              data.encodedCustomerID +
              '/' +
              data.encodedClaimNumber +
              '/' +
              data.encodedMemberID
          ]);
          this.didNavigate.next(data);
        } else {
          this.didNavigate.next(null);
        }
      });

    return this.didNavigate;
  }
}
