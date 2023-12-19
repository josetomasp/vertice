import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';

@Injectable({
  providedIn: 'root'
})
export class PbmPosFooterService extends DestroyableComponent {
  private isOnSaveDecisionMode = new BehaviorSubject(false);
  isOnSaveDecisionModeObservable = this.isOnSaveDecisionMode.asObservable();

  constructor() {
    super();
  }

  public sendSaveDecisionMode(isOnSaveDecisionMode: boolean) {
    this.isOnSaveDecisionMode.next(isOnSaveDecisionMode);
  }
}
