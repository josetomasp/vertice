import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef, Injector
} from "@angular/core";
import {Router} from "@angular/router";
import {
  SERVER_ERROR_OVERLAY_DATA
} from "@modules/server-error-overlay/server-error-overlay.data";
import {
  ServerErrorOverlayComponent
} from "@modules/server-error-overlay/server-error-overlay.component";
import {
  ComponentPortal,
  DomPortalOutlet,
  PortalOutlet
} from "@angular/cdk/portal";
import {first} from "rxjs/operators";
import {Subscription} from "rxjs";

/**
 * Base class for overlay using portal outlet
 */
export class ServerErrorOverlay {
  constructor(public target: Element,
              public componentFactoryResolver: ComponentFactoryResolver,
              public applicationRef: ApplicationRef,
              public router: Router,
              public closeOnNavigate: boolean
  ) {
  }

  private outletReference?: PortalOutlet;
  private fatalErrorPortalReference?: ComponentPortal<ServerErrorOverlayComponent>;
  private routerNavigationEvents?: Subscription;
  open(
    retryCallback: () => void,
    errorMessages: string[]
  ): ComponentRef<ServerErrorOverlayComponent> {
    const injector = Injector.create({
      providers: [
        {
          provide: SERVER_ERROR_OVERLAY_DATA,
          useValue: {
            errorMessages,
            retryCallback
          }
        }
      ]
    });
    const outlet = new DomPortalOutlet(
      //TODO: have a better way of wiring this up.... potentially a directive that registers the elementRef
      this.target,
      this.componentFactoryResolver,
      this.applicationRef,
      injector
    );
    const componentPortal = new ComponentPortal(
      ServerErrorOverlayComponent,
      null,
      injector,
      this.componentFactoryResolver
    );
    this.outletReference = outlet;
    this.fatalErrorPortalReference = componentPortal;
    if (this.routerNavigationEvents) {
      this.routerNavigationEvents.unsubscribe();
    }
    if (this.closeOnNavigate) {
      this.routerNavigationEvents = this.router.events
        .pipe(first())
        .subscribe(() => {
          this.detach();
        });
    }

    return outlet.attachComponentPortal(componentPortal);
  }
  detach() {
    if (this.fatalErrorPortalReference && this.outletReference) {
      this.fatalErrorPortalReference.detach();
      this.outletReference.detach();
      this.fatalErrorPortalReference = null;
      this.outletReference = null;
      if(this.closeOnNavigate) {
        this.routerNavigationEvents.unsubscribe();

      }
    }
  }
}
