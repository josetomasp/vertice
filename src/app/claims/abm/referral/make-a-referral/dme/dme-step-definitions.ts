import { WizardStep } from '../../store/models/make-a-referral.models';

export const DME_ARCH_TYPE = 'dme';
export const DME_EQUIPMENT_STEP_NAME = DME_ARCH_TYPE + '-equipment';
export const DME_REVIEW_STEP_NAME = DME_ARCH_TYPE + '-review';
export const DME_VENDOR_STEP_NAME = DME_ARCH_TYPE + '-vendors';
export const DME_DOCUMENTS_STEP_NAME = DME_ARCH_TYPE + '-documents';

// Added support to an alternative icon using any type of image
// The icon array will be used:
// [0] = 'image' (Identify is an image instead of an icon)
// [1] = Url for the desired image.
// [2] = css class added to the image html object.
export const DME_STEP_DEFINITIONS: WizardStep[] = [
  {
    name: DME_EQUIPMENT_STEP_NAME,
    icon: [],
    label: 'Equipment'
  }
];
