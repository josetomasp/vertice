import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { SnoozeClaimRiskActionsRequest } from '@shared/store/actions/shared.actions';
import { RootState } from '../../../../store/models/root.models';
import { Intervention } from '@shared/store/models';

@Component({
  selector: 'healthe-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionButtonComponent {
  @ViewChild(MatMenuTrigger, { static: true }) menuTrigger: MatMenuTrigger;
  @Input()
  index: number = 0;
  @Input()
  interventions: Array<Intervention>;
  @Input()
  claimNumber: string;
  requestActionForm = new FormGroup({
    actionUrl: new FormControl(false)
  });

  constructor(public store$: Store<RootState>) {}

  requestAction() {
    const url = this.requestActionForm.getRawValue().actionUrl;
    if (url) {
      window.open(url, '_blank');
    } else {
      /**
       * Action with no URL is assumed to be reevaluate
       */
      this.store$.dispatch(
        new SnoozeClaimRiskActionsRequest({ claimNumber: this.claimNumber })
      );
    }
    this.menuTrigger.closeMenu();
  }

  hasIpe() {
    return this.interventions.map((i) => i.type).indexOf('ipe+') > -1;
  }
}
