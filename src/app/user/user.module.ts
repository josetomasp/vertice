import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { RootState } from '../store/models/root.models';
import { UserInfoRequest } from './store/actions/user.actions';
import { UserEffects } from './store/effects/user.effects';
import { reducer } from './store/reducers/user.reducers';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([UserEffects]),
    StoreModule.forFeature('user', reducer)
  ],
  declarations: []
})
export class UserModule {
  constructor(store$: Store<RootState>) {
    store$.dispatch(new UserInfoRequest(null));
  }
}
