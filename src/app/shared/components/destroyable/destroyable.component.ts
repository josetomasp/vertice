import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// This component is just meant to provide our standard destroy method for unsubscribing from observables

@Directive()
export class DestroyableComponent implements OnDestroy {
  onDestroy$ = new Subject<void>();
  constructor() {}

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
