import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { HealtheSelectOption } from '@shared';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { Observable, of, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { compareLocations } from 'src/app/claims/abm/referral/make-a-referral/make-a-referral-shared';

@Component({
  selector: 'healthe-dme-single-or-range-switch',
  templateUrl: './dme-single-or-range-switch.component.html',
  styleUrls: ['../../specific-date-trip-information-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DmeSingleOrRangeSwitchComponent implements OnInit, OnDestroy {
  @Input()
  parentFormGroup: FormGroup;

  @Input()
  index: number;

  @Input()
  currentStepIndex: number;

  @Input()
  locationOptions$: Observable<HealtheSelectOption<any>[]> = of([]);

  @Output()
  showAddLocationModal = new EventEmitter();

  compareLocations = compareLocations;
  private unsubscribe$ = new Subject<never>();

  constructor(public confirmationModalService: ConfirmationModalService) {}

  get dynamicDateMode() {
    return (
      this.parentFormGroup.get('dynamicDateMode') || { value: 'dateRange' }
    );
  }

  ngOnInit() {
    if (this.parentFormGroup.get('deliveryDate').value) {
      const quantity = this.parentFormGroup.get('quantity').value;
      const appointmentDate = this.parentFormGroup.get('deliveryDate').value;
      this.dateModeChange(new Event('manual'), 'singleDate');
      this.parentFormGroup.get('deliveryDate').setValue(appointmentDate);
      this.parentFormGroup.get('quantity').setValue(quantity);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  dateModeChange($event: Event, clickedMode: string) {
    // To support arrow
    if (
      ($event as KeyboardEvent).key &&
      ($event as KeyboardEvent).key.includes('Arrow')
    ) {
      if (clickedMode === 'singleDate') {
        clickedMode = 'dateRange';
      } else {
        clickedMode = 'singleDate';
      }
    }
    const deliveryStartDate = this.parentFormGroup.get('startDate');
    const deliveryEndDate = this.parentFormGroup.get('endDate');
    const deliveryDate = this.parentFormGroup.get('deliveryDate');
    const dynamicDateMode = this.parentFormGroup.get('dynamicDateMode');
    if (clickedMode !== dynamicDateMode.value) {
      if (
        (dynamicDateMode.value === 'dateRange' &&
          (deliveryStartDate.dirty || deliveryEndDate.dirty)) ||
        (dynamicDateMode.value === 'singleDate' && deliveryDate.dirty)
      ) {
        $event.preventDefault();
        this.confirmationModalService
          .displayModal({
            titleString: 'Are You Sure?',
            bodyHtml:
              'Switching modes will clear data for the fields on this row. Are you sure you want to proceed?',
            affirmString: 'YES',
            denyString: 'NO'
          })
          .afterClosed()
          .pipe(filter((confirm) => confirm))
          .subscribe(() => {
            this.switchDateFormMode(
              deliveryDate,
              deliveryStartDate,
              deliveryEndDate,
              dynamicDateMode
            );
          });
      } else {
        this.switchDateFormMode(
          deliveryDate,
          deliveryStartDate,
          deliveryEndDate,
          dynamicDateMode
        );
      }
    }
  }

  _showAddLocationModal(locationSelect: MatSelect) {
    this.showAddLocationModal.emit(locationSelect);
  }

  private switchDateFormMode(
    deliveryDate: AbstractControl,
    deliveryStartDate: AbstractControl,
    deliveryEndDate: AbstractControl,
    dynamicDateMode: AbstractControl
  ) {
    if (dynamicDateMode.value === 'dateRange') {
      dynamicDateMode.setValue('singleDate');
      deliveryStartDate.reset();
      deliveryStartDate.disable();
      deliveryEndDate.reset();
      deliveryEndDate.disable();
      deliveryDate.enable();
    } else {
      dynamicDateMode.setValue('dateRange');
      deliveryStartDate.enable();
      deliveryEndDate.enable();
      deliveryDate.reset();
      deliveryDate.disable();
    }
  }
}
