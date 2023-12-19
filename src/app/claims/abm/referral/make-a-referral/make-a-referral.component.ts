import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../../../store/models/root.models';
import { getUserInfo } from '../../../../user/store/selectors/user.selectors';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'healthe-make-a-referral',
  templateUrl: './make-a-referral.component.html',
  styleUrls: ['./make-a-referral.component.scss']
})
export class MakeAReferralComponent implements OnInit {
  userIsInternal: boolean = false;
  constructor(public store$: Store<RootState>) {
    store$
      .pipe(
        select(getUserInfo),
        filter((userInfo) => userInfo !== null),
        first()
      )
      .subscribe((userInfo) => (this.userIsInternal = userInfo.internal));
  }

  ngOnInit() {}
}
