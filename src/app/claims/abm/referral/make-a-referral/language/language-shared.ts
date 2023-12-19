import { ClaimLocation } from '../../store/models/make-a-referral.models';
import {
  FormatType,
  generalFormat,
  objectFullyPopulated,
  referralLocationToFullString
} from '../make-a-referral-shared';

export function buildLanguageSchedulingForm(forms): any[] {
  const data = [];
  if (forms.constructor === Array && objectFullyPopulated(forms)) {
    forms.forEach((item) => {
      const obj = {};
      data.push(obj);
      obj['appointmentDate'] = generalFormat(
        item.appointmentDate,
        '',
        FormatType.DATE
      );

      if (item.appointmentTime) {
        obj['appointmentTime'] = generalFormat(
          item.appointmentTime,
          '',
          FormatType.TIME_12HR
        );
      }
      if (item.appointmentAddress) {
        obj['appointmentAddress'] = {
          columnText: generalFormat(
            item.appointmentAddress.type,
            '',
            FormatType.NONE
          ),
          tooltip:
            item.appointmentAddress.name +
            ' - ' +
            item.appointmentAddress.address
        };
      }
      if (item.certification) {
        obj['certification'] = generalFormat(
          item.certification.subTypeDescription,
          '',
          FormatType.NONE
        );
      }

      obj['notes'] = generalFormat(item['notes'], '', FormatType.NONE);
    });
  }
  return data;
}

export function buildLanguageSpecifiedLocations(
  values: { appointmentAddress: ClaimLocation }[]
): string[] {
  let locationsList: string[] = [];

  values
    .filter((location) => location.appointmentAddress)
    .forEach((location) => {
      locationsList.push(
        referralLocationToFullString(location.appointmentAddress)
      );
    });

  return [...new Set(locationsList)];
}
