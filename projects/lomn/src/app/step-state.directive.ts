import { Directive, OnDestroy, OnInit, Renderer2, Input } from '@angular/core';
import { MatStep, MatStepHeader, MatStepper } from '@angular/material/stepper';
import { takeWhile } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[healtheStepState]'
})
export class StepStateDirective implements OnInit, OnDestroy {
  private alive = true;
  @Input() hasVendorStep: boolean = true;
  @Input() hasDocumentsStep: boolean = true;
  @Input() hasReviewStep: boolean = true;
  @Input() sharedForm: FormGroup = null;

  constructor(private renderer2: Renderer2, private stepper: MatStepper) {}

  //#region   Lifecycle Hooks
  ngOnInit(): void {
    this.stepper.selectionChange
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        (selection: {
          previouslySelectedIndex: number;
          previouslySelectedStep: MatStep;
          selectedIndex: number;
          selectedStep: MatStep;
        }) => {
          // Get the reference  of previous and selected step and header
          const previouslySelectedHeader: MatStepHeader = this.stepper._stepHeader.toArray()[
            selection.previouslySelectedIndex
          ];
          const previouslySelectedStep: MatStep =
            selection.previouslySelectedStep;
          const selectedHeader: MatStepHeader = this.stepper._stepHeader.toArray()[
            selection.selectedIndex
          ];
          const reviewStepIndex = this.stepper.steps.length - 1;
          const docsStepIndex = this.stepper.steps.length - 2;
          const vendorsStepIndex = this.stepper.steps.length - 3;

          this.resetState(selectedHeader); // Remove valid and invalid CSS class, the selected one needs to be on blue
          let iconClass = 'invalid';
          if (
            selection.previouslySelectedIndex !== reviewStepIndex ||
            !this.hasReviewStep
          ) {
            if (!previouslySelectedStep.hasError) {
              if (this.sharedForm) {
                if (
                  this.sharedForm.valid ||
                  (selection.previouslySelectedIndex === vendorsStepIndex &&
                    this.hasVendorStep) ||
                  (selection.previouslySelectedIndex === docsStepIndex &&
                    this.hasDocumentsStep)
                ) {
                  iconClass = 'valid';
                }
              } else {
                iconClass = 'valid';
              }
            } else if (!previouslySelectedStep.hasError) {
              iconClass = 'valid';
            }
          } else if (this.isStepperValid()) {
            iconClass = 'valid';
          }
          this.resetState(previouslySelectedHeader);
          this.setState(previouslySelectedHeader, iconClass);
        }
      );
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
  //#endregion

  //#region   Private Methods
  private isStepperValid(): boolean {
    let totalStepsValid = 0;
    this.stepper.steps.forEach((step) => {
      if (!step.hasError) {
        totalStepsValid++;
      }
    });

    if (this.sharedForm) {
      return (
        totalStepsValid === this.stepper.steps.length && this.sharedForm.valid
      );
    } else {
      return totalStepsValid === this.stepper.steps.length;
    }
  }

  private resetState(header: MatStepHeader): void {
    this.renderer2.removeClass(header._getHostElement(), 'valid');
    this.renderer2.removeClass(header._getHostElement(), 'invalid');
  }

  private setState(header: MatStepHeader, className: string): void {
    this.renderer2.addClass(header._getHostElement(), className);
  }
  //#endregion

  public evaluateAllStepsValidity() {
    const reviewStepIndex = this.stepper.steps.length - 1;
    const docsStepIndex = this.stepper.steps.length - 2;
    const vendorsStepIndex = this.stepper.steps.length - 3;
    const headers = this.stepper._stepHeader.toArray();
    this.stepper.steps.forEach((step: MatStep, index) => {
      let iconClass = 'invalid';

      if (index !== reviewStepIndex || !this.hasReviewStep) {
        if (!step.hasError) {
          if (this.sharedForm) {
            if (
              this.sharedForm.valid ||
              (index === vendorsStepIndex && this.hasVendorStep) ||
              (index === docsStepIndex && this.hasDocumentsStep)
            ) {
              iconClass = 'valid';
            }
          } else {
            iconClass = 'valid';
          }
        } else if (!step.hasError) {
          iconClass = 'valid';
        }
      } else if (this.isStepperValid()) {
        iconClass = 'valid';
      }
      this.setState(headers[index], iconClass);
    });
  }
}
