# Modules

#### On `index.ts` files

`index.ts` files should be put in the root of single responsibility modules. This allows us to import all necessary members from that module
without excessive import statements. We don't put an index.ts file in the root of the modules folder itself to prevent circular dependencies

---

- Error Card Module
- Form Validation Extractor Module
  - Gets the errors out of forms using the reactive forms directives
- Healthe Grid Module
- Healthe Notes Module
- Mobile Invite Module
  - Contains a modal and service that send a request to invite a claimant for the Vertice Mobile Project (not its actual name, we don't have a concrete name for it yet)

- Server Error Overlay Module
  - Global Overlay :: An overlay that covers all the content to the right of the nav bar
    - gives access to the `ServerErrorGlobalOverlay` service
    - By default, closes on navigating away from the current screen
    - More "hands off" since it's globally accessible through a service
    - only allows one instance
    - to use, inject the service, and call:
      - `open(callback: () => void, errorMessage?: string)`
      - you can also remove the overlay with `detach()`
  - Anchor Directive :: An overlay that covers all the container that it's attached to
    - A bit more involved since it's dependent on component to directive communication which can't be done in a service 
    - allows multiple instances
    - By default, ***does not*** close on navigating away from the current screen
    - to use: 
       - `@ViewChild(ServerErrorOverlayAnchorDirective) overlay: ServerErrorOverlayAnchorDirective`
       - `open(callback: () => void, errorMessage?: string)`
       - you can also remove the overlay with `detach()`
-  VerticeRumModule
    - Track Ignored Events
      - IgnoredFeatureTrackingService
        - `provide: [IgnoredFeatureTrackingService]` MUST be done on routing component level
        - provides the tracking functionality
      - IgnoredFeatureTriggerDirective
        - tags a component that, when clicked, will trigger the `track()` method in pendo with the provided event name
      - IgnoredFeatureDirective
        - registers the component with the name provided
        - listens to click event to determine whether it's been interacted with or not
