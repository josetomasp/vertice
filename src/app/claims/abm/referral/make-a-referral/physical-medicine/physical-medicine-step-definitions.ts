import { WizardStep } from '../../store/models/make-a-referral.models';

export const PHYSICALMEDICINE_ARCH_TYPE = 'physicalMedicine';
export const PHYSICALMEDICINE_PHYSICALTHERAPY_STEP_NAME =
  PHYSICALMEDICINE_ARCH_TYPE + '-physicalTherapy';
export const PHYSICALMEDICINE_OCCUPATIONALTHERAPY_STEP_NAME =
  PHYSICALMEDICINE_ARCH_TYPE + '-occupationalTherapy';
export const PHYSICALMEDICINE_FCE_STEP_NAME =
  PHYSICALMEDICINE_ARCH_TYPE + '-fce';
export const PHYSICALMEDICINE_OTHER_STEP_NAME =
  PHYSICALMEDICINE_ARCH_TYPE + '-other';
export const PHYSICALMEDICINE_REVIEW_STEP_NAME =
  PHYSICALMEDICINE_ARCH_TYPE + '-review';
export const PHYSICALMEDICINE_VENDOR_STEP_NAME =
  PHYSICALMEDICINE_ARCH_TYPE + '-vendors';
export const PHYSICALMEDICINE_DOCUMENTS_STEP_NAME =
  PHYSICALMEDICINE_ARCH_TYPE + '-documents';
export const PHYSICALMEDICINE_SHARED_FORM_NAME =
  PHYSICALMEDICINE_ARCH_TYPE + '-shared';

// The icon array will be used:
// [0] = 'image' (Identify is an image instead of an icon)
// [1] = Url for the desired image.
// [2] = css class added to the image html object.
export const PHYSICALMEDICINE_STEP_DEFINITIONS: WizardStep[] = [
  {
    name: PHYSICALMEDICINE_PHYSICALTHERAPY_STEP_NAME,
    icon: [
      'image',
      'assets/img/make-a-referral/physical-medicine/physical_therapy.png',
      'physical-therapy-img'
    ],
    label: 'Physical Therapy',
    groupName: 'Physical Therapy'
  },
  {
    name: PHYSICALMEDICINE_OCCUPATIONALTHERAPY_STEP_NAME,
    icon: [
      'image',
      'assets/img/make-a-referral/physical-medicine/occupational_therapy.png',
      'occupational-therapy-img'
    ],
    label: 'Occupational Therapy',
    groupName: 'Occupational Therapy'
  },
  {
    name: PHYSICALMEDICINE_FCE_STEP_NAME,
    icon: ['fal', 'fa-notes-medical'],
    label: 'FCE',
    groupName: 'Functional Capacity Evaluation'
  },
  {
    name: PHYSICALMEDICINE_OTHER_STEP_NAME,
    icon: ['fas', 'fa-file-medical'],
    label: 'Other',
    groupName: 'Other'
  }
];
