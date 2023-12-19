import * as moment from 'moment';
import { MakeReferralFusionOptions } from '../store/models/fusion/fusion-make-a-referral.models';
import {
  LEGACY_TRANSPORTATION_ARCH_TYPE,
  TRANSPORTATION_ARCH_TYPE,
  TRANSPORTATION_FLIGHT_STEP_NAME,
  TRANSPORTATION_LODGING_STEP_NAME,
  TRANSPORTATION_OTHER_STEP_NAME,
  TRANSPORTATION_SEDAN_STEP_NAME,
  TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME
} from './transportation/transportation-step-definitions';
import {
  ClaimLocation,
  MakeReferralOptions,
  ReferralGroundLocationAddress
} from '../store/models/make-a-referral.models';
import { InjectionToken } from '@angular/core';

import {
  LANGUAGE_ARCH_TYPE,
  LANGUAGE_INTERPRETATION_STEP_NAME,
  LANGUAGE_TRANSLATION_STEP_NAME
} from './language/language-step-definitions';
import { DIAGNOSTICS_ARCH_TYPE } from './diagnostics/diagnostics-step-definitions';
import { every } from 'lodash';
import { PHYSICALMEDICINE_ARCH_TYPE } from './physical-medicine/physical-medicine-step-definitions';
import { HOMEHEALTH_ARCH_TYPE } from './home-health/home-health-step-definitions';
import { DME_ARCH_TYPE } from './dme/dme-step-definitions';
import GeocoderAddressComponent = google.maps.GeocoderAddressComponent;

export function translateServiceName(serviceName: string): string {
  switch (serviceName) {
    case 'all':
      return 'All';

    case TRANSPORTATION_OTHER_STEP_NAME:
      return 'Other';

    case TRANSPORTATION_SEDAN_STEP_NAME:
      return 'Sedan';

    case TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME:
      return 'Wheelchair';

    case TRANSPORTATION_FLIGHT_STEP_NAME:
      return 'Flight';

    case TRANSPORTATION_LODGING_STEP_NAME:
      return 'Lodging';

    case LANGUAGE_INTERPRETATION_STEP_NAME:
      return 'On-Site Interpretation';

    case LANGUAGE_TRANSLATION_STEP_NAME:
      return 'Document Translation';

    default:
      return 'Default';
  }
}

// Type used for the store selectors
// in order to know if we need to get
// data from different store locations.
export type ServiceType =
  | typeof TRANSPORTATION_ARCH_TYPE
  | typeof LANGUAGE_ARCH_TYPE
  | typeof DIAGNOSTICS_ARCH_TYPE
  | typeof PHYSICALMEDICINE_ARCH_TYPE
  | typeof HOMEHEALTH_ARCH_TYPE
  | typeof DME_ARCH_TYPE;

export type MakeAReferralOptionsType =
  | MakeReferralOptions
  | MakeReferralFusionOptions;

export enum FormatType {
  NONE,
  TIME_12HR,
  DATE
}

export const enum AncilliaryServiceCode {
  DME = 'DME', // DME
  HH = 'HH', // Home Health
  TRP = 'TRP', // Transportation
  LAN = 'LAN', // Language
  CLN = 'CLN', // Clinical
  MOR = 'MOR', // Mail Order
  RTL = 'RTL', // Retail
  OTH = 'OTH', // Other
  PM = 'PM', // Physical Medicine
  IMP = 'IMP', // Implants
  DX = 'DX' // Diagnostics
}

export function getAncilliaryServiceCodeFromArchType(archType): string {
  switch (archType) {
    case DIAGNOSTICS_ARCH_TYPE:
      return AncilliaryServiceCode.DX;
    case DME_ARCH_TYPE:
      return AncilliaryServiceCode.DME;
    case HOMEHEALTH_ARCH_TYPE:
      return AncilliaryServiceCode.HH;
    case LANGUAGE_ARCH_TYPE:
      return AncilliaryServiceCode.LAN;
    case PHYSICALMEDICINE_ARCH_TYPE:
      return AncilliaryServiceCode.PM;
    case TRANSPORTATION_ARCH_TYPE:
      return AncilliaryServiceCode.TRP;
    default:
      console.error(
        'No ARCH TYPE found to select Ancilliary Service Code, please add it on MaR-shared getAncilliaryServiceCodeFromArchType function'
      );
  }
}

export function getArchTypeFromAncilliaryServiceCode(
  ancilliaryServiceCode,
  legacy?: boolean
): string {
  switch (ancilliaryServiceCode) {
    case AncilliaryServiceCode.DX:
      return DIAGNOSTICS_ARCH_TYPE;
    case AncilliaryServiceCode.DME:
      return DME_ARCH_TYPE;
    case AncilliaryServiceCode.HH:
      return HOMEHEALTH_ARCH_TYPE;
    case AncilliaryServiceCode.LAN:
      return LANGUAGE_ARCH_TYPE;
    case AncilliaryServiceCode.PM:
      return PHYSICALMEDICINE_ARCH_TYPE;
    case AncilliaryServiceCode.TRP:
      return legacy
        ? LEGACY_TRANSPORTATION_ARCH_TYPE
        : TRANSPORTATION_ARCH_TYPE;
    default:
      console.error(
        'No Ancilliary Service Code found to select ARCH TYPE, please add it on MaR-shared getArchTypeFromAncilliaryServiceCode function'
      );
  }
}

export function getAncilliaryServiceCodeFromServiceName(serviceName): string {
  switch (serviceName) {
    case 'Diagnostics':
      return AncilliaryServiceCode.DX;
    case 'DME':
      return AncilliaryServiceCode.DME;
    case 'Home Health':
      return AncilliaryServiceCode.HH;
    case 'Language':
      return AncilliaryServiceCode.LAN;
    case 'Physical Medicine':
      return AncilliaryServiceCode.PM;
    case 'Transportation':
      return AncilliaryServiceCode.TRP;
    default:
      console.error(
        'No ARCH TYPE found to select Service Name, please add it on MaR-shared getAncilliaryServiceCodeFromServiceName function'
      );
  }
}

export function generalFormat(
  value: string,
  defaultValue: string,
  formatType: FormatType
): string {
  if (value) {
    switch (formatType) {
      default:
      case FormatType.NONE:
        return value;

      case FormatType.TIME_12HR:
        const time = moment(value, 'H:mm:ss');
        if (time.isValid()) {
          return time.format('hh:mm A');
        } else {
          return value;
        }

      case FormatType.DATE:
        const date = moment(value);
        if (date.isValid()) {
          return date.format('MM/DD/YYYY');
        } else {
          return value;
        }
    }
  }

  return defaultValue;
}

export function referralLocationToFullString(location: ClaimLocation): string {
  if (location) {
    return location.type + ' - ' + location.name + ' - ' + location.address;
  } else {
    return '';
  }
}

export const MAT_EXPANSION_PANEL_REF = new InjectionToken('expansionPanel');

export function getAddressComponentValueByType(
  type: string,
  components: GeocoderAddressComponent[]
): string {
  let value: GeocoderAddressComponent = components.find((component) =>
    component.types.includes(type)
  );

  if (value && value.short_name) {
    return value.short_name;
  } else {
    console.warn(
      'Vertice UI - looking up Google address component by type - type not found:',
      type,
      components
    );
  }

  return '';
}

export function compareLocations(
  option: ClaimLocation,
  selection: ClaimLocation
): boolean {
  return (
    option !== null &&
    selection !== null &&
    option.id + '' === selection.id + ''
  );
}

export function buildLocationAddressDisplayText(
  locationAddress: ReferralGroundLocationAddress
): string {
  return buildLocationAddressDisplayTextStrings(
    locationAddress.streetAddress1,
    locationAddress.streetAddress2,
    locationAddress.city,
    locationAddress.state,
    locationAddress.zipCode,
    locationAddress.zipCodeExt
  );
}

export function buildLocationAddressDisplayTextStrings(
  streetAddress1: string,
  streetAddress2: string,
  city: string,
  state: string,
  zipCode: string,
  zipCodeExt: string
): string {
  let text: string = streetAddress1;

  if (streetAddress2) {
    text += ' ' + streetAddress2;
  }

  // only add the comma if there was a street to support city only
  if (text) {
    text += ', ';
  }
  if (city) {
    text += city;
  }

  if (state) {
    text += ', ' + state;
  }

  if (zipCode) {
    text += ' ' + zipCode;
  }

  if (zipCodeExt) {
    text += '-' + zipCodeExt;
  }

  return text;
}

export function objectFullyPopulated(object): boolean {
  return every(object, (form) => {
    const keys = Object.keys(form);
    let populated = true;
    keys.forEach((key) => {
      if (form[key] === null) {
        populated = false;
      }
    });
    return populated;
  });
}
