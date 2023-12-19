import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  PbmAuthFormMode,
  PbmAuthSubmitResponse
} from '../../store/models/pbm-authorization-information.model';
import { Observable } from 'rxjs';
import { RootState } from 'src/app/store/models/root.models';
import { select, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import {
  getRxAuthorizationSubmitResponse
} from '../../store/selectors/pbm-authorization-information.selectors';
import {
  resetRxAuthorizationState
} from '../../store/actions/pbm-authorization-information.actions';
import { AlertType } from '@healthe/vertice-library';

@Component({
  selector: 'healthe-pbm-authorization-post-submit',
  templateUrl: './pbm-authorization-post-submit.component.html',
  styleUrls: ['./pbm-authorization-post-submit.component.scss']
})
export class PbmAuthorizationPostSubmitComponent implements OnInit, OnDestroy {
  pbmAuthFormMode = PbmAuthFormMode;
  alertType = AlertType;
  rxAuthorizationSubmitResponse$: Observable<{
    response: PbmAuthSubmitResponse;
    isLastDecisionSave: boolean;
  }> = this.store$.pipe(
    first(),
    select(getRxAuthorizationSubmitResponse)
  );
  showSuccessBanner: boolean;

  constructor(public store$: Store<RootState>) {
  }

  ngOnInit() {
    this.rxAuthorizationSubmitResponse$.subscribe((submit) => {
      if (submit.response.successful) {
        this.showSuccessBanner = true;
      }
    });
  }

  ngAfterViewInit() {
    let top = document.getElementById('headerBar-claimDisplay');
    if (top !== null) {
      top.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      });
      top = null;
    }
  }

  ngOnDestroy(): void {
    this.store$.dispatch(resetRxAuthorizationState());
  }
}
