import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'healthe-composite-review-section',
  template: `
    <section class="healthe-composite-review-section">
      <h4 class="primary">
        {{ title }}
        <a
          *ngIf="editSectionEnabled"
          mat-button
          (click)="editThisSection.emit()"
          class="healthe-review__edit-section"
          >Edit this section</a
        >
      </h4>
      <ng-content></ng-content>
    </section>
  `,
  styles: [
    `
      a[mat-button].healthe-review__edit-section {
        padding-left: var(--gap-width);
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class CompositeReviewSectionComponent {
  @Input()
  title: string;
  @Input()
  editSectionEnabled: boolean = false;
  @Output()
  editThisSection = new EventEmitter();
}
