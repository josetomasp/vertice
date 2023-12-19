import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  GenericFormFieldType
} from '@modules/generic-wizard/generic-wizard.models';

@Component({
  selector: 'healthe-simple-review-section',
  template: `
    <section class="healthe-simple-review-section">
      <label class="overhead-label healthe-simple-review-section__label"
        >{{ label }}
        <a
          *ngIf='editSectionEnabled'
          class="healthe-simple-review-section__edit-section"
          mat-button
          (click)="editThisSection.emit()"
          >Edit this section</a
        ></label
      >
      <ng-container [ngSwitch]="type">
        <div *ngSwitchCase="GenericFormFieldType.MultiSelect">
          <span *ngIf="!value || value.length === 0" class="text-hint badge">
            No Values for {{ label }}
          </span>
          <ul *ngIf="value?.length > 0">
            <li *ngFor="let val of value">
              {{ val }}
            </li>
          </ul>
        </div>
        <div
          *ngSwitchDefault
          class="healthe-simple-review-section__value text-hint"
        >
          {{ value ?? 'No Value for ' + label }}
        </div>
      </ng-container>
    </section>
  `,
  styles: [
    `
      .healthe-simple-review-section__edit-section {
        text-transform: none;
        margin-left: var(--gap-width);
      }
    `
  ]
})
export class SimpleReviewSectionComponent {
  @Input()
  label: string;
  @Input()
  value: any;
  @Input()
  type: GenericFormFieldType;
  @Input()
  editSectionEnabled: boolean = false;
  @Output()
  editThisSection = new EventEmitter();
  public readonly GenericFormFieldType = GenericFormFieldType;
}
