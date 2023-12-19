import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getSelectedServiceDetailTypes } from 'src/app/claims/abm/referral/store/selectors/makeReferral.selectors';
import { RootState } from 'src/app/store/models/root.models';
import { MatStepper } from '@angular/material/stepper';
import { first } from 'rxjs/operators';

@Component({
  selector: 'healthe-review-section-header',
  templateUrl: './review-section-header.component.html',
  styleUrls: ['./review-section-header.component.scss']
})
export class ReviewSectionHeaderComponent implements OnInit {
  @Input()
  sectionName: string;

  @Input()
  sectionTitle: string;

  @Input()
  columnCount: number = 6;

  @Input()
  step: string = '';

  @Input()
  offsetForNonSelectedServiceDetailTypes = -1;

  sectionSpace: number;

  stepIndex = 0;

  selectedServiceDetailTypes$;

  constructor(
    public store$: Store<RootState>,
    @Optional() @Inject(MatStepper) public matStepper: MatStepper
  ) {}

  ngOnInit() {
    this.selectedServiceDetailTypes$ = this.store$.pipe(
      select(getSelectedServiceDetailTypes(this.sectionName))
    );

    this.sectionSpace = 100 / this.columnCount;

    this.selectedServiceDetailTypes$.pipe(first()).subscribe((value) => {
      if (this.offsetForNonSelectedServiceDetailTypes === -1) {
        this.stepIndex = value.indexOf(this.step);
      } else {
        this.stepIndex =
          value.length + this.offsetForNonSelectedServiceDetailTypes;
      }
    });
  }

  doNavigation() {
    if (this.stepIndex >= 0) {
      this.matStepper.selectedIndex = this.stepIndex;
    }
  }
}
