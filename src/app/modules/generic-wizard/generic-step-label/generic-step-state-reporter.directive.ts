import { AfterViewInit, Directive, OnInit, Renderer2 } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { startWith } from 'rxjs/operators';
import { GenericWizardStore } from '@modules/generic-wizard/generic-wizard.store';
import { combineLatest, Subscription } from 'rxjs';

@Directive({
  selector: '[healtheGenericStepStateReporter]'
})
export class GenericStepStateReporterDirective
  implements OnInit, AfterViewInit
{
  vmSubscription: Subscription;
  stepChangeSubscription: Subscription;
  statusChangeSubscription: Subscription;

  constructor(
    public matStepper: MatStepper,
    public renderer2: Renderer2,
    public store: GenericWizardStore<any>
  ) {}

  reinitialize() {
    this.initStepValidity();
    this.startStepStateReporter();
  }

  ngOnInit() {
    this.initStepValidity();
  }

  ngAfterViewInit() {
    this.startStepStateReporter();
  }

  private initStepValidity() {
    if (this.vmSubscription) {
      this.vmSubscription.unsubscribe();
    }
    this.vmSubscription = this.store.vm$.subscribe(
      ({ activeStepIndex, touchedSteps, validSteps }) => {
        this.matStepper.steps.toArray().forEach((step, i) => {
          const isActive = activeStepIndex === i;
          const isTouched = touchedSteps.includes(i);
          const isValid = validSteps.includes(i);
          this.applyValidityClasses(i, isActive, isTouched, isValid);
        });
      }
    );
  }

  private startStepStateReporter() {
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
    if (this.stepChangeSubscription) {
      this.stepChangeSubscription.unsubscribe();
    }
    const statusChangeList = [];
    this.matStepper.steps.toArray().forEach((step, i) => {
      let touched = false;
      Object.defineProperty(step.stepControl, 'touched', {
        set: (_touched) => {
          if (_touched) {
            this.store.pushTouchedStep(i);
          } else {
            this.store.popTouchedStep(i);
          }
          touched = _touched;
        },
        get: () => {
          return touched;
        }
      });
      statusChangeList.push(
        step.stepControl.statusChanges.pipe(startWith(step.stepControl.status))
      );
    });
    const combinedStatusChanges = combineLatest(statusChangeList);
    this.statusChangeSubscription = combinedStatusChanges.subscribe(
      (statuses) => {
        statuses.forEach((status, i) => {
          if (status === 'VALID') {
            this.store.pushValidStep(i);
          } else {
            this.store.popValidStep(i);
          }
        });
      }
    );
    this.stepChangeSubscription = this.matStepper.selectionChange
      .pipe(
        startWith({
          selectedIndex: this.matStepper.selectedIndex,
          previouslySelectedIndex: null,
          previouslySelectedStep: null,
          selectedStep: this.matStepper.steps.get(this.matStepper.selectedIndex)
        })
      )
      .subscribe(({ selectedIndex }) => {
        this.store.setActiveStep(selectedIndex);
        this.store.pushTouchedStep(selectedIndex);
      });
  }

  private applyValidityClasses(
    stepIndex: number,
    isActive: boolean,
    isTouched: boolean,
    isValid: boolean
  ) {
    const header = this.matStepper._stepHeader.toArray()[stepIndex];
    this.renderer2.removeClass(header._getHostElement(), 'valid');
    this.renderer2.removeClass(header._getHostElement(), 'invalid');
    this.renderer2.removeClass(header._getHostElement(), 'default');
    this.renderer2.removeClass(header._getHostElement(), 'selected');
    this.renderer2.addClass(
      header._getHostElement(),
      this.getHeaderClass(isActive, isTouched, isValid)
    );
  }

  private getHeaderClass(
    isActive: boolean,
    isTouched: boolean,
    isValid: boolean
  ) {
    if (isActive) {
      return 'selected';
    }
    if (!isActive) {
      if (!isTouched) {
        return 'default';
      }
      if (isValid) {
        return 'valid';
      } else {
        return 'invalid';
      }
    }
  }
}
