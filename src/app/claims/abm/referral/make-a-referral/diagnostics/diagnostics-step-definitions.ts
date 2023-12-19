import { WizardStep } from '../../store/models/make-a-referral.models';

export const DIAGNOSTICS_ARCH_TYPE = 'diagnostics';
export const DIAGNOSTICS_MRI_STEP_NAME = DIAGNOSTICS_ARCH_TYPE + '-mri';
export const DIAGNOSTICS_EMG_STEP_NAME = DIAGNOSTICS_ARCH_TYPE + '-emg';
export const DIAGNOSTICS_XRAY_STEP_NAME = DIAGNOSTICS_ARCH_TYPE + '-xray';
export const DIAGNOSTICS_CTSCAN_STEP_NAME = DIAGNOSTICS_ARCH_TYPE + '-ctscan';
export const DIAGNOSTICS_ULTRASOUND_STEP_NAME =
  DIAGNOSTICS_ARCH_TYPE + '-ultrasound';
export const DIAGNOSTICS_OTHER_STEP_NAME = DIAGNOSTICS_ARCH_TYPE + '-other';
export const DIAGNOSTICS_REVIEW_STEP_NAME = DIAGNOSTICS_ARCH_TYPE + '-review';
export const DIAGNOSTICS_VENDOR_STEP_NAME = DIAGNOSTICS_ARCH_TYPE + '-vendors';
export const DIAGNOSTICS_DOCUMENTS_STEP_NAME =
  DIAGNOSTICS_ARCH_TYPE + '-documents';
export const DIAGNOSTICS_SHARED_FORM_NAME = DIAGNOSTICS_ARCH_TYPE + '-shared';

export const DIAGNOSTICS_STEP_NAME_CATEGORY_MAP = {
  [DIAGNOSTICS_MRI_STEP_NAME]: 'MRI',
  [DIAGNOSTICS_EMG_STEP_NAME]: 'EMG/NCS',
  [DIAGNOSTICS_XRAY_STEP_NAME]: 'Xray',
  [DIAGNOSTICS_CTSCAN_STEP_NAME]: 'CT',
  [DIAGNOSTICS_ULTRASOUND_STEP_NAME]: 'Ultrasound',
  [DIAGNOSTICS_OTHER_STEP_NAME]: 'Other Tests'
};

// Added support to an alternative icon using any type of image
// The icon array will be used:
// [0] = 'image' (Identify is an image instead of an icon)
// [1] = Url for the desired image.
// [2] = css class added to the image html object.
export const DIAGNOSTICS_STEP_DEFINITIONS: WizardStep[] = [
  {
    name: DIAGNOSTICS_MRI_STEP_NAME,
    icon: [
      'image',
      'assets/img/make-a-referral/diagnostics/mri.PNG',
      'mri-img'
    ],
    label: 'MRI'
  },
  {
    name: DIAGNOSTICS_EMG_STEP_NAME,
    icon: [
      'image',
      'assets/img/make-a-referral/diagnostics/emg.PNG',
      'emg-img'
    ],
    label: 'EMG/NCS'
  },
  {
    name: DIAGNOSTICS_XRAY_STEP_NAME,
    icon: ['fas', 'fa-x-ray'],
    label: 'X-Ray'
  },
  {
    name: DIAGNOSTICS_CTSCAN_STEP_NAME,
    icon: [
      'image',
      'assets/img/make-a-referral/diagnostics/ctscan.PNG',
      'ctscan-img'
    ],
    label: 'CT Scan'
  },
  {
    name: DIAGNOSTICS_ULTRASOUND_STEP_NAME,
    icon: [
      'image',
      'assets/img/make-a-referral/diagnostics/ultrasound.PNG',
      'ultrasound-img'
    ],
    label: 'Ultrasound'
  },
  {
    name: DIAGNOSTICS_OTHER_STEP_NAME,
    icon: ['fas', 'fa-file-medical'],
    label: 'Other'
  }
];
