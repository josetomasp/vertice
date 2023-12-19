import { WizardStep } from '../../store/models/make-a-referral.models';

export const HOMEHEALTH_ARCH_TYPE = 'homeHealth';
export const HOMEHEALTH_NURSING_STEP_NAME = HOMEHEALTH_ARCH_TYPE + '-nursing';
export const HOMEHEALTH_INHOMETHERAPY_STEP_NAME =
  HOMEHEALTH_ARCH_TYPE + '-inHomeTherapy';
export const HOMEHEALTH_AIDES_STEP_NAME = HOMEHEALTH_ARCH_TYPE + '-aides';
export const HOMEHEALTH_INFUSION_STEP_NAME = HOMEHEALTH_ARCH_TYPE + '-infusion';
export const HOMEHEALTH_OTHER_STEP_NAME = HOMEHEALTH_ARCH_TYPE + '-other';
export const HOMEHEALTH_REVIEW_STEP_NAME = HOMEHEALTH_ARCH_TYPE + '-review';
export const HOMEHEALTH_VENDOR_STEP_NAME = HOMEHEALTH_ARCH_TYPE + '-vendors';
export const HOMEHEALTH_DOCUMENTS_STEP_NAME =
  HOMEHEALTH_ARCH_TYPE + '-documents';
export const HOMEHEALTH_SHARED_FORM = HOMEHEALTH_ARCH_TYPE + '-shared';

// The icon array will be used:
// [0] = 'image' (Identify is an image instead of an icon)
// [1] = Url for the desired image.
// [2] = css class added to the image html object.
export const HOMEHEALTH_STEP_DEFINITIONS: WizardStep[] = [
  {
    name: HOMEHEALTH_NURSING_STEP_NAME,
    icon: [
      'image',
      'assets/img/make-a-referral/home-health/nursing.png',
      'nursing'
    ],
    label: 'Nursing'
  },
  {
    name: HOMEHEALTH_INHOMETHERAPY_STEP_NAME,
    icon: [
      'image',
      'assets/img/make-a-referral/home-health/in-home-therapy.png',
      'in-home-therapy'
    ],
    label: 'In-Home Therapy'
  },
  {
    name: HOMEHEALTH_AIDES_STEP_NAME,
    icon: [
      'image',
      'assets/img/make-a-referral/home-health/aides.png',
      'aides'
    ],
    label: 'Aides'
  },
  {
    name: HOMEHEALTH_INFUSION_STEP_NAME,
    icon: [
      'image',
      'assets/img/make-a-referral/home-health/infusion.png',
      'infusion'
    ],
    label: 'Infusion'
  },
  {
    name: HOMEHEALTH_OTHER_STEP_NAME,
    icon: ['fas', 'fa-file-medical'],
    label: 'Other'
  }
];
