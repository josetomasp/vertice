import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  SpecificDateFormArrayConfig,
  SpecificDateFormFieldType
} from '../components/specific-date-form-array/specific-date-form-config';
import { duplicateFromAndToValidator } from './TransporationSpecificDateValidators';

export function generateTransportationSpecificDateConfig(
  serviceActionType: string,
  appointmentTypes$: Observable<string[]>
): SpecificDateFormArrayConfig {
  return {
    addDateButtonLabel: 'ADD DATE',
    addLocationButtonLabel: 'ADD LOCATION',
    formTitle: 'Trip Information',
    serviceActionType,
    stepName: 'transportation-' + serviceActionType,
    actionConfig: {
      enableAddNote: true,
      enableAddStop: true,
      enableDelete: true,
      enableDuplicate: true,
      deleteLabel: 'Delete Stop'
    },
    controls: [
      [
        {
          formControlName: 'specificDate',
          formState: null,
          type: SpecificDateFormFieldType.Date,
          validatorOrOpts: [Validators.required],
          label: 'PICKUP DATE',
          placeholder: 'MM/DD/YYYY',
          errorMessages: {
            required: 'Select a date for the trip'
          }
        },
        {
          formControlName: 'pickupTime',
          formState: null,
          type: SpecificDateFormFieldType.Time,
          validatorOrOpts: [Validators.required],
          label: 'PICKUP TIME',
          placeholder: 'Choose time',
          errorMessages: {
            required: 'Select a time for the trip'
          }
        },
        {
          formControlName: 'appointmentType',
          formState: null,
          type: SpecificDateFormFieldType.Select,
          options: appointmentTypes$.pipe(
            map((types) => {
              let typesLabelValueObject = [];
              Object.keys(types).forEach((type) =>
                typesLabelValueObject.push({
                  label: types[type],
                  value: types[type]
                })
              );
              return typesLabelValueObject;
            })
          ),
          validatorOrOpts: [Validators.required],
          label: 'APPOINTMENT TYPE',
          placeholder: 'Choose Appointment Type',
          errorMessages: {
            required: 'Select an appointment type'
          }
        },
        {
          formControlName: 'appointmentTime',
          formState: null,
          type: SpecificDateFormFieldType.Time,
          validatorOrOpts: [Validators.required],
          label: 'APPOINTMENT TIME',
          placeholder: 'Choose time',
          errorMessages: {
            required: 'Select an appointment time'
          }
        }
      ],
      [
        {
          formControlName: 'fromAddress',
          formState: null,
          type: SpecificDateFormFieldType.Location,
          validatorOrOpts: [Validators.required, duplicateFromAndToValidator],
          label: 'FROM ADDRESS',
          placeholder: 'Choose Pickup Location',
          errorMessages: {
            required: "Select a value for 'From Address'",
            duplicate: 'From Address and To Address cannot be the same'
          }
        },
        {
          formControlName: 'toAddress',
          formState: null,
          type: SpecificDateFormFieldType.Location,
          validatorOrOpts: [Validators.required, duplicateFromAndToValidator],
          label: 'TO ADDRESS',
          placeholder: 'Choose Destination',
          errorMessages: {
            required: "Select a value for 'To Address'",
            duplicate: 'From Address and To Address cannot be the same'
          }
        }
      ]
    ],
    roundTripConfig: {
      fromAddressFormControlName: 'fromAddress',
      toAddressFormControlName: 'toAddress',
      appointmentTypeFormControlName: 'appointmentType',
      appointmentTimeFormControlName: 'appointmentTime',
      pickupDateFormControlName: 'specificDate'
    }
  };
}
