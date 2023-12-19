import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/store/models/root.models';
import {
  getEncodedClaimNumber,
  getEncodedCustomerId
} from '../../../../../store/selectors/router.selectors';
import {
  getSelectableServices,
  getSelectedServiceTypes
} from '../../store/selectors/makeReferral.selectors';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

import { MakeAReferralHelperService } from '../make-a-referral-helper.service';

interface ServiceOption {
  name: string;
  isDisabled: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'healthe-service-selection-modal',
  templateUrl: './service-selection-modal.component.html',
  styleUrls: ['./service-selection-modal.component.scss']
})
export class ServiceSelectionModalComponent implements OnInit {
  selectedServiceTypes$ = this.store$.pipe(select(getSelectedServiceTypes));
  encodedCustomerId$ = this.store$.pipe(
    select(getEncodedCustomerId),
    first()
  );
  encodedClaimNumber$ = this.store$.pipe(
    select(getEncodedClaimNumber),
    first()
  );
  serviceChoices$ = this.store$.pipe(select(getSelectableServices));

  formGroup: FormGroup = null;

  serviceOptions: ServiceOption[] = [];

  constructor(
    public dialogRef: MatDialogRef<ServiceSelectionModalComponent>,
    public store$: Store<RootState>,
    private makeAReferralHelperService: MakeAReferralHelperService
  ) {}

  ngOnInit() {
    combineLatest([this.serviceChoices$, this.selectedServiceTypes$])
      .pipe(
        first(),
        map(([choices, selectedServices]) => {
          const options: ServiceOption[] = [];
          choices.forEach((value) => {
            const option: ServiceOption = {
              name: value.serviceType,
              isDisabled: false,
              isSelected: false
            };

            selectedServices.forEach((service) => {
              if (option.name === service) {
                option.isDisabled = true;
                option.isSelected = true;
              }
            });

            options.push(option);
          });

          return options;
        })
      )
      .subscribe((options) => {
        this.serviceOptions = options;

        const formGroup = new FormGroup({});

        options.forEach((option) => {
          const fc: FormControl = new FormControl(option.isSelected);
          formGroup.addControl(option.name, fc);
        });

        this.formGroup = formGroup;
      });
  }

  isAddServiceEnabled(): boolean {
    if (this.serviceOptions.length === 0) {
      return false;
    }

    return this.serviceOptions.some((option, index, array) => {
      return this.formGroup.get(option.name).value !== option.isSelected;
    });
  }

  addServices() {
    combineLatest([
      this.encodedClaimNumber$,
      this.encodedCustomerId$
    ]).subscribe(([encodedClaimNumber, encodedCustomerId]) => {
      const selectedServices: string[] = [];
      this.serviceOptions.forEach((option) => {
        if (true === this.formGroup.get(option.name).value) {
          selectedServices.push(option.name);
        }
      });

      this.makeAReferralHelperService.prepareServices(
        selectedServices,
        encodedCustomerId,
        encodedClaimNumber
      );

      this.dialogRef.close();
    });
  }
}
