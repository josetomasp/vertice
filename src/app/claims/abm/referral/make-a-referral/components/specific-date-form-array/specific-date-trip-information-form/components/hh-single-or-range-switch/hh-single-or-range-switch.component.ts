import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ConfirmationModalService } from '@shared/components/confirmation-modal/confirmation-modal.service';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'healthe-hh-single-or-range-switch',
  templateUrl: './hh-single-or-range-switch.component.html',
  styleUrls: ['../../specific-date-trip-information-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HhSingleOrRangeSwitchComponent implements OnInit, OnDestroy {
  @Input()
  parentFormGroup: FormGroup;
  @Input()
  index: number;

  @Input()
  currentStepIndex: number;

  private unsubscribe$ = new Subject<never>();

  constructor(public confirmationModalService: ConfirmationModalService) {}

  get dynamicDateMode() {
    return (
      this.parentFormGroup.get('dynamicDateMode') || { value: 'dateRange' }
    );
  }

  ngOnInit() {
    if (this.parentFormGroup.get('appointmentDate').value) {
      const numberOfVisits = this.parentFormGroup.get('numberOfVisits').value;
      const appointmentDate = this.parentFormGroup.get('appointmentDate').value;
      this.dateModeChange(new Event('manual'), 'singleDate');
      this.parentFormGroup.get('appointmentDate').setValue(appointmentDate);
      this.parentFormGroup.get('numberOfVisits').setValue(numberOfVisits);
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
    const startDate = this.parentFormGroup.get('startDate');
    const endDate = this.parentFormGroup.get('endDate');
    const numberOfVisits = this.parentFormGroup.get('numberOfVisits');
    const appointmentDate = this.parentFormGroup.get('appointmentDate');
    const dynamicDateMode = this.parentFormGroup.get('dynamicDateMode');
    if (clickedMode !== dynamicDateMode.value) {
      if (
        (dynamicDateMode.value === 'dateRange' &&
          (startDate.dirty || endDate.dirty || numberOfVisits.dirty)) ||
        (dynamicDateMode.value === 'singleDate' && appointmentDate.dirty)
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
              startDate,
              endDate,
              numberOfVisits,
              appointmentDate,
              dynamicDateMode
            );
          });
      } else {
        this.switchDateFormMode(
          startDate,
          endDate,
          numberOfVisits,
          appointmentDate,
          dynamicDateMode
        );
      }
    }
  }

  private switchDateFormMode(
    startDate: AbstractControl,
    endDate: AbstractControl,
    numberOfVisits: AbstractControl,
    appointmentDate: AbstractControl,
    dynamicDateMode: AbstractControl
  ) {
    if (dynamicDateMode.value === 'dateRange') {
      dynamicDateMode.setValue('singleDate');
      startDate.reset();
      startDate.disable();
      endDate.reset();
      endDate.disable();
      numberOfVisits.reset();
      numberOfVisits.disable();
      appointmentDate.enable();
    } else {
      dynamicDateMode.setValue('dateRange');
      startDate.enable();
      endDate.enable();
      numberOfVisits.enable();
      appointmentDate.reset();
      appointmentDate.disable();
    }
  }
}
