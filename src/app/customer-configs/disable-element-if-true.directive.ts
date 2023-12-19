import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Optional,
  Renderer2,
  Self
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { FeatureFlagService } from './feature-flag.service';

@Directive({
  selector: '[healtheDisableElementIfTrue]'
})
export class DisableElementIfTrueDirective implements OnInit {
  @Input() componentGroupName: string;
  @Input() elementName: string;
  @Input() classToAdd: string;

  constructor(
    private featureFlagService: FeatureFlagService,
    @Optional() @Self() private ngControl: NgControl,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const condition = this.featureFlagService.shouldElementBeDisabled(
      this.componentGroupName,
      this.elementName
    );

    if (this.ngControl) {
      const action = condition ? 'disable' : 'enable';
      this.ngControl.control[action]();
    } else if (condition) {
      if (!this.classToAdd) {
        setTimeout(() => {
          this.renderer.setAttribute(
            this.elementRef.nativeElement,
            'disabled',
            'true'
          );
        }, 0);
      } else if (this.classToAdd) {
        setTimeout(() => {
          this.renderer.addClass(
            this.elementRef.nativeElement,
            this.classToAdd
          );
        }, 0);
      }
    }
  }
}
