import { Component } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { isAuthorizationInformationIsLoading } from '../store/selectors/pbm-authorization-information.selectors';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { map } from 'rxjs/operators';
import { isClaimV3Loading } from '../store/selectors/claim.selectors';

@Component({
  selector: 'app-lomn-wrapper',
  templateUrl: './lomn-wrapper.component.html',
  styleUrls: ['./lomn-wrapper.component.scss'],
  animations: [
    trigger('fade', [
      state('fadeOut', style({ opacity: 0, display: 'none' })),
      state('fadeIn', style({ opacity: 1 })),
      transition('* => *', animate('400ms ease-out'))
    ])
  ]
})
export class LomnWrapperComponent {
  isLoading = createSelector(
    isClaimV3Loading,
    isAuthorizationInformationIsLoading,
    (isClaimLoading, isAuthLoading) => {
      return isClaimLoading || isAuthLoading;
    }
  );

  isLoading$ = this.store$.pipe(select(this.isLoading));
  overlayState$ = this.isLoading$.pipe(
    map((isLoading) => (isLoading ? 'fadeIn' : 'fadeOut'))
  );
  constructor(public store$: Store<any>) {}
}
