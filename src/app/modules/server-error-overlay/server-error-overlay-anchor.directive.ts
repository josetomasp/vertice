import {
  ApplicationRef,
  ComponentFactoryResolver,
  Directive,
  ElementRef
} from '@angular/core';
import { ServerErrorOverlay } from '@modules/server-error-overlay/server-error-overlay';
import { Router } from '@angular/router';

@Directive({
  selector: '[healtheServerErrorOverlayAnchor]',
  exportAs: 'healtheServerErrorOverlayAnchor'
})
export class ServerErrorOverlayAnchorDirective extends ServerErrorOverlay {
  constructor(
    public elementRef: ElementRef,
    public componentFactoryResolver: ComponentFactoryResolver,
    public applicationRef: ApplicationRef,
    public router: Router
  ) {
    super(
      elementRef.nativeElement as Element,
      componentFactoryResolver,
      applicationRef,
      router,
      false
    );
  }
}
