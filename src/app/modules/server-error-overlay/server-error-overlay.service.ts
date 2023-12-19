import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable
} from '@angular/core';

import { Router } from '@angular/router';
import { ServerErrorOverlay } from '@modules/server-error-overlay/server-error-overlay';

@Injectable({ providedIn: 'root' })
export class ServerErrorGlobalOverlay extends ServerErrorOverlay {
  constructor(
    public componentFactoryResolver: ComponentFactoryResolver,
    public applicationRef: ApplicationRef,
    public router: Router
  ) {
    super(
      document.body.getElementsByTagName('mat-sidenav-content')[0],
      componentFactoryResolver,
      applicationRef,
      router,
      true
    );
  }
}
