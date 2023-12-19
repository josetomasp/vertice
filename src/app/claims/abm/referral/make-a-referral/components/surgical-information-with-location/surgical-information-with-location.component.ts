import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ClaimLocation } from '../../../store/models/make-a-referral.models';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DestroyableComponent } from '@shared/components/destroyable/destroyable.component';
import { isEqual } from 'lodash';
import { HealtheDatepickerComponent } from '@healthe/vertice-library';

@Component({
  selector: 'healthe-surgical-information-with-location',
  templateUrl: './surgical-information-with-location.component.html',
  styleUrls: ['./surgical-information-with-location.component.scss']
})
export class SurgicalInformationWithLocationComponent
  extends DestroyableComponent
  implements OnInit {
  @Input()
  parentFormGroup: FormGroup;

  @Input()
  locations$: Observable<
    {
      label: string;
      value: ClaimLocation;
    }[]
  >;

  @Input()
  subService: string;

  @ViewChild('surgeryDate', { static: false })
  surgeryDateElement: HealtheDatepickerComponent;

  constructor() {
    super();
  }

  compareWithLocation(option, selection) {
    return option && selection && option.id === selection.id;
  }

  ngOnInit() {
    this.parentFormGroup
      .get('surgeryDate')
      .valueChanges.pipe(
        distinctUntilChanged(isEqual),
        takeUntil(this.onDestroy$)
      )
      .subscribe((value) => {
        this.surgeryDateElement.value = value;
      });
  }
}
