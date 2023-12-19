import { WizardStep } from '../../store/models/make-a-referral.models';

export const TRANSPORTATION_ARCH_TYPE = 'transportation';
export const LEGACY_TRANSPORTATION_ARCH_TYPE = 'legacyTransportation';
export const TRANSPORTATION_SEDAN_STEP_NAME =
  TRANSPORTATION_ARCH_TYPE + '-sedan';
export const TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME =
  TRANSPORTATION_ARCH_TYPE + '-wheelchair-support';
export const TRANSPORTATION_FLIGHT_STEP_NAME =
  TRANSPORTATION_ARCH_TYPE + '-flight';
export const TRANSPORTATION_LODGING_STEP_NAME =
  TRANSPORTATION_ARCH_TYPE + '-lodging';
export const TRANSPORTATION_OTHER_STEP_NAME =
  TRANSPORTATION_ARCH_TYPE + '-other';
export const TRANSPORTATION_VENDOR_STEP_NAME =
  TRANSPORTATION_ARCH_TYPE + '-vendors';
export const TRANSPORTATION_DOCUMENTS_STEP_NAME =
  TRANSPORTATION_ARCH_TYPE + '-documents';

export const TRANSPORTATION_REVIEW_STEP_NAME =
  TRANSPORTATION_ARCH_TYPE + '-review';

export const TRANSPORTATION_STEP_DEFINITIONS: WizardStep[] = [
  {
    name: TRANSPORTATION_SEDAN_STEP_NAME,
    icon: ['far', 'fa-car'],
    label: 'Sedan',
    help: 'Ride Share services may be\n provided if applicable.'
  },
  {
    name: TRANSPORTATION_WHEELCHAIR_SUPPORT_STEP_NAME,
    icon: ['far', 'fa-wheelchair'],
    label: 'Wheelchair Transport'
  },
  {
    name: TRANSPORTATION_FLIGHT_STEP_NAME,
    icon: ['far', 'fa-plane-departure'],
    label: 'Flight'
  },
  {
    name: TRANSPORTATION_LODGING_STEP_NAME,
    icon: ['far', 'fa-hotel'],
    label: 'Lodging'
  },
  {
    name: TRANSPORTATION_OTHER_STEP_NAME,
    icon: ['far', 'fa-ambulance'],
    label: 'Other',
    help:
      'Services may include: ALS, BLS\n, Air Ambulance, Stretcher, Bus, or Boat.'
  }
];
